import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, Zap, Server, Award } from 'lucide-react';
import { sound } from '../../utils/audio';

const TrustRazorpay = () => {
  return (
    <section id="trust" className="relative py-20 sm:py-28 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 bg-[#0D0E1C] overflow-hidden w-full">
      
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#0082FB]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="w-full relative z-10">
        
        {/* Holographic Security Vault Card */}
        <div className="p-5 sm:p-10 lg:p-14 rounded-3xl bg-gradient-to-br from-[#0C2340] via-[#15162B] to-[#0B0C16] border border-[#0082FB]/40 shadow-2xl shadow-[#0082FB]/10 relative overflow-hidden">
          
          {/* Subtle Ambient Razorpay Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0082FB]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Copy Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge from Brief */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0082FB]/20 border border-[#0082FB]/50 text-[#0082FB] text-xs font-mono font-bold tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#0082FB]" />
                <span>POWERED BY RAZORPAY</span>
              </div>

              {/* Heading from Brief */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight leading-tight">
                Built on Razorpay's payment infrastructure.
              </h2>

              {/* Text from Brief */}
              <p className="text-base sm:text-lg text-white/80 leading-relaxed font-light">
                SplitPay uses Razorpay Payment Links and UPI to move money safely between friends — the same rails trusted by India's largest businesses.
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-mono">
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-white/80">
                  <Lock className="w-4 h-4 text-[#C6FF3D]" />
                  <span>256-Bit Bank Grade SSL</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-[#C6FF3D]" />
                  <span>NPCI & UPI Certified</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-white/80">
                  <Server className="w-4 h-4 text-[#0082FB]" />
                  <span>Direct Bank Settlement</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 border border-white/10 text-white/80">
                  <Award className="w-4 h-4 text-[#0082FB]" />
                  <span>PCI-DSS Level 1 Compliant</span>
                </div>
              </div>

            </div>

            {/* Right 3D Visual: Razorpay Security Badge Card */}
            <div className="lg:col-span-5 flex justify-center perspective-1000">
              <div 
                onMouseEnter={() => sound.playHover()}
                className="w-full max-w-sm p-8 rounded-3xl bg-[#0B0C16]/90 border border-[#0082FB]/40 shadow-2xl space-y-6 text-center transform-style-3d hover:scale-105 transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#0082FB] to-[#C6FF3D] p-0.5 mx-auto shadow-xl shadow-[#0082FB]/30">
                  <div className="w-full h-full rounded-[22px] bg-[#0C2340] flex items-center justify-center">
                    <ShieldCheck className="w-10 h-10 text-[#C6FF3D]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xl font-bold text-white font-['Space_Grotesk']">
                    Enterprise Trust.
                  </div>
                  <div className="text-xs font-mono text-[#0082FB]">
                    Razorpay Payment Links API Engine
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left font-mono text-[11px] space-y-2 text-white/70">
                  <div className="flex justify-between">
                    <span>Payment Processing:</span>
                    <span className="text-[#C6FF3D]">Razorpay</span>
                  </div>
                  <div className="flex justify-between">
                    <span>UPI Gateways:</span>
                    <span className="text-white">GPay, PhonePe, Paytm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Privacy:</span>
                    <span className="text-[#C6FF3D]">Zero Card Data Stored</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Settlement Time:</span>
                    <span className="text-white">Real-Time IMPS</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-white/40">
                  No hidden margins. Instant college bill settlement.
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default TrustRazorpay;
