import { ArrowRight, Sparkles, Zap, Play, ShieldCheck, Smartphone } from 'lucide-react';
import { sound } from '../../utils/audio';

const Hero3D = ({ onOpenWaitlist, onOpenDemo, onOpenHowItWorks, onOpenAuth }) => {
  const handleGetStarted = () => {
    sound.playClick();
    if (onOpenAuth) {
      onOpenAuth();
    } else if (onOpenDemo) {
      onOpenDemo();
    }
  };

  const handleHowItWorks = () => {
    sound.playClick();
    if (onOpenHowItWorks) {
      onOpenHowItWorks();
    }
  };

  return (
    <section className="relative flex-1 flex items-center py-4 sm:py-6 px-3 sm:px-5 md:px-6 lg:px-8 overflow-hidden w-full">
      <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
        
        {/* Left: Value Proposition */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-left">
          
          {/* Subtle Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80">
            <span className="w-2 h-2 rounded-full bg-[#C6FF3D]" />
            <span>Campus Bill Splitting • 1-Tap UPI</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-['Space_Grotesk'] leading-[1.1]">
            Split the bill. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6FF3D] to-[#0082FB]">
              Not the friendship.
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-lg font-normal">
            Turn group expenses into one shared bill your friends can pay in 1 tap via UPI. Zero app download required for friends to settle.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleGetStarted}
              className="px-5 sm:px-6 py-3 rounded-xl bg-[#C6FF3D] text-[#0B0C16] font-bold text-sm sm:text-base hover:bg-[#b5f422] active:scale-95 transition-all shadow-md shadow-[#C6FF3D]/10 flex items-center gap-2 font-['Space_Grotesk'] cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleHowItWorks}
              className="px-4 sm:px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium text-sm sm:text-base transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#C6FF3D]" />
              <span>How it works</span>
            </button>
          </div>

          {/* Simple Trust Bullets */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 sm:gap-4 text-[11px] sm:text-xs text-white/60 font-mono">
            <div>
              <div className="text-white font-bold text-sm font-['Space_Grotesk']">1-Tap UPI</div>
              <div className="text-white/50 text-[10px] sm:text-xs">GPay, PhonePe, Paytm</div>
            </div>
            <div>
              <div className="text-white font-bold text-sm font-['Space_Grotesk']">Zero Install</div>
              <div className="text-white/50 text-[10px] sm:text-xs">Direct Web Links</div>
            </div>
            <div>
              <div className="text-white font-bold text-sm font-['Space_Grotesk']">Instant Settle</div>
              <div className="text-white/50 text-[10px] sm:text-xs">Direct Bank Transfer</div>
            </div>
          </div>

        </div>

        {/* Right: Welcome to SplitPay Portal Card */}
        <div className="lg:col-span-6 w-full max-w-lg mx-auto lg:max-w-none">
          <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-[#14162B] via-[#101124] to-[#0A0B16] border border-white/15 shadow-2xl space-y-4 overflow-hidden">
            
            {/* Background Ambient Glow */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#C6FF3D]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#0082FB]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Card Header */}
            <div className="relative flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">👋</span>
                <span className="text-sm sm:text-base font-bold text-white font-['Space_Grotesk']">
                  Welcome to SplitPay
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] animate-ping" />
                Live &amp; Ready
              </span>
            </div>

            {/* Welcoming Message */}
            <div className="relative space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk']">
                Your Campus &amp; Trip Expense Hub
              </h2>
              <p className="text-xs text-white/60 leading-relaxed">
                No awkward follow-ups. Split bills with friends and get paid directly to your UPI bank account in seconds.
              </p>
            </div>

            {/* 3 Welcome Highlights */}
            <div className="relative space-y-2 pt-1">
              <div className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-colors flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C6FF3D]/15 text-[#C6FF3D] flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white font-['Space_Grotesk']">1-Tap Direct UPI Payments</div>
                  <div className="text-[10px] text-white/50">Instant settle via GPay, PhonePe, and Paytm</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-colors flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0082FB]/15 text-[#0082FB] flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white font-['Space_Grotesk']">Zero App Download Needed</div>
                  <div className="text-[10px] text-white/50">Share a link on WhatsApp, friends settle in browser</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-colors flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white font-['Space_Grotesk']">Smart WhatsApp Nudges</div>
                  <div className="text-[10px] text-white/50">Send polite, automated payment reminder links</div>
                </div>
              </div>
            </div>

            {/* Welcome Actions */}
            <div className="relative pt-1 space-y-2">
              <button
                onClick={handleGetStarted}
                className="w-full py-2.5 rounded-xl bg-[#C6FF3D] hover:bg-[#b5f422] text-[#0B0C16] font-bold text-xs sm:text-sm font-['Space_Grotesk'] transition-all flex items-center justify-center gap-2 shadow-md shadow-[#C6FF3D]/10 active:scale-95 cursor-pointer"
              >
                <span>Sign In / Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/40 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C6FF3D]" />
                <span>100% Free &bull; Razorpay Rails &bull; Safe Bank Settle</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero3D;
