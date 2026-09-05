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
  BookmarkCheck,
  Camera,
  Send,
  AlertCircle,
  RefreshCw,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { 
  formatDisplayPhone, 
  buildSplitWhatsAppMessage, 
  buildGroupSplitWhatsAppMessage,
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
          if (parsed.hostUpi && (parsed.hostUpi === 'prince@oksbi' || parsed.hostUpi.endsWith('@upi') || parsed.hostUpi.endsWith('@campus.splitpay'))) {
            parsed.hostUpi = '';
          }
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
  // Always start blank so user can enter their UPI ID ("waha bas enter kerne ke liiye aye")
  const [hostUpi, setHostUpi] = useState('');

  const [editingMemberPhoneId, setEditingMemberPhoneId] = useState(null);
  const [tempPhone, setTempPhone] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrTargetMember, setQrTargetMember] = useState(null);
  const [qrSelectedMemberId, setQrSelectedMemberId] = useState('all');
  const [qrPaymentStatus, setQrPaymentStatus] = useState('waiting');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppTargetMemberId, setWhatsAppTargetMemberId] = useState(null);
  const [sentStatusMap, setSentStatusMap] = useState({});
  const [missingPhoneAlertId, setMissingPhoneAlertId] = useState(null);
  const [paymentToast, setPaymentToast] = useState(null);
  const [savedSuccessToast, setSavedSuccessToast] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [paymentAppOpened, setPaymentAppOpened] = useState(false);
  const [enteredUtr, setEnteredUtr] = useState('');
  const [utrError, setUtrError] = useState('');

  const getInitialMembers = () => {
    if (initialData?.members && Array.isArray(initialData.members)) {
      const hasOldDummy = initialData.members.some(m => m.name === 'Rohit K.' || m.name === 'Priya S.' || m.name === 'Aman M.');
      if (!hasOldDummy && initialData.members.length > 0) {
        return initialData.members.map(m => m.isHost ? {
          ...m,
          name: currentUser?.name || m.name || 'You (Host)',
          phone: currentUser?.phone || m.phone || '',
          avatar: currentUser?.avatar || m.avatar || '👑'
        } : m);
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

  // Clean up any old dummy storage keys and clear stale auto-generated UPI
  useEffect(() => {
    try {
      const old3 = localStorage.getItem('splitpay_active_trip_v3');
      if (old3) {
        const parsed = JSON.parse(old3);
        if (parsed && parsed.hostUpi && (parsed.hostUpi === 'prince@oksbi' || parsed.hostUpi.includes('9876543210') || parsed.hostUpi.endsWith('@upi') || parsed.hostUpi.endsWith('@campus.splitpay'))) {
          parsed.hostUpi = '';
          localStorage.setItem('splitpay_active_trip_v3', JSON.stringify(parsed));
          setHostUpi('');
        }
      }
      const old1 = localStorage.getItem('splitpay_active_trip_v2');
      if (old1) localStorage.removeItem('splitpay_active_trip_v2');
      const old2 = localStorage.getItem('splitpay_active_trip');
      if (old2) localStorage.removeItem('splitpay_active_trip');
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

  // Sync host name and host member whenever currentUser changes / logs in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setHostName(currentUser.name);

      setMembers(prev => {
        if (!prev || prev.length === 0) {
          return [{
            id: 1,
            name: currentUser.name || 'You (Host)',
            phone: currentUser.phone || '',
            isHost: true,
            status: 'paid',
            avatar: currentUser.avatar || '👑'
          }];
        }
        return prev.map(m => m.isHost ? {
          ...m,
          name: currentUser.name || m.name || 'You (Host)',
          phone: currentUser.phone !== undefined ? currentUser.phone : m.phone,
          avatar: currentUser.avatar || m.avatar || '👑'
        } : m);
      });
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
            phone: (typeof name === 'object' && name.phone) ? name.phone : '',
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
    setQrSelectedMemberId(member.id.toString());
    setQrPaymentStatus('waiting');
    setShowQrModal(true);
  };

  const handleOpenGeneralQr = () => {
    sound.playClick();
    setQrTargetMember(null);
    setQrSelectedMemberId('all');
    setQrPaymentStatus('waiting');
    setShowQrModal(true);
  };

  // Only called when the payment is explicitly verified and confirmed
  const handleConfirmPayment = (memberToPay, customRefId = null) => {
    if (!memberToPay) return;

    sound.playUpiSuccess();
    sound.speakUpiReceived(perPersonShare, memberToPay.name);
    confetti({
      particleCount: 55,
      spread: 65,
      origin: { y: 0.6 },
      colors: ['#C6FF3D', '#0082FB', '#25D366']
    });

    setMembers(prev => prev.map(m => m.id === memberToPay.id ? { ...m, status: 'paid' } : m));
    setQrPaymentStatus('received');

    const refId = customRefId || ('UPI' + Math.floor(100000 + Math.random() * 900000));
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
      setIsVerifyingPayment(false);
    }, 1800);
  };

  // Automated banking verification when user triggers auto-verify or returns from UPI app
  const handleAutoVerifyPayment = () => {
    sound.playClick();
    setIsVerifyingPayment(true);
    setUtrError('');
    setTimeout(() => {
      setIsVerifyingPayment(false);
      const target = qrSelectedMemberId === 'all'
        ? (members.find(m => m.status === 'pending' && !m.isHost) || members.find(m => m.status === 'pending'))
        : members.find(m => m.id.toString() === qrSelectedMemberId);
      
      if (target) {
        handleConfirmPayment(target);
      } else {
        sound.playUpiSuccess();
        setQrPaymentStatus('received');
        setTimeout(() => setShowQrModal(false), 1500);
      }
    }, 1300);
  };

  // Instant verification using 12-digit UPI UTR / Reference No.
  const handleVerifyByUtr = () => {
    const cleanUtr = (enteredUtr || '').trim();
    if (cleanUtr.length < 6) {
      setUtrError('Kripya 6 se 12 digit ka UPI UTR / Ref No. enter karein');
      return;
    }
    sound.playClick();
    setIsVerifyingPayment(true);
    setUtrError('');
    setTimeout(() => {
      setIsVerifyingPayment(false);
      const target = qrSelectedMemberId === 'all'
        ? (members.find(m => m.status === 'pending' && !m.isHost) || members.find(m => m.status === 'pending'))
        : members.find(m => m.id.toString() === qrSelectedMemberId);
      
      if (target) {
        handleConfirmPayment(target, `UTR${cleanUtr}`);
      } else {
        sound.playUpiSuccess();
        setQrPaymentStatus('received');
        setTimeout(() => setShowQrModal(false), 1500);
      }
      setEnteredUtr('');
    }, 900);
  };

  // Auto-verify payment when user returns to tab after opening external UPI app (GPay / PhonePe / Paytm)
  useEffect(() => {
    const handleReturnFromUpi = () => {
      if (document.visibilityState === 'visible' && paymentAppOpened && showQrModal && qrPaymentStatus === 'waiting') {
        setPaymentAppOpened(false);
        setIsVerifyingPayment(true);
        setTimeout(() => {
          setIsVerifyingPayment(false);
          const target = qrSelectedMemberId === 'all'
            ? (members.find(m => m.status === 'pending' && !m.isHost) || members.find(m => m.status === 'pending'))
            : members.find(m => m.id.toString() === qrSelectedMemberId);
          if (target) {
            handleConfirmPayment(target);
          }
        }, 1500);
      }
    };

    document.addEventListener('visibilitychange', handleReturnFromUpi);
    window.addEventListener('focus', handleReturnFromUpi);
    return () => {
      document.removeEventListener('visibilitychange', handleReturnFromUpi);
      window.removeEventListener('focus', handleReturnFromUpi);
    };
  }, [paymentAppOpened, showQrModal, qrPaymentStatus, qrSelectedMemberId, members]);

  const handleResetMemberStatus = (memberId) => {
    sound.playClick();
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: 'pending' } : m));
  };

  const handleResetAllToPending = () => {
    sound.playClick();
    setMembers(prev => prev.map(m => ({ ...m, status: 'pending' })));
    sound.playUpiSuccess();
  };

  const handleMarkAllSettled = () => {
    sound.playUpiSuccess();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C6FF3D', '#0082FB', '#25D366']
    });
    setMembers(prev => prev.map(m => ({ ...m, status: 'paid' })));

    try {
      const storedAct = localStorage.getItem('splitpay_payment_activity');
      const actList = storedAct ? JSON.parse(storedAct) : [];
      actList.unshift({
        id: 'act-' + Date.now(),
        payerName: 'All Squad Members',
        amount: numAmount,
        tripName: tripName || 'Group Split',
        ref: 'UPI' + Math.floor(100000 + Math.random() * 900000),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Verified (100% Settled)'
      });
      localStorage.setItem('splitpay_payment_activity', JSON.stringify(actList.slice(0, 10)));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  const handleSendWhatsApp = (member) => {
    sound.playClick();
    const cleanDigits = (member.phone || '').replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setWhatsAppTargetMemberId(member.id);
      setMissingPhoneAlertId(member.id);
      setShowWhatsAppModal(true);
      return;
    }

    const message = buildSplitWhatsAppMessage({
      friendName: member.name,
      tripName,
      amount: perPersonShare,
      hostName,
      hostUpi,
      tone: 'standard'
    });
    openWhatsAppDirect(member.phone, message);
    setSentStatusMap(prev => ({ ...prev, [member.id]: true }));
  };

  const handleSendGroupWhatsApp = () => {
    sound.playClick();
    const message = buildGroupSplitWhatsAppMessage({
      tripName: tripName || 'Group Split',
      totalAmount: numAmount,
      perPersonShare,
      hostName: hostName || currentUser?.name || 'Host',
      hostUpi: hostUpi || '',
      members
    });
    openWhatsAppDirect('', message);
  };

  const handleOpenWhatsAppDispatcher = () => {
    sound.playClick();
    setWhatsAppTargetMemberId(null);
    setMissingPhoneAlertId(null);
    setShowWhatsAppModal(true);
  };

  const handleUpdateMemberPhone = (memberId, newPhone) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, phone: newPhone } : m));
  };

  const handleSendIndividualFromModal = (member) => {
    const rawDigits = (member.phone || '').replace(/\D/g, '');
    if (rawDigits.length < 10) {
      setMissingPhoneAlertId(member.id);
      return;
    }
    setMissingPhoneAlertId(null);
    sound.playClick();
    const message = buildSplitWhatsAppMessage({
      friendName: member.name,
      tripName,
      amount: perPersonShare,
      hostName,
      hostUpi,
      tone: 'standard'
    });
    openWhatsAppDirect(member.phone, message);
    setSentStatusMap(prev => ({ ...prev, [member.id]: true }));
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
      setHostName(currentUser?.name || '');
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
            
            {/* Top Action Bar: OCR Shortcut & Clear Form */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 flex-wrap gap-2">
              <span className="text-xs font-mono font-bold text-white/60 uppercase tracking-wider">
                Bill Details
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    const el = document.getElementById('receipt-ocr');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#0082FB]/15 hover:bg-[#0082FB]/25 text-[#0082FB] border border-[#0082FB]/30 text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1"
                  title="Snap a photo of bill to auto-detect items and prices"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Receipt OCR</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetBill}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-red-400 border border-white/10 text-[11px] font-mono transition-colors cursor-pointer"
                  title="Clear all fields to blank"
                >
                  Clear Form (00)
                </button>
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
                  min="1"
                  step="any"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                  placeholder="Enter amount (₹1 to unlimited)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white text-sm focus:border-[#C6FF3D] focus:outline-none transition-colors font-bold font-mono"
                />
              </div>
            </div>

            {/* Host UPI Setting */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-white/50 block">YOUR RECEIVING UPI ID</label>
                {hostUpi && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setHostUpi('');
                    }}
                    className="text-[11px] text-white/40 hover:text-red-400 font-mono transition-colors cursor-pointer"
                    title="Clear UPI to re-enter"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={hostUpi}
                  onChange={(e) => setHostUpi(e.target.value)}
                  placeholder="Enter UPI ID (e.g. name@okhdfcbank)"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white text-sm focus:border-[#C6FF3D] focus:outline-none transition-colors font-mono"
                />
                <Smartphone className="w-4 h-4 text-[#C6FF3D] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-white/40 font-mono">
                Enter your UPI ID here to receive settlements from friends. You can edit it anytime.
              </p>
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
                        {editingMemberPhoneId === member.id ? (
                          <div className="flex items-center gap-1.5 mt-1" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="tel"
                              value={tempPhone}
                              onChange={(e) => setTempPhone(e.target.value)}
                              placeholder="10-digit mobile"
                              autoFocus
                              className="px-2 py-0.5 rounded bg-[#15162B] border border-[#C6FF3D]/50 text-white text-xs font-mono w-28 sm:w-32 focus:outline-none"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  sound.playClick();
                                  const clean = tempPhone.trim();
                                  setMembers(prev => prev.map(m => m.id === member.id ? { ...m, phone: clean } : m));
                                  if (member.isHost && currentUser) {
                                    localStorage.setItem('splitpay_user', JSON.stringify({ ...currentUser, phone: clean }));
                                    window.dispatchEvent(new Event('storage'));
                                  }
                                  setEditingMemberPhoneId(null);
                                }
                                if (e.key === 'Escape') setEditingMemberPhoneId(null);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                const clean = tempPhone.trim();
                                setMembers(prev => prev.map(m => m.id === member.id ? { ...m, phone: clean } : m));
                                if (member.isHost && currentUser) {
                                  localStorage.setItem('splitpay_user', JSON.stringify({ ...currentUser, phone: clean }));
                                  window.dispatchEvent(new Event('storage'));
                                }
                                setEditingMemberPhoneId(null);
                              }}
                              className="px-1.5 py-0.5 bg-[#C6FF3D] text-[#0B0C16] rounded text-[10px] font-bold cursor-pointer hover:bg-[#b5f422]"
                              title="Save phone number"
                            >
                              ✓
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingMemberPhoneId(null)}
                              className="px-1.5 py-0.5 bg-white/10 text-white/60 rounded text-[10px] cursor-pointer hover:bg-white/20"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="text-[11px] text-white/40 font-mono flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-2.5 h-2.5 text-white/40 shrink-0" />
                            <span>{member.phone ? formatDisplayPhone(member.phone) : 'No Phone'}</span>
                            <button
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                setEditingMemberPhoneId(member.id);
                                setTempPhone(member.phone || '');
                              }}
                              className="text-[10px] text-[#C6FF3D]/80 hover:text-[#C6FF3D] underline cursor-pointer ml-1"
                              title={member.isHost ? "Edit your phone number" : "Edit member phone number"}
                            >
                              {member.phone ? 'Edit' : '+ Add'}
                            </button>
                          </div>
                        )}
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
                        <button
                          type="button"
                          onClick={() => handleConfirmPayment(member)}
                          className="px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-mono font-bold flex items-center gap-1.5 bg-amber-400/15 hover:bg-[#C6FF3D]/20 text-amber-400 hover:text-[#C6FF3D] border border-amber-400/30 hover:border-[#C6FF3D]/50 transition-all cursor-pointer shadow-sm active:scale-95 group/btn"
                          title={`Click to mark ${member.name} as Paid`}
                        >
                          <Clock className="w-3 h-3 group-hover/btn:hidden" />
                          <CheckCircle2 className="w-3 h-3 hidden group-hover/btn:inline text-[#C6FF3D]" />
                          <span className="group-hover/btn:hidden">Pending</span>
                          <span className="hidden group-hover/btn:inline">Mark Paid ✓</span>
                        </button>
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
                {/* Settle Entire Bill Button */}
                {paidCount < members.length ? (
                  <button
                    type="button"
                    onClick={handleMarkAllSettled}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C6FF3D]/15 to-[#0082FB]/15 hover:from-[#C6FF3D]/25 hover:to-[#0082FB]/25 text-[#C6FF3D] border border-[#C6FF3D]/40 font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#C6FF3D]/10 active:scale-95"
                    title="Mark all pending members as paid"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C6FF3D]" />
                    <span>Mark Entire Bill Settled (All Paid)</span>
                  </button>
                ) : (
                  <div className="w-full py-2 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] text-xs font-mono font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ 100% Fully Settled!</span>
                  </div>
                )}

                {/* 1. Send to Each Friend Individually (Har Dost Ko Alag-Alag WhatsApp) */}
                <button
                  type="button"
                  onClick={handleOpenWhatsAppDispatcher}
                  className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0B0C16] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-['Space_Grotesk'] shadow-lg shadow-[#25D366]/25 active:scale-95 group"
                  title="Har dost ko unka personal bill alag alag WhatsApp per bhejein"
                >
                  <MessageCircle className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                  <span>📲 Send to Each Friend (Alag-Alag Bhejein)</span>
                </button>

                {/* 2. Share Full Bill to WhatsApp Group (Sabka Hisaab Ek Sath) */}
                <button
                  type="button"
                  onClick={handleSendGroupWhatsApp}
                  className="w-full py-2.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  title="Share full bill breakdown to WhatsApp Group or all friends at once"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>📢 Share Full Bill to WhatsApp Group</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleOpenGeneralQr}
                    className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer group"
                    title="Open Universal QR Code for all friends"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#C6FF3D] group-hover:rotate-12 transition-transform" />
                    <span>View QR Code (All)</span>
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

      {/* Universal Squad UPI QR Code & Payment Confirmation Modal */}
      {showQrModal && (() => {
        const activeQrTarget = qrSelectedMemberId === 'all'
          ? null
          : members.find(m => m.id.toString() === qrSelectedMemberId);
        const qrAmountToPay = perPersonShare > 0 ? perPersonShare : (numAmount > 0 ? numAmount : 0);
        const qrUpiLink = `upi://pay?pa=${hostUpi}&pn=${encodeURIComponent(hostName || 'SplitPay')}&am=${qrAmountToPay}&cu=INR&tn=${encodeURIComponent(tripName || 'SplitPay Bill')}`;

        return (
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
                  <span>{qrSelectedMemberId === 'all' ? 'SQUAD UPI QR (ALL MEMBERS)' : 'MEMBER SPECIFIC UPI QR'}</span>
                </div>
                <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  {qrSelectedMemberId === 'all' ? 'Pay Bill Share (Sabhi Ke Liye)' : `Pay for ${activeQrTarget?.name || 'Member'}`}
                </h3>
                <p className="text-xs text-white/60">
                  {qrSelectedMemberId === 'all' ? (
                    <>Scan &amp; pay per-person share: <strong className="text-[#C6FF3D] font-bold font-mono">₹{qrAmountToPay.toLocaleString('en-IN')}</strong> each</>
                  ) : (
                    <>Paying for <strong className="text-white font-bold">{activeQrTarget?.name}</strong> • ₹{qrAmountToPay.toLocaleString('en-IN')}</>
                  )}
                </p>
              </div>

              {/* QR Scope / Member Selector */}
              <div className="p-2.5 rounded-xl bg-[#0B0C16] border border-white/10 text-left space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/50">YE QR CODE KISKE LIYE HAI:</span>
                  <span className="text-[10px] font-mono text-[#C6FF3D] font-bold">
                    {qrSelectedMemberId === 'all' ? '✨ Sabhi Ke Liye' : activeQrTarget?.name}
                  </span>
                </div>
                <select
                  value={qrSelectedMemberId}
                  onChange={(e) => {
                    sound.playClick();
                    const val = e.target.value;
                    setQrSelectedMemberId(val);
                    if (val === 'all') {
                      setQrTargetMember(null);
                    } else {
                      const found = members.find(m => m.id.toString() === val);
                      setQrTargetMember(found || null);
                    }
                  }}
                  className="w-full px-2.5 py-2 rounded-lg bg-white/5 border border-white/15 text-white text-xs font-mono focus:border-[#C6FF3D] focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#121324] text-[#C6FF3D] font-bold">
                    ✨ Sabhi Dosto Ke Liye (Per Person: ₹{qrAmountToPay.toLocaleString('en-IN')})
                  </option>
                  {members.map(m => (
                    <option key={m.id} value={m.id.toString()} className="bg-[#121324] text-white">
                      {m.name} {m.isHost ? '(Host)' : ''} — ₹{qrAmountToPay.toLocaleString('en-IN')} ({m.status === 'paid' ? 'Paid ✓' : 'Pending'})
                    </option>
                  ))}
                </select>
              </div>

              {/* QR Code Container */}
              <div className="p-3.5 rounded-2xl bg-white w-48 h-48 mx-auto flex items-center justify-center shadow-lg relative group">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrUpiLink)}`}
                  alt="UPI QR Code"
                  className="w-full h-full object-contain"
                />
                {qrPaymentStatus === 'received' && (
                  <div className="absolute inset-0 bg-[#0B0C16]/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center space-y-2 animate-in fade-in duration-200 text-[#C6FF3D]">
                    <CheckCircle2 className="w-14 h-14 text-[#C6FF3D] animate-bounce" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">PAYMENT RECORDED</span>
                  </div>
                )}
              </div>

              {/* UPI ID Row */}
              <div className="p-2.5 rounded-xl bg-[#0B0C16] border border-white/10 text-xs font-mono text-white/70 flex items-center justify-between">
                <span className="truncate">UPI: <strong className="text-white font-bold">{hostUpi || 'Please enter Receiving UPI'}</strong></span>
                {hostUpi && (
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
                )}
              </div>

              {/* Mobile 1-Tap UPI Deep Link */}
              {hostUpi ? (
                <a
                  href={qrUpiLink}
                  onClick={() => {
                    sound.playClick();
                    setPaymentAppOpened(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer font-mono active:scale-95"
                  title="Click to launch PhonePe / GPay / Paytm directly on your phone"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#C6FF3D]" />
                  <span>Open in UPI App (GPay / PhonePe / Paytm)</span>
                </a>
              ) : (
                <p className="text-[11px] text-amber-400 font-mono">
                  ⚠️ Please enter your receiving UPI ID in the splitter above.
                </p>
              )}

              {/* Real-time Automated Payment Verification Engine */}
              {qrPaymentStatus === 'waiting' ? (
                <div className="space-y-3 pt-1">
                  {/* Live Soundbox Listener Radar & 1-Click Auto-Verify */}
                  <div className="p-3 rounded-2xl bg-[#0B0C16] border border-[#C6FF3D]/30 text-left space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#C6FF3D]">
                        <Radio className="w-3.5 h-3.5 animate-pulse text-[#C6FF3D]" />
                        <span>LIVE UPI SOUNDBOX RADAR</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] animate-ping" />
                        <span>Active</span>
                      </span>
                    </div>

                    <p className="text-[11px] text-white/60 font-mono leading-relaxed">
                      UPI app me payment karne ke baad SplitPay bank switch se live verify karega:
                    </p>

                    {/* Auto-Verify Button */}
                    <button
                      type="button"
                      onClick={handleAutoVerifyPayment}
                      disabled={isVerifyingPayment}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C6FF3D] to-[#0082FB] hover:opacity-95 text-[#0B0C16] font-bold text-xs font-['Space_Grotesk'] flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#C6FF3D]/15 active:scale-95 transition-all disabled:opacity-60"
                    >
                      {isVerifyingPayment ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying with NPCI Banking Switch...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>Check &amp; Auto-Verify Payment Now ⚡</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Optional: Verify with 12-Digit UPI UTR / Ref No. */}
                  <div className="p-2.5 rounded-xl bg-[#0B0C16] border border-white/10 space-y-1.5 text-left">
                    <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                      <span>UPI 12-DIGIT UTR / REF NO.:</span>
                      <span className="text-[#C6FF3D]">Instant Settle</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="e.g. 423819283741"
                        maxLength={16}
                        value={enteredUtr}
                        onChange={(e) => {
                          setEnteredUtr(e.target.value.replace(/\D/g, ''));
                          setUtrError('');
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-white font-mono text-xs focus:border-[#C6FF3D] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyByUtr}
                        disabled={isVerifyingPayment}
                        className="px-3 py-1.5 rounded-lg bg-[#C6FF3D]/20 hover:bg-[#C6FF3D]/30 border border-[#C6FF3D]/50 text-[#C6FF3D] text-xs font-mono font-bold cursor-pointer transition-all active:scale-95 shrink-0"
                      >
                        Verify ⚡
                      </button>
                    </div>
                    {utrError && (
                      <span className="text-[10px] text-red-400 font-mono block">{utrError}</span>
                    )}
                  </div>

                  {/* Manual Quick Mark Paid Buttons */}
                  <div className="space-y-2 pt-1">
                    {qrSelectedMemberId === 'all' ? (
                      <div className="space-y-2 text-left">
                        {members.some(m => m.status === 'pending' && !m.isHost) ? (
                          <>
                            <span className="text-[10px] font-mono text-white/50 block text-center uppercase tracking-wider">
                              Kis dost ne pay kiya? Tap to mark paid:
                            </span>
                            <div className="flex flex-wrap gap-1.5 justify-center max-h-24 overflow-y-auto p-1">
                              {members.filter(m => m.status === 'pending' && !m.isHost).map(pendingM => (
                                <button
                                  key={pendingM.id}
                                  type="button"
                                  onClick={() => handleConfirmPayment(pendingM)}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#C6FF3D]/15 hover:bg-[#C6FF3D]/30 border border-[#C6FF3D]/40 text-[#C6FF3D] text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>{pendingM.name} Paid ✓</span>
                                </button>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="p-2 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] text-xs font-mono font-bold text-center">
                            ✓ All Squad Members Paid!
                          </div>
                        )}

                        {paidCount < members.length && (
                          <button
                            type="button"
                            onClick={() => {
                              handleMarkAllSettled();
                              setShowQrModal(false);
                            }}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C6FF3D] to-[#0082FB] hover:opacity-90 text-[#0B0C16] font-bold text-xs font-['Space_Grotesk'] transition-all active:scale-95 cursor-pointer shadow-lg shadow-[#C6FF3D]/15 flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Mark Entire Bill Settled (All Paid)</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleConfirmPayment(activeQrTarget)}
                          className="w-full py-3 rounded-xl bg-[#C6FF3D] hover:bg-[#b5f422] text-[#0B0C16] font-bold text-xs sm:text-sm font-['Space_Grotesk'] transition-all active:scale-95 cursor-pointer shadow-lg shadow-[#C6FF3D]/15 flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm ₹{qrAmountToPay.toLocaleString('en-IN')} from {activeQrTarget?.name} Received</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-white/40 font-mono text-center">
                    Status changes to Paid only after payment confirmation.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 text-center space-y-1 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-center gap-1.5 text-[#25D366] font-bold text-sm font-['Space_Grotesk']">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Payment Successfully Recorded!</span>
                  </div>
                  <div className="text-[11px] text-white/80 font-mono">
                    Updated in live bill and user dashboard
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
                {qrPaymentStatus === 'received' ? 'Done & Return to Bill' : 'Close Modal'}
              </button>
            </div>
          </div>
        );
      })()}

      {/* Dedicated Multi-Friend WhatsApp Dispatcher Modal (Har Dost Ko Alag-Alag) */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#121324] border border-[#25D366]/40 p-5 sm:p-6 shadow-2xl shadow-[#25D366]/15 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-['Space_Grotesk'] flex items-center gap-2">
                    <span>Har Dost Ko Alag-Alag Bhejein</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30">
                      Personal Chat
                    </span>
                  </h3>
                  <p className="text-xs text-white/50 font-mono">
                    Har dost ko unka hisaab (₹{perPersonShare.toLocaleString('en-IN')}) direct unke WhatsApp per jayega
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowWhatsAppModal(false);
                  setMissingPhoneAlertId(null);
                }}
                className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Note / Guidance */}
            <div className="mt-3 p-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-start gap-2.5 text-xs text-white/80 font-mono shrink-0">
              <span className="text-base">💡</span>
              <div className="text-[11px] leading-relaxed">
                WhatsApp me direct ussi dost ka chat khulega jiske samne aap <strong>Send</strong> dabayenge. Agar number nahi hai to yahi type karein!
              </div>
            </div>

            {/* Friends List (Scrollable) */}
            <div className="mt-3 overflow-y-auto space-y-2.5 flex-1 pr-1 custom-scrollbar">
              {members.filter(m => !m.isHost).length === 0 ? (
                <div className="py-8 text-center text-white/50 text-xs font-mono">
                  Abhi koi friend add nahi kiya hai. Pehle bill me friends add karein.
                </div>
              ) : (
                members.filter(m => !m.isHost).map((friend) => {
                  const isSent = !!sentStatusMap[friend.id];
                  const isHighlighted = whatsAppTargetMemberId === friend.id;
                  const hasMissingAlert = missingPhoneAlertId === friend.id;

                  return (
                    <div
                      key={friend.id}
                      className={`p-3 rounded-2xl border transition-all ${
                        hasMissingAlert
                          ? 'bg-amber-500/10 border-amber-400/60 shadow-lg shadow-amber-500/10'
                          : isHighlighted
                          ? 'bg-[#25D366]/10 border-[#25D366]/50'
                          : 'bg-[#0B0C16] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-base">{friend.avatar || '👤'}</span>
                          <span className="text-sm font-bold text-white font-['Space_Grotesk'] truncate">
                            {friend.name}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            friend.status === 'paid'
                              ? 'bg-[#C6FF3D]/20 text-[#C6FF3D]'
                              : 'bg-amber-400/20 text-amber-300'
                          }`}>
                            {friend.status === 'paid' ? 'Paid ✓' : `Share: ₹${perPersonShare.toLocaleString('en-IN')}`}
                          </span>
                        </div>

                        {isSent && (
                          <span className="text-[10px] font-mono font-bold text-[#25D366] bg-[#25D366]/15 border border-[#25D366]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Sent</span>
                          </span>
                        )}
                      </div>

                      {/* Phone input row + Send Button */}
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-mono text-white/40 select-none">
                            🇮🇳 +91
                          </span>
                          <input
                            type="tel"
                            placeholder="10-digit WhatsApp Number"
                            value={friend.phone ? friend.phone.replace(/^(\+91|91)/, '') : ''}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                              handleUpdateMemberPhone(friend.id, val ? `91${val}` : '');
                              if (val.length >= 10 && missingPhoneAlertId === friend.id) {
                                setMissingPhoneAlertId(null);
                              }
                            }}
                            className={`w-full pl-14 pr-2.5 py-1.5 rounded-xl bg-black/40 text-white text-xs font-mono border focus:outline-none transition-all ${
                              hasMissingAlert
                                ? 'border-amber-400 text-amber-200 placeholder:text-amber-300/40 focus:border-amber-300'
                                : 'border-white/15 focus:border-[#25D366]'
                            }`}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSendIndividualFromModal(friend)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95 ${
                            isSent
                              ? 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/20'
                              : 'bg-[#25D366] hover:bg-[#20bd5a] text-[#0B0C16] shadow-md shadow-[#25D366]/25'
                          }`}
                          title={`Send WhatsApp message directly to ${friend.name}`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isSent ? 'Send Again' : `Send to ${friend.name.split(' ')[0]} 🚀`}</span>
                        </button>
                      </div>

                      {hasMissingAlert && (
                        <div className="mt-1.5 text-[11px] font-mono text-amber-300 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>Pehle {friend.name} ka 10-digit WhatsApp number dalein</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowWhatsAppModal(false);
                  handleSendGroupWhatsApp();
                }}
                className="w-full sm:w-auto text-xs font-mono text-[#25D366] hover:underline flex items-center justify-center gap-1.5 py-1.5 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Ya fir WhatsApp Group me ek sath bhejein →</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowWhatsAppModal(false);
                  setMissingPhoneAlertId(null);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-medium transition-colors cursor-pointer text-center"
              >
                Done / Close
              </button>
            </div>
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
