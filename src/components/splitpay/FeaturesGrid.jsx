import React, { useState } from 'react';
import { 
  Camera, 
  ScanLine, 
  Sparkles, 
  CalendarCheck, 
  Repeat, 
  Wallet, 
  Users, 
  Plane, 
  BellRing, 
  MessageSquare, 
  Flame, 
  Utensils, 
  CheckCircle2, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Smartphone, 
  Receipt,
  FileSpreadsheet,
  Layers,
  Clock,
  Laugh,
  Pencil,
  MapPin
} from 'lucide-react';
import { sound } from '../../utils/audio';

const FeaturesGrid = () => {
  // Hero Card State: Toggle between Bill photo and UPI screenshot
  const [activeScanType, setActiveScanType] = useState('bill');
  const [isScanning, setIsScanning] = useState(false);

  // Reminder Escalation Preview State
  const [activeEscalation, setActiveEscalation] = useState(0);

  // Card 3 State: Editable Trip Destination
  const [tripDestination, setTripDestination] = useState('Goa');
  const [isEditingDestination, setIsEditingDestination] = useState(false);
  const [tempDestination, setTempDestination] = useState('Goa');

  const tripPresets = [
    { 
      name: 'Goa', 
      icon: '🏖️', 
      expenses: [
        { name: '🚕 Airport Prepaid Cab', amount: '₹1,850' },
        { name: '🍕 Curlies Shack Dinner', amount: '₹3,400' },
        { name: '🛵 Scooty Rentals (4x)', amount: '₹2,000' }
      ]
    },
    { 
      name: 'Manali', 
      icon: '🏔️', 
      expenses: [
        { name: '🚕 Volvo / Cab Transit', amount: '₹2,200' },
        { name: '🍲 Old Manali Cafe Dinner', amount: '₹3,100' },
        { name: '⛷️ Solang Valley Passes', amount: '₹1,950' }
      ]
    },
    { 
      name: 'Ladakh', 
      icon: '🏍️', 
      expenses: [
        { name: '🏍️ Royal Enfield Rentals', amount: '₹3,500' },
        { name: '🍜 Pangong Tso Homestay', amount: '₹2,800' },
        { name: '⛽ High-Altitude Fuel', amount: '₹950' }
      ]
    },
    { 
      name: 'Rishikesh', 
      icon: '🌊', 
      expenses: [
        { name: '🚣 River Rafting & Jump', amount: '₹2,400' },
        { name: '⛺ Riverside Camp Stay', amount: '₹3,200' },
        { name: '☕ Beatles Cafe Breakfast', amount: '₹1,650' }
      ]
    }
  ];

  const currentPreset = tripPresets.find(p => p.name.toLowerCase() === tripDestination.toLowerCase());
  const currentExpenses = currentPreset ? currentPreset.expenses : [
    { name: `🚕 Transit & Cabs in ${tripDestination}`, amount: '₹2,100' },
    { name: `🍕 ${tripDestination} Group Dinners`, amount: '₹3,200' },
    { name: `🎟️ Local Sightseeing & Activities`, amount: '₹1,950' }
  ];

  const handleScanTrigger = (type) => {
    sound.playClick();
    setActiveScanType(type);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      sound.playUpiSuccess();
    }, 1200);
  };

  const escalationStages = [
    {
      level: "Step 1",
      badge: "Friendly Nudge",
      tone: "Gentle & Polite",
      message: "Hey Dev, ₹450 from yesterday's dinner is ready whenever you are! ☕",
      time: "Day 1 • 8:00 PM",
      color: "text-[#0082FB] border-[#0082FB]/30 bg-[#0082FB]/10",
      pillColor: "border-[#0082FB]/40 text-[#0082FB]"
    },
    {
      level: "Step 2",
      badge: "Meme Nudge",
      tone: "Playful Humor",
      message: "My bank account is currently singing 'Channa Mereya'... ₹450 pending 😭💸",
      time: "Day 3 • 12:30 PM",
      color: "text-[#FF6B4A] border-[#FF6B4A]/30 bg-[#FF6B4A]/10",
      pillColor: "border-[#FF6B4A]/40 text-[#FF6B4A]"
    },
    {
      level: "Step 3",
      badge: "Public Callout",
      tone: "Gamified Peer Pressure",
      message: "📢 Group Bulletin: Dev has survived 5 days without paying for cheese naan. Legend. 🏆",
      time: "Day 5 • Group Feed",
      color: "text-[#C6FF3D] border-[#C6FF3D]/30 bg-[#C6FF3D]/10",
      pillColor: "border-[#C6FF3D]/40 text-[#C6FF3D]"
    }
  ];

  return (
    <section id="features" className="relative py-20 sm:py-28 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 bg-[#0B0C16] overflow-hidden w-full">
      
      {/* Background Ambience / Glows */}
      <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-[#C6FF3D]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 -left-20 w-[500px] h-[500px] bg-[#0082FB]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-2/3 left-1/3 w-[400px] h-[400px] bg-[#FF6B4A]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-[#C6FF3D] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            THE SPLITPAY ADVANTAGE
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">
            What makes{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6FF3D] via-[#0082FB] to-[#FF6B4A]">
              SplitPay different
            </span>
          </h2>

          <p className="text-base sm:text-lg text-white/70 max-w-3xl mx-auto font-normal leading-relaxed">
            Most split apps just do the maths. SplitPay actually moves the money — and makes sure it moves on time.
          </p>
        </div>

        {/* 5 Cards in Uneven Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* =========================================================================
              CARD 1 (HERO - 8 Columns on Desktop): Scan & Split
              Visual Demo: Camera Bill / UPI Screenshot OCR Detection & Auto Breakdown
             ========================================================================= */}
          <div 
            onMouseEnter={() => sound.playHover()}
            className="md:col-span-12 lg:col-span-8 p-5 sm:p-7 md:p-8 lg:p-9 rounded-3xl bg-[#15162B]/85 hover:bg-[#181932] border border-white/10 hover:border-[#C6FF3D]/50 transition-all duration-300 group flex flex-col justify-between glass-card relative overflow-hidden shadow-2xl"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C6FF3D]/12 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-5 relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#C6FF3D]/15 text-[#C6FF3D] flex items-center justify-center shadow-lg shadow-[#C6FF3D]/10">
                    <ScanLine className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-[#C6FF3D] uppercase tracking-wider font-bold block">
                      FEATURE 01 • HERO OCR ENGINE
                    </span>
                    <span className="text-[11px] font-mono text-white/50">Zero manual typing guaranteed</span>
                  </div>
                </div>

                {/* Scan Type Switcher / Interactive Trigger */}
                <div className="inline-flex items-center p-1 rounded-xl bg-[#0B0C16]/90 border border-white/10 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => handleScanTrigger('bill')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                      activeScanType === 'bill'
                        ? 'bg-[#C6FF3D] text-[#0B0C16] font-bold shadow-md'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    Bill Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScanTrigger('upi')}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                      activeScanType === 'upi'
                        ? 'bg-[#C6FF3D] text-[#0B0C16] font-bold shadow-md'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    UPI Screenshot
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-['Space_Grotesk'] group-hover:text-[#C6FF3D] transition-colors">
                  1. Scan & Split
                </h3>
                <p className="mt-2 text-sm sm:text-base text-white/75 leading-relaxed max-w-2xl">
                  Snap a photo of the bill or a UPI screenshot — SplitPay reads the amount and items automatically using OCR, so nobody has to type anything in manually.
                </p>
              </div>

              {/* Live Interactive Visual Demo: Bill Photo → Auto Split Breakdown */}
              <div className="mt-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  {/* Left: Simulated Bill Photo / UPI Scan Area */}
                  <div className="md:col-span-6 relative p-4 rounded-2xl bg-[#0B0C16]/95 border border-white/10 font-mono text-xs overflow-hidden">
                    {/* Laser Scanner Line Animation */}
                    <div 
                      className={`absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C6FF3D] to-transparent shadow-[0_0_12px_#C6FF3D] z-20 transition-all duration-700 ${
                        isScanning ? 'animate-pulse top-1/2' : 'top-3 opacity-60'
                      }`} 
                    />
                    
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-[11px] text-white/50">
                      <span className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#C6FF3D]" />
                        {activeScanType === 'bill' ? 'CAFE_RECEIPT_092.JPG' : 'GPAY_TRANSACTION_SS.PNG'}
                      </span>
                      <span className="text-[#C6FF3D] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] animate-ping" />
                        OCR Active
                      </span>
                    </div>

                    {activeScanType === 'bill' ? (
                      <div className="space-y-2 text-[11px]">
                        <div className="text-center font-bold text-white/90 border-b border-dashed border-white/10 pb-1">
                          THE BIG CHILL CAFE • NEW DELHI
                        </div>
                        <div className="flex items-center justify-between p-1.5 rounded bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-white">
                          <span className="text-[#C6FF3D]">1x Penne Arrabiata</span>
                          <span className="font-bold font-mono">₹480.00</span>
                        </div>
                        <div className="flex items-center justify-between p-1.5 rounded bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-white">
                          <span className="text-[#C6FF3D]">1x Garlic Bread Ex. Cheese</span>
                          <span className="font-bold font-mono">₹240.00</span>
                        </div>
                        <div className="flex items-center justify-between p-1.5 rounded bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-white">
                          <span className="text-[#C6FF3D]">2x Iced Peach Tea</span>
                          <span className="font-bold font-mono">₹360.00</span>
                        </div>
                        <div className="pt-1.5 border-t border-dashed border-white/10 flex items-center justify-between font-bold text-white">
                          <span>Total Extracted (inc. GST):</span>
                          <span className="text-[#C6FF3D] text-sm">₹1,134.00</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-[11px]">
                        <div className="text-center font-bold text-white/90 border-b border-dashed border-white/10 pb-1">
                          UPI TRANSACTION PROOF • SUCCESSFUL
                        </div>
                        <div className="p-2 rounded bg-white/5 border border-white/10 space-y-1">
                          <div className="text-white/50 text-[10px]">Paid to merchant:</div>
                          <div className="text-white font-bold text-xs">SOCIAL HAUS KHAS (UPI)</div>
                          <div className="text-[#0082FB] font-mono text-[10px]">TXN ID: 429188049102</div>
                        </div>
                        <div className="p-2 rounded bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 flex items-center justify-between font-bold text-white">
                          <span className="text-[#C6FF3D]">OCR Auto-Detected:</span>
                          <span className="text-[#C6FF3D] text-sm">₹3,450.00</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between text-[10px] text-white/40 pt-2 border-t border-white/5">
                      <span>99.4% Parsing Accuracy</span>
                      <button 
                        type="button" 
                        onClick={() => handleScanTrigger(activeScanType)} 
                        className="text-[#C6FF3D] hover:underline cursor-pointer"
                      >
                        {isScanning ? 'Extracting text...' : 'Click to re-scan ⟳'}
                      </button>
                    </div>
                  </div>

                  {/* Right: Instant Auto-Split Breakdown Output */}
                  <div className="md:col-span-6 space-y-2 font-mono">
                    <div className="flex items-center gap-2 text-xs text-[#C6FF3D] font-bold uppercase tracking-wider pb-1">
                      <ArrowRight className="w-3.5 h-3.5" />
                      Instant Auto-Split Breakdown
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#0B0C16] border border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#C6FF3D]/20 text-[#C6FF3D] flex items-center justify-center text-[11px] font-bold">
                          A
                        </div>
                        <div>
                          <div className="text-white font-medium">Aman (Pasta + Tea)</div>
                          <div className="text-[10px] text-white/40">Assigned automatically via OCR</div>
                        </div>
                      </div>
                      <span className="text-[#C6FF3D] font-bold">₹660.00</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#0B0C16] border border-white/10 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#0082FB]/20 text-[#0082FB] flex items-center justify-center text-[11px] font-bold">
                          P
                        </div>
                        <div>
                          <div className="text-white font-medium">Priya (Garlic Bread + Tea)</div>
                          <div className="text-[10px] text-white/40">Shared items split evenly</div>
                        </div>
                      </div>
                      <span className="text-[#0082FB] font-bold">₹474.00</span>
                    </div>

                    <div className="p-2 rounded-xl bg-gradient-to-r from-[#C6FF3D]/15 to-[#0082FB]/15 border border-[#C6FF3D]/30 flex items-center justify-between text-[11px]">
                      <span className="text-white/90 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C6FF3D]" />
                        Ready to request in 1-tap
                      </span>
                      <span className="text-white font-bold font-mono">₹1,134.00 total</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Bottom Proof Badges */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3 text-xs font-mono text-white/60">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#C6FF3D] flex items-center gap-1">
                <Check className="w-3 h-3" /> Reads physical receipt paper
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#C6FF3D] flex items-center gap-1">
                <Check className="w-3 h-3" /> GPay / PhonePe / Paytm screenshots
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#C6FF3D] flex items-center gap-1">
                <Check className="w-3 h-3" /> Auto-splits taxes & tips
              </span>
            </div>
          </div>

          {/* =========================================================================
              CARD 2 (SUPPORTING - 4 Columns on Desktop): Auto-pay for recurring bills
              Visual Demo: PG rent / Mess Subscriptions via Razorpay Subscriptions
             ========================================================================= */}
          <div 
            onMouseEnter={() => sound.playHover()}
            className="md:col-span-12 lg:col-span-4 p-5 sm:p-7 rounded-3xl bg-[#15162B]/85 hover:bg-[#181932] border border-white/10 hover:border-[#0082FB]/50 transition-all duration-300 group flex flex-col justify-between glass-card relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#0082FB]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#0082FB]/15 text-[#0082FB] flex items-center justify-center shadow-lg shadow-[#0082FB]/10">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-[#0082FB] px-2.5 py-1 rounded-md bg-[#0082FB]/10 border border-[#0082FB]/20 font-bold">
                  UPI AUTOPAY
                </span>
              </div>

              <div>
                <span className="text-xs font-mono text-[#0082FB] uppercase tracking-wider font-bold block">
                  FEATURE 02 • RECURRING RAILS
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk'] group-hover:text-[#0082FB] transition-colors mt-1">
                  2. Auto-pay for recurring bills
                </h3>
              </div>

              <p className="text-sm text-white/70 leading-relaxed">
                Set up PG rent, mess bills, or monthly subscriptions once. SplitPay auto-deducts each member's share every month via Razorpay Subscriptions — nobody has to remember, nobody has to remind.
              </p>

              {/* Visual Demo Card */}
              <div className="p-4 rounded-2xl bg-[#0B0C16] border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <Repeat className="w-3.5 h-3.5 text-[#0082FB]" />
                    Flat 302 PG Rent
                  </span>
                  <span className="text-[#0082FB] text-[11px] font-bold">1st of Month</span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between p-1.5 rounded bg-white/5 text-white/70">
                    <span>Rahul (Room A)</span>
                    <span className="text-[#C6FF3D] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> ₹8,500 Auto-debited
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-white/5 text-white/70">
                    <span>Aryan (Room B)</span>
                    <span className="text-[#C6FF3D] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> ₹8,500 Auto-debited
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-[#0082FB]/10 border border-[#0082FB]/20 text-[10px] text-[#0082FB] flex items-center justify-between">
                  <span>Powered by Razorpay e-Mandates</span>
                  <span className="font-bold">Zero Reminders Sent</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>PG Rent • Mess • Netflix 4K</span>
              <span className="text-[#0082FB]">Auto-cleared ✓</span>
            </div>
          </div>

          {/* =========================================================================
              CARD 3 (SUPPORTING - 4 Columns on Desktop): Group Wallet for trips
              Visual Demo: Shared trip pool with zero mid-trip chasing & auto settle-up
             ========================================================================= */}
          <div 
            onMouseEnter={() => sound.playHover()}
            className="md:col-span-12 lg:col-span-4 p-5 sm:p-7 rounded-3xl bg-[#15162B]/85 hover:bg-[#181932] border border-white/10 hover:border-[#C6FF3D]/50 transition-all duration-300 group flex flex-col justify-between glass-card relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C6FF3D]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#C6FF3D]/15 text-[#C6FF3D] flex items-center justify-center shadow-lg shadow-[#C6FF3D]/10">
                  <Wallet className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-[#C6FF3D] px-2.5 py-1 rounded-md bg-[#C6FF3D]/10 border border-[#C6FF3D]/20 font-bold">
                  SHARED POOL
                </span>
              </div>

              <div>
                <span className="text-xs font-mono text-[#C6FF3D] uppercase tracking-wider font-bold block">
                  FEATURE 03 • TRIP POOLING
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk'] group-hover:text-[#C6FF3D] transition-colors mt-1">
                  3. Group Wallet for trips
                </h3>
              </div>

              <p className="text-sm text-white/70 leading-relaxed">
                Before a trip, everyone contributes to one shared pool. All trip expenses — cabs, food, tickets — get paid straight from the wallet, so nobody's chasing anyone mid-trip. Settle-up happens automatically at the end.
              </p>

              {/* Trip Pool Visual Card */}
              <div className="p-4 rounded-2xl bg-[#0B0C16] border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 gap-2">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <Plane className="w-3.5 h-3.5 text-[#C6FF3D] shrink-0" />
                    {isEditingDestination ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (tempDestination.trim()) {
                            setTripDestination(tempDestination.trim());
                          }
                          setIsEditingDestination(false);
                          sound.playUpiSuccess();
                        }}
                        className="flex items-center gap-1.5 flex-1"
                      >
                        <input
                          type="text"
                          value={tempDestination}
                          onChange={(e) => setTempDestination(e.target.value)}
                          autoFocus
                          className="bg-white/10 text-white font-bold px-2 py-0.5 rounded border border-[#C6FF3D]/60 text-xs focus:outline-none focus:ring-1 focus:ring-[#C6FF3D] w-full max-w-[130px]"
                          placeholder="e.g. Manali, Dubai"
                        />
                        <button
                          type="submit"
                          className="text-[#0B0C16] bg-[#C6FF3D] text-[10px] font-bold px-2 py-0.5 rounded hover:bg-[#b0f52b] cursor-pointer shrink-0"
                        >
                          Save
                        </button>
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setTempDestination(tripDestination);
                          setIsEditingDestination(true);
                        }}
                        className="group/edit flex items-center gap-1.5 text-white font-bold hover:text-[#C6FF3D] transition-colors cursor-pointer text-left truncate"
                        title="Click to edit trip destination"
                      >
                        <span className="truncate">{tripDestination} Trip 2025 Pool</span>
                        <Pencil className="w-3 h-3 text-white/40 group-hover/edit:text-[#C6FF3D] shrink-0 transition-colors" />
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-[#C6FF3D] font-bold shrink-0">₹24,000 Total</span>
                </div>

                {/* Quick Destination Switcher Pills */}
                <div className="flex flex-wrap items-center gap-1 pt-0.5 pb-1">
                  <span className="text-[10px] text-white/40 mr-0.5 flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" /> Destination:
                  </span>
                  {tripPresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setTripDestination(preset.name);
                        setTempDestination(preset.name);
                        setIsEditingDestination(false);
                      }}
                      className={`px-1.5 py-0.5 rounded text-[10px] transition-all cursor-pointer ${
                        tripDestination.toLowerCase() === preset.name.toLowerCase()
                          ? 'bg-[#C6FF3D]/20 text-[#C6FF3D] border border-[#C6FF3D]/40 font-bold'
                          : 'bg-white/5 text-white/50 hover:text-white border border-transparent'
                      }`}
                    >
                      {preset.icon} {preset.name}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setTempDestination(tripDestination);
                      setIsEditingDestination(true);
                    }}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-white/50 hover:text-[#C6FF3D] transition-all cursor-pointer"
                  >
                    ✏️ Custom
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  {currentExpenses.map((exp, i) => (
                    <div key={i} className="flex items-center justify-between p-1.5 rounded bg-white/5 text-white/70">
                      <span className="truncate mr-2">{exp.name}</span>
                      <span className="text-[#FF6B4A] font-bold shrink-0">-{exp.amount}</span>
                    </div>
                  ))}
                </div>

                <div className="p-2 rounded-lg bg-[#C6FF3D]/10 border border-[#C6FF3D]/20 text-[10px] text-[#C6FF3D] flex items-center justify-between">
                  <span>Remaining: ₹16,750</span>
                  <span className="font-bold">Auto-refund on return</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>Nobody pays out-of-pocket</span>
              <span className="text-[#C6FF3D]">1-tap QR pay</span>
            </div>
          </div>

          {/* =========================================================================
              CARD 4 (SUPPORTING - 4 Columns on Desktop): Reminders that actually work
              Visual Demo: Interactive 3-stage escalation ladder (Friendly → Meme → Callout)
             ========================================================================= */}
          <div 
            onMouseEnter={() => sound.playHover()}
            className="md:col-span-12 lg:col-span-4 p-5 sm:p-7 rounded-3xl bg-[#15162B]/85 hover:bg-[#181932] border border-white/10 hover:border-[#FF6B4A]/50 transition-all duration-300 group flex flex-col justify-between glass-card relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF6B4A]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#FF6B4A]/15 text-[#FF6B4A] flex items-center justify-center shadow-lg shadow-[#FF6B4A]/10">
                  <BellRing className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-[#FF6B4A] px-2.5 py-1 rounded-md bg-[#FF6B4A]/10 border border-[#FF6B4A]/20 font-bold">
                  PEER PRESSURE
                </span>
              </div>

              <div>
                <span className="text-xs font-mono text-[#FF6B4A] uppercase tracking-wider font-bold block">
                  FEATURE 04 • SMART ESCALATION
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk'] group-hover:text-[#FF6B4A] transition-colors mt-1">
                  4. Reminders that actually work
                </h3>
              </div>

              <p className="text-sm text-white/70 leading-relaxed">
                A friendly nudge first. Then a funnier one. If it's still pending, SplitPay posts a lighthearted public callout in the group — peer pressure, gamified, without anyone having to send an awkward DM.
              </p>

              {/* Interactive 3-Stage Escalation Ladder Preview */}
              <div className="p-4 rounded-2xl bg-[#0B0C16] border border-white/10 space-y-3 font-mono text-xs">
                {/* 3 Steps selector */}
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-white/5 border border-white/10 text-[11px] text-center">
                  {escalationStages.map((stage, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setActiveEscalation(idx);
                      }}
                      className={`py-1 rounded-lg transition-all cursor-pointer ${
                        activeEscalation === idx
                          ? `${stage.pillColor} bg-white/10 font-bold border`
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      {stage.level}
                    </button>
                  ))}
                </div>

                {/* Escalation Stage Message Card */}
                <div className={`p-3 rounded-xl border space-y-1.5 transition-all ${escalationStages[activeEscalation].color}`}>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      {activeEscalation === 0 && <MessageSquare className="w-3 h-3" />}
                      {activeEscalation === 1 && <Laugh className="w-3 h-3" />}
                      {activeEscalation === 2 && <Flame className="w-3 h-3" />}
                      {escalationStages[activeEscalation].badge}
                    </span>
                    <span className="opacity-70">{escalationStages[activeEscalation].time}</span>
                  </div>
                  <p className="text-white text-xs leading-snug font-sans font-medium">
                    "{escalationStages[activeEscalation].message}"
                  </p>
                </div>

                <div className="text-[10px] text-white/40 flex items-center justify-between pt-1">
                  <span>94% cleared before Stage 3</span>
                  <span className="text-[#C6FF3D]">0 Awkward DMs</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>Friendly ➔ Meme ➔ Public Callout</span>
              <span className="text-[#FF6B4A]">Auto-pilot</span>
            </div>
          </div>

          {/* =========================================================================
              CARD 5 (SUPPORTING - 4 Columns on Desktop): Split by what you actually ordered
              Visual Demo: Precise item-to-person mapping (Extra cheese argument killer)
             ========================================================================= */}
          <div 
            onMouseEnter={() => sound.playHover()}
            className="md:col-span-12 lg:col-span-4 p-5 sm:p-7 rounded-3xl bg-[#15162B]/85 hover:bg-[#181932] border border-white/10 hover:border-[#C6FF3D]/50 transition-all duration-300 group flex flex-col justify-between glass-card relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C6FF3D]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#C6FF3D]/15 text-[#C6FF3D] flex items-center justify-center shadow-lg shadow-[#C6FF3D]/10">
                  <Utensils className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-[#C6FF3D] px-2.5 py-1 rounded-md bg-[#C6FF3D]/10 border border-[#C6FF3D]/20 font-bold">
                  PRECISION CALC
                </span>
              </div>

              <div>
                <span className="text-xs font-mono text-[#C6FF3D] uppercase tracking-wider font-bold block">
                  FEATURE 05 • ZERO-ARGUMENT SPLIT
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk'] group-hover:text-[#C6FF3D] transition-colors mt-1">
                  5. Split by what you actually ordered
                </h3>
              </div>

              <p className="text-sm text-white/70 leading-relaxed">
                Assign each item on the bill to the person who ordered it. SplitPay calculates exact shares — no more <span className="text-white font-medium italic">"why am I paying for your extra cheese"</span> arguments.
              </p>

              {/* Exact Item Assignment Visual Card */}
              <div className="p-4 rounded-2xl bg-[#0B0C16] border border-white/10 space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px]">
                  <span className="text-white/60">ITEM</span>
                  <span className="text-white/60">ASSIGNED TO</span>
                </div>

                <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-[11px]">
                  <div>
                    <div className="text-white font-medium">Double Cheese Burger</div>
                    <div className="text-[10px] text-[#FF6B4A]">Includes +₹60 Extra Cheese</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-[#FF6B4A]/20 text-[#FF6B4A] text-[10px] font-bold">
                      @Aman Only
                    </span>
                    <div className="text-white font-bold text-xs mt-0.5">₹340</div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-[11px]">
                  <div>
                    <div className="text-white font-medium">Basic Greek Salad</div>
                    <div className="text-[10px] text-[#C6FF3D]">No dairy / vegan share</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-[#C6FF3D]/20 text-[#C6FF3D] text-[10px] font-bold">
                      @Sneha Only
                    </span>
                    <div className="text-white font-bold text-xs mt-0.5">₹160</div>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-[#C6FF3D]/10 border border-[#C6FF3D]/20 text-[10px] text-[#C6FF3D] flex items-center justify-between">
                  <span>Taxes & Service Charge</span>
                  <span className="font-bold">Split Pro-Rata</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>Fair to the exact rupee</span>
              <span className="text-[#C6FF3D]">Zero Friendship Drama</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default FeaturesGrid;
