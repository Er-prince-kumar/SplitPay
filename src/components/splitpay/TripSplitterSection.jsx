import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Users, 
  IndianRupee, 
  Send, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  Zap, 
  ShieldCheck, 
  Save,
  MessageCircle,
  QrCode,
  Smartphone,
  Phone,
  Edit2,
  X,
  ExternalLink,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { 
  cleanPhoneNumber, 
  formatDisplayPhone, 
  buildSplitWhatsAppMessage, 
  openWhatsAppDirect,
  getWhatsAppUrl 
} from '../../utils/whatsapp';

const TripSplitterSection = ({ currentUser, onOpenAuth }) => {
  // Main Trip Bill State
  const [tripName, setTripName] = useState('Manali Snow Trip — 2026');
  const [totalAmount, setTotalAmount] = useState(6000);
  const [hostName, setHostName] = useState(currentUser?.name || 'Prince Kumar');
  const [hostUpi, setHostUpi] = useState(currentUser?.upiId || 'prince@oksbi');
  
  // Dynamic Squad Members with WhatsApp Phone Numbers
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [editingPhoneMemberId, setEditingPhoneMemberId] = useState(null);
  const [tempPhone, setTempPhone] = useState('');

  const [members, setMembers] = useState([
    { id: 1, name: hostName, phone: '9876543210', isHost: true, status: 'paid', amount: 1500, avatar: '👑' },
    { id: 2, name: 'Rohit K.', phone: '9876512345', isHost: false, status: 'paid', amount: 1500, avatar: '👨‍💻' },
    { id: 3, name: 'Priya S.', phone: '9811223344', isHost: false, status: 'pending', amount: 1500, avatar: '👩‍🎨' },
    { id: 4, name: 'Aman M.', phone: '9899887766', isHost: false, status: 'pending', amount: 1500, avatar: '🎒' }
  ]);

  // WhatsApp Tool State
  const [activeTone, setActiveTone] = useState('standard');
  const [whatsAppModalMember, setWhatsAppModalMember] = useState(null);
  const [modalPhone, setModalPhone] = useState('');
  const [modalCustomMsg, setModalCustomMsg] = useState('');

  // Quick WhatsApp Dispatch to any number
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedTrips, setSavedTrips] = useState([]);

  // Auto-sync host name when user logs in
  useEffect(() => {
    if (currentUser?.name) {
      setHostName(currentUser.name);
      if (currentUser.upiId) setHostUpi(currentUser.upiId);
      setMembers(prev => prev.map(m => m.isHost ? { ...m, name: currentUser.name } : m));
    }
  }, [currentUser]);

  // Load saved trips from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('splitpay_saved_trips');
      if (stored) {
        setSavedTrips(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Recalculate equal shares whenever totalAmount or members count change
  const memberCount = Math.max(members.length, 1);
  const perPersonShare = Math.round(totalAmount / memberCount);

  // Update member individual share display
  const activeMembers = members.map(m => ({
    ...m,
    amount: perPersonShare
  }));

  const paidCount = activeMembers.filter(m => m.status === 'paid').length;
  const pendingMembers = activeMembers.filter(m => m.status === 'pending');
  const collectedTotal = paidCount * perPersonShare;
  const settledPercent = Math.min(100, Math.round((collectedTotal / Math.max(totalAmount, 1)) * 100));

  // Add a new member with optional phone number
  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    sound.playClick();
    const newId = Date.now();
    const avatars = ['⚡', '🚀', '🎸', '🌟', '🎯', '🔥', '🎧', '🍕', '🏄'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    setMembers(prev => [
      ...prev,
      {
        id: newId,
        name: newMemberName.trim(),
        phone: newMemberPhone.trim(),
        isHost: false,
        status: 'pending',
        amount: perPersonShare,
        avatar: randomAvatar
      }
    ]);
    setNewMemberName('');
    setNewMemberPhone('');
    sound.playUpiSuccess();
  };

  // Remove a member
  const handleRemoveMember = (id) => {
    sound.playClick();
    if (members.length <= 2) {
      alert("A group bill must have at least 2 members.");
      return;
    }
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  // Toggle or Pay member status (Simulate 1-Tap UPI payment)
  const handleSimulateMemberPay = (id) => {
    sound.playClick();
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === 'paid' ? 'pending' : 'paid';
        if (nextStatus === 'paid') {
          sound.playUpiSuccess();
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.65 },
            colors: ['#C6FF3D', '#0082FB', '#FFFFFF']
          });
        }
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  // Inline phone editing handlers
  const handleStartEditPhone = (member) => {
    sound.playClick();
    setEditingPhoneMemberId(member.id);
    setTempPhone(member.phone || '');
  };

  const handleSavePhone = (id) => {
    sound.playClick();
    setMembers(prev => prev.map(m => m.id === id ? { ...m, phone: tempPhone.trim() } : m));
    setEditingPhoneMemberId(null);
  };

  // Direct WhatsApp dispatch for an individual squad member
  const handleDirectWhatsAppSend = (member, tone = activeTone) => {
    sound.playClick();
    
    // If no phone number is provided yet, open the modal to add number
    if (!member.phone || cleanPhoneNumber(member.phone).length < 10) {
      setWhatsAppModalMember(member);
      setModalPhone(member.phone || '');
      setModalCustomMsg(buildSplitWhatsAppMessage({
        friendName: member.name,
        tripName,
        amount: member.amount,
        hostName,
        hostUpi,
        tone
      }));
      return;
    }

    const msg = buildSplitWhatsAppMessage({
      friendName: member.name,
      tripName,
      amount: member.amount,
      hostName,
      hostUpi,
      tone
    });

    openWhatsAppDirect(member.phone, msg);
    sound.playUpiSuccess();
    confetti({
      particleCount: 60,
      spread: 65,
      origin: { y: 0.65 },
      colors: ['#25D366', '#C6FF3D', '#FFFFFF']
    });
  };

  // Open WhatsApp Modal for customization or missing phone number
  const handleOpenWhatsAppModal = (member) => {
    sound.playClick();
    setWhatsAppModalMember(member);
    setModalPhone(member.phone || '');
    setModalCustomMsg(buildSplitWhatsAppMessage({
      friendName: member.name,
      tripName,
      amount: member.amount,
      hostName,
      hostUpi,
      tone: activeTone
    }));
  };

  // Submit modal and launch WhatsApp
  const handleModalSendWhatsApp = (e) => {
    e.preventDefault();
    if (!modalPhone.trim()) return;

    sound.playClick();
    const cleanNum = cleanPhoneNumber(modalPhone);
    
    // Persist phone to member if editing member
    if (whatsAppModalMember) {
      setMembers(prev => prev.map(m => m.id === whatsAppModalMember.id ? { ...m, phone: modalPhone.trim() } : m));
    }

    const finalMsg = modalCustomMsg.trim() || buildSplitWhatsAppMessage({
      friendName: whatsAppModalMember?.name || 'Friend',
      tripName,
      amount: whatsAppModalMember?.amount || perPersonShare,
      hostName,
      hostUpi,
      tone: activeTone
    });

    openWhatsAppDirect(cleanNum, finalMsg);
    sound.playUpiSuccess();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#25D366', '#C6FF3D', '#FFFFFF']
    });
    setWhatsAppModalMember(null);
  };

  // Quick Dispatch directly to any number
  const handleQuickDispatchAny = (e) => {
    e.preventDefault();
    if (!quickPhone.trim()) return;

    sound.playClick();
    const cleanNum = cleanPhoneNumber(quickPhone);
    const targetName = quickName.trim() || 'Friend';

    const msg = buildSplitWhatsAppMessage({
      friendName: targetName,
      tripName,
      amount: perPersonShare,
      hostName,
      hostUpi,
      tone: activeTone
    });

    openWhatsAppDirect(cleanNum, msg);
    sound.playUpiSuccess();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#25D366', '#C6FF3D', '#FFFFFF']
    });
    setQuickName('');
    setQuickPhone('');
  };

  // Copy WhatsApp payment message
  const handleCopyWhatsApp = () => {
    sound.playClick();
    sound.playUpiSuccess();
    setCopiedLink(true);

    const message = buildSplitWhatsAppMessage({
      friendName: 'Everyone',
      tripName,
      amount: perPersonShare,
      hostName,
      hostUpi,
      tone: activeTone
    });

    if (navigator.clipboard) {
      navigator.clipboard.writeText(message);
    }

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#25D366', '#C6FF3D', '#FFFFFF']
    });

    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Save Trip
  const handleSaveTrip = () => {
    sound.playClick();
    sound.playUpiSuccess();

    const tripRecord = {
      id: Date.now(),
      name: tripName,
      totalAmount,
      perPersonShare,
      memberCount: activeMembers.length,
      settledPercent,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      hostName,
      members: activeMembers
    };

    const updated = [tripRecord, ...savedTrips.filter(t => t.name !== tripName)];
    setSavedTrips(updated);
    localStorage.setItem('splitpay_saved_trips', JSON.stringify(updated));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Preview message for current active tone
  const currentPreviewMessage = buildSplitWhatsAppMessage({
    friendName: pendingMembers[0]?.name || 'Rohit',
    tripName,
    amount: perPersonShare,
    hostName,
    hostUpi,
    tone: activeTone
  });

  return (
    <section id="create-split" className="relative py-20 sm:py-28 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 bg-[#0D0E1C] overflow-hidden w-full">
      
      {/* Background Lighting */}
      <div className="absolute top-1/4 left-1/4 w-[550px] h-[550px] bg-[#C6FF3D]/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#0082FB]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-[#25D366]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="w-full relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-xs font-mono font-bold uppercase tracking-wider">
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            DIRECT WHATSAPP DISPATCH &amp; INSTANT SPLIT
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">
            Add Friend's Number &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25D366] via-[#C6FF3D] to-[#0082FB]">
              Send Bill Direct to WhatsApp.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
            Input each friend's phone number. In 1 tap, SplitPay formats the exact bill, individual share amount, and 1-tap UPI link, dispatching it straight into their WhatsApp chat.
          </p>

          {!currentUser && (
            <div className="inline-flex items-center gap-2 text-xs font-mono text-white/60 bg-white/5 px-4 py-2 rounded-xl border border-white/10 mt-2">
              <span>Want to sync trips to your college profile?</span>
              <button 
                onClick={onOpenAuth}
                className="text-[#C6FF3D] font-bold underline hover:text-[#b5f422] cursor-pointer"
              >
                Sign In / Create Account
              </button>
            </div>
          )}
        </div>

        {/* Creator Grid (Form on Left, 3D Live Card & WhatsApp Tool on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form & Member Phone Numbers */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#15162B]/90 border border-white/10 space-y-6 glass-card">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="text-white font-bold font-['Space_Grotesk'] text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-[#C6FF3D]" />
                Trip &amp; Squad Member Setup
              </div>
              <span className="text-xs font-mono text-[#25D366] flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" /> WHATSAPP SYNC
              </span>
            </div>

            {/* Trip / Event Name Input */}
            <div className="space-y-1.5 font-mono text-xs text-left">
              <label className="text-white/60">TRIP OR EVENT NAME *</label>
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="e.g. Manali Snow Trip, Goa Shack Dinner, Room 204 Biryani"
                className="w-full px-4 py-3 rounded-xl bg-[#0B0C16] border border-white/15 text-white text-sm focus:border-[#C6FF3D] focus:outline-none transition-colors font-['Space_Grotesk'] font-bold"
              />
            </div>

            {/* Total Bill Amount & Host UPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs text-left">
              <div className="space-y-1.5">
                <label className="text-white/60">TOTAL BILL AMOUNT (₹) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-bold">₹</span>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-[#0B0C16] border border-white/15 text-white text-sm focus:border-[#C6FF3D] focus:outline-none transition-colors font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-white/60">HOST UPI ID (YOU RECEIVE HERE) *</label>
                <input
                  type="text"
                  value={hostUpi}
                  onChange={(e) => setHostUpi(e.target.value)}
                  placeholder="e.g. prince@oksbi"
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0C16] border border-white/15 text-white text-sm focus:border-[#C6FF3D] focus:outline-none transition-colors font-['JetBrains_Mono']"
                />
              </div>
            </div>

            {/* Squad Members Manager with Phone Inputs */}
            <div className="space-y-3 pt-2 text-left font-mono text-xs">
              <div className="flex items-center justify-between text-white/60">
                <span>SQUAD MEMBERS ({activeMembers.length})</span>
                <span className="text-[#C6FF3D]">Auto-split: ₹{perPersonShare}/person</span>
              </div>

              {/* Members List with Direct WhatsApp Trigger & Phone Editing */}
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {activeMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="p-3.5 rounded-2xl bg-[#0B0C16] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <span className="text-2xl mt-0.5">{member.avatar}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-white font-bold font-['Space_Grotesk'] flex items-center gap-1.5">
                          <span className="truncate">{member.name}</span>
                          {member.isHost && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C6FF3D]/15 text-[#C6FF3D] font-mono shrink-0">
                              Host / You
                            </span>
                          )}
                        </div>

                        {/* Phone Number Badge or Inline Edit */}
                        <div className="mt-1">
                          {editingPhoneMemberId === member.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="tel"
                                value={tempPhone}
                                onChange={(e) => setTempPhone(e.target.value)}
                                placeholder="10-digit WhatsApp No."
                                className="bg-white/15 text-white text-xs px-2 py-0.5 rounded border border-[#25D366] font-mono focus:outline-none w-36"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleSavePhone(member.id)}
                              />
                              <button
                                type="button"
                                onClick={() => handleSavePhone(member.id)}
                                className="text-[#25D366] hover:bg-[#25D366]/20 p-1 rounded cursor-pointer"
                                title="Save phone"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingPhoneMemberId(null)}
                                className="text-white/40 hover:text-white p-1 rounded cursor-pointer"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 flex-wrap">
                              {member.phone ? (
                                <button
                                  type="button"
                                  onClick={() => handleStartEditPhone(member)}
                                  className="text-[11px] font-mono text-[#25D366] hover:underline flex items-center gap-1 bg-[#25D366]/10 px-2 py-0.5 rounded-md cursor-pointer group"
                                  title="Click to edit WhatsApp number"
                                >
                                  <Phone className="w-2.5 h-2.5" />
                                  <span>{formatDisplayPhone(member.phone)}</span>
                                  <Edit2 className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 ml-0.5" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleStartEditPhone(member)}
                                  className="text-[10px] font-mono text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-amber-400/10 hover:bg-amber-400/20 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                                  title="Add phone number for WhatsApp message"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                  <span>+ Add WhatsApp No.</span>
                                </button>
                              )}
                              <span className="text-[11px] text-white/40">
                                Owes: <strong className="text-white/80">₹{member.amount.toLocaleString('en-IN')}</strong>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions: Paid/Pending toggle & Direct WhatsApp button */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {/* Direct WhatsApp Button */}
                      <button
                        type="button"
                        onClick={() => handleDirectWhatsAppSend(member)}
                        className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold font-['Space_Grotesk'] transition-all cursor-pointer flex items-center gap-1.5 bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-[#0B0C16] border border-[#25D366]/40 active:scale-95 shadow-sm"
                        title={member.phone ? `Send ₹${member.amount} split link directly to ${member.name}'s WhatsApp` : `Add phone number & send to WhatsApp`}
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp</span>
                      </button>

                      {/* Paid / Pending Status Toggle */}
                      <button
                        type="button"
                        onClick={() => handleSimulateMemberPay(member.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          member.status === 'paid'
                            ? 'bg-[#C6FF3D]/20 text-[#C6FF3D] border border-[#C6FF3D]/30'
                            : 'bg-[#FF6B4A]/20 text-[#FF6B4A] border border-[#FF6B4A]/30 hover:bg-[#FF6B4A]/30'
                        }`}
                        title="Click to toggle Paid/Pending"
                      >
                        {member.status === 'paid' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Paid</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </>
                        )}
                      </button>

                      {!member.isHost && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                          title="Remove member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Member Input Form (Name + WhatsApp Number) */}
              <form onSubmit={handleAddMember} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 mt-2">
                <div className="text-[11px] font-bold text-white/70 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#C6FF3D]" />
                  Add New Friend to Split &amp; WhatsApp:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Friend's Name (e.g. Simran, Rohan)"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#0B0C16] border border-white/15 text-white text-xs focus:border-[#C6FF3D] focus:outline-none transition-colors"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp No. (e.g. 9876543210)"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#0B0C16] border border-white/15 text-white text-xs focus:border-[#25D366] focus:outline-none transition-colors font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-[#C6FF3D] hover:bg-[#b2f022] text-[#0B0C16] font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-['Space_Grotesk']"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Friend to Squad</span>
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: 3D Live Bill Summary & DIRECT WHATSAPP DISPATCH TOOL */}
          <div className="lg:col-span-6 space-y-6 text-left font-mono">
            
            {/* 1. Live Bill Summary Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1B1B3A] to-[#0D0D1E] border border-[#C6FF3D]/40 shadow-2xl space-y-6 relative overflow-hidden glass-card">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#C6FF3D]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
                <div>
                  <span className="text-[10px] text-[#C6FF3D] tracking-widest uppercase">
                    LIVE SHARED BILL • RAZORPAY UPI
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-['Space_Grotesk']">
                    {tripName || "Untitled Trip"}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0C2340] border border-[#0082FB]/40 text-[#0082FB] text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ACTIVE</span>
                </div>
              </div>

              {/* Split Metrics Card */}
              <div className="p-5 rounded-2xl bg-[#0B0C16]/90 border border-white/10 grid grid-cols-2 gap-4 relative z-10">
                <div>
                  <div className="text-xs text-white/50">TOTAL BILL</div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk']">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-white/40 mt-0.5">{activeMembers.length} Members</div>
                </div>

                <div>
                  <div className="text-xs text-[#C6FF3D]">EACH FRIEND OWES</div>
                  <div className="text-2xl sm:text-3xl font-black text-[#C6FF3D] font-['Space_Grotesk']">
                    ₹{perPersonShare.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-white/40 mt-0.5">Auto-divided equally</div>
                </div>
              </div>

              {/* Progress Meter */}
              <div className="space-y-2 relative z-10">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">SETTLEMENT PROGRESS</span>
                  <span className="text-[#C6FF3D] font-bold">{settledPercent}% COLLECTED</span>
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#C6FF3D] to-[#0082FB] transition-all duration-500 ease-out"
                    style={{ width: `${settledPercent}%` }}
                  />
                </div>
                <div className="text-[11px] text-white/40 flex justify-between">
                  <span>Collected: ₹{collectedTotal.toLocaleString('en-IN')}</span>
                  <span>Pending: ₹{(totalAmount - collectedTotal).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                <button
                  type="button"
                  onClick={handleCopyWhatsApp}
                  className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0B0C16] font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied to Clipboard! 🎉</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Group Bill Text</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSaveTrip}
                  className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] border border-white/15 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Save className="w-4 h-4 text-[#C6FF3D]" />
                  <span>{savedSuccess ? "Saved to My Trips! ✓" : "Save Trip Ledger"}</span>
                </button>
              </div>
            </div>

            {/* 2. DEDICATED TOOL: Direct WhatsApp Message Dispatcher */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#15162B]/95 border border-[#25D366]/40 shadow-xl space-y-5 relative overflow-hidden glass-card">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#25D366]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="text-white font-bold font-['Space_Grotesk'] text-base flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  Direct WhatsApp Dispatch Tool
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#25D366]/15 text-[#25D366] font-bold">
                  DIRECT wa.me API
                </span>
              </div>

              {/* Message Tone Selector */}
              <div className="space-y-2">
                <div className="text-[11px] text-white/60">SELECT MESSAGE TONE:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { id: 'standard', label: '💼 Standard' },
                    { id: 'friendly', label: '😄 Friendly' },
                    { id: 'urgent', label: '⏰ Urgent' },
                    { id: 'fun', label: '🍕 Fun Meme' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setActiveTone(t.id);
                      }}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center ${
                        activeTone === t.id
                          ? 'bg-[#25D366] text-[#0B0C16] shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 text-white/70'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pending Friends Quick 1-Tap WhatsApp List */}
              <div className="space-y-2 pt-1">
                <div className="text-[11px] text-white/60 flex items-center justify-between">
                  <span>DISPATCH TO PENDING FRIENDS ({pendingMembers.length}):</span>
                  <span className="text-amber-300">₹{perPersonShare} each</span>
                </div>

                {pendingMembers.length === 0 ? (
                  <div className="p-3 rounded-xl bg-[#C6FF3D]/10 border border-[#C6FF3D]/20 text-[#C6FF3D] text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>All friends have settled their share! Bill is 100% paid.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pendingMembers.map(m => (
                      <div 
                        key={m.id}
                        className="p-2.5 rounded-xl bg-[#0B0C16] border border-white/10 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base">{m.avatar}</span>
                          <div className="truncate">
                            <div className="font-bold text-white text-xs truncate">{m.name}</div>
                            <div className="text-[10px] text-white/40 font-mono">
                              {m.phone ? formatDisplayPhone(m.phone) : <span className="text-amber-400">No phone added</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenWhatsAppModal(m)}
                            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                            title="Customize message before sending"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDirectWhatsAppSend(m)}
                            className="py-1.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0B0C16] font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            <span>Send ₹{perPersonShare}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick WhatsApp to Any External Number */}
              <form onSubmit={handleQuickDispatchAny} className="pt-2 border-t border-white/10 space-y-2">
                <div className="text-[11px] text-white/60">
                  QUICK SEND TO ANY PHONE NUMBER:
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Friend's Name (e.g. Tanmay)"
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0B0C16] border border-white/15 text-white text-xs focus:border-[#25D366] focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp No. (10 digits)"
                    value={quickPhone}
                    onChange={(e) => setQuickPhone(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0B0C16] border border-white/15 text-white text-xs focus:border-[#25D366] focus:outline-none font-mono"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0B0C16] font-bold text-xs flex items-center justify-center gap-1 cursor-pointer shrink-0 active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </form>

              {/* Live WhatsApp Message Bubble Preview */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] text-white/40 uppercase tracking-wider flex items-center justify-between">
                  <span>LIVE WHATSAPP CHAT PREVIEW:</span>
                  <span className="text-[#25D366] font-bold">wa.me direct sync</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#0B141B] border border-[#25D366]/25 text-left relative shadow-inner">
                  <div className="text-[11px] text-white/90 whitespace-pre-line leading-relaxed font-['Inter']">
                    {currentPreviewMessage}
                  </div>
                  <div className="text-[9px] text-[#25D366]/80 text-right mt-1.5 flex items-center justify-end gap-1 font-mono">
                    <span>Just now</span>
                    <span>✓✓</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Saved Trips Ledger / History */}
        {savedTrips.length > 0 && (
          <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-[#15162B]/60 border border-white/10 text-left font-mono space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="text-white font-bold font-['Space_Grotesk'] text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C6FF3D]" />
                My Saved Campus Trips &amp; Bills ({savedTrips.length})
              </div>
              <span className="text-xs text-white/40">Saved in local session</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {savedTrips.map((trip) => (
                <div 
                  key={trip.id}
                  className="p-4 rounded-2xl bg-[#0B0C16] border border-white/10 space-y-2 hover:border-[#C6FF3D]/40 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-white font-['Space_Grotesk'] truncate">
                      {trip.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#C6FF3D]/10 text-[#C6FF3D] font-bold">
                      {trip.settledPercent}% Done
                    </span>
                  </div>

                  <div className="text-xs text-white/60 flex justify-between">
                    <span>Total: ₹{trip.totalAmount}</span>
                    <span>Share: ₹{trip.perPersonShare}</span>
                  </div>

                  <div className="text-[10px] text-white/40 pt-1 border-t border-white/5 flex justify-between">
                    <span>{trip.memberCount} Members</span>
                    <span>{trip.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* WHATSAPP CUSTOM DISPATCH MODAL */}
      {whatsAppModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#15162B] border border-[#25D366]/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative text-left font-mono">
            <button
              onClick={() => setWhatsAppModalMember(null)}
              className="absolute top-5 right-5 text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#25D366] font-bold uppercase tracking-wider">
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Send WhatsApp Split Bill</span>
              </div>
              <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Dispatch to {whatsAppModalMember.name}
              </h3>
              <p className="text-xs text-white/60">
                Split share: <strong className="text-[#C6FF3D]">₹{whatsAppModalMember.amount.toLocaleString('en-IN')}</strong> for {tripName}
              </p>
            </div>

            <form onSubmit={handleModalSendWhatsApp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-white/70 font-bold">
                  WHATSAPP PHONE NUMBER *
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-xs text-[#25D366] font-bold font-mono">
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    value={modalPhone}
                    onChange={(e) => setModalPhone(e.target.value)}
                    placeholder="Enter 10-digit WhatsApp number"
                    className="w-full pl-18 pr-4 py-3 rounded-xl bg-[#0B0C16] border border-white/15 text-white text-sm focus:border-[#25D366] focus:outline-none transition-colors font-mono"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Message preview and edit */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs text-white/70">
                  <span className="font-bold">MESSAGE TEXT:</span>
                  <div className="flex gap-1">
                    {['standard', 'friendly', 'urgent', 'fun'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setActiveTone(t);
                          setModalCustomMsg(buildSplitWhatsAppMessage({
                            friendName: whatsAppModalMember.name,
                            tripName,
                            amount: whatsAppModalMember.amount,
                            hostName,
                            hostUpi,
                            tone: t
                          }));
                        }}
                        className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${activeTone === t ? 'bg-[#25D366] text-[#0B0C16] font-bold' : 'bg-white/10 text-white/60'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={6}
                  value={modalCustomMsg}
                  onChange={(e) => setModalCustomMsg(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0B0C16] border border-white/15 text-white/90 text-xs focus:border-[#25D366] focus:outline-none font-['Inter'] leading-relaxed"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setWhatsAppModalMember(null)}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0B0C16] font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Launch WhatsApp 🚀</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

export default TripSplitterSection;
