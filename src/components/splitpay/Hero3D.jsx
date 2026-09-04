import React, { useState, useRef } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Users, 
  Send, 
  ChevronRight, 
  Play, 
  ExternalLink,
  QrCode,
  Smartphone,
  Pencil,
  Plus,
  Trash2,
  Check,
  X,
  MapPin,
  UserPlus,
  MessageCircle,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { 
  cleanPhoneNumber, 
  formatDisplayPhone, 
  buildSplitWhatsAppMessage, 
  openWhatsAppDirect 
} from '../../utils/whatsapp';

const Hero3D = ({ onOpenWaitlist, onOpenDemo }) => {
  // 3D Tilt Card State
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  // Popular State & Destination Presets
  const statePresets = [
    { state: 'Goa', title: 'Goa Trip — Room 204', icon: '🏖️' },
    { state: 'Himachal', title: 'Manali Snow Trip — Room 301', icon: '🏔️' },
    { state: 'Uttarakhand', title: 'Rishikesh Rafting — Camp 4', icon: '🌊' },
    { state: 'Rajasthan', title: 'Jaipur Heritage — Room 108', icon: '🏰' },
    { state: 'Kerala', title: 'Munnar & Alleppey — Villa 2', icon: '🌴' },
    { state: 'Ladakh', title: 'Leh Ladakh Ride — Squad A', icon: '🏍️' }
  ];

  // Bill Interactive State (Editable Trip & State Name)
  const [tripName, setTripName] = useState('Goa Trip — Room 204');
  const [isEditingTripName, setIsEditingTripName] = useState(false);
  const [tempTripName, setTempTripName] = useState('Goa Trip — Room 204');

  // Squad Members State with WhatsApp Numbers
  const [members, setMembers] = useState([
    { id: 1, name: 'Rohit K.', phone: '9876543210', role: 'Cabs & Fuel', status: 'paid', avatar: '👨‍💻', time: '10:14 AM via PhonePe' },
    { id: 2, name: 'Priya S.', phone: '9811223344', role: 'Shack Dinner', status: 'paid', avatar: '👩‍🎨', time: '11:02 AM via GPay' },
    { id: 3, name: 'Aman M.', phone: '9899887766', role: 'Hostel Stay', status: 'pending', avatar: '🎒', time: 'Link sent to WhatsApp' },
    { id: 4, name: 'You (Organizer)', phone: '9999900000', role: 'Trip Host', status: 'paid', avatar: '👑', time: 'Host account' },
  ]);

  const [isEditingSquad, setIsEditingSquad] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [tempMemberName, setTempMemberName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');

  const [simulatingPayment, setSimulatingPayment] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  // Dynamic calculations based on squad size
  const totalAmount = 7400;
  const perPersonShare = members.length > 0 ? Math.round(totalAmount / members.length) : 0;
  const paidCount = members.filter(m => m.status === 'paid').length;
  const collectedAmount = paidCount * perPersonShare;
  const progressPercent = totalAmount > 0 ? Math.min(100, (collectedAmount / totalAmount) * 100) : 0;

  const handleAddMember = (e) => {
    e?.preventDefault();
    if (!newMemberName.trim()) return;
    sound.playClick();
    const emojis = ['🎒', '🕶️', '⚡', '🚀', '🏄', '🎧', '🎸', '⚽'];
    const newMember = {
      id: Date.now(),
      name: newMemberName.trim(),
      phone: newMemberPhone.trim() || '9876543210',
      role: 'Trip Share',
      status: 'pending',
      avatar: emojis[members.length % emojis.length],
      time: 'WhatsApp split ready'
    };
    setMembers(prev => [...prev, newMember]);
    setNewMemberName('');
    setNewMemberPhone('');
    sound.playUpiSuccess();
  };

  const handleSendWhatsApp = (member) => {
    sound.playClick();
    const msg = buildSplitWhatsAppMessage({
      friendName: member.name,
      tripName,
      amount: perPersonShare,
      hostName: 'Prince Kumar',
      hostUpi: 'prince@oksbi',
      tone: 'standard'
    });
    openWhatsAppDirect(member.phone || '9876543210', msg);
    sound.playUpiSuccess();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#25D366', '#C6FF3D', '#FFFFFF']
    });
  };

  const handleStartEditMember = (member) => {
    sound.playClick();
    setEditingMemberId(member.id);
    setTempMemberName(member.name);
  };

  const handleSaveMemberName = (id) => {
    if (tempMemberName.trim()) {
      setMembers(prev => prev.map(m => m.id === id ? { ...m, name: tempMemberName.trim() } : m));
    }
    setEditingMemberId(null);
    sound.playClick();
  };

  const handleDeleteMember = (id) => {
    if (members.length <= 1) return;
    sound.playClick();
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleToggleStatus = (id) => {
    sound.playClick();
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === 'paid' ? 'pending' : 'paid';
        if (nextStatus === 'paid') sound.playUpiSuccess();
        return {
          ...m,
          status: nextStatus,
          time: nextStatus === 'paid' ? 'Just now via 1-Tap UPI' : 'Link sent to WhatsApp'
        };
      }
      return m;
    }));
  };

  // Mouse move for 3D card tilt
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt angle (-15 to +15 deg)
    const rotX = -((y - centerY) / centerY) * 12;
    const rotY = ((x - centerX) / centerX) * 12;
    
    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.6
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos({ x: 50, y: 50, opacity: 0 });
  };

  // Simulate 1-Tap Razorpay Payment
  const triggerSimulatePayment = () => {
    sound.playClick();
    setShowRazorpayModal(true);
  };

  const completeSimulation = () => {
    setSimulatingPayment(true);
    sound.playClick();

    setTimeout(() => {
      sound.playUpiSuccess();
      
      // Fire celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C6FF3D', '#0082FB', '#FF6B4A', '#FFFFFF']
      });

      setMembers(prev => {
        const firstPending = prev.find(m => m.status === 'pending');
        if (!firstPending) return prev;
        return prev.map(m => m.id === firstPending.id ? {
          ...m,
          status: 'paid',
          time: 'Just now via Razorpay UPI (1-Tap)'
        } : m);
      });

      setSimulatingPayment(false);
      setShowRazorpayModal(false);
    }, 900);
  };

  const resetSimulation = () => {
    sound.playClick();
    setMembers(prev => prev.map((m, idx) => idx >= 2 ? {
      ...m,
      status: 'pending',
      time: 'Link sent to WhatsApp'
    } : m));
  };

  return (
    <section className="relative min-h-screen pt-32 sm:pt-36 pb-20 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 flex items-center justify-center overflow-hidden w-full">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-[#1B1B3A]/60 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#C6FF3D]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#FF6B4A]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center relative z-10">
        
        {/* Left Column: Copy, Value Proposition, and CTAs */}
        <div className="lg:col-span-6 space-y-8 text-left w-full">
          
          {/* Badge: Target Audience */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1B1B3A]/80 border border-[#C6FF3D]/30 backdrop-blur-md text-xs font-mono tracking-wide text-white shadow-lg shadow-[#C6FF3D]/5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6FF3D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6FF3D]"></span>
            </span>
            <span className="text-[#C6FF3D] font-bold">COLLEGE EXPENSES REINVENTED</span>
            <span className="text-white/30">•</span>
            <span className="text-white/80">Hostels • Trips • Fests</span>
          </div>

          {/* Main Headline from Brief */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-white font-['Space_Grotesk'] leading-[1.08]">
              Split the bill. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6FF3D] via-[#a6ff00] to-[#0082FB]">
                Not the friendship.
              </span>
            </h1>

            {/* Subheading from Brief */}
            <p className="text-lg sm:text-xl text-white/75 font-normal leading-relaxed">
              SplitPay turns any group expense — trip, dinner, fest ticket — into one shared bill your friends can pay in one tap, powered by Razorpay.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                if (onOpenWaitlist) onOpenWaitlist();
              }}
              className="px-8 py-4 rounded-2xl bg-[#C6FF3D] text-[#0B0C16] font-bold text-base hover:bg-[#b5f422] active:scale-95 transition-all shadow-xl shadow-[#C6FF3D]/25 hover:shadow-[#C6FF3D]/40 flex items-center justify-center gap-3 font-['Space_Grotesk'] group cursor-pointer"
            >
              <span>Join waitlist</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#how-it-works"
              onClick={() => sound.playClick()}
              className="px-7 py-4 rounded-2xl bg-[#1B1B3A]/60 hover:bg-[#1B1B3A] text-white border border-white/15 hover:border-white/30 font-semibold text-base transition-all flex items-center justify-center gap-2.5 backdrop-blur-md cursor-pointer"
            >
              <Play className="w-4 h-4 text-[#C6FF3D] fill-[#C6FF3D]" />
              <span>See how it works</span>
            </a>
          </div>

          {/* Small note under CTAs with Hinglish flavor */}
          <div className="pt-2 flex items-center gap-3 text-xs sm:text-sm text-white/60 font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B4A]" />
            <p>
              Built for hostels, trip groups, and fest squads.{' '}
              <span className="text-[#C6FF3D] font-medium italic">
                No more "bhai paisa bhej diya kya".
              </span>
            </p>
          </div>

          {/* Trust badges strip */}
          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/10 text-xs text-white/50 font-mono">
            <div>
              <div className="text-white text-base font-bold font-['Space_Grotesk']">1-Tap UPI</div>
              <div>GPay, PhonePe, Paytm</div>
            </div>
            <div>
              <div className="text-white text-base font-bold font-['Space_Grotesk']">Zero Install</div>
              <div>Friends pay via Web link</div>
            </div>
            <div>
              <div className="text-white text-base font-bold font-['Space_Grotesk']">Instant Settle</div>
              <div>Direct to your bank</div>
            </div>
          </div>

        </div>

        {/* Right Column: 3D Gyroscopic Mock Bill Card (Specified in Brief) */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end w-full perspective-1000">
          
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transition: 'transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}
            className="w-full rounded-3xl p-5 sm:p-7 md:p-8 transform-style-3d relative cursor-default select-none glass-card glass-card-glow"
          >
            {/* Dynamic Glass Specular Highlight */}
            <div 
              className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.18) 0%, transparent 60%)`,
                opacity: glarePos.opacity
              }}
            />

            {/* Floating 3D Badge: Razorpay Verified */}
            <div 
              style={{ transform: 'translateZ(35px)' }}
              className="flex items-center justify-between pb-6 border-b border-white/10"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0082FB]/20 border border-[#0082FB]/40 flex items-center justify-center text-[#0082FB]">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="text-xs font-mono text-white/50 tracking-wider">LIVE SHARED BILL</div>
                  {isEditingTripName ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (tempTripName.trim()) setTripName(tempTripName.trim());
                        setIsEditingTripName(false);
                        sound.playUpiSuccess();
                      }}
                      className="flex items-center gap-1.5 mt-1"
                    >
                      <input
                        type="text"
                        value={tempTripName}
                        onChange={(e) => setTempTripName(e.target.value)}
                        autoFocus
                        className="bg-white/15 text-white font-bold px-2 py-0.5 rounded border border-[#0082FB]/60 text-xs focus:outline-none focus:ring-1 focus:ring-[#0082FB] w-44"
                        placeholder="e.g. Manali Snow Trip"
                      />
                      <button
                        type="submit"
                        className="px-2 py-0.5 rounded bg-[#0082FB] text-white text-[11px] font-bold hover:bg-[#0070da] cursor-pointer"
                      >
                        Save
                      </button>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setTempTripName(tripName);
                        setIsEditingTripName(true);
                      }}
                      className="group/title flex items-center gap-2 text-lg font-bold text-white font-['Space_Grotesk'] hover:text-[#0082FB] transition-colors text-left cursor-pointer"
                      title="Click to edit trip destination"
                    >
                      <span>{tripName}</span>
                      <Pencil className="w-3.5 h-3.5 text-white/40 group-hover/title:text-[#0082FB] transition-colors" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0C2340] border border-[#0082FB]/40 text-[#0082FB] text-[11px] font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>RAZORPAY LINK</span>
              </div>
            </div>

            {/* Quick State / Destination Selector Chips */}
            <div style={{ transform: 'translateZ(25px)' }} className="flex flex-wrap items-center gap-1.5 py-2.5 border-b border-white/10 text-xs font-mono">
              <span className="text-white/40 text-[10px] flex items-center gap-1 shrink-0">
                <MapPin className="w-3 h-3 text-[#0082FB]" /> State / Trip:
              </span>
              {statePresets.map((preset) => (
                <button
                  key={preset.state}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setTripName(preset.title);
                    setTempTripName(preset.title);
                    setIsEditingTripName(false);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] transition-all cursor-pointer ${
                    tripName.toLowerCase().includes(preset.state.toLowerCase())
                      ? 'bg-[#0082FB]/20 text-[#0082FB] border border-[#0082FB]/40 font-bold shadow-sm'
                      : 'bg-white/5 text-white/50 hover:text-white border border-transparent'
                  }`}
                >
                  {preset.icon} {preset.state}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setTempTripName(tripName);
                  setIsEditingTripName(true);
                }}
                className="px-2 py-0.5 rounded-lg text-[10px] bg-white/5 text-white/50 hover:text-[#0082FB] transition-all cursor-pointer flex items-center gap-0.5"
              >
                <Pencil className="w-2.5 h-2.5" /> Custom
              </button>
            </div>

            {/* Bill Summary & Amount Owed */}
            <div 
              style={{ transform: 'translateZ(25px)' }}
              className="py-5 flex items-end justify-between border-b border-white/10"
            >
              <div>
                <div className="text-xs font-mono text-white/60 mb-1">EACH PERSON OWES</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white font-['Space_Grotesk']">
                    ₹{perPersonShare.toLocaleString()}
                  </span>
                  <span className="text-xs font-mono text-[#C6FF3D]">/ {members.length} members</span>
                </div>
                <div className="text-[11px] font-mono text-white/40 mt-1">Total Bill: ₹{totalAmount.toLocaleString()}.00 (Auto-split)</div>
              </div>

              {/* Real-time Settlement Meter */}
              <div className="text-right">
                <div className="text-xs font-mono text-white/60 mb-1">SETTLED</div>
                <div className="text-xl font-bold font-['Space_Grotesk'] text-[#C6FF3D]">
                  {progressPercent.toFixed(0)}%
                </div>
                <div className="text-[11px] font-mono text-white/40 mt-1">
                  ₹{collectedAmount.toLocaleString()} of ₹{totalAmount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Live Progress Bar */}
            <div style={{ transform: 'translateZ(20px)' }} className="w-full bg-white/10 h-2 rounded-full overflow-hidden my-4">
              <div 
                className="h-full bg-gradient-to-r from-[#C6FF3D] to-[#0082FB] transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Squad Members & Payment Statuses */}
            <div style={{ transform: 'translateZ(30px)' }} className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs font-mono text-white/50 px-1">
                <span>SQUAD MEMBERS ({members.length})</span>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsEditingSquad(!isEditingSquad);
                  }}
                  className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isEditingSquad
                      ? 'bg-[#C6FF3D] text-[#0B0C16] shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-white/80'
                  }`}
                >
                  {isEditingSquad ? (
                    <>
                      <Check className="w-3 h-3" /> Done Editing
                    </>
                  ) : (
                    <>
                      <Pencil className="w-2.5 h-2.5" /> Edit Squad
                    </>
                  )}
                </button>
              </div>

              {/* Add Member Bar (visible when editing squad) */}
              {isEditingSquad && (
                <form
                  onSubmit={handleAddMember}
                  className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-xl bg-white/5 border border-dashed border-[#0082FB]/50"
                >
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Friend's name (e.g. Tanmay S.)..."
                    className="flex-1 bg-transparent text-white text-xs px-2 py-1 focus:outline-none placeholder:text-white/30 font-mono w-full"
                  />
                  <input
                    type="tel"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    placeholder="WhatsApp (e.g. 98765...)"
                    className="bg-transparent text-[#25D366] text-xs px-2 py-1 focus:outline-none placeholder:text-white/30 font-mono w-full sm:w-36 border-t sm:border-t-0 sm:border-l border-white/10"
                  />
                  <button
                    type="submit"
                    disabled={!newMemberName.trim()}
                    className="px-3 py-1 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-[#0B0C16] text-[11px] font-bold font-mono flex items-center gap-1 disabled:opacity-40 cursor-pointer shrink-0 w-full sm:w-auto justify-center"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </form>
              )}

              {members.map((member) => (
                <div 
                  key={member.id}
                  className={`p-3 rounded-2xl flex items-center justify-between border transition-all ${
                    member.status === 'paid'
                      ? 'bg-white/5 border-white/10'
                      : 'bg-[#FF6B4A]/10 border-[#FF6B4A]/30 shadow-lg shadow-[#FF6B4A]/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">
                      {member.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      {editingMemberId === member.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={tempMemberName}
                            onChange={(e) => setTempMemberName(e.target.value)}
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveMemberName(member.id)}
                            className="bg-white/20 text-white text-xs font-bold px-1.5 py-0.5 rounded border border-[#0082FB] w-full max-w-[130px] focus:outline-none font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveMemberName(member.id)}
                            className="text-[#C6FF3D] hover:bg-[#C6FF3D]/20 p-1 rounded cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingMemberId(null)}
                            className="text-white/40 hover:text-white p-1 rounded cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEditMember(member)}
                            className="font-semibold text-sm text-white hover:text-[#0082FB] transition-colors truncate text-left cursor-pointer flex items-center gap-1"
                            title="Click to rename friend"
                          >
                            <span className="truncate">{member.name}</span>
                            <Pencil className="w-2.5 h-2.5 text-white/30 hover:text-[#0082FB] shrink-0" />
                          </button>
                          {member.id === 4 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/70 shrink-0">
                              Host
                            </span>
                          )}
                        </div>
                      )}
                      <div className="text-xs font-mono text-white/40 truncate flex items-center gap-1.5">
                        <span>{member.time}</span>
                        {member.phone && (
                          <span className="text-[#25D366] text-[10px] hidden sm:inline">• {formatDisplayPhone(member.phone)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isEditingSquad ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(member.id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                            member.status === 'paid'
                              ? 'bg-[#C6FF3D]/20 text-[#C6FF3D] border border-[#C6FF3D]/30'
                              : 'bg-[#FF6B4A]/20 text-[#FF6B4A] border border-[#FF6B4A]/30'
                          }`}
                        >
                          {member.status === 'paid' ? 'Mark Pending' : 'Mark Paid'}
                        </button>
                        {members.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteMember(member.id)}
                            className="p-1 rounded-lg text-white/40 hover:text-[#FF6B4A] hover:bg-[#FF6B4A]/10 transition-colors cursor-pointer"
                            title="Remove member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        {member.status === 'paid' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/30 text-xs font-mono font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C6FF3D]" />
                            Paid ₹{perPersonShare.toLocaleString()}
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FF6B4A]/20 text-[#FF6B4A] border border-[#FF6B4A]/40 text-xs font-mono font-bold animate-pulse">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>

                            {/* Direct WhatsApp Trigger */}
                            <button
                              type="button"
                              onClick={() => handleSendWhatsApp(member)}
                              className="p-1.5 rounded-full bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-[#0B0C16] border border-[#25D366]/40 transition-all cursor-pointer shadow-sm active:scale-90 flex items-center justify-center"
                              title={`Send WhatsApp split bill directly to ${member.name} (${member.phone || 'Enter number'})`}
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            </button>

                            {/* Interactive 1-Tap Trigger */}
                            <button
                              onClick={triggerSimulatePayment}
                              className="px-3 py-1 rounded-full bg-[#C6FF3D] hover:bg-[#b2f022] text-[#0B0C16] text-xs font-bold font-['Space_Grotesk'] active:scale-95 transition-all shadow-md shadow-[#C6FF3D]/20 cursor-pointer flex items-center gap-1"
                            >
                              <Zap className="w-3 h-3 fill-current" />
                              Pay 1-Tap
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer inside card */}
            <div 
              style={{ transform: 'translateZ(15px)' }} 
              className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50"
            >
              <div className="flex items-center gap-1.5 text-[#C6FF3D]">
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp auto-sync active</span>
              </div>

              {members.some(m => m.id === 3 && m.status === 'paid') && (
                <button
                  onClick={resetSimulation}
                  className="text-xs text-white/60 hover:text-white underline cursor-pointer"
                >
                  Reset demo
                </button>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Simulated Razorpay 1-Tap Checkout Sheet Modal */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#0C2340] border border-[#0082FB]/50 rounded-3xl max-w-sm w-full p-6 text-white shadow-2xl shadow-[#0082FB]/30 relative animate-in fade-in zoom-in duration-200">
            
            {/* Razorpay Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/15">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#0082FB] flex items-center justify-center font-bold text-xs">
                  R
                </div>
                <span className="font-bold font-['Space_Grotesk'] text-sm tracking-wide">Razorpay Standard</span>
              </div>
              <button 
                onClick={() => setShowRazorpayModal(false)}
                className="text-white/60 hover:text-white text-xs font-mono p-1"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Transaction Overview */}
            <div className="py-5 text-center space-y-2">
              <div className="text-xs font-mono text-white/60 uppercase">
                SplitPay for {members.find(m => m.status === 'pending')?.name || 'Friend'}
              </div>
              <div className="text-3xl font-black font-['Space_Grotesk'] text-white">
                ₹{perPersonShare.toLocaleString()}.00
              </div>
              <div className="text-xs font-mono text-[#C6FF3D]">
                {tripName} • Direct host transfer
              </div>
            </div>

            {/* 1-Tap UPI Providers */}
            <div className="space-y-2.5 py-3">
              <div className="text-[11px] font-mono text-white/50 uppercase">PAY VIA FAST UPI APP</div>
              
              <button
                onClick={completeSimulation}
                disabled={simulatingPayment}
                className="w-full p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-between transition-all group active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#4285F4] text-white flex items-center justify-center font-black text-xs">
                    G
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white group-hover:text-[#C6FF3D] transition-colors">
                      Google Pay UPI
                    </div>
                    <div className="text-[11px] font-mono text-white/50">Instant 1-Tap Approval</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/60 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={completeSimulation}
                disabled={simulatingPayment}
                className="w-full p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-between transition-all group active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#5f259f] text-white flex items-center justify-center font-black text-xs">
                    P
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white group-hover:text-[#C6FF3D] transition-colors">
                      PhonePe UPI
                    </div>
                    <div className="text-[11px] font-mono text-white/50">Instant 1-Tap Approval</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/60 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={completeSimulation}
                disabled={simulatingPayment}
                className="w-full p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-between transition-all group active:scale-98 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#002e6e] text-white flex items-center justify-center font-black text-xs">
                    Paytm
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white group-hover:text-[#C6FF3D] transition-colors">
                      Paytm / CRED UPI
                    </div>
                    <div className="text-[11px] font-mono text-white/50">Any UPI Handle</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/60 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Confirm 1-Tap Primary Button */}
            <div className="pt-3">
              <button
                onClick={completeSimulation}
                disabled={simulatingPayment}
                className="w-full py-4 rounded-2xl bg-[#C6FF3D] text-[#0B0C16] font-extrabold text-sm hover:bg-[#b2f022] active:scale-95 transition-all shadow-lg shadow-[#C6FF3D]/30 flex items-center justify-center gap-2 cursor-pointer font-['Space_Grotesk']"
              >
                {simulatingPayment ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-[#0B0C16] border-t-transparent animate-spin" />
                    <span>Authorizing UPI Token...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay ₹1,850 in 1 Tap</span>
                  </>
                )}
              </button>
              <div className="text-center text-[10px] font-mono text-white/40 mt-3 flex items-center justify-center gap-1">
                <span>🔒 256-Bit Bank Grade Encryption • NPCI / UPI Rail</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

export default Hero3D;
