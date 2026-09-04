import React from 'react';
import { MessageSquareOff, Calculator, UserCheck, AlertTriangle, MessageCircle, ArrowDownRight } from 'lucide-react';
import { sound } from '../../utils/audio';

const ProblemSection = () => {
  return (
    <section id="problem" className="relative py-20 sm:py-28 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 bg-[#0B0C16] overflow-hidden w-full">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-[#FF6B4A]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#1B1B3A]/80 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6B4A]/15 border border-[#FF6B4A]/30 text-[#FF6B4A] text-xs font-mono font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            THE CAMPUS EXPENSE DILEMMA
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">
            Every group trip has the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B4A] via-[#FF8A65] to-[#C6FF3D]">
              same three problems.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-white/70 font-normal">
            You've lived this. It happens every single time money and friends mix.
          </p>
        </div>

        {/* 3 Interactive 3D Problem Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 perspective-1000">
          
          {/* Problem Card 1: One person always pays first */}
          <div 
            onMouseEnter={() => sound.playHover()}
            className="rounded-3xl p-7 bg-[#15162B]/80 hover:bg-[#1B1B3A] border border-white/10 hover:border-[#FF6B4A]/50 transition-all duration-300 transform-style-3d hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#FF6B4A]/15 group flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Badge & Step */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#FF6B4A] px-2.5 py-1 rounded bg-[#FF6B4A]/10 border border-[#FF6B4A]/20">
                  PROBLEM 01
                </span>
                <span className="text-white/30 text-xs font-mono">CHASING PHASE</span>
              </div>

              {/* 3D Visual Mockup: The Chaser's Dilemma */}
              <div className="p-4 rounded-2xl bg-[#0B0C16]/90 border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-white/50 pb-2 border-b border-white/5">
                  <span>CAB BOOKED (GOA AIRPORT)</span>
                  <span className="text-white font-bold">₹2,400</span>
                </div>

                <div className="space-y-2">
                  <div className="p-2 rounded bg-white/5 text-white/70 text-[11px] flex items-center justify-between">
                    <span>You paid upfront:</span>
                    <span className="text-[#FF6B4A] font-bold">₹2,400.00</span>
                  </div>
                  <div className="p-2 rounded bg-[#FF6B4A]/10 text-[#FF6B4A] text-[11px]">
                    ⏳ 4 days later: Still owed ₹1,800 across 3 friends
                  </div>
                </div>
              </div>

              {/* Card Content from Brief */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white font-['Space_Grotesk'] group-hover:text-[#FF6B4A] transition-colors">
                  One person always pays first
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Someone books the cab or the tickets, then spends the next week chasing everyone individually over WhatsApp and calls.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-[#FF6B4A]">
              <span>Status: Bank account exhausted</span>
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>

          {/* Problem Card 2: Reminders get awkward */}
          <div 
            onMouseEnter={() => sound.playHover()}
            className="rounded-3xl p-7 bg-[#15162B]/80 hover:bg-[#1B1B3A] border border-white/10 hover:border-[#C6FF3D]/50 transition-all duration-300 transform-style-3d hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#C6FF3D]/15 group flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Badge & Step */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#C6FF3D] px-2.5 py-1 rounded bg-[#C6FF3D]/10 border border-[#C6FF3D]/20">
                  PROBLEM 02
                </span>
                <span className="text-white/30 text-xs font-mono">AWKWARD PHASE</span>
              </div>

              {/* 3D Visual Mockup: The Awkward WhatsApp Ping */}
              <div className="p-4 rounded-2xl bg-[#0B0C16]/90 border border-white/10 space-y-2.5 font-mono text-xs">
                <div className="flex items-center gap-2 text-[#25D366] text-[11px] pb-1 border-b border-white/5">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WHATSAPP CHAT (ROOM 204)</span>
                </div>

                <div className="bg-[#1B1B3A]/80 p-2.5 rounded-xl text-white/80 text-[11px] space-y-1">
                  <div className="text-[9px] text-white/40">You • Yesterday 11:20 PM</div>
                  <div>"bhai paisa bhej diya kya dinner ka? 😅"</div>
                </div>

                <div className="bg-white/5 p-2 rounded-xl text-white/50 text-[10px] flex items-center justify-between">
                  <span>Seen by Aman at 2:14 AM</span>
                  <span className="text-[#0082FB]">✓✓ Read</span>
                </div>
              </div>

              {/* Card Content from Brief */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white font-['Space_Grotesk'] group-hover:text-[#C6FF3D] transition-colors">
                  Reminders get awkward
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Nobody wants to be "that friend" texting <span className="text-white font-medium italic">"bhai paisa bhej de"</span> for the fifth time while friendships feel strained.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-[#C6FF3D]">
              <span>Status: Seen at 2:14 AM, no reply</span>
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>

          {/* Problem Card 3: Splitting math gets messy */}
          <div 
            onMouseEnter={() => sound.playHover()}
            className="rounded-3xl p-7 bg-[#15162B]/80 hover:bg-[#1B1B3A] border border-white/10 hover:border-[#0082FB]/50 transition-all duration-300 transform-style-3d hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#0082FB]/15 group flex flex-col justify-between"
          >
            <div className="space-y-6">
              {/* Badge & Step */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0082FB] px-2.5 py-1 rounded bg-[#0082FB]/10 border border-[#0082FB]/20">
                  PROBLEM 03
                </span>
                <span className="text-white/30 text-xs font-mono">MATH CHAOS</span>
              </div>

              {/* 3D Visual Mockup: The Broken Equation */}
              <div className="p-4 rounded-2xl bg-[#0B0C16]/90 border border-white/10 space-y-2 font-mono text-xs">
                <div className="text-white/50 text-[11px] pb-1 border-b border-white/5 flex items-center justify-between">
                  <span>SPLIT CONFUSION</span>
                  <Calculator className="w-3.5 h-3.5 text-[#0082FB]" />
                </div>

                <div className="space-y-1 text-[11px] text-white/70">
                  <div className="flex justify-between">
                    <span>Rahul: "I only had a chai"</span>
                    <span className="text-white/40">-₹40</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Karan: "I paid for the toll"</span>
                    <span className="text-white/40">+₹180</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pooja: "Didn't drink beer"</span>
                    <span className="text-white/40">-₹450</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 text-[11px] text-[#FF6B4A]">
                  ❌ Everyone argues over who owes whom
                </div>
              </div>

              {/* Card Content from Brief */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white font-['Space_Grotesk'] group-hover:text-[#0082FB] transition-colors">
                  Splitting math gets messy
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Uneven shares, one person who didn't eat, someone who paid for fuel — the maths never stays simple and spreadsheets give headaches.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-[#0082FB]">
              <span>Status: Disputed calculation</span>
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ProblemSection;
