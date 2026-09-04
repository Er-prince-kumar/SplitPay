import React from 'react';
import { ShieldCheck, Heart, ExternalLink, Globe } from 'lucide-react';
import { sound } from '../../utils/audio';

const Footer = () => {
  return (
    <footer className="bg-[#070811] text-white py-16 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 2xl:px-20 border-t border-white/10 relative z-10 select-none w-full">
      <div className="w-full space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1B1B3A] border border-[#C6FF3D]/40 flex items-center justify-center text-[#C6FF3D] font-mono font-bold">
                S/P
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-['Space_Grotesk']">
                SplitPay<span className="text-[#C6FF3D]">.</span>
              </span>
            </div>

            {/* Required Text from Brief */}
            <p className="text-sm text-white/60 max-w-md font-mono">
              A student project idea, built on the Razorpay Payment Links API.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-[#0082FB]">
              <ShieldCheck className="w-4 h-4" />
              <span>Razorpay Standard Payment Gateway Rails</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3 text-xs font-mono">
            <div className="text-white/40 uppercase tracking-widest font-bold">NAVIGATION</div>
            <ul className="space-y-2 text-white/70">
              <li>
                <a href="#problem" className="hover:text-[#C6FF3D] transition-colors">
                  Why SplitPay
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#C6FF3D] transition-colors">
                  How it Works (3 Steps)
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#C6FF3D] transition-colors">
                  Features & Bento Grid
                </a>
              </li>
              <li>
                <a href="#sandbox" className="hover:text-[#C6FF3D] transition-colors">
                  Live 3D Bill Sandbox
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-[#C6FF3D] transition-colors">
                  Razorpay Security
                </a>
              </li>
            </ul>
          </div>

          {/* Campus Hubs */}
          <div className="md:col-span-3 space-y-3 text-xs font-mono">
            <div className="text-white/40 uppercase tracking-widest font-bold">CAMPUS HUBS</div>
            <p className="text-white/60 leading-relaxed">
              Targeting students at LPU, DU, IITs, BITS, VIT, and engineering hostels across India.
            </p>
            <div className="text-[#C6FF3D] font-semibold">
              #SplitTheBillNotTheFriendship
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40">
          <div>
            &copy; {new Date().getFullYear()} SplitPay. Built with high-energy 3D UI/UX.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted for college squads with</span>
            <span className="text-[#FF6B4A]">❤️</span>
            <span>and electric code</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
