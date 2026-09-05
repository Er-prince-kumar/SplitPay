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

  // Encode UPI address cleanly without '@' to prevent WhatsApp phishing alerts
  const safeUpi = hostUpi ? hostUpi.trim().replace('@', '_at_') : '';
  const cleanHost = hostName || 'Organizer';
  const cleanTrip = tripName || 'Bill Split';

  // 100% Clean, standard URL without suspicious Base64 padding '=' or phishing '@'
  const gatewayUrl = `${baseUrl}/?pay=1&friend=${encodeURIComponent(friendName)}&amount=${amount}&host=${encodeURIComponent(cleanHost)}&trip=${encodeURIComponent(cleanTrip)}${safeUpi ? `&upi=${encodeURIComponent(safeUpi)}` : ''}`;

  let text = `Hey ${friendName}! 👋\n`;
  text += `*${cleanTrip}* ka aapka split share:\n\n`;
  text += `💰 *Amount*: *₹${formattedAmount}*\n`;
  text += `👤 *Organizer*: ${cleanHost}\n`;
  if (hostUpi) {
    text += `💳 *UPI ID*: *${hostUpi.trim()}*\n`;
  }
  text += `\n🚀 *1-Tap Pay Link (GPay / PhonePe / Paytm / QR):*\n${gatewayUrl}\n\n`;
  text += `Aap directly link khol kar kisi bhi UPI app se settle kar sakte hain. 🙏\n_SplitPay ⚡_`;
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

  const safeUpi = hostUpi ? hostUpi.trim().replace('@', '_at_') : '';
  const cleanHost = hostName || 'Organizer';
  const cleanTrip = tripName || 'Group Split';

  const gatewayUrl = `${baseUrl}/?pay=1&amount=${perPersonShare}&host=${encodeURIComponent(cleanHost)}&trip=${encodeURIComponent(cleanTrip)}${safeUpi ? `&upi=${encodeURIComponent(safeUpi)}` : ''}`;

  const memberLines = members.map((m, idx) => {
    const isPaid = m.status === 'paid';
    return `${idx + 1}. ${m.name}: *₹${formattedShare}* ${isPaid ? '✅ (Paid)' : '⏳ (Pending)'}`;
  }).join('\n');

  let text = `📢 *SplitPay Bill: ${cleanTrip}* 💸\n\n`;
  text += `💰 *Total Bill*: ₹${formattedTotal}\n`;
  text += `👥 *Total Friends*: ${members.length}\n`;
  text += `👉 *Per Person Share*: *₹${formattedShare} each*\n\n`;
  text += `📋 *Member Status:*\n${memberLines}\n\n`;
  text += `👤 *Organizer*: ${cleanHost}\n`;
  if (hostUpi) {
    text += `💳 *UPI ID*: *${hostUpi.trim()}*\n`;
  }
  text += `\n🚀 *1-Tap Pay Link (All UPI Apps & QR):*\n${gatewayUrl}\n\n`;
  text += `Sabhi dost apna share settle kar dein! 🙏\n_SplitPay ⚡_`;
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
