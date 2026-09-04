import { useState, useEffect } from 'react';
import { ArrowRight, User, LogOut, PlusCircle, Sparkles, Menu, X } from 'lucide-react';
import { sound } from '../../utils/audio';

const Navbar = ({ onOpenWaitlist, onOpenDemo, onOpenAuth, onOpenAIChat, currentUser, onSignOut, onOpenProfile }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const scrollToSection = (e, id) => {
    if (e && e.preventDefault) e.preventDefault();
    sound.playClick();
    closeMobileMenu();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled || mobileMenuOpen
        ? 'py-3.5 bg-[#0B0C16]/95 backdrop-blur-md border-b border-white/10 shadow-lg' 
        : 'py-5 bg-transparent'
    }`}>
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-5 md:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a 
          href="#" 
          className="flex items-center gap-2.5 group cursor-pointer"
          onClick={() => {
            sound.playClick();
            closeMobileMenu();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="w-9 h-9 rounded-xl bg-[#1B1B3A] border border-[#C6FF3D]/40 flex items-center justify-center group-hover:border-[#C6FF3D] transition-colors shadow-sm">
            <span className="font-extrabold text-lg text-[#C6FF3D] font-mono tracking-tighter">S/P</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-['Space_Grotesk']">
            SplitPay<span className="text-[#C6FF3D]">.</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm text-white/70">
          <a 
            href="#trip-splitter" 
            className="text-[#C6FF3D] hover:text-[#b5f422] transition-colors font-semibold flex items-center gap-1.5 cursor-pointer"
            onClick={(e) => scrollToSection(e, 'trip-splitter')}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Split a Bill</span>
          </a>
          <a 
            href="#create-split" 
            className="hover:text-white transition-colors cursor-pointer"
            onClick={(e) => scrollToSection(e, 'create-split')}
          >
            Create Split
          </a>
          {currentUser && (
            <a 
              href="#user-dashboard" 
              className="px-2.5 py-1 rounded-lg bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/30 font-bold hover:bg-[#C6FF3D]/20 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
              onClick={(e) => scrollToSection(e, 'user-dashboard')}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] animate-ping" />
              <span>My Trips</span>
            </a>
          )}
          <button 
            type="button"
            onClick={() => {
              sound.playClick();
              if (onOpenAIChat) onOpenAIChat();
            }}
            className="hover:text-[#C6FF3D] transition-colors flex items-center gap-1.5 cursor-pointer text-sm text-white/80"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] animate-pulse" />
            <span>AI Assistant</span>
          </button>
          <a 
            href="#how-it-works" 
            className="hover:text-white transition-colors cursor-pointer"
            onClick={(e) => scrollToSection(e, 'how-it-works')}
          >
            How it works
          </a>
          <a 
            href="#problem" 
            className="hover:text-white transition-colors cursor-pointer"
            onClick={(e) => scrollToSection(e, 'problem')}
          >
            Why
          </a>
          <a 
            href="#features" 
            className="hover:text-white transition-colors cursor-pointer"
            onClick={(e) => scrollToSection(e, 'features')}
          >
            Features
          </a>
          <a 
            href="#trust" 
            className="hover:text-white transition-colors cursor-pointer"
            onClick={(e) => scrollToSection(e, 'trust')}
          >
            Security
          </a>
        </nav>

        {/* Right Actions: Auth, Waitlist, and Mobile Menu Hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {currentUser ? (
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#14152A] border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  if (onOpenProfile) onOpenProfile();
                }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-left"
                title="View & Edit Profile Details"
              >
                <span className="text-base">{currentUser.avatar || '👑'}</span>
                <span className="text-white font-medium max-w-[80px] sm:max-w-[110px] truncate">{currentUser.name}</span>
                <User className="w-3 h-3 text-[#C6FF3D]" />
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onSignOut();
                }}
                className="p-1 text-white/40 hover:text-red-400 transition-colors cursor-pointer"
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
              className="hidden sm:flex px-3.5 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/5 border border-white/10 transition-colors cursor-pointer items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-[#C6FF3D]" />
              <span>Log in</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              closeMobileMenu();
              if (onOpenWaitlist) onOpenWaitlist();
            }}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#C6FF3D] hover:bg-[#b5f422] text-[#0B0C16] font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-[#C6FF3D]/10 cursor-pointer font-['Space_Grotesk'] shrink-0"
          >
            <span>Join waitlist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(prev => !prev);
            }}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#C6FF3D]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Dropdown Sheet */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-6 border-t border-white/10 bg-[#0B0C16] animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 pt-2 text-sm font-medium">
            <a 
              href="#create-split" 
              className="p-2.5 rounded-xl bg-[#C6FF3D]/10 text-[#C6FF3D] border border-[#C6FF3D]/20 font-bold flex items-center gap-2"
              onClick={() => {
                sound.playClick();
                closeMobileMenu();
              }}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Bill Split</span>
            </a>

            {currentUser && (
              <>
                <a 
                  href="#user-dashboard" 
                  className="p-2.5 rounded-xl bg-[#0082FB]/15 text-[#0082FB] border border-[#0082FB]/30 font-bold flex items-center gap-2"
                  onClick={() => {
                    sound.playClick();
                    closeMobileMenu();
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#0082FB] animate-ping" />
                  <span>My Trips & Dashboard</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    closeMobileMenu();
                    if (onOpenProfile) onOpenProfile();
                  }}
                  className="p-2.5 rounded-xl bg-[#C6FF3D]/15 text-[#C6FF3D] border border-[#C6FF3D]/30 font-bold flex items-center gap-2 text-left"
                >
                  <User className="w-4 h-4" />
                  <span>Edit Profile Details</span>
                </button>
              </>
            )}

            <button 
              type="button"
              onClick={() => {
                sound.playClick();
                closeMobileMenu();
                if (onOpenAIChat) onOpenAIChat();
              }}
              className="p-2.5 rounded-xl bg-white/5 text-white hover:text-[#C6FF3D] border border-white/10 flex items-center gap-2 text-left"
            >
              <Sparkles className="w-4 h-4 text-[#C6FF3D]" />
              <span>SplitPay AI Assistant</span>
            </button>

            <a 
              href="#how-it-works" 
              className="p-2 text-white/70 hover:text-white cursor-pointer"
              onClick={(e) => scrollToSection(e, 'how-it-works')}
            >
              How It Works
            </a>

            <a 
              href="#problem" 
              className="p-2 text-white/70 hover:text-white cursor-pointer"
              onClick={(e) => scrollToSection(e, 'problem')}
            >
              The Problem &amp; Why SplitPay
            </a>

            <a 
              href="#features" 
              className="p-2 text-white/70 hover:text-white cursor-pointer"
              onClick={(e) => scrollToSection(e, 'features')}
            >
              Features
            </a>

            <a 
              href="#trust" 
              className="p-2 text-white/70 hover:text-white cursor-pointer"
              onClick={(e) => scrollToSection(e, 'trust')}
            >
              Security &amp; Razorpay
            </a>

            {!currentUser && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  closeMobileMenu();
                  onOpenAuth();
                }}
                className="mt-2 p-2.5 rounded-xl bg-white/10 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-[#C6FF3D]" />
                <span>Log In / Sign Up</span>
              </button>
            )}
          </nav>
        </div>
      )}

    </header>
  );
};

export default Navbar;
