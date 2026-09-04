import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  User, 
  LogOut,
  PlusCircle
} from 'lucide-react';
import { sound } from '../../utils/audio';

const Navbar = ({ onOpenWaitlist, onOpenDemo, onOpenAuth, currentUser, onSignOut }) => {
  const [scrolled, setScrolled] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const isMuted = sound.toggleMute();
    setMuted(isMuted);
    if (!isMuted) sound.playClick();
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'py-3 bg-[#0b0c16]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl' 
        : 'py-5 bg-transparent'
    }`}>
      {/* Top micro-ticker for campus live stats */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 mb-2 hidden md:flex items-center justify-between text-[11px] font-mono tracking-wider text-white/50 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#C6FF3D] animate-ping" />
          <span className="text-white/80 font-medium">CAMPUS LIVE:</span>
          <span>4,820 students splitting bills across 38 universities</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-[#0082FB] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Powered by Razorpay API
          </span>
          <span className="text-white/30">•</span>
          <span className="text-[#C6FF3D]">Avg settle time: 4.8s</span>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a 
          href="#" 
          className="flex items-center gap-3 group"
          onClick={() => sound.playClick()}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B1B3A] to-[#0D0D1E] border border-[#C6FF3D]/40 flex items-center justify-center shadow-lg shadow-[#C6FF3D]/10 group-hover:scale-105 group-hover:border-[#C6FF3D] transition-all">
            <span className="font-extrabold text-xl text-[#C6FF3D] font-mono tracking-tighter">S/P</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1 font-['Space_Grotesk']">
              SplitPay
              <span className="text-[#C6FF3D] text-3xl leading-none">.</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase -mt-1">
              CAMPUS FINTECH
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-white/70">
          <a 
            href="#create-split" 
            className="text-[#C6FF3D] hover:text-[#b5f422] transition-colors py-1 flex items-center gap-1.5 font-bold"
            onClick={() => sound.playHover()}
          >
            <PlusCircle className="w-4 h-4" />
            Split a Bill
          </a>
          <a 
            href="#problem" 
            className="hover:text-[#C6FF3D] transition-colors py-1"
            onClick={() => sound.playHover()}
          >
            Why
          </a>
          <a 
            href="#how-it-works" 
            className="hover:text-[#C6FF3D] transition-colors py-1"
            onClick={() => sound.playHover()}
          >
            How it works
          </a>
          <a 
            href="#features" 
            className="hover:text-[#C6FF3D] transition-colors py-1"
            onClick={() => sound.playHover()}
          >
            Features
          </a>
          <a 
            href="#sandbox" 
            className="hover:text-[#C6FF3D] transition-colors py-1 flex items-center gap-1.5"
            onClick={() => sound.playHover()}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C6FF3D]" />
            Live 3D Sandbox
          </a>
          <a 
            href="#trust" 
            className="hover:text-[#C6FF3D] transition-colors py-1"
            onClick={() => sound.playHover()}
          >
            Security
          </a>
        </nav>

        {/* Actions, Auth & Sound Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Sound Synthesizer Mute Button */}
          <button
            onClick={toggleSound}
            aria-label={muted ? 'Unmute 3D Audio' : 'Mute 3D Audio'}
            className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all text-xs flex items-center gap-1.5 cursor-pointer"
            title={muted ? 'Sound Muted' : '3D Sound Enabled'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#C6FF3D]" />}
            <span className="hidden xl:inline font-mono text-[11px]">{muted ? 'OFF' : 'SFX'}</span>
          </button>

          {/* User Auth Section */}
          {currentUser ? (
            <div className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-[#15162B] border border-[#C6FF3D]/30 shadow-md">
              <span className="w-8 h-8 rounded-xl bg-[#C6FF3D]/20 text-[#C6FF3D] flex items-center justify-center text-sm font-bold">
                {currentUser.avatar || '👑'}
              </span>
              <div className="hidden sm:block text-left text-xs font-mono">
                <div className="text-white font-bold leading-tight font-['Space_Grotesk'] truncate max-w-[110px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-[#C6FF3D] leading-none truncate max-w-[110px]">
                  {currentUser.upiId}
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onSignOut();
                }}
                className="p-1 rounded-lg text-white/40 hover:text-red-400 transition-colors ml-1 cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onOpenAuth();
              }}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#C6FF3D]" />
              <span>Log In</span>
            </button>
          )}

          {/* Primary Waitlist Button in Electric Lime */}
          <button
            onClick={() => {
              sound.playClick();
              if (onOpenWaitlist) onOpenWaitlist();
            }}
            className="group relative inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#C6FF3D] text-[#0B0C16] hover:bg-[#b2f022] active:scale-95 transition-all shadow-lg shadow-[#C6FF3D]/25 hover:shadow-[#C6FF3D]/40 font-['Space_Grotesk'] cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current hidden sm:inline" />
            <span>Join waitlist</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
