import React, { useState, useEffect } from 'react';
import { 
  Users, 
  IndianRupee, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  FolderKanban, 
  QrCode,
  Zap,
  Calendar,
  X,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

const UserDashboard = ({ currentUser, onSelectTrip, onOpenAIChat, onOpenProfile }) => {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'active' | 'settled'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // New Trip Form State
  const [newTripTitle, setNewTripTitle] = useState('');
  const [newTripAmount, setNewTripAmount] = useState('');
  const [newTripFriends, setNewTripFriends] = useState('');

  // Storage key specific to current user
  const storageKey = `splitpay_trips_${currentUser?.email || 'guest'}`;

  // Default seed trips for new/existing logged in user
  const defaultUserTrips = [
    {
      id: 'trip-1',
      tripName: 'Goa Beach Shack & Cabs',
      totalAmount: 7400,
      hostName: currentUser?.name || 'Prince Kumar',
      hostUpi: currentUser?.upiId || 'prince@oksbi',
      category: 'Vacation',
      createdAt: '2026-09-02',
      members: [
        { id: 1, name: currentUser?.name || 'Prince Kumar', phone: '9876543210', isHost: true, status: 'paid', avatar: '👑' },
        { id: 2, name: 'Rohit K.', phone: '9876512345', isHost: false, status: 'pending', avatar: '👨‍💻' },
        { id: 3, name: 'Priya S.', phone: '9811223344', isHost: false, status: 'pending', avatar: '👩‍🎨' },
        { id: 4, name: 'Aman M.', phone: '9899887766', isHost: false, status: 'pending', avatar: '🎒' }
      ]
    },
    {
      id: 'trip-2',
      tripName: 'Manali Snow Trek & Cabs 2026',
      totalAmount: 16500,
      hostName: currentUser?.name || 'Prince Kumar',
      hostUpi: currentUser?.upiId || 'prince@oksbi',
      category: 'Adventure',
      createdAt: '2026-08-28',
      members: [
        { id: 1, name: currentUser?.name || 'Prince Kumar', phone: '9876543210', isHost: true, status: 'paid', avatar: '👑' },
        { id: 2, name: 'Vicky R.', phone: '9822334455', isHost: false, status: 'paid', avatar: '🏂' },
        { id: 3, name: 'Neha T.', phone: '9833445566', isHost: false, status: 'paid', avatar: '⛷️' },
        { id: 4, name: 'Sahil P.', phone: '9844556677', isHost: false, status: 'pending', avatar: '🏕️' },
        { id: 5, name: 'Pooja M.', phone: '9855667788', isHost: false, status: 'pending', avatar: '🎒' }
      ]
    },
    {
      id: 'trip-3',
      tripName: 'Hostel Midnight Biryani Party',
      totalAmount: 1600,
      hostName: currentUser?.name || 'Prince Kumar',
      hostUpi: currentUser?.upiId || 'prince@oksbi',
      category: 'Food',
      createdAt: '2026-08-20',
      members: [
        { id: 1, name: currentUser?.name || 'Prince Kumar', phone: '9876543210', isHost: true, status: 'paid', avatar: '👑' },
        { id: 2, name: 'Ankit D.', phone: '9812345678', isHost: false, status: 'paid', avatar: '🍗' },
        { id: 3, name: 'Rahul S.', phone: '9823456789', isHost: false, status: 'paid', avatar: '🥤' },
        { id: 4, name: 'Tanmay V.', phone: '9834567890', isHost: false, status: 'paid', avatar: '🍟' }
      ]
    },
    {
      id: 'trip-4',
      tripName: 'Flatmates WiFi & Monthly Groceries',
      totalAmount: 3600,
      hostName: currentUser?.name || 'Prince Kumar',
      hostUpi: currentUser?.upiId || 'prince@oksbi',
      category: 'Utilities',
      createdAt: '2026-08-15',
      members: [
        { id: 1, name: currentUser?.name || 'Prince Kumar', phone: '9876543210', isHost: true, status: 'paid', avatar: '👑' },
        { id: 2, name: 'Sameer B.', phone: '9866778899', isHost: false, status: 'pending', avatar: '🛒' },
        { id: 3, name: 'Kunal G.', phone: '9877889900', isHost: false, status: 'pending', avatar: '📶' }
      ]
    }
  ];

  const [trips, setTrips] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Could not load user trips from localStorage", e);
    }
    return defaultUserTrips;
  });

  // Save trips to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(trips));
    } catch (e) {
      console.warn("Could not save user trips to localStorage", e);
    }
  }, [trips, storageKey]);

  // Aggregate Metrics
  const totalVolume = trips.reduce((acc, t) => acc + (t.totalAmount || 0), 0);
  
  // Calculate total pending amount to collect across all trips
  const totalToCollect = trips.reduce((acc, t) => {
    const share = t.members.length > 0 ? Math.round(t.totalAmount / t.members.length) : 0;
    const pendingCount = t.members.filter(m => !m.isHost && m.status === 'pending').length;
    return acc + (share * pendingCount);
  }, 0);

  const totalMembersCount = trips.reduce((acc, t) => acc + t.members.length, 0);
  const totalPaidMembers = trips.reduce((acc, t) => acc + t.members.filter(m => m.status === 'paid').length, 0);
  const overallSettlementRate = totalMembersCount > 0 ? Math.round((totalPaidMembers / totalMembersCount) * 100) : 0;

  // Calculate profile completion percentage
  let completionScore = 0;
  if (currentUser?.name) completionScore += 20;
  if (currentUser?.email) completionScore += 20;
  if (currentUser?.phone) completionScore += 20;
  if (currentUser?.upiId) completionScore += 20;
  if (currentUser?.college) completionScore += 10;
  if (currentUser?.roomNo) completionScore += 10;

  const handleCopyUpi = () => {
    sound.playClick();
    if (navigator.clipboard && currentUser?.upiId) {
      navigator.clipboard.writeText(currentUser.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleOpenTripInSplitter = (trip) => {
    sound.playClick();
    sound.playUpiSuccess();
    if (onSelectTrip) {
      onSelectTrip(trip);
    }
    const el = document.getElementById('trip-splitter');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteTrip = (tripId, e) => {
    e.stopPropagation();
    sound.playClick();
    if (window.confirm("Are you sure you want to remove this trip from your dashboard?")) {
      setTrips(prev => prev.filter(t => t.id !== tripId));
    }
  };

  const handleCreateTrip = (e) => {
    e.preventDefault();
    if (!newTripTitle.trim() || !newTripAmount) return;

    sound.playClick();
    sound.playUpiSuccess();

    // Parse friend names
    const rawNames = newTripFriends
      .split(',')
      .map(n => n.trim())
      .filter(Boolean);

    const avatars = ['👨‍💻', '👩‍🎨', '🎒', '🕶️', '⚡', '🚀', '🏄', '🎧'];
    
    // Host is always first member
    const membersList = [
      {
        id: Date.now(),
        name: currentUser?.name || 'Prince Kumar',
        phone: '9876543210',
        isHost: true,
        status: 'paid',
        avatar: '👑'
      },
      ...rawNames.map((name, i) => ({
        id: Date.now() + i + 1,
        name,
        phone: '98' + Math.floor(10000000 + Math.random() * 90000000),
        isHost: false,
        status: 'pending',
        avatar: avatars[i % avatars.length]
      }))
    ];

    // If no friends provided, add 2 sample friends
    if (membersList.length === 1) {
      membersList.push(
        { id: Date.now() + 1, name: 'Aman M.', phone: '9876512345', isHost: false, status: 'pending', avatar: '🎒' },
        { id: Date.now() + 2, name: 'Priya S.', phone: '9811223344', isHost: false, status: 'pending', avatar: '👩‍🎨' }
      );
    }

    const newTrip = {
      id: 'trip-' + Date.now(),
      tripName: newTripTitle.trim(),
      totalAmount: Number(newTripAmount),
      hostName: currentUser?.name || 'Prince Kumar',
      hostUpi: currentUser?.upiId || 'prince@oksbi',
      category: 'Custom Split',
      createdAt: new Date().toISOString().split('T')[0],
      members: membersList
    };

    setTrips(prev => [newTrip, ...prev]);
    setIsCreateModalOpen(false);
    setNewTripTitle('');
    setNewTripAmount('');
    setNewTripFriends('');

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C6FF3D', '#0082FB', '#25D366']
    });

    // Auto load in splitter
    handleOpenTripInSplitter(newTrip);
  };

  const filteredTrips = trips.filter(trip => {
    const isFullySettled = trip.members.every(m => m.status === 'paid');
    if (activeFilter === 'active') return !isFullySettled;
    if (activeFilter === 'settled') return isFullySettled;
    return true;
  });

  return (
    <section id="user-dashboard" className="py-12 sm:py-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-[#0B0C18] border-b border-white/10 w-full relative">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C6FF3D]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#0082FB]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto space-y-8 sm:space-y-10 relative z-10">
        
        {/* Top Profile & Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#14152A] via-[#101124] to-[#14152A] border border-white/15 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#C6FF3D]/20 to-[#0082FB]/20 border border-[#C6FF3D]/40 flex items-center justify-center text-2xl sm:text-3xl shadow-inner shrink-0">
              {currentUser?.avatar || '👑'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-['Space_Grotesk'] truncate">
                  Welcome, {currentUser?.name || 'Explorer'}! 👋
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/30 text-[11px] font-mono font-bold shrink-0">
                  Verified Host
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-white/60 font-mono mt-1 flex-wrap">
                <span>{currentUser?.college || 'Lovely Professional University (LPU)'}</span>
                <span>•</span>
                <button
                  onClick={handleCopyUpi}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  title="Click to copy UPI ID"
                >
                  <span>UPI: <strong className="text-white font-bold">{currentUser?.upiId || 'prince@oksbi'}</strong></span>
                  {copiedUpi ? (
                    <Check className="w-3 h-3 text-[#C6FF3D]" />
                  ) : (
                    <Copy className="w-3 h-3 text-white/40" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => {
                sound.playClick();
                if (onOpenProfile) onOpenProfile();
              }}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs sm:text-sm border border-white/15 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4 text-[#C6FF3D]" />
              <span>Profile ({completionScore}%)</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#C6FF3D] hover:bg-[#b5f422] text-[#0B0C16] font-bold text-xs sm:text-sm font-['Space_Grotesk'] transition-all flex items-center gap-2 shadow-lg shadow-[#C6FF3D]/15 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Trip Split</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                if (onOpenAIChat) onOpenAIChat();
              }}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs sm:text-sm border border-white/15 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C6FF3D]" />
              <span>AI Auto-Fill</span>
            </button>
          </div>

        </div>

        {/* Profile Completion Alert Banner (if incomplete) */}
        {completionScore < 100 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#14152A] to-amber-500/10 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5 text-amber-300">
              <span className="text-base">⚡</span>
              <div>
                <strong>Profile is {completionScore}% complete:</strong> Add your Phone Number & Room details to enable automatic WhatsApp split reminders!
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                if (onOpenProfile) onOpenProfile();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#0B0C16] font-bold text-xs shrink-0 self-start sm:self-auto cursor-pointer transition-colors shadow-sm"
            >
              Complete Details →
            </button>
          </div>
        )}

        {/* Financial KPI Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Stat 1: Total Volume */}
          <div className="p-5 rounded-2xl bg-[#121326] border border-white/10 space-y-2 hover:border-[#C6FF3D]/30 transition-all">
            <div className="flex items-center justify-between text-white/50 text-xs font-mono">
              <span>TOTAL SPENT & SPLIT</span>
              <FolderKanban className="w-4 h-4 text-[#C6FF3D]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk']">
              ₹{totalVolume.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-white/40 font-mono">
              Across {trips.length} registered campus trips
            </div>
          </div>

          {/* Stat 2: To Collect From Friends */}
          <div className="p-5 rounded-2xl bg-[#121326] border border-white/10 space-y-2 hover:border-amber-400/30 transition-all">
            <div className="flex items-center justify-between text-white/50 text-xs font-mono">
              <span>TO COLLECT (FROM FRIENDS)</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-['Space_Grotesk']">
              ₹{totalToCollect.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-white/40 font-mono">
              Pending settlements awaiting payment
            </div>
          </div>

          {/* Stat 3: Settlement Rate */}
          <div className="p-5 rounded-2xl bg-[#121326] border border-white/10 space-y-2 hover:border-[#25D366]/30 transition-all">
            <div className="flex items-center justify-between text-white/50 text-xs font-mono">
              <span>OVERALL SETTLED RATE</span>
              <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#25D366] font-['Space_Grotesk']">
              {overallSettlementRate}%
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#25D366] h-full rounded-full transition-all duration-500" 
                style={{ width: `${overallSettlementRate}%` }} 
              />
            </div>
          </div>

          {/* Stat 4: Active Trips Count */}
          <div className="p-5 rounded-2xl bg-[#121326] border border-white/10 space-y-2 hover:border-[#0082FB]/30 transition-all">
            <div className="flex items-center justify-between text-white/50 text-xs font-mono">
              <span>ACTIVE EXPENSE HUBS</span>
              <Users className="w-4 h-4 text-[#0082FB]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk']">
              {trips.length} Trips
            </div>
            <div className="text-[11px] text-white/40 font-mono">
              {trips.filter(t => t.members.every(m => m.status === 'paid')).length} fully settled
            </div>
          </div>

        </div>

        {/* Trips Management Section */}
        <div className="space-y-4">
          
          {/* Section Filter Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                <span>My Saved Trips & Expense Splits</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#C6FF3D] border border-white/10">
                  {trips.length}
                </span>
              </h2>
              <p className="text-xs text-white/50">
                Click any trip card to immediately load and edit it in the live UPI Bill Splitter.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#14152A] border border-white/10 text-xs font-mono self-start sm:self-auto">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveFilter('all');
                }}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeFilter === 'all' ? 'bg-[#C6FF3D] text-[#0B0C16] font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                All ({trips.length})
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveFilter('active');
                }}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeFilter === 'active' ? 'bg-[#C6FF3D] text-[#0B0C16] font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveFilter('settled');
                }}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeFilter === 'settled' ? 'bg-[#C6FF3D] text-[#0B0C16] font-bold' : 'text-white/60 hover:text-white'
                }`}
              >
                Settled
              </button>
            </div>
          </div>

          {/* Trips Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTrips.map((trip) => {
              const perPerson = trip.members.length > 0 ? Math.round(trip.totalAmount / trip.members.length) : 0;
              const paidMembers = trip.members.filter(m => m.status === 'paid').length;
              const isSettled = paidMembers === trip.members.length;
              const progress = Math.round((paidMembers / trip.members.length) * 100);

              return (
                <div
                  key={trip.id}
                  onClick={() => handleOpenTripInSplitter(trip)}
                  className="p-5 rounded-2xl bg-[#121326] hover:bg-[#16172E] border border-white/10 hover:border-[#C6FF3D]/40 transition-all cursor-pointer space-y-4 group relative flex flex-col justify-between shadow-md"
                >
                  <div className="space-y-2.5">
                    
                    {/* Card Top: Category & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60 border border-white/10">
                        {trip.category || 'Trip'}
                      </span>
                      
                      {isSettled ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#25D366] bg-[#25D366]/15 px-2 py-0.5 rounded-full border border-[#25D366]/30">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>100% Settled</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-400/15 px-2 py-0.5 rounded-full border border-amber-400/30">
                          <Clock className="w-2.5 h-2.5" />
                          <span>In Progress</span>
                        </span>
                      )}
                    </div>

                    {/* Trip Title */}
                    <h3 className="text-base font-bold text-white font-['Space_Grotesk'] group-hover:text-[#C6FF3D] transition-colors truncate">
                      {trip.tripName}
                    </h3>

                    {/* Numbers: Total & Share */}
                    <div className="p-3 rounded-xl bg-[#0B0C16] border border-white/5 grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-white/40 block">TOTAL BILL</span>
                        <span className="text-lg font-black text-white font-['Space_Grotesk']">
                          ₹{trip.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-[#C6FF3D] block">EACH PERSON</span>
                        <span className="text-lg font-black text-[#C6FF3D] font-['Space_Grotesk']">
                          ₹{perPerson.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Members Avatars & Progress */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
                        <div className="flex items-center -space-x-1.5 overflow-hidden">
                          {trip.members.map((m) => (
                            <span 
                              key={m.id} 
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full border text-xs ${
                                m.status === 'paid' 
                                  ? 'bg-[#C6FF3D]/20 border-[#C6FF3D]/50 text-white' 
                                  : 'bg-[#1E2038] border-white/20 text-white/70'
                              }`}
                              title={`${m.name}: ${m.status.toUpperCase()}`}
                            >
                              {m.avatar}
                            </span>
                          ))}
                        </div>
                        <span>{paidMembers}/{trip.members.length} Paid</span>
                      </div>

                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#0082FB] to-[#C6FF3D] h-full rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenTripInSplitter(trip)}
                      className="text-xs font-mono font-bold text-[#C6FF3D] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open in Splitter</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteTrip(trip.id, e)}
                      className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                      title="Delete trip"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Live UPI Settlements Feed */}
        <div className="p-6 rounded-3xl bg-[#121326] border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#C6FF3D]" />
              <h3 className="text-sm sm:text-base font-bold text-white font-['Space_Grotesk']">
                Recent Campus Payment Activity
              </h3>
            </div>
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
              UPI Real-Time Log
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#0B0C16] border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-white font-bold">Vicky R. paid ₹3,300</div>
                <div className="text-[10px] text-white/40">Manali Snow Trek • UPI Ref #629104</div>
              </div>
              <span className="text-[#25D366] font-bold">✓ Verified</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0B0C16] border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-white font-bold">Neha T. paid ₹3,300</div>
                <div className="text-[10px] text-white/40">Manali Snow Trek • UPI Ref #839201</div>
              </div>
              <span className="text-[#25D366] font-bold">✓ Verified</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0B0C16] border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-white font-bold">Biryani Split Completed</div>
                <div className="text-[10px] text-white/40">4 Friends • ₹1,600 Total Settled</div>
              </div>
              <span className="text-[#C6FF3D] font-bold">✓ Closed</span>
            </div>
          </div>
        </div>

      </div>

      {/* Modal: Create New Trip Split */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#14152A] border border-white/15 shadow-2xl space-y-5 text-left relative animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚀</span>
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                  Create New Campus Split
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTrip} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-white/60 block">TRIP / EVENT NAME</label>
                <input
                  type="text"
                  required
                  value={newTripTitle}
                  onChange={(e) => setNewTripTitle(e.target.value)}
                  placeholder="e.g. Kasol Weekend Trip, Midnight Domino's"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white focus:border-[#C6FF3D] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white/60 block">TOTAL BILL AMOUNT (₹)</label>
                <input
                  type="number"
                  min="50"
                  step="10"
                  required
                  value={newTripAmount}
                  onChange={(e) => setNewTripAmount(e.target.value)}
                  placeholder="e.g. 5200"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white font-bold focus:border-[#C6FF3D] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white/60 block">FRIENDS IN THIS SPLIT (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={newTripFriends}
                  onChange={(e) => setNewTripFriends(e.target.value)}
                  placeholder="e.g. Aman, Rohit, Priya, Simran"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white focus:border-[#C6FF3D] focus:outline-none transition-colors"
                />
                <p className="text-[10px] text-white/40">
                  Leave empty to create with default squad members.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#C6FF3D] hover:bg-[#b5f422] text-[#0B0C16] font-bold font-['Space_Grotesk'] transition-all shadow-md shadow-[#C6FF3D]/20 cursor-pointer active:scale-95"
                >
                  Create & Open
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </section>
  );
};

export default UserDashboard;
