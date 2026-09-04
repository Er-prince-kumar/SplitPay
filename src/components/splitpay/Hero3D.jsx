import { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Zap, 
  MessageCircle,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { buildSplitWhatsAppMessage, openWhatsAppDirect } from '../../utils/whatsapp';

const Hero3D = ({ onOpenWaitlist }) => {
  const presets = [
    { title: 'Goa Trip — Room 204', amount: 7400, icon: '🏖️' },
    { title: 'Manali Snow Ride', amount: 9600, icon: '🏔️' },
    { title: 'Hostel Midnight Biryani', amount: 1800, icon: '🍗' },
  ];

  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const currentPreset = presets[activePresetIndex];

  const [squad, setSquad] = useState([
    { id: 1, name: 'Rohit K.', role: 'Cabs & Fuel', status: 'pending', avatar: '👨‍💻' },
    { id: 2, name: 'Priya S.', role: 'Beach Shack', status: 'pending', avatar: '👩‍🎨' },
    { id: 3, name: 'Aman M.', role: 'Hostel Stay', status: 'pending', avatar: '🎒' },
    { id: 4, name: 'You (Host)', role: 'Trip Organizer', status: 'paid', avatar: '👑' },
  ]);

  const perHead = Math.round(currentPreset.amount / squad.length);
  const paidCount = squad.filter(m => m.status === 'paid').length;
  const progressPercent = Math.round((paidCount / squad.length) * 100);

  const handleNudge = (member) => {
    sound.playClick();
    const message = buildSplitWhatsAppMessage({
      friendName: member.name,
      tripName: currentPreset.title,
      amount: perHead,
      hostName: 'Prince Kumar',
      hostUpi: 'prince@oksbi',
      tone: 'standard'
    });
    openWhatsAppDirect('9876543210', message);
  };

  const scrollToSplitter = () => {
    sound.playClick();
    const el = document.getElementById('trip-splitter');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 overflow-hidden w-full">
      <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        
        {/* Left: Value Proposition */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          {/* Subtle Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80">
            <span className="w-2 h-2 rounded-full bg-[#C6FF3D]" />
            <span>Campus Bill Splitting • 1-Tap UPI</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-['Space_Grotesk'] leading-[1.08]">
            Split the bill. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6FF3D] to-[#0082FB]">
              Not the friendship.
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-lg font-normal">
            Turn group expenses into one shared bill your friends can pay in 1 tap via UPI. Zero app download required for friends to settle.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={scrollToSplitter}
              className="px-6 py-3.5 rounded-xl bg-[#C6FF3D] text-[#0B0C16] font-bold text-sm sm:text-base hover:bg-[#b5f422] active:scale-95 transition-all shadow-md shadow-[#C6FF3D]/10 flex items-center gap-2 font-['Space_Grotesk'] cursor-pointer"
            >
              <span>Create Bill Split</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#how-it-works"
              onClick={() => sound.playClick()}
              className="px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium text-sm sm:text-base transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#C6FF3D]" />
              <span>How it works</span>
            </a>
          </div>

          {/* Simple Trust Bullets */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-2 sm:gap-4 text-[11px] sm:text-xs text-white/60 font-mono">
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

        {/* Right: Clean, Elegant Live Split Card */}
        <div className="lg:col-span-6 w-full max-w-lg mx-auto lg:max-w-none">
          <div className="rounded-2xl p-6 sm:p-7 bg-[#121324] border border-white/10 shadow-xl space-y-5">
            
            {/* Card Header & Presets */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentPreset.icon}</span>
                <span className="text-sm font-bold text-white font-['Space_Grotesk']">{currentPreset.title}</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/20">
                Live Preview
              </span>
            </div>

            {/* Presets Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sound.playClick();
                    setActivePresetIndex(idx);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors shrink-0 cursor-pointer ${
                    activePresetIndex === idx
                      ? 'bg-[#C6FF3D] text-[#0B0C16] font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
                  }`}
                >
                  {preset.icon} {preset.title.split('—')[0]}
                </button>
              ))}
            </div>

            {/* Numbers Display */}
            <div className="p-4 rounded-xl bg-[#0B0C16] border border-white/10 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] font-mono text-white/40 block">TOTAL BILL</span>
                <span className="text-2xl font-black text-white font-['Space_Grotesk']">
                  ₹{currentPreset.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono text-[#C6FF3D] block">EACH PERSON</span>
                <span className="text-2xl font-black text-[#C6FF3D] font-['Space_Grotesk']">
                  ₹{perHead.toLocaleString('en-IN')}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="col-span-2 pt-1">
                <div className="flex justify-between text-[11px] font-mono text-white/50 mb-1">
                  <span>Settled: {paidCount} of {squad.length} paid</span>
                  <span className="text-[#C6FF3D] font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-[#C6FF3D] transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Squad Members */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-white/40 uppercase tracking-wider flex justify-between">
                <span>Friends in Split</span>
                <span>Status</span>
              </div>

              {squad.map((member) => (
                <div 
                  key={member.id}
                  className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{member.avatar}</span>
                    <div>
                      <div className="text-xs font-bold text-white font-['Space_Grotesk']">{member.name}</div>
                      <div className="text-[10px] text-white/40 font-mono">{member.role}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {member.status === 'pending' && (
                      <button
                        onClick={() => handleNudge(member)}
                        className="p-1 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 transition-colors cursor-pointer"
                        title="Send WhatsApp Nudge"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {member.status === 'paid' ? (
                      <span
                        className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 bg-[#C6FF3D]/15 text-[#C6FF3D] border border-[#C6FF3D]/30 select-none cursor-default shadow-sm"
                        title="Payment verified via UPI"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Paid</span>
                      </span>
                    ) : (
                      <span
                        className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 bg-amber-400/15 text-amber-400 border border-amber-400/30 select-none cursor-default"
                        title={`Payment pending for ${member.name}`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>Pending</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom action */}
            <button
              onClick={scrollToSplitter}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Open Custom Bill Splitter</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C6FF3D]" />
            </button>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero3D;
