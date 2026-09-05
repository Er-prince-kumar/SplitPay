import React, { useState } from 'react';
import { 
  Sparkles, 
  Users, 
  IndianRupee, 
  Copy, 
  Check, 
  Share2, 
  Coffee, 
  Fuel, 
  Sliders, 
  Zap,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

const presets = [
  { name: "Goa Trip — Room 204", amount: 7400, people: 4, icon: "🏖️" },
  { name: "Hostel Midnight Biryani", amount: 1600, people: 4, icon: "🍗" },
  { name: "College Fest Passes", amount: 4500, people: 5, icon: "🎟️" },
  { name: "Flatmates WiFi & Groceries", amount: 3200, people: 3, icon: "🛒" }
];

const LiveSandbox = () => {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [billAmount, setBillAmount] = useState(7400);
  const [groupSize, setGroupSize] = useState(4);
  const [coffeeDeduction, setCoffeeDeduction] = useState(false);
  const [fuelAddition, setFuelAddition] = useState(false);
  const [copied, setCopied] = useState(false);

  // Compute calculated shares
  const adjustedTotal = billAmount - (coffeeDeduction ? 150 : 0) + (fuelAddition ? 300 : 0);
  const perPersonShare = Math.round(adjustedTotal / groupSize);

  const applyPreset = (index) => {
    sound.playClick();
    setSelectedPreset(index);
    setBillAmount(presets[index].amount);
    setGroupSize(presets[index].people);
    setCoffeeDeduction(false);
    setFuelAddition(false);
  };

  const copyWhatsAppLink = () => {
    sound.playClick();
    sound.playUpiSuccess();
    setCopied(true);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#C6FF3D', '#25D366', '#FFFFFF']
    });

    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="sandbox" className="relative py-20 sm:py-28 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 bg-[#0B0C16] overflow-hidden w-full">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#C6FF3D]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="w-full relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C6FF3D]/10 border border-[#C6FF3D]/30 text-[#C6FF3D] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C6FF3D]" />
            INTERACTIVE 3D PLAYGROUND
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Space_Grotesk'] tracking-tight">
            Try the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6FF3D] to-[#0082FB]">
              Live Bill Split Simulator
            </span>
          </h2>

          <p className="text-base sm:text-lg text-white/70">
            Customize group size, total bill, or special exceptions. Watch SplitPay auto-calculate everything in real time.
          </p>
        </div>

        {/* Preset Selector Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {presets.map((p, i) => (
            <button
              key={p.name}
              onClick={() => applyPreset(i)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                selectedPreset === i
                  ? 'bg-[#C6FF3D] text-[#0B0C16] font-bold border-[#C6FF3D] shadow-lg shadow-[#C6FF3D]/20'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel */}
          <div className="lg:col-span-6 p-7 sm:p-8 rounded-3xl bg-[#15162B]/80 border border-white/10 space-y-6 glass-card">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-white font-bold font-['Space_Grotesk'] text-lg">
                <Sliders className="w-5 h-5 text-[#C6FF3D]" />
                Expense Parameters
              </div>
              <span className="text-xs font-mono text-[#C6FF3D]">LIVE RE-CALC</span>
            </div>

            {/* Total Bill Amount Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white/60">TOTAL BILL AMOUNT:</span>
                <span className="text-xl font-black text-white font-['Space_Grotesk']">
                  ₹{billAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="400"
                max="25000"
                step="100"
                value={billAmount}
                onChange={(e) => {
                  setBillAmount(Number(e.target.value));
                  setSelectedPreset(-1);
                }}
                className="w-full accent-[#C6FF3D] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/40">
                <span>₹400</span>
                <span>₹12,500</span>
                <span>₹25,000</span>
              </div>
            </div>

            {/* Group Size Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white/60">NUMBER OF FRIENDS (SPLITTERS):</span>
                <span className="text-xl font-black text-[#C6FF3D] font-['Space_Grotesk']">
                  {groupSize} People
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                step="1"
                value={groupSize}
                onChange={(e) => {
                  setGroupSize(Number(e.target.value));
                  setSelectedPreset(-1);
                }}
                className="w-full accent-[#C6FF3D] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-white/40">
                <span>2 (Duo)</span>
                <span>4 (Room squad)</span>
                <span>8 (Full Fest Wing)</span>
              </div>
            </div>

            {/* Campus Realities / Custom Share Exceptions */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono text-white/50">CAMPUS EXCEPTIONS (ONE-CLICK):</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    sound.playClick();
                    setCoffeeDeduction(!coffeeDeduction);
                  }}
                  className={`p-3 rounded-2xl border text-xs font-mono text-left transition-all flex items-center justify-between cursor-pointer ${
                    coffeeDeduction
                      ? 'bg-[#C6FF3D]/15 border-[#C6FF3D] text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-[#C6FF3D]" />
                    <span>"Rahul only had coffee"</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#C6FF3D]">-₹150</span>
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setFuelAddition(!fuelAddition);
                  }}
                  className={`p-3 rounded-2xl border text-xs font-mono text-left transition-all flex items-center justify-between cursor-pointer ${
                    fuelAddition
                      ? 'bg-[#0082FB]/15 border-[#0082FB] text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Fuel className="w-4 h-4 text-[#0082FB]" />
                    <span>"Host paid car toll"</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#0082FB]">+₹300</span>
                </button>
              </div>
            </div>

          </div>

          {/* Dynamic 3D Result Card */}
          <div className="lg:col-span-6 p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1B1B3A] to-[#0D0D1E] border border-[#C6FF3D]/30 shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Ambient Corner Flare */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C6FF3D]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-[#C6FF3D] tracking-widest uppercase">
                  AUTO-CALCULATED BILL PREVIEW
                </span>
                <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  {presets[selectedPreset]?.name || "Custom Campus Group"}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0C2340] text-[#0082FB] text-xs font-mono font-bold">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>UPI READY</span>
              </div>
            </div>

            {/* Big Share Display */}
            <div className="p-6 rounded-2xl bg-[#0B0C16]/80 border border-white/10 text-center space-y-2">
              <div className="text-xs font-mono text-white/50">EACH PERSON PAYS EXACTLY</div>
              <div className="text-4xl sm:text-5xl font-black text-[#C6FF3D] font-['Space_Grotesk'] tracking-tight">
                ₹{perPersonShare.toLocaleString('en-IN')}
              </div>
              <div className="text-xs font-mono text-white/40">
                Total ₹{adjustedTotal.toLocaleString('en-IN')} split among {groupSize} friends • Razorpay 1-Tap UPI
              </div>
            </div>

            {/* Generated WhatsApp Share Message Box */}
            <div className="p-4 rounded-2xl bg-[#0B0C16] border border-white/10 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-[#25D366] text-xs font-bold pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Share Link Ready:</span>
                </div>
                <span className="text-[10px] text-white/40">Instant 1-Tap</span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 text-white/80 text-[11px] leading-relaxed">
                "Bhai! The bill for <span className="text-[#C6FF3D] font-bold">{presets[selectedPreset]?.name || "our group"}</span> came to ₹{adjustedTotal.toLocaleString('en-IN')}. Your share is <span className="text-[#C6FF3D] font-bold">₹{perPersonShare}</span>. Settle instantly via UPI on SplitPay: <span className="text-[#0082FB] underline">er-prince-kumar.github.io/SplitPay</span>"
              </div>

              <button
                onClick={copyWhatsAppLink}
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0B0C16] font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-[#25D366]/20 active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied to Clipboard! 🎉</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy WhatsApp Bill Invite</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default LiveSandbox;
