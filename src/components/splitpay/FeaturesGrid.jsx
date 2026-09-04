import React from 'react';
import { 
  Zap, 
  MessageCircle, 
  ScanLine, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const FeaturesGrid = () => {
  const features = [
    {
      title: "1-Tap UPI Deep Links",
      icon: <Zap className="w-5 h-5 text-[#C6FF3D]" />,
      tag: "Zero App Install",
      desc: "Friends receive a web link that directly opens GPay, PhonePe, or Paytm with the exact share pre-filled. Zero friction."
    },
    {
      title: "Automated WhatsApp Nudges",
      icon: <MessageCircle className="w-5 h-5 text-[#25D366]" />,
      tag: "Reminder-Free",
      desc: "Polite, automated reminders sent straight to friends via WhatsApp. No awkward manual follow-ups or strained friendships."
    },
    {
      title: "Smart Receipt OCR",
      icon: <ScanLine className="w-5 h-5 text-[#0082FB]" />,
      tag: "Zero Manual Typing",
      desc: "Snap a quick photo of your dinner receipt or cab invoice. SplitPay extracts the items and amounts automatically."
    },
    {
      title: "Direct Bank Settlement",
      icon: <ShieldCheck className="w-5 h-5 text-[#C6FF3D]" />,
      tag: "Powered by Razorpay",
      desc: "Built on NPCI-certified UPI payment rails. Money moves safely and settles straight into your bank account."
    }
  ];

  return (
    <section id="features" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0C16] border-t border-white/5 w-full scroll-mt-20">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70">
            <Sparkles className="w-3.5 h-3.5 text-[#C6FF3D]" />
            <span>Core Features</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
            Built for campus living
          </h2>

          <p className="text-sm sm:text-base text-white/60">
            Everything you need to manage group expenses without awkwardness.
          </p>
        </div>

        {/* 4 Clean Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat, idx) => (
            <div 
              key={idx}
              className="p-6 sm:p-7 rounded-2xl bg-[#121324] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <span className="text-[11px] font-mono font-medium px-2.5 py-1 rounded bg-white/5 text-white/60">
                    {feat.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  {feat.title}
                </h3>

                <p className="text-sm text-white/70 leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs font-mono text-[#C6FF3D]">
                <span>Instant & reliable</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesGrid;
