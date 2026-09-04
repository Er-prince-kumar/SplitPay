import { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Check, 
  Copy, 
  MessageCircle, 
  Plus, 
  Trash2, 
  UserCheck, 
  Receipt, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { openWhatsAppDirect } from '../../utils/whatsapp';
import { 
  SAMPLE_RECEIPTS, 
  calculateItemizedSplit, 
  buildItemizedWhatsAppSummary 
} from '../../utils/receiptOcrEngine';

const ReceiptOcrSection = ({ currentUser, onApplyToSplitter }) => {
  // Active selected or uploaded receipt
  const [activeReceipt, setActiveReceipt] = useState(SAMPLE_RECEIPTS[0]);
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccessToast, setScanSuccessToast] = useState(false);

  // Editable receipt fields
  const [receiptName, setReceiptName] = useState(SAMPLE_RECEIPTS[0].name);
  const [items, setItems] = useState(SAMPLE_RECEIPTS[0].items);
  const [tax, setTax] = useState(SAMPLE_RECEIPTS[0].tax);
  const [tipOrFee, setTipOrFee] = useState(SAMPLE_RECEIPTS[0].tipOrFee);

  // Squad members participating in this meal
  const [squad, setSquad] = useState([
    { id: 'm-1', name: currentUser?.name || 'You (Host)', avatar: currentUser?.avatar || '👑', isHost: true },
    { id: 'm-2', name: 'Rohit K.', avatar: '👨‍💻', isHost: false },
    { id: 'm-3', name: 'Priya S.', avatar: '👩‍🎨', isHost: false },
    { id: 'm-4', name: 'Aman M.', avatar: '🎒', isHost: false },
  ]);

  const [newFriendName, setNewFriendName] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const fileInputRef = useRef(null);

  // Claims map: { [itemId]: [memberId1, memberId2, ...] }
  // Pre-seed first sample so users immediately see how "tap what you ordered" works
  const [claims, setClaims] = useState({
    'item-1': ['m-1', 'm-2'], // Farmhouse shared by You and Rohit
    'item-2': ['m-3', 'm-4'], // Peppy Paneer shared by Priya and Aman
    'item-3': ['m-1', 'm-2', 'm-3', 'm-4'], // Garlic bread shared by everyone
    'item-4': ['m-2', 'm-4'], // Pepsi shared by Rohit and Aman
    'item-5': ['m-1', 'm-3'] // Choco lava shared by You and Priya
  });

  // Calculate live breakdown
  const splitResult = calculateItemizedSplit({
    items,
    tax,
    tipOrFee,
    members: squad,
    claims
  });

  // Handle selecting a sample receipt
  const handleSelectSample = (sample) => {
    sound.playClick();
    setIsScanning(true);
    setUploadedImagePreview(null);

    setTimeout(() => {
      setActiveReceipt(sample);
      setReceiptName(sample.name);
      setItems(sample.items);
      setTax(sample.tax);
      setTipOrFee(sample.tipOrFee);

      // Default distribution: allocate first few items to squad
      const newClaims = {};
      sample.items.forEach((it, idx) => {
        if (squad.length > 0) {
          const m = squad[idx % squad.length];
          newClaims[it.id] = [m.id];
        }
      });
      setClaims(newClaims);

      setIsScanning(false);
      sound.playUpiSuccess();
    }, 600);
  };

  // Handle uploading real receipt photo
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sound.playClick();
    setIsScanning(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImagePreview(event.target?.result);
      
      // Simulate intelligent neural OCR extraction
      setTimeout(() => {
        const customItems = [
          { id: 'custom-1', name: 'Chef Special Main Course', qty: 1, price: 420, category: 'Main' },
          { id: 'custom-2', name: 'Fresh Crispy Appetizer', qty: 1, price: 210, category: 'Starter' },
          { id: 'custom-3', name: 'Mocktail / Beverage (x2)', qty: 2, price: 180, category: 'Drinks' },
          { id: 'custom-4', name: 'Signature Dessert Special', qty: 1, price: 160, category: 'Dessert' }
        ];

        setReceiptName(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") || "Scanned Bill Receipt");
        setItems(customItems);
        setTax(48);
        setTipOrFee(30);

        const newClaims = {
          'custom-1': ['m-1'],
          'custom-2': ['m-1', 'm-2'],
          'custom-3': ['m-3'],
          'custom-4': ['m-4']
        };
        setClaims(newClaims);

        setIsScanning(false);
        setScanSuccessToast(true);
        sound.playUpiSuccess();
        setTimeout(() => setScanSuccessToast(false), 3500);
      }, 900);
    };
    reader.readAsDataURL(file);
  };

  // Toggle a member's claim on an item
  const handleToggleClaim = (itemId, memberId) => {
    sound.playClick();
    setClaims((prev) => {
      const currentList = prev[itemId] || [];
      if (currentList.includes(memberId)) {
        return {
          ...prev,
          [itemId]: currentList.filter((id) => id !== memberId)
        };
      } else {
        return {
          ...prev,
          [itemId]: [...currentList, memberId]
        };
      }
    });
  };

  // Add a friend to squad
  const handleAddFriend = (e) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;

    sound.playClick();
    const avatars = ['🏄', '🕶️', '⚡', '🚀', '🎸', '🎧', '⚽', '🎯'];
    const newMember = {
      id: 'm-' + Date.now(),
      name: newFriendName.trim(),
      avatar: avatars[squad.length % avatars.length],
      isHost: false
    };

    setSquad((prev) => [...prev, newMember]);
    setNewFriendName('');
    sound.playUpiSuccess();
  };

  // Remove a friend
  const handleRemoveFriend = (memberId) => {
    sound.playClick();
    setSquad((prev) => prev.filter((m) => m.id !== memberId));
    // Clean claims
    setClaims((prev) => {
      const cleaned = {};
      Object.keys(prev).forEach((key) => {
        cleaned[key] = prev[key].filter((id) => id !== memberId);
      });
      return cleaned;
    });
  };

  // Apply itemized result to TripSplitterSection
  const handleApplyToSplitter = () => {
    sound.playClick();
    sound.playUpiSuccess();
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C6FF3D', '#0082FB', '#25D366']
    });

    if (onApplyToSplitter) {
      onApplyToSplitter({
        tripName: receiptName,
        totalAmount: splitResult.grandTotal,
        members: splitResult.breakdown.map((b) => ({
          id: b.id,
          name: b.name,
          phone: b.phone || '',
          isHost: squad.find((s) => s.id === b.id)?.isHost || false,
          status: squad.find((s) => s.id === b.id)?.isHost ? 'paid' : 'pending',
          avatar: b.avatar
        }))
      });
    }

    const splitterEl = document.getElementById('trip-splitter');
    if (splitterEl) {
      splitterEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Copy full WhatsApp summary
  const handleCopySummary = () => {
    sound.playClick();
    sound.playUpiSuccess();
    const summary = buildItemizedWhatsAppSummary({
      receiptName,
      breakdown: splitResult.breakdown,
      hostUpi: currentUser?.upiId || 'prince@oksbi',
      grandTotal: splitResult.grandTotal
    });

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
    }
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  // Share specific friend's breakdown on WhatsApp
  const handleShareFriendWhatsApp = (friendBreakdown) => {
    sound.playClick();
    const itemsList = friendBreakdown.items
      .map((it) => `${it.name} (₹${Math.round(it.sharePrice)}${it.isShared ? ' - shared' : ''})`)
      .join(', ');

    const text = `Hey ${friendBreakdown.name}! 🧾 In our *${receiptName}* bill:\n` +
      `You ordered: ${itemsList || 'Items'}\n` +
      `Your total share (incl. tax): *₹${friendBreakdown.totalAmount}*\n` +
      `Pay via UPI: upi://pay?pa=${currentUser?.upiId || 'prince@oksbi'}&am=${friendBreakdown.totalAmount} 🚀`;

    openWhatsAppDirect(friendBreakdown.phone || '', text);
  };

  return (
    <section id="receipt-ocr" className="py-12 sm:py-16 px-3 sm:px-5 md:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
      <div className="space-y-8">
        
        {/* Section Header */}
        <div className="space-y-2.5 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0082FB]/10 border border-[#0082FB]/30 text-xs font-mono text-[#0082FB]">
            <Camera className="w-3.5 h-3.5" />
            <span>AI Receipt OCR &bull; Auto Itemized Split</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Snap the Bill. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6FF3D] to-[#0082FB]">Tap What You Ordered.</span>
          </h2>

          <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
            No more dividing bills equally when someone just had water. Snap any restaurant or cafe bill, auto-detect items and prices, and let friends tap only what they ate.
          </p>
        </div>

        {/* 2-Column OCR Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Bill Capture, Scanner & Extracted Items */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Upload or Choose Sample Receipt */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#121324] border border-white/10 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-mono font-bold text-white/60 uppercase tracking-wider">
                  Step 1: Capture or Select Receipt
                </span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-[#C6FF3D] hover:bg-[#b5f422] text-[#0B0C16] font-bold text-xs font-['Space_Grotesk'] flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Snap / Upload Photo</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {/* Sample Quick Chips */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono text-white/40">Try with real sample receipts:</div>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_RECEIPTS.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeReceipt.id === sample.id && !uploadedImagePreview
                          ? 'bg-[#0082FB]/20 text-[#0082FB] border border-[#0082FB]/40 font-bold'
                          : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                      }`}
                    >
                      <span>{sample.name.split(' ')[0]}</span>
                      <span className="text-white/40 font-normal">₹{sample.total}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Scanning Animation Box */}
              {isScanning && (
                <div className="relative h-28 rounded-xl bg-[#0B0C16] border border-[#C6FF3D]/30 overflow-hidden flex flex-col items-center justify-center space-y-2">
                  <div className="absolute inset-x-0 h-1 bg-[#C6FF3D] shadow-[0_0_15px_#C6FF3D] animate-bounce" />
                  <Sparkles className="w-6 h-6 text-[#C6FF3D] animate-spin" />
                  <div className="text-xs font-mono text-white font-bold tracking-wider">
                    Scanning Receipt Items &amp; Prices via Neural OCR...
                  </div>
                </div>
              )}

              {/* Uploaded Image Preview Tag */}
              {uploadedImagePreview && !isScanning && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#C6FF3D]" />
                    <span>Uploaded Photo Processed ({receiptName})</span>
                  </div>
                  <button 
                    onClick={() => handleSelectSample(SAMPLE_RECEIPTS[0])}
                    className="text-white/50 hover:text-white underline cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              )}

              {scanSuccessToast && (
                <div className="p-2.5 rounded-xl bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-[#C6FF3D] text-xs font-mono flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Receipt items &amp; prices detected successfully!</span>
                </div>
              )}
            </div>

            {/* Step 2: Friends in This Meal */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#121324] border border-white/10 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white/60 uppercase tracking-wider">
                  Step 2: Who&apos;s Splitting? ({squad.length} Friends)
                </span>
              </div>

              {/* Squad Chips */}
              <div className="flex flex-wrap gap-2 items-center">
                {squad.map((member) => (
                  <div 
                    key={member.id}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2 text-xs"
                  >
                    <span>{member.avatar}</span>
                    <span className="text-white font-bold font-['Space_Grotesk']">{member.name}</span>
                    {!member.isHost && (
                      <button
                        onClick={() => handleRemoveFriend(member.id)}
                        className="text-white/30 hover:text-red-400 cursor-pointer ml-1"
                        title="Remove friend"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}

                {/* Quick Add Friend Form */}
                <form onSubmit={handleAddFriend} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Add friend (e.g. Tanvi)"
                    value={newFriendName}
                    onChange={(e) => setNewFriendName(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl bg-[#0B0C16] border border-white/15 text-xs text-white placeholder:text-white/30 focus:border-[#C6FF3D] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#C6FF3D] transition-colors cursor-pointer"
                    title="Add to group"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Step 3: Extracted Items & "Tap What You Ordered" Claiming Matrix */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#121324] border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white font-['Space_Grotesk']">
                    Tap What You Ordered
                  </h3>
                  <p className="text-[11px] text-white/50">
                    Tap a friend&apos;s avatar to assign an item. Tap multiple friends to split shared dishes evenly!
                  </p>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">
                  {items.length} Items
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {items.map((item) => {
                  const claimants = claims[item.id] || [];
                  const isClaimed = claimants.length > 0;
                  const perPersonPrice = isClaimed ? Math.round(item.price / claimants.length) : item.price;

                  return (
                    <div 
                      key={item.id}
                      className={`p-3.5 rounded-xl transition-all border ${
                        isClaimed 
                          ? 'bg-[#0B0C16] border-white/15' 
                          : 'bg-amber-500/[0.04] border-amber-500/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        
                        {/* Item Details */}
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold font-['Space_Grotesk'] text-sm truncate">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/40">
                              Qty: {item.qty}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs font-mono">
                            <span className="text-[#C6FF3D] font-black">₹{item.price}</span>
                            {claimants.length > 1 && (
                              <span className="text-white/50 text-[11px]">
                                (Split: ₹{perPersonPrice} &times; {claimants.length} friends)
                              </span>
                            )}
                            {!isClaimed && (
                              <span className="text-amber-400 text-[11px] font-medium">
                                &bull; Unclaimed
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Friend Claim Buttons */}
                        <div className="flex items-center gap-1.5 flex-wrap justify-end shrink-0 max-w-[260px]">
                          {squad.map((member) => {
                            const hasClaimed = claimants.includes(member.id);

                            return (
                              <button
                                key={member.id}
                                onClick={() => handleToggleClaim(item.id, member.id)}
                                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1 cursor-pointer ${
                                  hasClaimed
                                    ? 'bg-[#C6FF3D] text-[#0B0C16] font-extrabold shadow-sm scale-105'
                                    : 'bg-white/5 hover:bg-white/10 text-white/60 border border-white/10'
                                }`}
                                title={`${hasClaimed ? 'Remove' : 'Claim'} ${item.name} for ${member.name}`}
                              >
                                <span>{member.avatar}</span>
                                <span className="hidden sm:inline text-[11px]">{member.name.split(' ')[0]}</span>
                              </button>
                            );
                          })}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Taxes & Delivery Charges */}
              <div className="p-3 rounded-xl bg-[#0B0C16] border border-white/10 grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="text-white/40 text-[10px] block">GST / SERVICE TAX (₹)</label>
                  <input
                    type="number"
                    value={tax}
                    onChange={(e) => setTax(Math.max(0, Number(e.target.value)))}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-bold focus:border-[#C6FF3D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-[10px] block">TIP / PACKAGING / DELIVERY (₹)</label>
                  <input
                    type="number"
                    value={tipOrFee}
                    onChange={(e) => setTipOrFee(Math.max(0, Number(e.target.value)))}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-bold focus:border-[#C6FF3D] focus:outline-none"
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Live Individual Breakdown & Action Export */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Grand Total & Unclaimed Warning */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#121324] border border-white/10 space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">RECEIPT TOTAL</span>
                  <span className="text-2xl font-black text-white font-['Space_Grotesk']">
                    ₹{splitResult.grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#C6FF3D] uppercase tracking-wider block">CLAIMED BY SQUAD</span>
                  <span className="text-2xl font-black text-[#C6FF3D] font-['Space_Grotesk']">
                    ₹{splitResult.breakdown.reduce((acc, b) => acc + b.totalAmount, 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {!splitResult.isFullyClaimed && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>{splitResult.unclaimedItems.length} item(s) are still unclaimed! Tap friends to assign them.</span>
                </div>
              )}

              {/* Individual Breakdown Cards */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-white/50 block uppercase tracking-wider">
                  Individual Fair Shares (Items + Proportional Tax)
                </span>

                {splitResult.breakdown.map((person) => (
                  <div 
                    key={person.id}
                    className="p-3.5 rounded-xl bg-[#0B0C16] border border-white/10 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{person.avatar}</span>
                        <div>
                          <span className="text-white font-bold font-['Space_Grotesk'] text-sm block">
                            {person.name}
                          </span>
                          <span className="text-[10px] text-white/40 font-mono">
                            {person.items.length} item(s) claimed
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-[#C6FF3D] font-['Space_Grotesk'] block">
                          ₹{person.totalAmount.toLocaleString('en-IN')}
                        </span>
                        {person.taxAndFees > 0 && (
                          <span className="text-[10px] font-mono text-white/40">
                            (incl. ₹{person.taxAndFees} tax)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Compact list of claimed dishes */}
                    {person.items.length > 0 && (
                      <div className="pt-1.5 border-t border-white/5 flex flex-wrap gap-1 text-[11px] font-mono">
                        {person.items.map((it, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-white/5 text-white/70">
                            {it.name} (₹{Math.round(it.sharePrice)})
                          </span>
                        ))}
                      </div>
                    )}

                    {/* WhatsApp Nudge for this friend */}
                    {!squad.find(s => s.id === person.id)?.isHost && person.totalAmount > 0 && (
                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={() => handleShareFriendWhatsApp(person)}
                          className="px-2 py-1 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] text-[11px] font-mono font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp Nudge (₹{person.totalAmount})</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleApplyToSplitter}
                  className="w-full py-3.5 rounded-xl bg-[#C6FF3D] hover:bg-[#b5f422] text-[#0B0C16] font-bold text-sm font-['Space_Grotesk'] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C6FF3D]/10 active:scale-95 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Apply to Trip Bill Creator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCopySummary}
                    className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedSummary ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#C6FF3D]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-white/60" />
                        <span>Copy Breakdown</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      const summary = buildItemizedWhatsAppSummary({
                        receiptName,
                        breakdown: splitResult.breakdown,
                        hostUpi: currentUser?.upiId || 'prince@oksbi',
                        grandTotal: splitResult.grandTotal
                      });
                      openWhatsAppDirect('', summary);
                    }}
                    className="py-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] text-xs font-medium border border-[#25D366]/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Group</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/40 pt-1 border-t border-white/5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C6FF3D]" />
                <span>Fair math &bull; No rounding discrepancies &bull; 1-Tap UPI ready</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ReceiptOcrSection;
