import React from 'react';
import { FileText, Share2, Zap, ArrowRight } from 'lucide-react';
import { sound } from '../../utils/audio';

const HowItWorks3D = () => {
  const steps = [
    {
      step: "01",
      title: "Create the bill",
      icon: <FileText className="w-5 h-5 text-[#C6FF3D]" />,
      desc: "Enter the total amount and select your squad. SplitPay calculates equal or custom shares instantly."
    },
    {
      step: "02",
      title: "Share WhatsApp link",
      icon: <Share2 className="w-5 h-5 text-[#0082FB]" />,
      desc: "Each friend gets a verified Razorpay payment link directly on WhatsApp. No app installation needed."
    },
    {
      step: "03",
      title: "Pay in 1 tap via UPI",
      icon: <Zap className="w-5 h-5 text-[#25D366]" />,
      desc: "Friends pay in seconds with GPay, PhonePe, or Paytm. The bill settles automatically in real time."
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 px-3 sm:px-5 md:px-6 lg:px-8 bg-[#0D0E1C] border-t border-white/5 w-full scroll-mt-20">
      <div className="w-full max-w-[1600px] mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70">
            <Zap className="w-3.5 h-3.5 text-[#C6FF3D]" />
            <span>Simple 3-Step Process</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
            How SplitPay Works
          </h2>

          <p className="text-sm sm:text-base text-white/60">
            From receipt to 100% settled in under 60 seconds.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-[#121324] border border-white/10 hover:border-white/20 transition-all space-y-4 relative"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {s.icon}
                </div>
                <span className="font-mono text-2xl font-black text-white/20">
                  {s.step}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                {s.title}
              </h3>

              <p className="text-sm text-white/70 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks3D;
