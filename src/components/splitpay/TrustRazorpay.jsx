import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, Server, Award } from 'lucide-react';

const TrustRazorpay = () => {
  return (
    <section id="trust" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#0D0E1C] border-t border-white/5 w-full scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        
        <div className="p-8 sm:p-12 rounded-3xl bg-[#121324] border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#0082FB]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>POWERED BY RAZORPAY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
              Enterprise payment infrastructure.
            </h2>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              SplitPay utilizes official Razorpay UPI rails to move money safely between friends — the same payment infrastructure trusted by India's leading digital platforms.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0B0C16] border border-white/10 text-white/80">
                <Lock className="w-4 h-4 text-[#C6FF3D]" />
                <span>256-Bit Bank-Grade SSL</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0B0C16] border border-white/10 text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[#C6FF3D]" />
                <span>NPCI & UPI Certified</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0B0C16] border border-white/10 text-white/80">
                <Server className="w-4 h-4 text-[#0082FB]" />
                <span>Direct Bank Settlement</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#0B0C16] border border-white/10 text-white/80">
                <Award className="w-4 h-4 text-[#0082FB]" />
                <span>PCI-DSS Level 1 Compliant</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Trust Badge Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm p-6 sm:p-8 rounded-2xl bg-[#0B0C16] border border-white/10 space-y-5 text-center shadow-lg">
              <div className="w-16 h-16 rounded-2xl bg-[#0082FB]/10 border border-[#0082FB]/30 flex items-center justify-center mx-auto text-[#0082FB]">
                <ShieldCheck className="w-8 h-8 text-[#C6FF3D]" />
              </div>

              <div className="space-y-1">
                <div className="text-lg font-bold text-white font-['Space_Grotesk']">
                  Bank-to-Bank Transfers
                </div>
                <div className="text-xs font-mono text-white/50">
                  Instant settlement via UPI
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-xs text-white/70 space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-white/40">Rail:</span>
                  <span className="text-[#C6FF3D]">UPI 2.0 (IMPS)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Supported Apps:</span>
                  <span className="text-white">GPay, PhonePe, Paytm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Data Policy:</span>
                  <span className="text-white">No PIN / Credential Storage</span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-white/40">
                Safe, direct, and zero fees for college students.
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default TrustRazorpay;
