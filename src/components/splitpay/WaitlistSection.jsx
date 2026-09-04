import React, { useState } from 'react';
import { 
  Zap, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Mail, 
  School, 
  User, 
  Share2, 
  Download,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

const campuses = [
  "Lovely Professional University (LPU)",
  "Delhi University (DU)",
  "IIT Delhi / Bombay / Madras",
  "BITS Pilani / Goa / Hyderabad",
  "VIT Vellore / Chennai",
  "DTU / NSUT Delhi",
  "Manipal Academy (MAHE)",
  "SRM Institute",
  "Other College / University"
];

const WaitlistSection = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState(campuses[0]);
  const [submitted, setSubmitted] = useState(false);
  const [waitlistNumber, setWaitlistNumber] = useState(412);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert("Please enter a valid college or personal email address.");
      return;
    }

    sound.playUpiSuccess();
    const assignedNumber = Math.floor(400 + Math.random() * 50);
    setWaitlistNumber(assignedNumber);
    setSubmitted(true);

    // Blast celebratory confetti
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#C6FF3D', '#0082FB', '#FF6B4A', '#FFFFFF']
    });
  };

  return (
    <section id="waitlist" className="relative py-20 sm:py-28 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 bg-[#0B0C16] overflow-hidden w-full">
      
      {/* Glow Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C6FF3D]/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        
        {!submitted ? (
          <div className="p-5 sm:p-10 lg:p-14 rounded-3xl bg-[#15162B]/90 border border-[#C6FF3D]/30 shadow-2xl glass-card text-center space-y-8">
            
            {/* Header */}
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C6FF3D]/15 border border-[#C6FF3D]/40 text-[#C6FF3D] text-xs font-mono font-bold tracking-wider">
                <Sparkles className="w-4 h-4 text-[#C6FF3D]" />
                <span>EXCLUSIVE CAMPUS ROLLOUT</span>
              </div>

              {/* Heading from Brief */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">
                Be the first to try{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6FF3D] to-[#0082FB]">
                  SplitPay on campus.
                </span>
              </h2>

              {/* Subtext from Brief */}
              <p className="text-base sm:text-lg text-white/70">
                We're launching with a few college groups first. Drop your email and we'll send you early access.
              </p>
            </div>

            {/* Waitlist Form */}
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 text-left">
              
              {/* Optional Name */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-white/60">YOUR NAME / NICKNAME</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="e.g. Prince Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#0B0C16] border border-white/15 text-white placeholder-white/30 text-sm focus:border-[#C6FF3D] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* College Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-white/60">COLLEGE / UNIVERSITY</label>
                <div className="relative">
                  <School className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <select
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#0B0C16] border border-white/15 text-white text-sm focus:border-[#C6FF3D] focus:outline-none transition-colors cursor-pointer"
                  >
                    {campuses.map((c) => (
                      <option key={c} value={c} className="bg-[#0B0C16] text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email (Required in brief) */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-white/60">COLLEGE OR PERSONAL EMAIL *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    required
                    placeholder="you@college.edu or name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#0B0C16] border border-white/15 text-white placeholder-white/30 text-sm focus:border-[#C6FF3D] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#C6FF3D] hover:bg-[#b2f022] text-[#0B0C16] font-extrabold text-base font-['Space_Grotesk'] shadow-xl shadow-[#C6FF3D]/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>Join waitlist</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="text-center text-xs font-mono text-white/40 pt-2">
                🔒 No spam. Only an early invite link when your campus tier opens.
              </div>
            </form>

          </div>
        ) : (
          /* Success Screen + 3D Holographic Campus Pass (Specified Success Message) */
          <div className="p-8 sm:p-14 rounded-3xl bg-[#15162B] border border-[#C6FF3D]/40 shadow-2xl glass-card text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
            
            <div className="w-16 h-16 rounded-full bg-[#C6FF3D]/20 text-[#C6FF3D] flex items-center justify-center mx-auto shadow-xl shadow-[#C6FF3D]/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            {/* Success Message from Brief */}
            <div className="space-y-2">
              <h3 className="text-3xl sm:text-4xl font-black text-white font-['Space_Grotesk']">
                You're on the list! 🎉
              </h3>
              <p className="text-base sm:text-lg text-[#C6FF3D] font-mono">
                We'll email you when SplitPay opens up for your campus.
              </p>
            </div>

            {/* 3D Holographic Campus Pass Card */}
            <div className="max-w-md mx-auto p-6 rounded-3xl bg-gradient-to-br from-[#1B1B3A] to-[#0B0C16] border border-[#C6FF3D]/50 shadow-2xl relative text-left font-mono space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-[#C6FF3D] text-[#0B0C16] font-black flex items-center justify-center text-xs font-['Space_Grotesk']">
                    S/P
                  </div>
                  <span className="text-white font-bold font-['Space_Grotesk'] text-sm">SPLITPAY CAMPUS PASS</span>
                </div>
                <span className="text-[#C6FF3D] text-xs font-bold">ALPHA ACCESS</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-white/40 text-[10px]">NAME:</div>
                  <div className="text-white font-bold">{name || "Campus Pioneer"}</div>
                </div>
                <div>
                  <div className="text-white/40 text-[10px]">WAITLIST QUEUE:</div>
                  <div className="text-[#C6FF3D] font-black text-sm">#{waitlistNumber}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-white/40 text-[10px]">CAMPUS / HOSTEL:</div>
                  <div className="text-white/90 truncate">{college}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                <span>Direct Razorpay Rails</span>
                <span className="text-[#C6FF3D]">Verified Squad Ticket</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setSubmitted(false);
                }}
                className="text-xs text-white/60 hover:text-white underline cursor-pointer font-mono"
              >
                Register another campus friend
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};

export default WaitlistSection;
