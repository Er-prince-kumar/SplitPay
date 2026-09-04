import React from 'react';
import { CreditCard, MessageCircle, Calculator, AlertCircle } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    {
      number: "01",
      title: "One person pays first",
      tag: "Out of Pocket",
      icon: <CreditCard className="w-5 h-5 text-[#FF6B4A]" />,
      desc: "Someone books the cab or hotel upfront, then spends days waiting for repayments while their bank balance drains."
    },
    {
      number: "02",
      title: "Reminders get awkward",
      tag: "Unspoken Tension",
      icon: <MessageCircle className="w-5 h-5 text-[#C6FF3D]" />,
      desc: "Nobody wants to be the friend repeatedly asking \"bhai paise bhej de\". Following up on small amounts strains friendships."
    },
    {
      number: "03",
      title: "The math gets chaotic",
      tag: "Math Headaches",
      icon: <Calculator className="w-5 h-5 text-[#0082FB]" />,
      desc: "Uneven shares, someone who skipped starters, someone who paid for fuel — messy spreadsheets turn fun trips into arguments."
    }
  ];

  return (
    <section id="problem" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0C16] border-t border-white/5 w-full">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70">
            <AlertCircle className="w-3.5 h-3.5 text-[#FF6B4A]" />
            <span>The Shared Bill Problem</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
            Every group trip has the same pain points.
          </h2>

          <p className="text-sm sm:text-base text-white/60">
            It happens every single time money and friends mix on campus.
          </p>
        </div>

        {/* 3 Clean Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((prob, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-[#121324] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {prob.icon}
                  </div>
                  <span className="text-xs font-mono font-bold text-white/30">
                    PROBLEM {prob.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  {prob.title}
                </h3>

                <p className="text-sm text-white/70 leading-relaxed">
                  {prob.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 text-xs font-mono text-white/40 flex items-center justify-between">
                <span>Result:</span>
                <span className="text-white/80 font-medium">{prob.tag}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProblemSection;
