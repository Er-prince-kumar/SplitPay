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
  hostUpi = '',
  tone = 'standard'
}) => {
  const formattedAmount = Number(amount).toLocaleString('en-IN');
  const baseUrl = typeof window !== 'undefined' && window.location.origin
    ? `${window.location.origin}${window.location.pathname.replace(/\/$/, '')}`
    : 'https://er-prince-kumar.github.io/SplitPay';

  const gatewayUrl = `${baseUrl}/?pay=true&friend=${encodeURIComponent(friendName)}&amount=${amount}&host=${encodeURIComponent(hostName)}&upi=${encodeURIComponent(hostUpi)}&trip=${encodeURIComponent(tripName)}`;

  let text = `Hey ${friendName}! 👋\n`;
  text += `Here is your personal split share for *${tripName}*:\n\n`;
  text += `💰 *Amount to Pay*: *₹${formattedAmount}*\n`;
  text += `👤 *Organizer*: ${hostName}\n`;
  if (hostUpi) {
    text += `💳 *UPI ID*: *${hostUpi}*\n`;
  }
  text += `\n🚀 *1-Tap Pay via SplitPay Secure Gateway:*\n${gatewayUrl}\n\n`;
  text += `🔒 _(Zero Risk • Verified SSL • GPay / PhonePe / Paytm accepted)_\n`;
  text += `Please settle whenever you get a minute! 🙏\n_Sent via SplitPay ⚡_`;
  return text;
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
  const baseUrl = typeof window !== 'undefined' && window.location.origin
    ? `${window.location.origin}${window.location.pathname.replace(/\/$/, '')}`
    : 'https://er-prince-kumar.github.io/SplitPay';

  const gatewayUrl = `${baseUrl}/?pay=true&amount=${perPersonShare}&host=${encodeURIComponent(hostName)}&upi=${encodeURIComponent(hostUpi)}&trip=${encodeURIComponent(tripName)}`;

  const memberLines = members.map((m, idx) => {
    const isPaid = m.status === 'paid';
    return `${idx + 1}. ${m.name}: *₹${formattedShare}* ${isPaid ? '✅ (Paid)' : '⏳ (Pending)'}`;
  }).join('\n');

  let text = `📢 *SplitPay Bill Breakdown: ${tripName || 'Group Split'}* 💸\n\n`;
  text += `💰 *Total Bill*: ₹${formattedTotal}\n`;
  text += `👥 *Total Friends*: ${members.length}\n`;
  text += `👉 *Per Person Share*: *₹${formattedShare} each*\n\n`;
  text += `📋 *Member Status:*\n${memberLines}\n\n`;
  text += `👤 *Organizer*: ${hostName}\n`;
  if (hostUpi) {
    text += `💳 *UPI ID*: *${hostUpi}*\n`;
  }
  text += `\n🚀 *1-Tap Pay via SplitPay Secure Gateway:*\n${gatewayUrl}\n\n`;
  text += `🔒 _(Verified SSL • Zero Risk • 1-Tap GPay/PhonePe/Paytm)_\n`;
  text += `Sabhi dost apna share settle kar dein! 🙏\n_Powered by SplitPay ⚡_`;
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
