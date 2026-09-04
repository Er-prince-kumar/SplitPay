/**
 * SplitPay AI Engine
 * Provides natural language bill parsing, uneven expense resolution,
 * creative WhatsApp reminder generation, and campus expense intelligence.
 */

// Heuristic natural language bill parser
export const parseExpensePrompt = (input) => {
  const text = input.trim();
  const lower = text.toLowerCase();

  // 1. Detect Total Amount (matches: ₹5400, 5400, 5.4k, 5k, rs 5400, inr 5400)
  let amount = 0;
  const kMatch = lower.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*k\b/i);
  if (kMatch) {
    amount = Math.round(parseFloat(kMatch[1]) * 1000);
  } else {
    const numMatch = text.match(/(?:₹|rs\.?|inr)?\s*(\d{2,7}(?:,\d{3})*)/i);
    if (numMatch) {
      amount = parseInt(numMatch[1].replace(/,/g, ''), 10);
    }
  }

  // 2. Detect Trip / Event Purpose
  let tripName = 'Group Expense';
  if (lower.includes('goa')) tripName = 'Goa Trip Cabs & Food';
  else if (lower.includes('manali')) tripName = 'Manali Snow Ride';
  else if (lower.includes('biryani') || lower.includes('dinner') || lower.includes('food') || lower.includes('cafe')) tripName = 'Dinner & Food Bill';
  else if (lower.includes('cab') || lower.includes('uber') || lower.includes('ola') || lower.includes('taxi')) tripName = 'Cab & Transit Share';
  else if (lower.includes('rent') || lower.includes('pg') || lower.includes('flat')) tripName = 'Flat Rent & Maintenance';
  else if (lower.includes('groceries') || lower.includes('wifi')) tripName = 'Roommates WiFi & Groceries';
  else if (lower.includes('fest') || lower.includes('ticket') || lower.includes('pass')) tripName = 'College Fest Passes';
  else {
    const words = text.split(/\s+/).slice(0, 4).join(' ');
    if (words.length > 5 && !words.match(/^\d+$/)) {
      tripName = words.charAt(0).toUpperCase() + words.slice(1);
    }
  }

  // 3. Extract Friends / People
  const defaultFriends = ['Rohit K.', 'Priya S.', 'Aman M.', 'You (Host)'];
  let detectedFriends = [];

  // Check for common names in input
  const potentialNames = [
    'rohit', 'priya', 'aman', 'rahul', 'karan', 'sneha', 'pooja', 'neha', 
    'ananya', 'aryan', 'dev', 'simran', 'rohan', 'tanvi', 'vikram', 'shivam'
  ];

  potentialNames.forEach(n => {
    if (lower.includes(n)) {
      detectedFriends.push(n.charAt(0).toUpperCase() + n.slice(1));
    }
  });

  if (lower.includes('me') || lower.includes('myself') || lower.includes('i ')) {
    if (!detectedFriends.includes('You (Host)')) {
      detectedFriends.push('You (Host)');
    }
  }

  // Check for number of people (e.g. "for 4 people", "4 friends", "between 3 roommates")
  const countMatch = lower.match(/(?:for|between|among|with)\s+(\d+)\s+(?:people|friends|roommates|flatmates|members|guys)/i);
  let expectedCount = countMatch ? parseInt(countMatch[1], 10) : 0;

  if (expectedCount > 0 && detectedFriends.length < expectedCount) {
    const backupNames = ['Rohit K.', 'Priya S.', 'Aman M.', 'Aryan V.', 'Sneha R.', 'Dev P.'];
    let idx = 0;
    while (detectedFriends.length < expectedCount) {
      const candidate = backupNames[idx % backupNames.length];
      if (!detectedFriends.includes(candidate)) {
        detectedFriends.push(candidate);
      }
      idx++;
    }
  }

  const finalSquad = detectedFriends.length >= 2 ? detectedFriends : defaultFriends;
  const count = finalSquad.length;
  const perPerson = amount > 0 ? Math.round(amount / count) : 0;

  return {
    isBillParse: amount > 0,
    tripName,
    totalAmount: amount,
    memberCount: count,
    members: finalSquad,
    perPersonShare: perPerson
  };
};

// Generates creative WhatsApp reminder messages based on tone
export const generateAIReminder = ({ friendName = 'Friend', amount = 500, tripName = 'Trip Bill', tone = 'meme', hostUpi = 'prince@oksbi' }) => {
  const amtStr = `₹${Number(amount).toLocaleString('en-IN')}`;

  const templates = {
    meme: [
      `Arre ${friendName}! 😭 Mera bank account filhaal 'Channa Mereya' gaa raha hai... ${tripName} ka ${amtStr} pending hai. 1-tap me settle kardo bhai: upi://pay?pa=${hostUpi}&am=${amount} 💸`,
      `Emergency Bulletin for ${friendName}! 📢 RBI has noted ₹0 incoming from your side for ${tripName} (${amtStr}). Bachpan ka pyaar bhool nahi jaana, UPI tap kardo: upi://pay?pa=${hostUpi}&am=${amount} 🚀`,
      `Legend says ${friendName} is still thinking about paying ${amtStr} for ${tripName}... 🏆 Clear kardo bhai, ek click me direct UPI: upi://pay?pa=${hostUpi}&am=${amount} ☕`
    ],
    polite: [
      `Hey ${friendName}! Hope you had a great time during ${tripName}. Whenever you get a moment, here is the direct link for your share of ${amtStr}: upi://pay?pa=${hostUpi}&am=${amount} Thanks a lot! ✨`,
      `Hi ${friendName}, just doing the end-of-week accounting for ${tripName}. Your split is ${amtStr}. You can pay directly with 1 tap here: upi://pay?pa=${hostUpi}&am=${amount} 🙏`
    ],
    urgent: [
      `Hey ${friendName}, need to clear the vendor / host payments for ${tripName} today. Please settle your share of ${amtStr} via UPI: upi://pay?pa=${hostUpi}&am=${amount} Thanks! ⚡`,
      `Reminder: ${amtStr} due for ${tripName}. Tap to settle via GPay/PhonePe: upi://pay?pa=${hostUpi}&am=${amount} ⏳`
    ]
  };

  const pool = templates[tone] || templates.meme;
  return pool[Math.floor(Math.random() * pool.length)];
};

// Smart response generator for SplitPay AI Assistant
export const processUserMessage = async (userMessage, context = {}) => {
  const text = userMessage.trim();
  const lower = text.toLowerCase();

  // 1. Check if user is asking to parse / split an expense
  const billInfo = parseExpensePrompt(text);
  if (billInfo.isBillParse) {
    return {
      type: 'bill_parsed',
      content: `I've analyzed your expense: **${billInfo.tripName}** for **₹${billInfo.totalAmount.toLocaleString('en-IN')}** divided equally among **${billInfo.memberCount} members**. Each person owes **₹${billInfo.perPersonShare.toLocaleString('en-IN')}**.`,
      data: billInfo
    };
  }

  // 2. Check if user wants a WhatsApp reminder / meme nudge
  if (lower.includes('reminder') || lower.includes('nudge') || lower.includes('meme') || lower.includes('whatsapp') || lower.includes('chase')) {
    let tone = 'meme';
    if (lower.includes('polite') || lower.includes('gentle') || lower.includes('formal')) tone = 'polite';
    if (lower.includes('urgent') || lower.includes('asap') || lower.includes('strict')) tone = 'urgent';

    // Try extracting name and amount
    const nameMatch = text.match(/(?:for|to)\s+([A-Za-z]+)/i);
    const friendName = nameMatch ? nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1) : 'Rohit';
    
    const amtMatch = text.match(/(?:₹|rs\.?|amount)?\s*(\d{2,6})/i);
    const amount = amtMatch ? parseInt(amtMatch[1], 10) : 650;

    const generatedMsg = generateAIReminder({
      friendName,
      amount,
      tripName: context.tripName || 'Goa Trip',
      tone,
      hostUpi: context.hostUpi || 'prince@oksbi'
    });

    return {
      type: 'reminder_generated',
      content: `Here is your ${tone} WhatsApp reminder ready to dispatch:`,
      reminderText: generatedMsg,
      friendName,
      amount
    };
  }

  // 3. Complex / Uneven split handling
  if (lower.includes('uneven') || lower.includes('deduct') || lower.includes('starter') || lower.includes('drinks') || lower.includes('only had') || lower.includes('didn\'t eat')) {
    return {
      type: 'uneven_explanation',
      content: `For uneven splits, SplitPay's algorithm isolates personal items before distributing the shared total:\n\n1. **Personal Extras**: Subtract personal items (e.g. ₹300 dessert for Rohit).\n2. **Shared Base**: Divide remaining base evenly across all eaters.\n3. **Add Back**: Add personal items back to individual shares.\n\n*Example*: ₹2,400 total dinner (4 people) where Rohit had ₹300 extra:\n• Shared pool = ₹2,100 / 4 = **₹525 each**\n• Others pay = **₹525**\n• Rohit pays = ₹525 + ₹300 = **₹825**\n\nWould you like me to apply this split to your bill?`
    };
  }

  // 4. Razorpay / Safety / UPI questions
  if (lower.includes('razorpay') || lower.includes('safe') || lower.includes('security') || lower.includes('bank') || lower.includes('upi')) {
    return {
      type: 'info',
      content: `**SplitPay Payment Architecture & Security:**\n\n• **1-Tap UPI Rails**: Generates deep links compliant with NPCI UPI 2.0 standards.\n• **Zero App Install**: Friends simply tap your link on WhatsApp; it triggers their native GPay, PhonePe, or Paytm app directly.\n• **Direct Settlement**: Funds settle directly into your linked bank account via Razorpay API with 256-bit bank-grade encryption.\n• **Zero PIN Storage**: SplitPay never sees or stores any banking credentials or UPI PINs.`
    };
  }

  // 5. College tips / Greetings / Default fallback
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
    return {
      type: 'greeting',
      content: `Hey! I'm **SplitPay AI** — your campus expense co-pilot. ⚡\n\nI can help you:\n• **Split any bill from plain text** (e.g. *"Split ₹4,800 Goa cab between 4 friends"*)\n• **Draft hilarious Bollywood WhatsApp reminders** that get friends to pay instantly\n• **Calculate complex uneven splits** (who didn't drink, who paid fuel)\n\nWhat are you splitting today?`
    };
  }

  return {
    type: 'general',
    content: `I'm ready to help! Tell me about your expense (e.g. *"Manali trip ₹9,600 split between Rohit, Priya, Aman, and me"*) or ask me to draft a reminder (*"Write a funny meme nudge for Aman who owes ₹1,200"*).`
  };
};
