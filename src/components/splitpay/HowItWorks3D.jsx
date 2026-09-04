import React, { useState } from 'react';
import { 
  FileText, 
  Share2, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  MessageCircle, 
  Smartphone, 
  ShieldCheck,
  CreditCard,
  QrCode
} from 'lucide-react';
import { sound } from '../../utils/audio';

const HowItWorks3D = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: "Create the bill",
      shortDesc: "Add total amount & squad",
      fullDesc: "Add the total amount and the people involved. SplitPay works out each person's share automatically with instant itemized adjustments.",
      tag: "AUTO-SPLIT ENGINE",
      icon: <FileText className="w-5 h-5 text-[#C6FF3D]" />
    },
    {
      step: 2,
      title: "Everyone gets a link",
      shortDesc: "Razorpay links via WhatsApp",
      fullDesc: "Each friend receives their own Razorpay payment link — by WhatsApp, SMS, or in-app. Zero app download required for friends to pay.",
      tag: "NO APP INSTALL REQUIRED",
      icon: <Share2 className="w-5 h-5 text-[#0082FB]" />
    },
    {
      step: 3,
      title: "Pay in one tap",
      shortDesc: "UPI in seconds & real-time settle",
      fullDesc: "They pay by UPI in seconds through their existing GPay, PhonePe, or Paytm. You watch the bill settle in real time, no reminders needed.",
      tag: "100% REMINDER-FREE",
      icon: <Zap className="w-5 h-5 text-[#FF6B4A]" />
    }
  ];

  const handleStepClick = (stepId) => {
    sound.playClick();
    setActiveStep(stepId);
  };

  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 bg-[#0D0E1C] overflow-hidden w-full">
      
      {/* Ambient Lighting */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#C6FF3D]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#0082FB]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-[#C6FF3D] text-xs font-mono font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-current" />
            3 SIMPLE STEPS
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">
            How{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6FF3D] to-[#0082FB]">
              SplitPay works
            </span>
          </h2>

          <p className="text-base sm:text-lg text-white/70">
            From chaotic receipt to 100% settled in less than 60 seconds.
          </p>
        </div>

        {/* Step Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {steps.map((s) => {
            const isActive = activeStep === s.step;
            return (
              <button
                key={s.step}
                onClick={() => handleStepClick(s.step)}
                className={`p-6 rounded-3xl border text-left transition-all duration-300 relative cursor-pointer ${
                  isActive 
                    ? 'bg-[#1B1B3A] border-[#C6FF3D] shadow-xl shadow-[#C6FF3D]/10' 
                    : 'bg-[#15162B]/60 border-white/10 hover:bg-[#15162B] hover:border-white/20'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 right-6 -translate-y-1/2 px-3 py-0.5 rounded-full bg-[#C6FF3D] text-[#0B0C16] text-[10px] font-mono font-bold tracking-widest uppercase">
                    ACTIVE STAGE
                  </span>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="font-mono text-2xl font-black text-white/30">
                    0{s.step}
                  </span>
                </div>

                <div className="text-xs font-mono text-[#C6FF3D] uppercase tracking-wider mb-1">
                  {s.tag}
                </div>
                <div className="text-xl font-bold text-white font-['Space_Grotesk'] mb-2">
                  {s.title}
                </div>
                <div className="text-xs text-white/60 leading-relaxed">
                  {s.fullDesc}
                </div>
              </button>
            );
          })}
        </div>

        {/* 3D Interactive Stage Visualization */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#15162B]/90 border border-white/10 glass-card glass-card-glow relative overflow-hidden">
          
          {/* Stage 1 Visual: Create the Bill */}
          {activeStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in zoom-in-95 duration-300">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-block px-3 py-1 rounded-md bg-[#C6FF3D]/15 text-[#C6FF3D] text-xs font-mono font-bold">
                  STEP 01 IN ACTION
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk']">
                  Add total amount, pick friends, auto-split handles the rest.
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  No spreadsheet formulas. Enter ₹4,200 for your hostel dinner, select 4 friends, and SplitPay computes individual totals even if someone opted out of starters.
                </p>
                <div className="p-4 rounded-2xl bg-[#0B0C16] border border-white/10 font-mono text-xs space-y-2">
                  <div className="flex justify-between text-white/50">
                    <span>HOSTEL DINNER BILL</span>
                    <span className="text-white font-bold">₹4,200</span>
                  </div>
                  <div className="flex justify-between text-[#C6FF3D]">
                    <span>4 FRIENDS (EQUAL SHARE)</span>
                    <span className="font-bold">₹1,050 / person</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 flex justify-center w-full">
                <div className="w-full p-6 rounded-2xl bg-[#0B0C16] border border-[#C6FF3D]/30 shadow-2xl space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-white font-bold text-sm font-['Space_Grotesk']">SplitPay Bill Creator</span>
                    <span className="text-[#C6FF3D] bg-[#C6FF3D]/10 px-2 py-0.5 rounded text-[10px]">READY TO SEND</span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <span className="text-white/60">Total Bill Amount:</span>
                      <span className="text-xl font-black text-white font-['Space_Grotesk']">₹4,200.00</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <span className="text-white/60">Split Mode:</span>
                      <span className="text-[#C6FF3D] font-bold">4 Equal Splits (₹1,050 each)</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveStep(2)}
                    className="w-full py-3 rounded-xl bg-[#C6FF3D] text-[#0B0C16] font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] flex items-center justify-center gap-2 hover:bg-[#b2f022] cursor-pointer"
                  >
                    <span>Generate Razorpay Links</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stage 2 Visual: Everyone gets a link */}
          {activeStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in zoom-in-95 duration-300">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-block px-3 py-1 rounded-md bg-[#0082FB]/15 text-[#0082FB] text-xs font-mono font-bold">
                  STEP 02 IN ACTION
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk']">
                  One tap to WhatsApp. No app install required for friends.
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Your friends don't need another app crowding their phone storage. They receive an authenticated Razorpay Smart Link directly on WhatsApp or SMS with the exact amount pre-filled.
                </p>
                <div className="p-4 rounded-2xl bg-[#0B0C16] border border-white/10 font-mono text-xs space-y-2">
                  <div className="flex items-center gap-2 text-[#25D366]">
                    <MessageCircle className="w-4 h-4" />
                    <span>INSTANT WHATSAPP DISPATCH</span>
                  </div>
                  <div className="text-white/70 text-[11px]">
                    "Hey Aman! Your share for the Goa Cab is ₹1,850. Pay with 1 tap via UPI here: <span className="text-[#0082FB] underline">rzp.io/l/splitpay-goa-aman</span>"
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 flex justify-center w-full">
                <div className="w-full p-6 rounded-2xl bg-[#0B0C16] border border-[#0082FB]/40 shadow-2xl space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-white font-bold text-sm font-['Space_Grotesk']">Razorpay Payment Link</span>
                    <span className="text-[#0082FB] bg-[#0082FB]/10 px-2 py-0.5 rounded text-[10px]">VERIFIED URL</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0C2340] border border-[#0082FB]/30 text-center space-y-2">
                    <div className="text-xs text-white/60">PAYMENT SECURED BY RAZORPAY</div>
                    <div className="text-2xl font-black text-white font-['Space_Grotesk']">₹1,850.00</div>
                    <div className="text-[10px] text-[#C6FF3D]">Supports GPay, PhonePe, Paytm, CRED, Cards</div>
                  </div>

                  <button 
                    onClick={() => setActiveStep(3)}
                    className="w-full py-3 rounded-xl bg-[#0082FB] text-white font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] flex items-center justify-center gap-2 hover:bg-[#0071da] cursor-pointer"
                  >
                    <span>Simulate Friend's 1-Tap Pay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stage 3 Visual: Pay in one tap */}
          {activeStep === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in zoom-in-95 duration-300">
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-block px-3 py-1 rounded-md bg-[#C6FF3D]/15 text-[#C6FF3D] text-xs font-mono font-bold">
                  STEP 03 IN ACTION
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk']">
                  They pay by UPI in seconds. Zero awkward reminder texts.
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Your friend clicks the link, their favorite UPI app opens with one tap, they authorize with their UPI PIN, and the money lands straight into your bank account.
                </p>
                <div className="p-4 rounded-2xl bg-[#0B0C16] border border-white/10 font-mono text-xs space-y-2">
                  <div className="flex items-center gap-2 text-[#C6FF3D]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>AUTOMATIC LEDGER SETTLEMENT</span>
                  </div>
                  <div className="text-white/70 text-[11px]">
                    No screenshots needed. No checking bank SMS. SplitPay marks them paid in real-time.
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 flex justify-center w-full">
                <div className="w-full p-6 rounded-2xl bg-[#0B0C16] border border-[#C6FF3D]/50 shadow-2xl space-y-4 font-mono text-xs">
                  <div className="text-center py-4 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-[#C6FF3D]/20 text-[#C6FF3D] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div className="text-xl font-bold text-white font-['Space_Grotesk']">
                      Payment Successful!
                    </div>
                    <div className="text-xs text-[#C6FF3D]">
                      ₹1,850.00 Settled via Razorpay UPI Rail
                    </div>
                    <div className="text-[10px] text-white/40">
                      Transaction ID: pay_N719ks820 | Bank Status: Credited
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveStep(1)}
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] cursor-pointer"
                  >
                    Start Over from Step 01
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default HowItWorks3D;
