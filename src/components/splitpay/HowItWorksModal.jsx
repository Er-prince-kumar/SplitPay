import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Share2, 
  Zap, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Users, 
  Smartphone, 
  Sparkles, 
  Play, 
  Pause,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

const stepsData = [
  {
    step: "01",
    tag: "BILL CREATION",
    title: "Create Bill & Add Squad",
    desc: "Set the total event or trip expense, add your hostel roommates or trip squad, and let SplitPay calculate exact shares automatically.",
    badge: "Auto-Calculated in 5s",
    badgeColor: "text-[#C6FF3D] bg-[#C6FF3D]/10 border-[#C6FF3D]/30",
    previewType: "bill"
  },
  {
    step: "02",
    tag: "WHATSAPP DISPATCH",
    title: "Send 1-Tap Links on WhatsApp",
    desc: "No app download required for friends! Each member receives a personalized WhatsApp payment link with pre-filled UPI details.",
    badge: "Zero App Download Required",
    badgeColor: "text-[#0082FB] bg-[#0082FB]/10 border-[#0082FB]/30",
    previewType: "whatsapp"
  },
  {
    step: "03",
    tag: "INSTANT UPI SETTLEMENT",
    title: "1-Tap UPI Payment & Auto-Settle",
    desc: "Friends tap the link to open GPay, PhonePe, or Paytm. Funds go straight to the Host's bank account with zero platform fees.",
    badge: "Direct Bank-to-Bank • 0% Fee",
    badgeColor: "text-[#25D366] bg-[#25D366]/10 border-[#25D366]/30",
    previewType: "settle"
  }
];

const HowItWorksModal = ({ isOpen, onClose, onOpenSplitter }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play steps when active
  useEffect(() => {
    let interval = null;
    if (isOpen && isPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % stepsData.length);
      }, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const current = stepsData[activeStep];

  const handleNext = () => {
    sound.playClick();
    if (activeStep < stepsData.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      // Finished all steps: celebrate!
      sound.playUpiSuccess();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C6FF3D', '#0082FB', '#25D366']
      });
      if (onOpenSplitter) {
        onOpenSplitter();
      }
      onClose();
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleSelectStep = (idx) => {
    sound.playClick();
    setActiveStep(idx);
  };

  const handleStartSplitter = () => {
    sound.playClick();
    sound.playUpiSuccess();
    if (onOpenSplitter) {
      onOpenSplitter();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto">
      <div className="w-full max-w-2xl my-auto max-h-[92vh] overflow-y-auto rounded-3xl bg-[#14152A] border border-[#C6FF3D]/40 p-5 sm:p-7 text-white shadow-2xl shadow-[#C6FF3D]/10 relative glass-card animate-in zoom-in-95 duration-200 space-y-6">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#C6FF3D]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-[#0082FB]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1B1B3A] border border-[#C6FF3D]/50 flex items-center justify-center text-[#C6FF3D] font-mono font-bold text-xs shadow-sm">
              <Zap className="w-4 h-4 text-[#C6FF3D]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg font-['Space_Grotesk'] text-white">
                  How SplitPay Works
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#C6FF3D]/15 text-[#C6FF3D] text-[10px] font-mono font-bold border border-[#C6FF3D]/30">
                  Interactive Demo
                </span>
              </div>
              <p className="text-[11px] font-mono text-white/50">
                From group expense to 100% settled in under 60 seconds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-play demo toggle */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsPlaying(prev => !prev);
              }}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                isPlaying 
                  ? 'bg-[#C6FF3D]/20 text-[#C6FF3D] border-[#C6FF3D]/40' 
                  : 'bg-white/5 text-white/60 border-white/10 hover:text-white'
              }`}
              title={isPlaying ? "Pause auto-play" : "Auto-play walkthrough"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline font-mono text-[10px]">
                {isPlaying ? "Auto: ON" : "Auto Play"}
              </span>
            </button>

            {/* Close Button */}
            <button 
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3 Step Navigation Pills */}
        <div className="grid grid-cols-3 gap-2 relative z-10">
          {stepsData.map((s, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectStep(idx)}
                className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isActive 
                    ? 'bg-[#1D1E3A] border-[#C6FF3D] shadow-md shadow-[#C6FF3D]/10' 
                    : 'bg-[#0E0F1E] border-white/10 hover:border-white/20 text-white/60 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                  <span className={`font-bold ${isActive ? 'text-[#C6FF3D]' : 'text-white/40'}`}>
                    STEP {s.step}
                  </span>
                  {idx < activeStep && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#25D366]" />
                  )}
                </div>
                <div className={`text-xs font-bold font-['Space_Grotesk'] truncate ${isActive ? 'text-white' : 'text-white/70'}`}>
                  {s.title}
                </div>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C6FF3D] to-[#0082FB]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Step Content & Interactive Preview Mockup */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0B0C18] border border-white/10 space-y-5 relative z-10">
          
          {/* Header & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${current.badgeColor}`}>
                  {current.tag}
                </span>
                <span className="text-xs font-mono text-white/50">
                  Step {activeStep + 1} of 3
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-black text-white font-['Space_Grotesk']">
                {current.title}
              </h4>
            </div>
            <span className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border shrink-0 ${current.badgeColor}`}>
              {current.badge}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
            {current.desc}
          </p>

          {/* Dynamic Interactive Visual Mockup Container */}
          <div className="rounded-xl overflow-hidden border border-white/10 bg-[#121324] p-4 sm:p-5">
            
            {/* PREVIEW 1: Bill Creation Preview */}
            {current.previewType === 'bill' && (
              <div className="space-y-3.5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-xs font-mono text-white/60 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C6FF3D]" />
                    <span className="font-bold text-white">Goa Weekend Shack Split</span>
                  </div>
                  <span className="text-[#C6FF3D] font-bold">Total: ₹8,000</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#0B0C16] border border-white/10 space-y-1">
                    <div className="text-[10px] text-white/50">Prince (Host)</div>
                    <div className="font-bold text-white">₹2,000</div>
                    <span className="text-[9px] text-[#C6FF3D] font-bold block">✓ Paid</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0B0C16] border border-white/10 space-y-1">
                    <div className="text-[10px] text-white/50">Vicky R.</div>
                    <div className="font-bold text-white">₹2,000</div>
                    <span className="text-[9px] text-amber-400 font-bold block">⏳ Pending</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0B0C16] border border-white/10 space-y-1">
                    <div className="text-[10px] text-white/50">Rahul S.</div>
                    <div className="font-bold text-white">₹2,000</div>
                    <span className="text-[9px] text-amber-400 font-bold block">⏳ Pending</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0B0C16] border border-white/10 space-y-1">
                    <div className="text-[10px] text-white/50">Neha T.</div>
                    <div className="font-bold text-white">₹2,000</div>
                    <span className="text-[9px] text-amber-400 font-bold block">⏳ Pending</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-white/50 pt-1">
                  <span>Equally Split (₹2,000 × 4)</span>
                  <span className="text-[#C6FF3D] font-bold">1-Tap Ready</span>
                </div>
              </div>
            )}

            {/* PREVIEW 2: WhatsApp Link Dispatch Preview */}
            {current.previewType === 'whatsapp' && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-mono text-[#25D366]">
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-bold">WhatsApp Direct Message Preview</span>
                </div>

                {/* WhatsApp Chat Bubble Mockup */}
                <div className="p-3.5 rounded-2xl rounded-tl-none bg-[#075E54]/30 border border-[#25D366]/30 space-y-2 text-xs text-white/90">
                  <div className="text-[11px] font-bold text-[#25D366]">
                    SplitPay • Goa Trip Bill 🏖️
                  </div>
                  <p className="text-xs leading-relaxed">
                    Hey Vicky! Prince created a bill split for <strong>Goa Trip</strong>. Your share is <strong>₹2,000</strong>.
                  </p>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-[#C6FF3D] truncate">
                      splitpay.me/pay/goa-204
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#25D366] text-black font-bold text-[10px] shrink-0">
                      1-Tap Pay
                    </span>
                  </div>
                  <div className="text-[10px] text-white/40 text-right font-mono">10:42 PM • Delivered</div>
                </div>
              </div>
            )}

            {/* PREVIEW 3: Instant UPI Settlement */}
            {current.previewType === 'settle' && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-white/10">
                  <span className="text-white/60">Verified Settlement Rail</span>
                  <span className="text-[#25D366] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Direct Bank Transfer
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0B0C16] border border-[#25D366]/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] font-bold text-base">
                      ₹
                    </div>
                    <div>
                      <div className="text-white font-bold text-xs font-mono">
                        Vicky paid ₹2,000 via UPI
                      </div>
                      <div className="text-[10px] text-white/40 font-mono">
                        Direct to prince@oksbi • Razorpay Rails
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#25D366]/15 text-[#25D366] font-mono text-[10px] font-bold border border-[#25D366]/30">
                    SETTLED
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-white/60">
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">GPay Supported</div>
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">PhonePe Supported</div>
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">Paytm / BHIM</div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Modal Controls: Next, Prev, and Create Split CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 relative z-10 border-t border-white/10">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrev}
              disabled={activeStep === 0}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeStep === 0 
                  ? 'opacity-40 cursor-not-allowed border-white/10 text-white/40' 
                  : 'bg-white/5 hover:bg-white/10 border-white/15 text-white'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{activeStep < stepsData.length - 1 ? 'Next Step' : 'Finish Tour'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C6FF3D]" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleStartSplitter}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#C6FF3D] hover:bg-[#b5f422] text-[#0B0C16] font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-[#C6FF3D]/20 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0B0C16]" />
            <span>Create a Split Bill Now</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0B0C16]" />
          </button>

        </div>

      </div>
    </div>
  );
};

export default HowItWorksModal;
