import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#080912] text-white py-12 px-3 sm:px-5 md:px-6 lg:px-8 border-t border-white/10 w-full">
      <div className="w-full max-w-[1600px] mx-auto space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1B1B3A] border border-[#C6FF3D]/40 flex items-center justify-center text-[#C6FF3D] font-mono font-bold text-sm">
                S/P
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-['Space_Grotesk']">
                SplitPay<span className="text-[#C6FF3D]">.</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-white/60 max-w-sm">
              Split group expenses into 1-tap UPI links with automated WhatsApp reminders. Built on Razorpay rails.
            </p>

            <div className="flex items-center gap-1.5 text-xs text-[#0082FB] font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Razorpay Verified Payment Partner</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-2.5 text-xs">
            <div className="text-white/40 uppercase tracking-wider font-mono font-bold">NAVIGATION</div>
            <ul className="space-y-1.5 text-white/70">
              <li>
                <a href="#trip-splitter" className="hover:text-[#C6FF3D] transition-colors">
                  Create a Bill Split
                </a>
              </li>
              <li>
                <a href="#problem" className="hover:text-[#C6FF3D] transition-colors">
                  Why SplitPay
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#C6FF3D] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#C6FF3D] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-[#C6FF3D] transition-colors">
                  Security & Trust
                </a>
              </li>
            </ul>
          </div>

          {/* Campus Focus */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <div className="text-white/40 uppercase tracking-wider font-mono font-bold">FOR STUDENTS</div>
            <p className="text-white/60 leading-relaxed">
              Designed for hostel roommates, college trips, and fest committees across universities in India.
            </p>
            <div className="text-[#C6FF3D] font-mono pt-1">
              #SplitTheBillNotTheFriendship
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-white/40">
          <div>
            &copy; {new Date().getFullYear()} SplitPay. All rights reserved.
          </div>
          <div>
            Fast, simple, and reminder-free bill splitting.
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
