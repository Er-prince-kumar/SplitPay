import { useState } from 'react';
import { 
  Zap, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Mail, 
  School, 
  User 
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

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C6FF3D', '#0082FB', '#25D366']
    });
  };

  return (
    <section id="waitlist" className="py-20 sm:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 bg-[#0B0C16] border-t border-white/5 w-full scroll-mt-20">
      <div className="max-w-4xl mx-auto w-full">
        
        {!submitted ? (
          <div className="p-6 sm:p-10 rounded-2xl bg-[#121324] border border-white/10 text-center space-y-7">
            
            {/* Header */}
            <div className="space-y-3 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70">
                <Sparkles className="w-3.5 h-3.5 text-[#C6FF3D]" />
                <span>Early Access</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
                Try SplitPay with your campus group.
              </h2>

              <p className="text-sm sm:text-base text-white/60">
                We're onboarding college hostel groups first. Drop your email to claim your VIP access pass.
              </p>
            </div>

            {/* Waitlist Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3.5 text-left">
              
              <div className="space-y-1">
                <label className="text-xs font-mono text-white/50">YOUR NAME</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    placeholder="e.g. Prince Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white placeholder-white/30 text-xs sm:text-sm focus:border-[#C6FF3D] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-white/50">COLLEGE / UNIVERSITY</label>
                <div className="relative">
                  <School className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <select
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white text-xs sm:text-sm focus:border-[#C6FF3D] focus:outline-none transition-colors cursor-pointer"
                  >
                    {campuses.map((c) => (
                      <option key={c} value={c} className="bg-[#0B0C16] text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-white/50">EMAIL ADDRESS *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    required
                    placeholder="name@college.edu or name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white placeholder-white/30 text-xs sm:text-sm focus:border-[#C6FF3D] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#C6FF3D] hover:bg-[#b2f022] text-[#0B0C16] font-bold text-sm font-['Space_Grotesk'] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Join VIP Waitlist</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-[11px] font-mono text-white/40 pt-1">
              No spam guaranteed. We only notify you when your group's invite code is ready.
            </div>

          </div>
        ) : (
          <div className="p-8 sm:p-12 rounded-2xl bg-[#121324] border border-[#C6FF3D]/30 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#C6FF3D]/20 text-[#C6FF3D] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white font-['Space_Grotesk']">
                You're on the list!
              </h3>
              <p className="text-xs sm:text-sm text-white/70">
                You are #{waitlistNumber} on the priority campus rollout for {college}.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0B0C16] border border-white/10 max-w-sm mx-auto font-mono text-xs text-[#C6FF3D]">
              Confirmation code sent to: <span className="text-white font-bold">{email}</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setSubmitted(false);
              }}
              className="text-xs font-mono text-white/50 hover:text-white underline cursor-pointer"
            >
              Add another friend or email
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default WaitlistSection;
