/**
 * Receipt OCR & Auto-Itemized Bill Splitting Engine
 * Parses receipt items, handles shared dish distributions,
 * calculates proportional taxes & tips, and generates WhatsApp breakdowns.
 */

export const SAMPLE_RECEIPTS = [
  {
    id: 'pizza-dominos',
    name: "Domino's Pizza & Wings Feast",
    place: "Domino's Pizza, Campus Sector 14",
    date: 'Today, 8:45 PM',
    currency: '₹',
    items: [
      { id: 'item-1', name: 'Farmhouse Pizza (Medium)', qty: 1, price: 450, category: 'Main' },
      { id: 'item-2', name: 'Peppy Paneer Pizza (Medium)', qty: 1, price: 420, category: 'Main' },
      { id: 'item-3', name: 'Stuffed Garlic Bread', qty: 1, price: 150, category: 'Sides' },
      { id: 'item-4', name: 'Pepsi 500ml Bottle (x2)', qty: 2, price: 120, category: 'Drinks' },
      { id: 'item-5', name: 'Choco Lava Cake', qty: 1, price: 110, category: 'Dessert' },
    ],
    subtotal: 1250,
    tax: 65, // GST 5%
    tipOrFee: 45, // Delivery Fee
    total: 1360
  },
  {
    id: 'cafe-bluetokai',
    name: "Blue Tokai Coffee & Bakery",
    place: "Blue Tokai Roasters, Connaught Place",
    date: 'Yesterday, 4:15 PM',
    currency: '₹',
    items: [
      { id: 'item-1', name: 'Iced Latte (Oat Milk)', qty: 1, price: 260, category: 'Beverage' },
      { id: 'item-2', name: 'Sea Salt Dark Mocha', qty: 1, price: 240, category: 'Beverage' },
      { id: 'item-3', name: 'Butter Croissant', qty: 1, price: 180, category: 'Bakery' },
      { id: 'item-4', name: 'Truffle Parmesan Fries', qty: 1, price: 220, category: 'Snacks' },
    ],
    subtotal: 900,
    tax: 45,
    tipOrFee: 50,
    total: 995
  },
  {
    id: 'dhaba-punjabi',
    name: "Punjab Grill & Dhaba Dinner",
    place: "Sher-e-Punjab Dhaba, GT Road",
    date: '02 Sept 2026, 9:30 PM',
    currency: '₹',
    items: [
      { id: 'item-1', name: 'Butter Chicken Handi', qty: 1, price: 520, category: 'Main' },
      { id: 'item-2', name: 'Dal Makhani Special', qty: 1, price: 360, category: 'Main' },
      { id: 'item-3', name: 'Butter Garlic Naan (x4)', qty: 4, price: 240, category: 'Breads' },
      { id: 'item-4', name: 'Chicken Dum Biryani', qty: 1, price: 410, category: 'Rice' },
      { id: 'item-5', name: 'Sweet Malai Lassi (x2)', qty: 2, price: 160, category: 'Drinks' },
    ],
    subtotal: 1690,
    tax: 85,
    tipOrFee: 100,
    total: 1875
  },
  {
    id: 'hostel-groceries',
    name: "Blinkit Hostel Roommate Groceries",
    place: "Blinkit Dark Store #102",
    date: '31 Aug 2026, 11:15 AM',
    currency: '₹',
    items: [
      { id: 'item-1', name: 'Amul Taaza Milk 1L (x2)', qty: 2, price: 112, category: 'Dairy' },
      { id: 'item-2', name: 'Brown Bread & Salted Butter', qty: 1, price: 105, category: 'Breakfast' },
      { id: 'item-3', name: 'Maggi Masala 12-Pack', qty: 1, price: 168, category: 'Snacks' },
      { id: 'item-4', name: 'Monster Energy Drink (x2)', qty: 2, price: 240, category: 'Drinks' },
      { id: 'item-5', name: 'Lays & Doritos Party Pack', qty: 1, price: 140, category: 'Snacks' },
    ],
    subtotal: 765,
    tax: 35,
    tipOrFee: 30,
    total: 830
  }
];

/**
 * Calculates itemized breakdown for each person.
 * Handles split items (1 item shared between multiple people)
 * and distributes tax/service charges proportionally based on each person's consumed subtotal.
 */
export const calculateItemizedSplit = ({
  items = [],
  tax = 0,
  tipOrFee = 0,
  members = [],
  claims = {} // { itemId: [memberId1, memberId2] }
}) => {
  const memberTotals = {};
  const memberItems = {};

  members.forEach((m) => {
    memberTotals[m.id] = 0;
    memberItems[m.id] = [];
  });

  let totalClaimedSubtotal = 0;
  let unclaimedItems = [];

  items.forEach((item) => {
    const claimants = claims[item.id] || [];
    if (claimants.length === 0) {
      unclaimedItems.push(item);
    } else {
      const sharePerPerson = item.price / claimants.length;
      claimants.forEach((memberId) => {
        if (memberTotals[memberId] !== undefined) {
          memberTotals[memberId] += sharePerPerson;
          memberItems[memberId].push({
            name: item.name,
            originalPrice: item.price,
            sharePrice: sharePerPerson,
            isShared: claimants.length > 1,
            sharedWithCount: claimants.length
          });
        }
      });
      totalClaimedSubtotal += item.price;
    }
  });

  const totalExtraCharges = (Number(tax) || 0) + (Number(tipOrFee) || 0);

  // Compute proportional tax and grand total for each member
  const breakdown = members.map((m) => {
    const rawSubtotal = memberTotals[m.id] || 0;
    // Proportional share of extra charges: (memberSubtotal / totalClaimedSubtotal) * totalExtraCharges
    const proportionalCharges = totalClaimedSubtotal > 0 
      ? Math.round((rawSubtotal / totalClaimedSubtotal) * totalExtraCharges) 
      : 0;
    const finalAmount = Math.round(rawSubtotal + proportionalCharges);

    return {
      id: m.id,
      name: m.name,
      avatar: m.avatar || '👤',
      phone: m.phone || '',
      items: memberItems[m.id] || [],
      subtotal: Math.round(rawSubtotal),
      taxAndFees: proportionalCharges,
      totalAmount: finalAmount
    };
  });

  const itemsTotal = items.reduce((acc, it) => acc + (Number(it.price) || 0), 0);
  const grandTotal = itemsTotal + (Number(tax) || 0) + (Number(tipOrFee) || 0);

  return {
    breakdown,
    itemsTotal,
    grandTotal,
    totalClaimedSubtotal,
    unclaimedItems,
    isFullyClaimed: unclaimedItems.length === 0
  };
};

/**
 * Builds a friendly itemized WhatsApp summary for individual members or the whole group.
 */
export const buildItemizedWhatsAppSummary = ({
  receiptName = 'Bill Split',
  breakdown = [],
  hostUpi = 'prince@oksbi',
  grandTotal = 0
}) => {
  let message = `🧾 *Itemized Bill Split: ${receiptName}*\n`;
  message += `💰 *Total Bill: ₹${grandTotal.toLocaleString('en-IN')}*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  breakdown.forEach((m) => {
    message += `👤 *${m.name}* owes *₹${m.totalAmount.toLocaleString('en-IN')}*\n`;
    if (m.items && m.items.length > 0) {
      m.items.forEach((it) => {
        message += `  • ${it.name}: ₹${Math.round(it.sharePrice)}${it.isShared ? ` (Shared with ${it.sharedWithCount})` : ''}\n`;
      });
      if (m.taxAndFees > 0) {
        message += `  • Proportional Taxes & Fees: ₹${m.taxAndFees}\n`;
      }
    } else {
      message += `  • No items claimed\n`;
    }
    message += `\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `👉 Pay directly to UPI ID: *${hostUpi}* (PhonePe/GPay/Paytm)\n`;
  message += `_Calculated with SplitPay Receipt OCR_`;

  return message;
};
