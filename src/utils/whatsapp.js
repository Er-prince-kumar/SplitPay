/**
 * WhatsApp integration utility for SplitPay
 * Automatically sanitizes phone numbers and generates direct wa.me chat links with pre-filled split messages.
 */

/**
 * Sanitizes and formats phone numbers for WhatsApp API
 * Defaults to India (+91) if 10 digits are provided.
 * @param {string} phone 
 * @returns {string} Clean digits with country code
 */
export const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  // Remove all non-digit characters
  let digits = phone.toString().replace(/\D/g, '');
  
  // Handle 10-digit Indian numbers (e.g. 9876543210 -> 919876543210)
  if (digits.length === 10) {
    return `91${digits}`;
  }
  
  // Handle 11-digit numbers starting with 0 (e.g. 09876543210 -> 919876543210)
  if (digits.length === 11 && digits.startsWith('0')) {
    return `91${digits.slice(1)}`;
  }
  
  return digits;
};

/**
 * Formats a phone number for user-friendly display
 * e.g. 9876543210 -> +91 98765 43210
 */
export const formatDisplayPhone = (phone) => {
  if (!phone) return '';
  const clean = cleanPhoneNumber(phone);
  if (clean.length === 12 && clean.startsWith('91')) {
    const main = clean.slice(2);
    return `+91 ${main.slice(0, 5)} ${main.slice(5)}`;
  }
  return phone;
};

/**
 * Builds personalized WhatsApp split messages based on tone
 */
export const buildSplitWhatsAppMessage = ({
  friendName = 'Friend',
  tripName = 'Trip Bill',
  amount = 0,
  hostName = 'Organizer',
  hostUpi = 'upi@bank',
  paymentLink = '',
  tone = 'standard'
}) => {
  const formattedAmount = Number(amount).toLocaleString('en-IN');
  const safeLink = paymentLink || `https://rzp.io/l/splitpay-${encodeURIComponent(tripName.toLowerCase().replace(/[^a-z0-9]/g, '-'))}`;

  switch (tone) {
    case 'friendly':
      return `Hey ${friendName}! 😄 Hope you had an amazing time on *${tripName}*!\n\nJust wrapping up the group expenses — your split comes to *₹${formattedAmount}*.\n\n⚡ *Pay in 1 tap via UPI:*\n${safeLink}\n\n👤 Host: ${hostName} (${hostUpi})\nThanks a ton! 🙌`;

    case 'urgent':
      return `Yo ${friendName}! ⏰ Quick friendly callout for *${tripName}*:\nThe trip expenses are waiting to be settled. Your pending share is *₹${formattedAmount}*.\n\n👉 *Clear it now in 1 tap:*\n${safeLink}\n\n👤 UPI: ${hostUpi}\nCheers! ⚡`;

    case 'fun':
      return `Bro ${friendName} 🍕 You ate the food, had the fun, now SplitPay wants the fund! 😂\nYour share for *${tripName}* is *₹${formattedAmount}*.\n\n💸 *Don't make ${hostName} chase you — 1-Tap Pay here:*\n${safeLink}\n\nClear karo bhai! ✨`;

    case 'standard':
    default:
      return `Hey ${friendName}! 👋\nHere is your share for *${tripName}*:\n💰 Amount: *₹${formattedAmount}*\n👤 Host: ${hostName} (${hostUpi})\n\n⚡ *Pay instantly in 1-tap via UPI:*\n${safeLink}\n\nPowered by SplitPay ⚡`;
  }
};

/**
 * Builds comprehensive Group WhatsApp split message for the entire squad / WhatsApp Group
 */
export const buildGroupSplitWhatsAppMessage = ({
  tripName = 'Group Split',
  totalAmount = 0,
  perPersonShare = 0,
  hostName = 'Host',
  hostUpi = '',
  members = []
}) => {
  const formattedTotal = Number(totalAmount).toLocaleString('en-IN');
  const formattedShare = Number(perPersonShare).toLocaleString('en-IN');
  const upiLink = hostUpi 
    ? `upi://pay?pa=${hostUpi}&pn=${encodeURIComponent(hostName)}&am=${perPersonShare}&cu=INR&tn=${encodeURIComponent(tripName || 'SplitPay')}`
    : '';

  const memberLines = members.map((m, idx) => {
    const isPaid = m.status === 'paid';
    return `${idx + 1}. ${m.name}: *₹${formattedShare}* ${isPaid ? '✅ (Paid)' : '⏳ (Pending)'}`;
  }).join('\n');

  let text = `📢 *SplitPay Bill Breakdown: ${tripName || 'Group Split'}* 💸\n\n`;
  text += `💰 *Total Bill*: ₹${formattedTotal}\n`;
  text += `👥 *Total Squad Members*: ${members.length}\n`;
  text += `👉 *Per Person Share*: *₹${formattedShare} each*\n\n`;
  text += `📋 *Member Status:*\n${memberLines}\n\n`;
  text += `⚡ *How to Pay (Direct UPI to Host):*\n`;
  text += `👤 Host: *${hostName}*\n`;
  text += `💳 UPI ID: *${hostUpi || 'Pending'}*\n`;
  if (upiLink) {
    text += `🔗 *1-Tap UPI Payment Link*:\n${upiLink}\n\n`;
  }
  text += `Sabhi log apna share jaldi settle kardo bhai! 🙏\nPowered by SplitPay ⚡`;
  return text;
};

/**
 * Returns wa.me link with encoded message
 */
export const getWhatsAppUrl = (phone, message) => {
  const clean = cleanPhoneNumber(phone);
  const encoded = encodeURIComponent(message);
  if (clean) {
    return `https://wa.me/${clean}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
};

/**
 * Opens WhatsApp chat directly in a new window/tab
 */
export const openWhatsAppDirect = (phone, message) => {
  const url = getWhatsAppUrl(phone, message);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  return url;
};
