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
export const generateAIReminder = ({ friendName = 'Friend', amount = 500, tripName = 'Trip Bill', tone = 'meme', hostUpi = 'yourname@upi' }) => {
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

  // Helper detection flags
  const isAskingHowToUse = lower.includes('how to use') || lower.includes('kaise use') || lower.includes('kaise kaam') || 
                           lower.includes('how it works') || lower.includes('steps') || lower.includes('guide') || 
                           lower.includes('tutorial') || lower.includes('kaise chalaye') || lower.includes('kaise kare');

  const isAskingFeaturesOrAbout = lower.includes('website') || lower.includes('splitpay') || lower.includes('kya hai') || 
                                  lower.includes('feature') || lower.includes('function') || lower.includes('har function') || 
                                  lower.includes('har ek point') || lower.includes('about') || lower.includes('overview') || 
                                  lower.includes('kya kya') || lower.includes('sab kuch') || lower.includes('batao') || 
                                  lower.includes('explain') || lower.includes('details');

  const isAskingDashboard = lower.includes('dashboard') || lower.includes('trip add') || lower.includes('add trip') || 
                            lower.includes('saved trip') || lower.includes('kpi') || lower.includes('trip kaise');

  const isAskingSplitter = lower.includes('bill splitter') || lower.includes('splitter') || lower.includes('squad') || 
                           lower.includes('equal split') || lower.includes('members');

  const isAskingOcr = lower.includes('receipt') || lower.includes('ocr') || lower.includes('scan') || 
                      lower.includes('camera') || lower.includes('photo bill') || lower.includes('scanner');

  const isAskingUpiOrPayment = lower.includes('upi') || lower.includes('qr') || lower.includes('payment') || 
                               lower.includes('settle') || lower.includes('paise') || lower.includes('receiving upi') || 
                               lower.includes('razorpay');

  const isAskingPhone = lower.includes('phone') || lower.includes('number') || lower.includes('mobile') || 
                        lower.includes('galat number') || lower.includes('edit phone');

  const isAskingReminder = lower.includes('reminder') || lower.includes('nudge') || lower.includes('meme') || 
                           lower.includes('whatsapp') || lower.includes('chase');

  const isAskingSecurity = lower.includes('safe') || lower.includes('security') || lower.includes('pin') || 
                           lower.includes('secure') || lower.includes('fraud');

  const isAskingProfile = lower.includes('profile') || lower.includes('password') || lower.includes('login') || 
                          lower.includes('signup') || lower.includes('account');

  // =========================================================================
  // 1. DIRECT EXPENSE CALCULATION (e.g. "Split 5000 among 4 friends")
  // Only triggers if it's NOT a general informational question about the site
  // =========================================================================
  if (!isAskingHowToUse && !isAskingFeaturesOrAbout && !isAskingDashboard && !isAskingOcr && !isAskingUpiOrPayment && !isAskingPhone && !isAskingSecurity && !isAskingProfile) {
    const billInfo = parseExpensePrompt(text);
    if (billInfo.isBillParse) {
      return {
        type: 'bill_parsed',
        content: `Maine aapka bill calculate kar liya hai! ⚡\n\n📌 **Trip/Expense**: ${billInfo.tripName}\n💰 **Total Amount**: ₹${billInfo.totalAmount.toLocaleString('en-IN')}\n👥 **Members (${billInfo.memberCount})**: ${billInfo.members.join(', ')}\n💸 **Per Person Share**: **₹${billInfo.perPersonShare.toLocaleString('en-IN')}**\n\nNiche diye gaye **"Apply to Trip Bill Creator"** button par click karein aur ye trip sidhe Live Bill Splitter me load ho jayegi!`,
        data: billInfo
      };
    }
  }

  // =========================================================================
  // 2. WHATSAPP REMINDER / MEME GENERATION REQUEST
  // (e.g. "Write a meme reminder for Rohit who owes 500")
  // =========================================================================
  if (isAskingReminder && (lower.includes('write') || lower.includes('banao') || lower.includes('generate') || lower.includes('draft') || lower.includes('for ') || lower.includes('ko '))) {
    let tone = 'meme';
    if (lower.includes('polite') || lower.includes('gentle') || lower.includes('formal') || lower.includes('pyar se')) tone = 'polite';
    if (lower.includes('urgent') || lower.includes('asap') || lower.includes('strict') || lower.includes('jaldi')) tone = 'urgent';

    const nameMatch = text.match(/(?:for|to|ko)\s+([A-Za-z]+)/i);
    const friendName = nameMatch ? nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1) : 'Rohit';
    
    const amtMatch = text.match(/(?:₹|rs\.?|amount)?\s*(\d{2,6})/i);
    const amount = amtMatch ? parseInt(amtMatch[1], 10) : 650;

    const generatedMsg = generateAIReminder({
      friendName,
      amount,
      tripName: context.tripName || 'Goa Trip',
      tone,
      hostUpi: context.hostUpi || 'yourname@upi'
    });

    return {
      type: 'reminder_generated',
      content: `Aapka ${tone.toUpperCase()} WhatsApp reminder ready hai! 🚀`,
      reminderText: generatedMsg,
      friendName,
      amount
    };
  }

  // =========================================================================
  // 3. RECEIPT SCANNER & OCR SPECIFIC
  // =========================================================================
  if (isAskingOcr) {
    return {
      type: 'ocr_explanation',
      content: `📸 **Smart Receipt OCR & Bill Scanner Kaise Kaam Karta Hai:**\n\n1. **Capture Ya Upload**: Cafe ya restaurant ke receipt ki photo khinchein ya image upload karein.\n2. **Instant OCR Extraction**: AI scanner receipt ke har dish ka naam, individual price, subtotal, GST/tax, aur service charge extract kar leta hai.\n3. **Itemized Checkbox Splitting**: Har dish ke aage dosto ke naam ke checkboxes aate hain. Jo item jisne khaya, bas use tick karein (e.g. Kisne Pizza khaya, kisne Cold Coffee li).\n4. **Proportional Tax Calculation**: GST, VAT aur restaurant service charge har person ke khaye hue item ke ratio me automatically aur legally divide hota hai.\n5. **Apply to Splitter**: **"⚡ Apply to Trip Bill Creator"** button dabate hi poora itemized bill Live Bill Splitter me load ho jata hai!`
    };
  }

  // =========================================================================
  // 4. USER DASHBOARD & TRIP MANAGEMENT
  // =========================================================================
  if (isAskingDashboard) {
    return {
      type: 'dashboard_explanation',
      content: `📊 **User Dashboard Kaise Kaam Karta Hai:**\n\n• **Clean State**: Naye user ke login karne par dashboard 100% clean shuru hota hai (0 Trips — "No Saved Trips Yet").\n• **+ Add Trip Split**: Dashboard ke top ya trips header me **"+ Add Trip"** button dabakar aap turant naya trip create kar sakte hain (Title, Amount, Friends).\n• **Financial KPI Cards**:\n  1. *Total Spent & Split*: Ab tak ke sabhi registered campus trips ka total kharcha.\n  2. *To Collect (From Friends)*: Dosto se lena baki kul pending amount.\n  3. *Overall Settled Rate*: Kitne percent friends ne pay kar diya hai (Progress bar ke sath).\n  4. *Active Expense Hubs*: Kul kitne active trips hain aur kitne fully settle ho chuke hain.\n• **1-Click Trip Settlement**: Har trip card par **"Mark 100% Settled"** toggle button hota hai jisse poora trip 1-click me paid ya reopen ho jata hai.\n• **Open in Splitter**: Kisi bhi trip card par click karte hi wo Live Bill Splitter me edit karne ke liye open ho jata hai.`
    };
  }

  // =========================================================================
  // 5. UPI PAYMENT, QR CODES & RECEIVING UPI
  // =========================================================================
  if (isAskingUpiOrPayment) {
    return {
      type: 'upi_explanation',
      content: `⚡ **SplitPay UPI & Dynamic QR Code System:**\n\n• **YOUR RECEIVING UPI ID**: Bill Splitter me ye field pehle se **100% blank** aati hai taaki aap apna sahi UPI ID ("e.g. name@okhdfcbank") enter kar sakein. Galat hone par **"Clear"** button se turant hata kar re-edit kar sakte hain.\n• **Dynamic QR Codes**: Member ke aage **"Pay"** button dabane par ek custom QR code banta hai jisme:\n  - Aapka UPI ID pre-set hota hai.\n  - Us dost ka exact per-person share pre-filled hota hai.\n• **Direct Bank-to-Bank**: Dost GPay, PhonePe, Paytm ya BHIM se scan karke pay karta hai aur paisa sidhe aapke bank account me transfer hota hai (Zero middleman, zero deduction).\n• **1-Tap UPI Links**: WhatsApp reminders me NPCI UPI 2.0 deep links hote hain jinhe tap karte hi friend ke phone me UPI app direct payment screen par open ho jati hai.`
    };
  }

  // =========================================================================
  // 6. PHONE NUMBER & RE-EDITING SUPPORT
  // =========================================================================
  if (isAskingPhone) {
    return {
      type: 'phone_explanation',
      content: `📱 **Phone Number & Re-editing Kaise Kaam Karta Hai:**\n\n• **Host Phone Number**: Jab aap login karte hain, aapka registered mobile number automatically host ki tarah load hota hai.\n• **Agar Galat Number Ho Toh Kaise Edit Karein?**\n  1. *Dashboard Welcome Banner*: Banner me mobile number ke aage **"Edit"** button par click karke turant update karein.\n  2. *Live Bill Splitter (Squad List)*: Member list me Host ke phone ke aage **"Edit"** button par click karein — wahi inline input khulega, sahi number daalkar **"✓"** dabayein, turant save ho jayega!\n  3. *Profile Modal*: Top navbar me Profile par click karke bhi apna number change kar sakte hain.\n• **Friends Phone Numbers**: Friends ke phone numbers optional hote hain. Agar daalein toh unhe direct WhatsApp reminder jayega; agar na daalein toh WhatsApp open hokar contact select karne dega.`
    };
  }

  // =========================================================================
  // 7. SECURITY, RAZORPAY & PRIVACY
  // =========================================================================
  if (isAskingSecurity) {
    return {
      type: 'security_explanation',
      content: `🔒 **SplitPay Security & Banking Infrastructure:**\n\n• **Bank-Grade Encryption**: Sabhi data transactions 256-bit SSL encryption ke through secure rehte hain.\n• **Zero PIN / Credential Storage**: SplitPay kabhi bhi aapka bank password, UPI PIN ya OTP nahi mangta aur na hi store karta hai. Payment hamesha aapke apne GPay/PhonePe app me authentic hoti hai.\n• **Razorpay Infrastructure**: Platform secure enterprise payment gateways aur NPCI UPI 2.0 protocols ko follow karta hai.\n• **Direct Settlement**: Friends ka paisa bina kisi middleman ke direct Host ke bank account me deposit hota hai.`
    };
  }

  // =========================================================================
  // 8. PROFILE, SIGNUP & STRONG PASSWORD RULES
  // =========================================================================
  if (isAskingProfile) {
    return {
      type: 'profile_explanation',
      content: `👤 **Profile & Account Security Rules:**\n\n• **Strong Password Policy**: Account protection ke liye password me kam se kam 6 characters, alphabets (a-z, A-Z), numbers (0-9), aur special characters (e.g. !@#$%^&*) hona zaruri hai.\n• **Live Strength Meter**: Signup aur Forgot Password me live color-coded strength bar aur checklist badges dikhte hain jo criteria verify karte hain.\n• **Profile Details**: Profile Modal me aap apna Full Name, Avatar Emoji (👑, 👨‍💻, 🎒, etc.), College/Campus, Room Number, Phone Number aur UPI ID kabhi bhi edit aur save kar sakte hain.`
    };
  }

  // =========================================================================
  // 9. HOW TO USE / STEP-BY-STEP WORKFLOW GUIDE
  // =========================================================================
  if (isAskingHowToUse && !lower.includes('har function') && !lower.includes('har ek point') && !lower.includes('all feature')) {
    return {
      type: 'how_to_use',
      content: `🚀 **SplitPay Kaise Use Karein (Step-by-Step Guide):**\n\nSplitPay use karna behad aasan hai — follow these 6 simple steps:\n\n• **Step 1: Sign In / Account Banayein**\nTop-right me **"Sign In"** button par click karein. Apna email/mobile aur ek strong password (alphabets + numbers + special characters e.g. "User@1234") daalkar register karein.\n\n• **Step 2: Trip Ya Bill Create Karein**\nDashboard me **"+ Add Trip Split"** button dabayein ya page scroll karke **"Live Bill Splitter"** me jayein. Trip ka naam (e.g. *Goa Weekend*, *Flat Rent*, *Hostel Dinner*) aur total amount enter karein.\n\n• **Step 3: Dosto Ko Add Karein**\nSquad section me apne dosto ke naam daalein. Agar unka WhatsApp number pata ho toh daalein (warna optional chhod dein).\n\n• **Step 4: Apna Receiving UPI ID Daalein**\n**"YOUR RECEIVING UPI ID"** input field me apna UPI ID daalein (e.g. "yourname@okhdfcbank"). Friends isi ID par direct pay karenge.\n\n• **Step 5: Friends Ko Payment Request Bhejein**\n  1. **WhatsApp Se**: Member ke aage green **WhatsApp** button dabayein — unhe 1-tap payment link ke sath message chala jayega.\n  2. **QR Code Se**: Member ke aage **"Pay"** button dabayein — screen par unke exact share ka dynamic UPI QR code khul jayega jise wo PhonePe/GPay se scan kar sakte hain.\n\n• **Step 6: Settle Mark Karein**\nJaise hi dost paisa bhej de, unke aage **"Pending"** button dabayein, wo **"Paid ✓"** ho jayega! Poora trip clear hone par trip card par **"Mark 100% Settled"** click karein.\n\n💡 **Pro-Tip**: Cafe/Restaurant bill ke liye **Receipt OCR Scanner** me bill ki photo daalein — AI automatically har item aur tax split kar dega!`
    };
  }

  // =========================================================================
  // 10. COMPLETE WEBSITE OVERVIEW & HAR EK FUNCTION EXPLANATION
  // =========================================================================
  if (isAskingFeaturesOrAbout || isAskingHowToUse) {
    return {
      type: 'features_overview',
      content: `🌟 **SplitPay Kya Hai & Har Function Kaise Kaam Karta Hai:**\n\nSplitPay ek modern **Campus & Group Expense Sharing Platform** hai jisme friends, roommates aur college groups apne kharche 1-tap UPI aur automated settlements se bina kisi awkward baatcheet ke split karte hain.\n\nHere is how every feature works:\n\n1. 📊 **User Dashboard (Trips Hub)**:\n• **KPI Metrics**: Real-time stats dikhata hai — Total Spent, Friends se lena baki (To Collect), Overall Settlement Rate (%), aur Active Trips.\n• **+ Add Trip Split**: New trip add karein (Title, Amount, Friends). Dashboard 100% clean shuru hota hai aur user ke trip create karne par hi trips add hoti hain.\n• **1-Click Settlement**: Trip card par **"Mark 100% Settled"** toggle dabate hi poora trip settle ho jata hai.\n• **Card Click**: Kisi bhi trip card par click karte hi wo direct Bill Splitter me load ho jata hai.\n\n2. ⚡ **Interactive Bill Splitter**:\n• **Equal Split**: Total amount ko sabhi members me automatically barabar divide karta hai.\n• **Squad Management**: Naye dost add karein with avatars aur mobile numbers.\n• **Host & Friends Phone Edit**: Phone number ke bagal me **Edit** button se galat number turant theek kiya ja sakta hai.\n• **Receiving UPI ID**: Blank field jaha Host apna UPI ID ("e.g. name@okhdfcbank") enter karta hai (Clear/Re-edit suvidha ke sath).\n• **Individual Settle**: Har member ke aage "Pending / Mark Paid" button with confetti celebration.\n\n3. 📸 **Smart Receipt OCR Scanner**:\n• Cafe ya restaurant ke physical bill ki photo khinchein/upload karein.\n• OCR AI har dish, uski price, subtotal, aur GST/tax read kar leta hai.\n• **Itemized Split**: Checkbox se choose karein kisne kya khaya. GST aur tax sabhi par proportionally divide ho jata hai.\n• 1-Click me bill Live Splitter me export ho jata hai.\n\n4. 📱 **1-Tap Direct UPI & Dynamic QR Codes**:\n• Har member ke aage **"Pay"** button dabate hi unke exact amount ka dynamic NPCI QR code khul jata hai.\n• GPay, PhonePe, Paytm ya BHIM se scan karte hi direct Host ke bank me paisa credit hota hai (Zero middleman fee).\n\n5. 💬 **SplitPay AI Co-Pilot (Ye Chatbot)**:\n• Plain text se bill calculation (e.g. *"Manali cab ₹3600 for 3 friends"*).\n• Bollywood meme WhatsApp reminders banana.\n• Website ke kisi bhi function ya doubt ka answer dena.\n\n6. 🔒 **Enterprise Security & Direct Settlement**:\n• 256-bit bank-grade encryption with Razorpay infrastructure. Zero UPI PIN ya password storage.\n\n7. 👤 **Profile & Strong Security**:\n• Name, avatar emoji, college, room number, phone aur UPI ID manage karein.\n• Strong password protection (combination of letters, numbers, and symbols).\n\n---\n\n🚀 **Quick 4-Step How-To-Use Guide:**\n1. **Sign In**: Email & strong password se account banayein.\n2. **Trip Create Karein**: Dashboard me **"+ Add Trip Split"** dabayein.\n3. **UPI ID Daalein**: Apna receiving UPI ID enter karein aur friends add karein.\n4. **1-Tap Settle**: QR code ya WhatsApp 1-tap link se pay karwayein aur **"Mark Paid ✓"** karein!`
    };
  }

  // =========================================================================
  // 11. UNEVEN SPLIT EXPLANATION
  // =========================================================================
  if (lower.includes('uneven') || lower.includes('deduct') || lower.includes('starter') || lower.includes('drinks') || lower.includes('only had') || lower.includes('didn\'t eat')) {
    return {
      type: 'uneven_explanation',
      content: `For uneven splits, SplitPay's algorithm isolates personal items before distributing the shared total:\n\n1. **Personal Extras**: Subtract personal items (e.g. ₹300 dessert for Rohit).\n2. **Shared Base**: Divide remaining base evenly across all eaters.\n3. **Add Back**: Add personal items back to individual shares.\n\n*Example*: ₹2,400 total dinner (4 people) where Rohit had ₹300 extra:\n• Shared pool = ₹2,100 / 4 = **₹525 each**\n• Others pay = **₹525**\n• Rohit pays = ₹525 + ₹300 = **₹825**\n\nWould you like me to apply this split to your bill?`
    };
  }

  // =========================================================================
  // 12. GREETINGS & INTRO
  // =========================================================================
  if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('namaste') || lower.includes('pranam')) {
    return {
      type: 'greeting',
      content: `Namaste! Main hoon **SplitPay AI** — aapka campus expense aur bill split assistant! ⚡\n\nAap mujhse ye sab pooch sakte hain:\n• **"Website ke saare features aur use kaise kare?"**\n• **"Dashboard me trip kaise add karein?"**\n• **"Receipt OCR scanner kaise kaam karta hai?"**\n• **"UPI payment aur QR codes kaise kaam karte hain?"**\n• **"Split ₹4,800 Goa trip among 4 friends"** (Direct calculation)\n• **"Write a meme WhatsApp reminder for Rohit"**\n\nAapko kis cheez ke bare me jaanna hai?`
    };
  }

  // =========================================================================
  // 13. SMART FALLBACK WITH HELPFUL PROMPTS
  // =========================================================================
  return {
    type: 'general',
    content: `Main SplitPay ke har feature aur function ke bare me bata sakta hoon! ⚡\n\nAap pooch sakte hain:\n• 📖 *"Website ke baare me sab kuch batao"* (Full overview)\n• 🚀 *"How to use / Kaise use karein?"* (Step-by-step tutorial)\n• 📊 *"Dashboard aur trip add kaise karein?"*\n• 📸 *"Receipt scanner kaise kaam karta hai?"*\n• ⚡ *"UPI payment aur QR code kaise kaam karta hai?"*\n• 📱 *"Phone number ya UPI ID galat ho jaye toh kaise edit karein?"*\n• 💸 *"Split ₹3,600 Manali trip between Aman, Rohit, and me"*`
  };
};
