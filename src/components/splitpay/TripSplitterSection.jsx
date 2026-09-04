import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Users, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  MessageCircle, 
  QrCode, 
  Smartphone, 
  Phone, 
  X, 
  ExternalLink,
  Zap,
  RotateCcw,
  BookmarkCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { 
  formatDisplayPhone, 
  buildSplitWhatsAppMessage, 
  openWhatsAppDirect 
} from '../../utils/whatsapp';

const TripSplitterSection = ({ currentUser, onOpenAuth, externalTripData }) => {
  // Helper to load initial saved trip from localStorage
  const getInitialTrip = () => {
    try {
      const saved = localStorage.getItem('splitpay_active_trip_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.tripName && parsed.tripName !== 'Goa Beach Shack & Cabs' && parsed.totalAmount !== 7400) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not parse saved trip from localStorage", e);
    }
    return null;
  };

  const initialData = getInitialTrip();

  const [tripName, setTripName] = useState(initialData?.tripName || '');
  const [totalAmount, setTotalAmount] = useState(
    initialData?.totalAmount !== undefined && initialData?.totalAmount !== 7400 ? initialData.totalAmount : ''
  );
  const [hostName, setHostName] = useState(
    currentUser?.name || (initialData?.hostName && initialData.hostName !== 'Prince Kumar' ? initialData.hostName : '')
  );
  const [hostUpi, setHostUpi] = useState(
    currentUser?.upiId || (initialData?.hostUpi && initialData.hostUpi !== 'prince@oksbi' ? initialData.hostUpi : '')
  );

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrTargetMember, setQrTargetMember] = useState(null);
  const [qrPaymentStatus, setQrPaymentStatus] = useState('waiting');
  const [paymentToast, setPaymentToast] = useState(null);
  const [savedSuccessToast, setSavedSuccessToast] = useState(false);

  const tripPresets = [
    { name: '🏖️ Goa Trip', amount: 7400, tripName: 'Goa Beach Shack & Cabs' },
    { name: '🏔️ Manali Snow', amount: 6000, tripName: 'Manali Snow Trip — 2026' },
    { name: '🍗 Midnight Biryani', amount: 1600, tripName: 'Hostel Midnight Biryani' },
    { name: '🛒 WiFi & Groceries', amount: 3200, tripName: 'Flatmates WiFi & Groceries' }
  ];

  const getInitialMembers = () => {
    if (initialData?.members && Array.isArray(initialData.members)) {
      const hasOldDummy = initialData.members.some(m => m.name === 'Rohit K.' || m.name === 'Priya S.');
      if (!hasOldDummy && initialData.members.length > 0) {
        return initialData.members;
      }
    }
    return [
      {
        id: 1,
        name: currentUser?.name || 'You (Host)',
        phone: currentUser?.phone || '',
        isHost: true,
        status: 'paid',
        avatar: currentUser?.avatar || '👑'
      }
    ];
  };

  const [members, setMembers] = useState(getInitialMembers);

  // Clean up any old dummy storage keys
  useEffect(() => {
    try {
      const old1 = localStorage.getItem('splitpay_active_trip_v2');
      if (old1 && old1.includes('Goa Beach Shack')) {
        localStorage.removeItem('splitpay_active_trip_v2');
      }
      const old2 = localStorage.getItem('splitpay_active_trip');
      if (old2 && old2.includes('Goa Beach Shack')) {
        localStorage.removeItem('splitpay_active_trip');
      }
    } catch (e) {}
  }, []);

  // Auto-persist active trip, members, and payment settlement status to localStorage on every change
  useEffect(() => {
    try {
      const payload = {
        tripName,
        totalAmount,
        hostName,
        hostUpi,
        members,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('splitpay_active_trip_v3', JSON.stringify(payload));
    } catch (e) {
      console.warn("Could not save trip to localStorage", e);
    }
  }, [tripName, totalAmount, hostName, hostUpi, members]);

  // Sync host name if user logs in
  useEffect(() => {
    if (currentUser?.name) {
      setHostName(currentUser.name);
      if (currentUser.upiId) setHostUpi(currentUser.upiId);
    }
  }, [currentUser]);

  // Sync external data applied from SplitPay AI or User Dashboard
  useEffect(() => {
    if (externalTripData) {
      if (externalTripData.tripName) setTripName(externalTripData.tripName);
      if (externalTripData.totalAmount) setTotalAmount(externalTripData.totalAmount);
      if (externalTripData.hostName) setHostName(externalTripData.hostName);
      if (externalTripData.hostUpi) setHostUpi(externalTripData.hostUpi);
      
      if (externalTripData.members && externalTripData.members.length > 0) {
        // If members already have full structure (id, name, status, etc.)
        if (typeof externalTripData.members[0] === 'object' && externalTripData.members[0].status) {
          setMembers(externalTripData.members);
        } else {
          const avatars = ['👑', '👨‍💻', '👩‍🎨', '🎒', '🕶️', '⚡', '🚀', '🏄'];
          const formatted = externalTripData.members.map((name, i) => ({
            id: Date.now() + i,
            name: typeof name === 'string' ? name : name.name,
            phone: (typeof name === 'object' && name.phone) ? name.phone : '9876543210',
            isHost: i === 0,
            status: i === 0 ? 'paid' : 'pending',
            avatar: avatars[i % avatars.length]
          }));
          setMembers(formatted);
        }
      }
    }
  }, [externalTripData]);

  const numAmount = Number(totalAmount) || 0;
  const perPersonShare = members.length > 0 && numAmount > 0 ? Math.round(numAmount / members.length) : 0;
  const paidCount = members.filter(m => m.status === 'paid').length;
  const progressPercent = members.length > 0 ? Math.round((paidCount / members.length) * 100) : 0;

  const handleApplyPreset = (p) => {
    sound.playClick();
    setTripName(p.tripName);
    setTotalAmount(p.amount);
    sound.playUpiSuccess();
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    sound.playClick();
    const avatars = ['🎒', '🕶️', '⚡', '🚀', '🏄', '🎧', '🎸', '⚽'];
    const newMember = {
      id: Date.now(),
      name: newMemberName.trim(),
      phone: newMemberPhone.trim() || '',
      isHost: false,
      status: 'pending',
      avatar: avatars[members.length % avatars.length]
    };

    setMembers(prev => [...prev, newMember]);
    setNewMemberName('');
    setNewMemberPhone('');
    sound.playUpiSuccess();
  };

  const handleRemoveMember = (id) => {
    sound.playClick();
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleOpenQrForMember = (member) => {
    sound.playClick();
    setQrTargetMember(member);
    setQrPaymentStatus('waiting');
    setShowQrModal(true);
  };

  const handleOpenGeneralQr = () => {
    sound.playClick();
    const target = members.find(m => m.status === 'pending') || members[1] || members[0];
    setQrTargetMember(target);
    setQrPaymentStatus('waiting');
    setShowQrModal(true);
  };

  // Only called when the payment is explicitly verified and confirmed
  const handleConfirmPayment = (memberToPay) => {
    if (!memberToPay) return;

    sound.playUpiSuccess();
    confetti({
      particleCount: 55,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#C6FF3D', '#0082FB', '#25D366']
    });

    setMembers(prev => prev.map(m => m.id === memberToPay.id ? { ...m, status: 'paid' } : m));
    setQrPaymentStatus('received');

    const refId = 'UPI' + Math.floor(100000 + Math.random() * 900000);
    setPaymentToast({
      name: memberToPay.name,
      amount: perPersonShare,
      ref: refId
    });

    // Record real payment to splitpay_payment_activity for UserDashboard live log
    try {
      const storedAct = localStorage.getItem('splitpay_payment_activity');
      const actList = storedAct ? JSON.parse(storedAct) : [];
      actList.unshift({
        id: 'act-' + Date.now(),
        payerName: memberToPay.name,
        amount: perPersonShare,
        tripName: tripName,
        ref: refId,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Verified'
      });
      localStorage.setItem('splitpay_payment_activity', JSON.stringify(actList.slice(0, 10)));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}

    setTimeout(() => {
      setPaymentToast(null);
    }, 4500);

    setTimeout(() => {
      setShowQrModal(false);
    }, 1800);
  };

  const handleResetMemberStatus = (memberId) => {
    sound.playClick();
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: 'pending' } : m));
  };

  const handleResetAllToPending = () => {
    sound.playClick();
    setMembers(prev => prev.map(m => ({ ...m, status: 'pending' })));
    sound.playUpiSuccess();
  };

  const handleSendWhatsApp = (member) => {
    sound.playClick();
    const message = buildSplitWhatsAppMessage({
      friendName: member.name,
      tripName,
      amount: perPersonShare,
      hostName,
      hostUpi,
      tone: 'standard'
    });
    openWhatsAppDirect(member.phone || '9876543210', message);
  };

  const handleCopySummary = () => {
    sound.playClick();
    sound.playUpiSuccess();
    setCopiedLink(true);

    const pendingNames = members.filter(m => m.status === 'pending').map(m => m.name).join(', ');
    const text = `*${tripName || 'Group Split'}*\nTotal: ₹${numAmount > 0 ? numAmount.toLocaleString('en-IN') : '00'}\nPer Person: ₹${perPersonShare > 0 ? perPersonShare.toLocaleString('en-IN') : '00'}\nPay via UPI: ${hostUpi || 'Pending'}\nPending from: ${pendingNames || 'None (All Settled!)'}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleResetBill = () => {
    sound.playClick();
    if (window.confirm("Clear all bill details and start fresh?")) {
      setTripName('');
      setTotalAmount('');
      setHostUpi(currentUser?.upiId || '');
      setMembers([
        {
          id: 1,
          name: currentUser?.name || 'You (Host)',
          phone: currentUser?.phone || '',
          isHost: true,
          status: 'paid',
          avatar: currentUser?.avatar || '👑'
        }
      ]);
      localStorage.removeItem('splitpay_active_trip_v3');
      localStorage.removeItem('splitpay_active_trip_v2');
      localStorage.removeItem('splitpay_active_trip');
      sound.playUpiSuccess();
    }
  };

  const handleSaveToDashboard = () => {
    sound.playClick();
    sound.playUpiSuccess();
    const storageKey = `splitpay_trips_${currentUser?.email || 'guest'}`;
    try {
      const stored = localStorage.getItem(storageKey);
      let list = stored ? JSON.parse(stored) : [];
      const existingIdx = list.findIndex(t => t.tripName.toLowerCase() === tripName.toLowerCase());
      const tripObj = {
        id: existingIdx >= 0 ? list[existingIdx].id : 'trip-' + Date.now(),
        tripName,
        totalAmount,
        hostName,
        hostUpi,
        category: 'Custom Split',
        createdAt: new Date().toISOString().split('T')[0],
        members
      };
      if (existingIdx >= 0) {
        list[existingIdx] = tripObj;
      } else {
        list.unshift(tripObj);
      }
      localStorage.setItem(storageKey, JSON.stringify(list));
      window.dispatchEvent(new Event('storage'));
      setSavedSuccessToast(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => setSavedSuccessToast(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section id="trip-splitter" className="py-16 sm:py-20 px-3 sm:px-5 md:px-6 lg:px-8 bg-[#0D0E1C] border-t border-white/5 w-full scroll-mt-20">
      <div id="create-split" className="w-full max-w-[1600px] mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70">
            <Users className="w-3.5 h-3.5 text-[#C6FF3D]" />
            <span>Bill Splitter & WhatsApp Dispatcher</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="text-[#C6FF3D] flex items-center gap-1 font-bold">
              <Check className="w-3 h-3" />
              Auto-Saved
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
            Create a Group Bill
          </h2>

          <p className="text-sm sm:text-base text-white/60">
            Set amount, add friends, and dispatch 1-tap UPI payment links directly to WhatsApp.
          </p>

          {!currentUser && (
            <div className="pt-1">
              <button 
                onClick={onOpenAuth}
                className="text-xs font-mono text-white/50 hover:text-[#C6FF3D] transition-colors cursor-pointer"
              >
                Already have an account? <span className="underline font-bold text-white/80">Log in</span> to save bills.
              </button>
            </div>
          )}
        </div>

        {/* 2-Column Splitter Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form & Squad Members */}
          <div className="lg:col-span-7 p-6 sm:p-7 rounded-2xl bg-[#121324] border border-white/10 space-y-6">
            
            {/* Presets Chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-white/50 block">QUICK TEMPLATES (OPTIONAL):</label>
                <button
                  type="button"
                  onClick={handleResetBill}
                  className="text-[11px] font-mono text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                  title="Clear all fields to blank"
                >
                  Clear Form (00)
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tripPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#C6FF3D]/15 text-white/80 hover:text-[#C6FF3D] border border-white/10 hover:border-[#C6FF3D]/30 text-xs font-mono transition-colors cursor-pointer"
                  >
                    {preset.name} (₹{preset.amount.toLocaleString('en-IN')})
                  </button>
                ))}
              </div>
            </div>

            {/* Trip Name & Amount Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-mono text-white/50 block">TRIP OR EVENT NAME</label>
                <input
                  type="text"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="Enter trip name (e.g. Goa Trip, Hostel Biryani)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white text-sm focus:border-[#C6FF3D] focus:outline-none transition-colors font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-white/50 block">TOTAL (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                  placeholder="00"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white text-sm focus:border-[#C6FF3D] focus:outline-none transition-colors font-bold font-mono"
                />
              </div>
            </div>

            {/* Host UPI Setting */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-mono text-white/50 block">YOUR UPI ID (RECEIVES PAYMENTS)</label>
              <input
                type="text"
                value={hostUpi}
                onChange={(e) => setHostUpi(e.target.value)}
                placeholder="Enter your UPI ID (e.g. name@okhdfcbank)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white text-sm focus:border-[#C6FF3D] focus:outline-none transition-colors font-mono"
              />
            </div>

            {/* Squad Members Header */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-white/50">MEMBERS ({members.length})</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/10">
                    Individual UPI Settlement
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#C6FF3D] font-bold">
                    ₹{perPersonShare > 0 ? perPersonShare.toLocaleString('en-IN') : '00'} / person
                  </span>
                  
                  {members.some(m => m.status === 'paid') && (
                    <button
                      type="button"
                      onClick={handleResetAllToPending}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-mono text-white/50 hover:text-amber-400 hover:bg-amber-400/10 border border-white/10 hover:border-amber-400/30 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                      title="Reset all member payments to Pending"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Reset All</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-2">
                {members.map((member) => (
                  <div 
                    key={member.id}
                    className="p-3 rounded-xl bg-[#0B0C16] border border-white/10 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg shrink-0">{member.avatar}</span>
                      <div className="min-w-0">
                        <div className="text-white font-bold font-['Space_Grotesk'] flex items-center gap-1.5 truncate">
                          <span>{member.name}</span>
                          {member.isHost && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-white/60 font-mono">
                              Host
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-white/40 font-mono flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" />
                          <span>{member.phone ? formatDisplayPhone(member.phone) : 'No Phone'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Member Actions */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      {member.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleOpenQrForMember(member)}
                          className="px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-mono font-bold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                          title={`Open UPI payment & QR for ${member.name}`}
                        >
                          <QrCode className="w-3.5 h-3.5 text-[#C6FF3D]" />
                          <span>Pay</span>
                        </button>
                      )}

                      {!member.isHost && (
                        <button
                          type="button"
                          onClick={() => handleSendWhatsApp(member)}
                          className="px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 transition-colors cursor-pointer flex items-center gap-1"
                          title={`Send WhatsApp payment request to ${member.name}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </button>
                      )}

                      {member.status === 'paid' ? (
                        <div className="flex items-center gap-1">
                          <span
                            className="px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-mono font-bold flex items-center gap-1 bg-[#C6FF3D]/15 text-[#C6FF3D] border border-[#C6FF3D]/30 select-none cursor-default shadow-sm"
                            title={member.isHost ? "Trip Organizer (Paid total bill upfront)" : "Payment verified"}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{member.isHost ? "Paid (Host)" : "Paid"}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => handleResetMemberStatus(member.id)}
                            className="px-1.5 py-0.5 rounded-lg text-[10px] font-mono text-white/40 hover:text-amber-400 hover:bg-white/5 border border-transparent hover:border-amber-400/25 transition-all cursor-pointer flex items-center gap-0.5 active:scale-95"
                            title={`Reset ${member.name}'s status back to Pending`}
                          >
                            <RotateCcw className="w-3 h-3 text-amber-400/70" />
                            <span className="hidden sm:inline">Reset</span>
                          </button>
                        </div>
                      ) : (
                        <span
                          className="px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-mono font-bold flex items-center gap-1 bg-amber-400/15 text-amber-400 border border-amber-400/30 select-none cursor-default"
                          title={`Payment pending for ${member.name}`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>Pending</span>
                        </span>
                      )}

                      {!member.isHost && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1 text-white/30 hover:text-red-400 transition-colors cursor-pointer"
                          title="Remove member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {members.length <= 1 && (
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center space-y-1">
                    <p className="text-xs text-white/60 font-medium">No friends added yet</p>
                    <p className="text-[11px] text-white/40 font-mono">Use the form below to add friends to this split</p>
                  </div>
                )}
              </div>

              {/* Add Member Form */}
              <form onSubmit={handleAddMember} className="p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/15 space-y-2 mt-2">
                <div className="text-[11px] font-mono text-white/60">Add a friend to this bill:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Friend's Name (e.g. Aman)"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-[#0B0C16] border border-white/15 text-white text-xs focus:border-[#C6FF3D] focus:outline-none"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp No. (Optional)"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-[#0B0C16] border border-white/15 text-white text-xs focus:border-[#25D366] focus:outline-none font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C6FF3D]" />
                  <span>Add Friend</span>
                </button>
              </form>

            </div>

          </div>

          {/* Right Column: Live Bill Summary & Fast Actions */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Summary Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#121324] border border-white/10 space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                  Bill Summary
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">
                  {members.length} Friends
                </span>
              </div>

              {/* Total and Per Head */}
              <div className="p-4 rounded-xl bg-[#0B0C16] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white/50">TOTAL EXPENSE</span>
                  <span className="text-xl font-black text-white font-['Space_Grotesk']">
                    ₹{numAmount > 0 ? numAmount.toLocaleString('en-IN') : '00'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-xs font-mono text-[#C6FF3D]">EACH PERSON OWES</span>
                  <span className="text-xl font-black text-[#C6FF3D] font-['Space_Grotesk']">
                    ₹{perPersonShare > 0 ? perPersonShare.toLocaleString('en-IN') : '00'}
                  </span>
                </div>
              </div>

              {/* Settlement Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-white/60">
                  <span>Settlement Progress</span>
                  <span className="text-white font-bold">{paidCount} of {members.length} Paid ({progressPercent}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0082FB] to-[#C6FF3D] transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Primary Actions */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const firstPending = members.find(m => m.status === 'pending');
                    handleSendWhatsApp(firstPending || members[1] || members[0]);
                  }}
                  className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0B0C16] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-['Space_Grotesk'] shadow-md shadow-[#25D366]/10"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Send WhatsApp Link</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleOpenGeneralQr}
                    className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#C6FF3D]" />
                    <span>View QR Code</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#C6FF3D]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-white/70" />
                        <span>Copy Summary</span>
                      </>
                    )}
                  </button>
                </div>

                {currentUser && (
                  <button
                    type="button"
                    onClick={handleSaveToDashboard}
                    className="w-full py-2.5 rounded-xl bg-[#C6FF3D]/10 hover:bg-[#C6FF3D]/20 border border-[#C6FF3D]/30 hover:border-[#C6FF3D] text-[#C6FF3D] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>{savedSuccessToast ? "✓ Saved to My Trips!" : "Save to My Trips Dashboard"}</span>
                  </button>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Smart UPI QR Code & Payment Confirmation Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-[#121324] border border-white/15 shadow-2xl space-y-4 text-center relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                sound.playClick();
                setShowQrModal(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-[#C6FF3D] font-mono text-[11px]">
                <QrCode className="w-3 h-3" />
                <span>UPI DIRECT PAYMENT</span>
              </div>
              <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Pay Bill Share
              </h3>
              <p className="text-xs text-white/60">
                Paying for <strong className="text-white font-bold">{qrTargetMember?.name || 'Friend'}</strong> • ₹{perPersonShare > 0 ? perPersonShare.toLocaleString('en-IN') : '00'}
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-3.5 rounded-2xl bg-white w-48 h-48 mx-auto flex items-center justify-center shadow-lg relative group">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=${hostUpi}&pn=${encodeURIComponent(hostName)}&am=${perPersonShare}&cu=INR&tn=${encodeURIComponent(tripName)}`)}`}
                alt="UPI QR Code"
                className="w-full h-full object-contain"
              />
              {qrPaymentStatus === 'received' && (
                <div className="absolute inset-0 bg-[#0B0C16]/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center space-y-2 animate-in fade-in duration-200 text-[#C6FF3D]">
                  <CheckCircle2 className="w-14 h-14 text-[#C6FF3D] animate-bounce" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">PAYMENT CONFIRMED</span>
                </div>
              )}
            </div>

            {/* UPI ID Row */}
            <div className="p-2.5 rounded-xl bg-[#0B0C16] border border-white/10 text-xs font-mono text-white/70 flex items-center justify-between">
              <span className="truncate">UPI ID: <strong className="text-white font-bold">{hostUpi}</strong></span>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  if (navigator.clipboard) navigator.clipboard.writeText(hostUpi);
                }}
                className="text-[11px] text-[#C6FF3D] hover:underline shrink-0 ml-2 cursor-pointer font-bold"
              >
                Copy
              </button>
            </div>

            {/* Mobile 1-Tap UPI Deep Link */}
            <a
              href={`upi://pay?pa=${hostUpi}&pn=${encodeURIComponent(hostName)}&am=${perPersonShare}&cu=INR&tn=${encodeURIComponent(tripName)}`}
              onClick={() => sound.playClick()}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Open in UPI App (GPay / PhonePe / Paytm)</span>
            </a>

            {/* Payment Action: Explicit Confirmation */}
            {qrPaymentStatus === 'waiting' ? (
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleConfirmPayment(qrTargetMember)}
                  className="w-full py-3 rounded-xl bg-[#C6FF3D] hover:bg-[#b5f422] text-[#0B0C16] font-bold text-xs sm:text-sm font-['Space_Grotesk'] transition-all active:scale-95 cursor-pointer shadow-lg shadow-[#C6FF3D]/15 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm ₹{perPersonShare.toLocaleString('en-IN')} Received</span>
                </button>
                <p className="text-[10px] text-white/40 font-mono">
                  Status changes to Paid only after payment is confirmed.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-center space-y-1 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-center gap-1.5 text-[#25D366] font-bold text-sm font-['Space_Grotesk']">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Payment Successfully Recorded!</span>
                </div>
                <div className="text-[11px] text-white/80 font-mono">
                  ₹{perPersonShare.toLocaleString('en-IN')} from {qrTargetMember?.name} verified • Updated in bill
                </div>
              </div>
            )}

            <button
              onClick={() => {
                sound.playClick();
                setShowQrModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            >
              {qrPaymentStatus === 'received' ? 'Done & Return to Bill' : 'Close (Keep Pending)'}
            </button>
          </div>
        </div>
      )}

      {/* Floating Real-Time UPI Soundbox Payment Notification Toast */}
      {paymentToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 z-50 p-4 rounded-2xl bg-[#121324]/95 backdrop-blur-md border border-[#C6FF3D]/40 shadow-2xl shadow-[#C6FF3D]/15 flex items-center gap-3.5 animate-in slide-in-from-bottom-6 duration-300 max-w-[90vw] sm:max-w-md">
          <div className="w-10 h-10 rounded-xl bg-[#C6FF3D]/20 border border-[#C6FF3D]/50 flex items-center justify-center text-[#C6FF3D] shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="text-xs font-bold text-[#C6FF3D] uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span>UPI Payment Received</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] animate-ping" />
            </div>
            <div className="text-sm font-black text-white font-['Space_Grotesk'] truncate">
              ₹{paymentToast.amount.toLocaleString('en-IN')} from {paymentToast.name}
            </div>
            <div className="text-[10px] text-white/50 font-mono truncate">
              Auto-settled in bill • Ref: #{paymentToast.ref}
            </div>
          </div>
          <button
            onClick={() => setPaymentToast(null)}
            className="p-1 rounded-lg text-white/40 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </section>
  );
};

export default TripSplitterSection;
