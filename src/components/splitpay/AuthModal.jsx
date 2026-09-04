import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  School, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Zap, 
  ShieldCheck,
  Eye,
  EyeOff,
  Phone,
  KeyRound,
  RotateCcw
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
  "Other University / College"
];

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: campuses[0],
    upiId: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showResetOption, setShowResetOption] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
    setShowResetOption(false);
  };

  const handleQuickLogin = (demoProfile) => {
    sound.playClick();
    localStorage.setItem('splitpay_user', JSON.stringify(demoProfile));
    
    try {
      const stored = localStorage.getItem('splitpay_registered_users');
      const list = stored ? JSON.parse(stored) : [];
      if (!list.some(u => u.email === demoProfile.email)) {
        list.push(demoProfile);
        localStorage.setItem('splitpay_registered_users', JSON.stringify(list));
      }
    } catch (err) {}

    sound.playUpiSuccess();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C6FF3D', '#0082FB', '#25D366']
    });

    onLoginSuccess(demoProfile);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setShowResetOption(false);

    const cleanIdentifier = formData.email.trim().toLowerCase();
    const cleanPassword = formData.password.trim();

    if (!cleanIdentifier) {
      setErrorMessage("Please enter your email address or mobile number.");
      return;
    }

    if (!cleanPassword) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setLoading(true);
    sound.playClick();

    // Fetch existing registered accounts database
    let registeredUsers = [];
    try {
      const stored = localStorage.getItem('splitpay_registered_users');
      if (stored) {
        registeredUsers = JSON.parse(stored);
      }
    } catch (err) {
      registeredUsers = [];
    }

    setTimeout(() => {
      setLoading(false);

      if (isSignUp) {
        // --- SIGN UP / ACCOUNT CREATION FLOW ---
        if (!formData.name.trim()) {
          setErrorMessage("Please enter your full name.");
          return;
        }

        if (cleanPassword.length < 4) {
          setErrorMessage("Password must be at least 4 characters.");
          return;
        }

        // Check if email or phone already registered
        const existingUser = registeredUsers.find(u => 
          (u.email && u.email.toLowerCase() === cleanIdentifier) ||
          (u.phone && u.phone.replace(/[\s+-]/g, '') === cleanIdentifier.replace(/[\s+-]/g, ''))
        );

        if (existingUser) {
          setErrorMessage("An account already exists with this email/phone! Click 'Sign In' tab above.");
          setShowResetOption(true);
          return;
        }

        const isEmail = cleanIdentifier.includes('@');
        // Create new account
        const newUser = {
          name: formData.name.trim(),
          email: isEmail ? cleanIdentifier : `${cleanIdentifier}@campus.splitpay`,
          phone: !isEmail ? cleanIdentifier : '9876543210',
          password: cleanPassword,
          college: formData.college,
          upiId: formData.upiId.trim() || `${formData.name.trim().toLowerCase().replace(/\s+/g, '')}@upi`,
          roomNo: 'Hostel BH-4, Room 302',
          avatar: '👑',
          createdAt: new Date().toISOString()
        };

        const updatedUsers = [...registeredUsers, newUser];
        localStorage.setItem('splitpay_registered_users', JSON.stringify(updatedUsers));
        localStorage.setItem('splitpay_user', JSON.stringify(newUser));

        sound.playUpiSuccess();
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C6FF3D', '#0082FB', '#FFFFFF']
        });

        onLoginSuccess(newUser);
        onClose();

      } else {
        // --- SIGN IN / LOGIN FLOW ---
        // Find existing user by email or mobile number
        const matchedUser = registeredUsers.find(u => 
          (u.email && u.email.toLowerCase() === cleanIdentifier) ||
          (u.phone && u.phone.replace(/[\s+-]/g, '') === cleanIdentifier.replace(/[\s+-]/g, ''))
        );

        if (!matchedUser) {
          // Seamless auto-provisioning so user is never blocked or locked out
          const isEmail = cleanIdentifier.includes('@');
          const autoName = isEmail 
            ? cleanIdentifier.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) 
            : 'Campus Member';

          const autoUser = {
            name: autoName || 'Prince Kumar',
            email: isEmail ? cleanIdentifier : `${cleanIdentifier}@campus.splitpay`,
            phone: !isEmail ? cleanIdentifier : '9876543210',
            password: cleanPassword,
            college: campuses[0],
            upiId: `${cleanIdentifier.replace(/[^a-zA-Z0-9]/g, '')}@upi`,
            roomNo: 'Hostel BH-4, Room 302',
            avatar: '👑',
            createdAt: new Date().toISOString()
          };

          registeredUsers.push(autoUser);
          localStorage.setItem('splitpay_registered_users', JSON.stringify(registeredUsers));
          localStorage.setItem('splitpay_user', JSON.stringify(autoUser));
          
          sound.playUpiSuccess();
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#C6FF3D', '#0082FB', '#FFFFFF']
          });

          onLoginSuccess(autoUser);
          onClose();
          return;
        }

        // Matched user exists: check password
        if (matchedUser.password && matchedUser.password !== cleanPassword) {
          sound.playHover();
          setErrorMessage("❌ Password match nahi kiya. Kripya apna password check karein ya neeche 'Reset Password' par click karein.");
          setShowResetOption(true);
          return;
        }

        // Successfully authenticated!
        localStorage.setItem('splitpay_user', JSON.stringify(matchedUser));
        sound.playUpiSuccess();

        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#C6FF3D', '#0082FB', '#FFFFFF']
        });

        onLoginSuccess(matchedUser);
        onClose();
      }
    }, 350);
  };

  const handleResetPasswordAndLogin = () => {
    sound.playClick();
    const cleanIdentifier = formData.email.trim().toLowerCase() || 'prince@lpu.in';
    const newPassword = formData.password.trim() || 'password123';

    try {
      const stored = localStorage.getItem('splitpay_registered_users');
      let list = stored ? JSON.parse(stored) : [];
      let found = false;

      list = list.map(u => {
        if ((u.email && u.email.toLowerCase() === cleanIdentifier) || 
            (u.phone && u.phone.replace(/[\s+-]/g, '') === cleanIdentifier.replace(/[\s+-]/g, ''))) {
          found = true;
          return { ...u, password: newPassword };
        }
        return u;
      });

      const updatedUser = found 
        ? list.find(u => (u.email && u.email.toLowerCase() === cleanIdentifier) || (u.phone && u.phone === cleanIdentifier))
        : {
            name: cleanIdentifier.split('@')[0] || 'Prince Kumar',
            email: cleanIdentifier.includes('@') ? cleanIdentifier : `${cleanIdentifier}@campus.splitpay`,
            phone: !cleanIdentifier.includes('@') ? cleanIdentifier : '9876543210',
            password: newPassword,
            college: campuses[0],
            upiId: 'prince@oksbi',
            roomNo: 'Hostel BH-4, Room 302',
            avatar: '👑',
            createdAt: new Date().toISOString()
          };

      if (!found) {
        list.push(updatedUser);
      }

      localStorage.setItem('splitpay_registered_users', JSON.stringify(list));
      localStorage.setItem('splitpay_user', JSON.stringify(updatedUser));

      sound.playUpiSuccess();
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C6FF3D', '#0082FB', '#FFFFFF']
      });

      onLoginSuccess(updatedUser);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const switchTab = (toSignUp) => {
    sound.playClick();
    setIsSignUp(toSignUp);
    setErrorMessage('');
    setShowResetOption(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto">
      <div className="w-full max-w-md my-auto max-h-[92vh] overflow-y-auto rounded-3xl bg-[#15162B] border border-[#C6FF3D]/40 p-5 sm:p-8 text-white shadow-2xl shadow-[#C6FF3D]/10 relative glass-card animate-in zoom-in-95 duration-200">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#C6FF3D]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1B1B3A] border border-[#C6FF3D]/50 flex items-center justify-center text-[#C6FF3D] font-mono font-bold text-xs">
              S/P
            </div>
            <div>
              <h3 className="font-bold text-lg font-['Space_Grotesk'] text-white">
                {isSignUp ? "Create Campus Account" : "Member Sign In"}
              </h3>
              <p className="text-[11px] font-mono text-white/50">
                {isSignUp ? "Register to manage and split campus expenses" : "Sign in to your SplitPay account"}
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Switch Tabs (Login vs Sign Up) */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#0B0C16] my-4 border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => switchTab(false)}
            className={`py-2 rounded-xl transition-all cursor-pointer font-bold ${
              !isSignUp ? 'bg-[#C6FF3D] text-[#0B0C16] shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchTab(true)}
            className={`py-2 rounded-xl transition-all cursor-pointer font-bold ${
              isSignUp ? 'bg-[#C6FF3D] text-[#0B0C16] shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* 1-Tap Quick Demo Login Options */}
        <div className="space-y-1.5 mb-4">
          <label className="text-[10px] font-mono text-white/40 block text-left">
            QUICK 1-TAP LOGIN (NO TYPING NEEDED):
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin({
                name: 'Prince Kumar',
                email: 'prince@lpu.in',
                password: 'password123',
                college: 'Lovely Professional University (LPU)',
                upiId: 'prince@oksbi',
                phone: '9876543210',
                roomNo: 'Hostel BH-4, Room 302',
                avatar: '👑',
                createdAt: new Date().toISOString()
              })}
              className="py-2 px-2.5 rounded-xl bg-[#C6FF3D]/10 hover:bg-[#C6FF3D]/20 border border-[#C6FF3D]/30 hover:border-[#C6FF3D] text-[#C6FF3D] font-bold text-[11px] font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 text-left"
            >
              <Zap className="w-3.5 h-3.5 shrink-0 fill-current" />
              <span className="truncate">Prince Kumar (LPU)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin({
                name: 'Ananya Sharma',
                email: 'ananya@du.ac.in',
                password: 'password123',
                college: 'Delhi University (DU)',
                upiId: 'ananya@paytm',
                phone: '9811223344',
                roomNo: 'Kaveri Hostel, Room 104',
                avatar: '👩‍🎨',
                createdAt: new Date().toISOString()
              })}
              className="py-2 px-2.5 rounded-xl bg-[#0082FB]/10 hover:bg-[#0082FB]/20 border border-[#0082FB]/30 hover:border-[#0082FB] text-[#0082FB] font-bold text-[11px] font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 text-left"
            >
              <Zap className="w-3.5 h-3.5 shrink-0 fill-current" />
              <span className="truncate">Ananya (DU)</span>
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-[#FF6B4A]/15 border border-[#FF6B4A]/40 text-[#FF6B4A] text-xs font-mono flex items-start gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-snug text-left flex-1">
              <div>{errorMessage}</div>
              {showResetOption && (
                <button
                  type="button"
                  onClick={handleResetPasswordAndLogin}
                  className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF6B4A]/20 hover:bg-[#FF6B4A]/30 text-white font-bold text-[11px] transition-colors cursor-pointer border border-[#FF6B4A]/50"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Update Password &amp; Sign In Now</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono text-left">
          
          {isSignUp && (
            <>
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-white/60 text-[11px]">FULL NAME *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Prince Kumar"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white placeholder-white/30 text-xs focus:border-[#C6FF3D] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* College */}
              <div className="space-y-1">
                <label className="text-white/60 text-[11px]">COLLEGE / CAMPUS</label>
                <div className="relative">
                  <School className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <select
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white text-xs focus:border-[#C6FF3D] focus:outline-none transition-colors cursor-pointer"
                  >
                    {campuses.map(c => (
                      <option key={c} value={c} className="bg-[#0B0C16] text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Receiving UPI ID */}
              <div className="space-y-1">
                <label className="text-white/60 text-[11px]">YOUR RECEIVING UPI ID (FOR HOST SETTLEMENTS)</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C6FF3D]" />
                  <input
                    type="text"
                    name="upiId"
                    placeholder="e.g. prince@oksbi or 9876543210@paytm"
                    value={formData.upiId}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white placeholder-white/30 text-xs focus:border-[#C6FF3D] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email or Phone Number */}
          <div className="space-y-1">
            <label className="text-white/60 text-[11px]">
              {isSignUp ? "EMAIL OR MOBILE NUMBER *" : "EMAIL OR MOBILE NUMBER *"}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                name="email"
                required
                placeholder="e.g. prince@lpu.in or 9876543210"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white placeholder-white/30 text-xs focus:border-[#C6FF3D] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Password with Show/Hide Toggle */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-white/60 text-[11px]">PASSWORD *</label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setShowResetOption(true);
                    setErrorMessage("Enter your new password below and click 'Update Password & Sign In Now'");
                  }}
                  className="text-[10px] text-[#C6FF3D]/80 hover:text-[#C6FF3D] cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Enter password (e.g. password123)"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white placeholder-white/30 text-xs focus:border-[#C6FF3D] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowPassword(prev => !prev);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer p-0.5"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#C6FF3D] hover:bg-[#b2f022] text-[#0B0C16] font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] active:scale-95 transition-all shadow-lg shadow-[#C6FF3D]/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-[#0B0C16] border-t-transparent animate-spin" />
                  <span>Verifying account...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? "Register & Create Account" : "Sign In to SplitPay"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Bottom Switch Helper */}
          <div className="text-center pt-2 text-[11px] text-white/50">
            {!isSignUp ? (
              <span>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => switchTab(true)}
                  className="text-[#C6FF3D] font-bold underline hover:text-white cursor-pointer ml-1"
                >
                  Create one here
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => switchTab(false)}
                  className="text-[#C6FF3D] font-bold underline hover:text-white cursor-pointer ml-1"
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>

          <div className="text-[10px] text-white/40 text-center flex items-center justify-center gap-1 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0082FB]" />
            <span>Encrypted credentials • Razorpay API Rails</span>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AuthModal;
