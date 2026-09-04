import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  School, 
  Smartphone, 
  Phone,
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  RotateCcw,
  KeyRound,
  LogIn,
  UserPlus
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
  // 'login' | 'signup' | 'forgot'
  const [authTab, setAuthTab] = useState('login');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    college: campuses[0],
    upiId: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMessage('');
    setSuccessMessage('');
  };

  const switchTab = (tab) => {
    sound.playClick();
    setAuthTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanPassword = formData.password.trim();

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

    // Ensure currently active user is present in registered database
    try {
      const activeUser = localStorage.getItem('splitpay_user');
      if (activeUser) {
        const parsed = JSON.parse(activeUser);
        if (parsed && (parsed.email || parsed.phone)) {
          const exists = registeredUsers.some(u => 
            (u.email && parsed.email && u.email.toLowerCase() === parsed.email.toLowerCase()) ||
            (u.phone && parsed.phone && u.phone.replace(/\D/g, '') === parsed.phone.replace(/\D/g, ''))
          );
          if (!exists) {
            registeredUsers.push(parsed);
            localStorage.setItem('splitpay_registered_users', JSON.stringify(registeredUsers));
          }
        }
      }
    } catch (e) {
      // ignore
    }

    // ==========================================
    // 1. SIGN IN (LOGIN) FLOW
    // ==========================================
    if (authTab === 'login') {
      const identifier = formData.email.trim();
      if (!identifier) {
        setErrorMessage("Please enter your registered email address or mobile number.");
        return;
      }

      if (!cleanPassword) {
        setErrorMessage("Please enter your password.");
        return;
      }

      setLoading(true);
      sound.playClick();

      setTimeout(() => {
        setLoading(false);

        const isEmailInput = identifier.includes('@');
        const cleanLoginEmail = identifier.toLowerCase();
        const cleanLoginPhone = identifier.replace(/[\s+-]/g, '');

        // Search user by email OR mobile number
        const matchedUser = registeredUsers.find(u => {
          const userEmail = (u.email || '').toLowerCase().trim();
          const userPhone = (u.phone || '').replace(/[\s+-]/g, '').trim();

          if (isEmailInput && userEmail === cleanLoginEmail) return true;
          if (!isEmailInput && cleanLoginPhone.length >= 7) {
            if (userPhone === cleanLoginPhone) return true;
            if (userPhone.endsWith(cleanLoginPhone) || cleanLoginPhone.endsWith(userPhone)) return true;
          }
          if (userEmail === cleanLoginEmail) return true;
          if (userPhone && cleanLoginPhone && userPhone === cleanLoginPhone) return true;
          return false;
        });

        if (!matchedUser) {
          sound.playHover();
          setErrorMessage(`No account found with ${isEmailInput ? 'email' : 'mobile number'} "${identifier}". Please check or click "Create Account".`);
          return;
        }

        // Matched user exists: verify password
        if (matchedUser.password && matchedUser.password !== cleanPassword) {
          sound.playHover();
          setErrorMessage("Incorrect password. Click 'Forgot password?' below to reset it.");
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
      }, 350);
      return;
    }

    // ==========================================
    // 2. CREATE ACCOUNT (SIGN UP) FLOW
    // ==========================================
    if (authTab === 'signup') {
      const cleanName = formData.name.trim();
      const cleanEmail = formData.email.trim().toLowerCase();
      const cleanPhone = formData.phone.trim();
      const cleanPhoneDigits = cleanPhone.replace(/[\s+-]/g, '');

      if (!cleanName) {
        setErrorMessage("Please enter your full name.");
        return;
      }

      if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        setErrorMessage("Please enter a valid email address (e.g. prince@lpu.in or name@gmail.com).");
        return;
      }

      if (!cleanPhoneDigits || cleanPhoneDigits.length < 10) {
        setErrorMessage("Please enter a valid 10-digit mobile number.");
        return;
      }

      if (cleanPassword.length < 4) {
        setErrorMessage("Password must be at least 4 characters long.");
        return;
      }

      // Check if email or phone is already registered
      const existingUser = registeredUsers.find(u => {
        const userEmail = (u.email || '').toLowerCase().trim();
        const userPhone = (u.phone || '').replace(/[\s+-]/g, '').trim();
        return (userEmail === cleanEmail) || (userPhone && userPhone === cleanPhoneDigits);
      });

      if (existingUser) {
        if ((existingUser.email || '').toLowerCase().trim() === cleanEmail) {
          setErrorMessage(`An account already exists with email "${cleanEmail}". Please sign in or reset password.`);
        } else {
          setErrorMessage(`An account already exists with mobile number "${cleanPhone}". Please sign in or reset password.`);
        }
        return;
      }

      setLoading(true);
      sound.playClick();

      setTimeout(() => {
        setLoading(false);

        const newUser = {
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          password: cleanPassword,
          college: formData.college,
          upiId: formData.upiId.trim() || `${cleanPhoneDigits}@upi` || `${cleanName.toLowerCase().replace(/\s+/g, '')}@upi`,
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
      }, 350);
      return;
    }

    // ==========================================
    // 3. DEDICATED FORGOT PASSWORD FLOW
    // ==========================================
    if (authTab === 'forgot') {
      const identifier = formData.email.trim();
      if (!identifier) {
        setErrorMessage("Please enter your registered email or mobile number.");
        return;
      }

      if (cleanPassword.length < 4) {
        setErrorMessage("New password must be at least 4 characters long.");
        return;
      }

      if (cleanPassword !== formData.confirmPassword.trim()) {
        setErrorMessage("Password and Confirm Password do not match! Please check again.");
        return;
      }

      setLoading(true);
      sound.playClick();

      setTimeout(() => {
        setLoading(false);

        const isEmailInput = identifier.includes('@');
        const cleanLoginEmail = identifier.toLowerCase();
        const cleanLoginPhone = identifier.replace(/[\s+-]/g, '');

        let found = false;
        let updatedUser = null;

        const updatedList = registeredUsers.map(u => {
          const userEmail = (u.email || '').toLowerCase().trim();
          const userPhone = (u.phone || '').replace(/[\s+-]/g, '').trim();

          const isMatch = (isEmailInput && userEmail === cleanLoginEmail) ||
                          (!isEmailInput && cleanLoginPhone.length >= 7 && (userPhone === cleanLoginPhone || userPhone.endsWith(cleanLoginPhone) || cleanLoginPhone.endsWith(userPhone))) ||
                          (userEmail === cleanLoginEmail) ||
                          (userPhone && cleanLoginPhone && userPhone === cleanLoginPhone);

          if (isMatch) {
            found = true;
            updatedUser = { ...u, password: cleanPassword };
            return updatedUser;
          }
          return u;
        });

        if (!found) {
          // If user wasn't in registered list, create the account with this password
          updatedUser = {
            name: isEmailInput ? identifier.split('@')[0].replace(/[._]/g, ' ') : 'Campus Member',
            email: isEmailInput ? cleanLoginEmail : `${cleanLoginPhone}@campus.splitpay`,
            phone: !isEmailInput ? identifier : '9876543210',
            password: cleanPassword,
            college: campuses[0],
            upiId: `${identifier.replace(/[^a-zA-Z0-9]/g, '')}@upi`,
            roomNo: 'Hostel BH-4, Room 302',
            avatar: '👑',
            createdAt: new Date().toISOString()
          };
          updatedList.push(updatedUser);
        }

        localStorage.setItem('splitpay_registered_users', JSON.stringify(updatedList));
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
      }, 350);
      return;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto">
      <div className="w-full max-w-md my-auto max-h-[92vh] overflow-y-auto rounded-3xl bg-[#15162B] border border-[#C6FF3D]/40 p-5 sm:p-7 text-white shadow-2xl shadow-[#C6FF3D]/10 relative glass-card animate-in zoom-in-95 duration-200">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#C6FF3D]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            {authTab === 'forgot' ? (
              <button
                type="button"
                onClick={() => switchTab('login')}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                title="Back to Login"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-[#1B1B3A] border border-[#C6FF3D]/50 flex items-center justify-center text-[#C6FF3D] font-mono font-bold text-xs">
                S/P
              </div>
            )}
            <div>
              <h3 className="font-bold text-lg font-['Space_Grotesk'] text-white">
                {authTab === 'login' && "Member Sign In"}
                {authTab === 'signup' && "Create Account"}
                {authTab === 'forgot' && "Reset Password"}
              </h3>
              <p className="text-[11px] font-mono text-white/50">
                {authTab === 'login' && "Login with either your email or mobile number"}
                {authTab === 'signup' && "Register with your email & mobile number"}
                {authTab === 'forgot' && "Enter your registered email or phone to reset"}
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

        {/* Tabs switcher: only shown for Sign In and Sign Up (clean 2-tab view) */}
        {authTab !== 'forgot' && (
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#0B0C16] my-4 border border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => switchTab('login')}
              className={`py-2 px-2 rounded-xl transition-all cursor-pointer font-bold flex items-center justify-center gap-1.5 ${
                authTab === 'login' ? 'bg-[#C6FF3D] text-[#0B0C16] shadow-md' : 'text-white/60 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            
            <button
              type="button"
              onClick={() => switchTab('signup')}
              className={`py-2 px-2 rounded-xl transition-all cursor-pointer font-bold flex items-center justify-center gap-1.5 ${
                authTab === 'signup' ? 'bg-[#C6FF3D] text-[#0B0C16] shadow-md' : 'text-white/60 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="my-3 p-3 rounded-2xl bg-[#FF6B4A]/15 border border-[#FF6B4A]/40 text-[#FF6B4A] text-xs font-mono flex items-start gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-snug text-left flex-1">
              {errorMessage}
              {authTab === 'login' && errorMessage.includes("Incorrect password") && (
                <button
                  type="button"
                  onClick={() => switchTab('forgot')}
                  className="block mt-1.5 text-[#C6FF3D] underline font-bold hover:text-white cursor-pointer"
                >
                  Click here to Reset Password
                </button>
              )}
            </div>
          </div>
        )}

        {/* Success Alert Box */}
        {successMessage && (
          <div className="my-3 p-3 rounded-2xl bg-[#C6FF3D]/15 border border-[#C6FF3D]/40 text-[#C6FF3D] text-xs font-mono flex items-start gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-snug text-left flex-1">{successMessage}</div>
          </div>
        )}

        {/* ================================================================= */}
        {/* INTERFACE 1: SIGN IN (LOGIN)                                      */}
        {/* ================================================================= */}
        {authTab === 'login' && (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono text-left">
            {/* Email or Phone */}
            <div className="space-y-1">
              <label className="text-white/60 text-[11px]">EMAIL OR MOBILE NUMBER *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  name="email"
                  required
                  placeholder="Enter registered email or mobile number"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white placeholder-white/30 text-xs focus:border-[#C6FF3D] focus:outline-none transition-colors"
                />
              </div>
              <span className="text-[10px] text-white/40 font-mono block">
                Sign in with either your registered email or 10-digit mobile
              </span>
            </div>

            {/* Password with Eye Toggle & Reset Button */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-white/60 text-[11px]">PASSWORD *</label>
                <button
                  type="button"
                  onClick={() => switchTab('forgot')}
                  className="text-[11px] text-[#C6FF3D] hover:underline font-medium cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Enter password"
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

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#C6FF3D] hover:bg-[#b2f022] text-[#0B0C16] font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] active:scale-95 transition-all shadow-lg shadow-[#C6FF3D]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-[#0B0C16] border-t-transparent animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to SplitPay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Switch to SignUp */}
            <div className="text-center pt-2 text-[11px] text-white/50">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => switchTab('signup')}
                className="text-[#C6FF3D] font-bold underline hover:text-white cursor-pointer ml-1"
              >
                Create Account here
              </button>
            </div>
          </form>
        )}

        {/* ================================================================= */}
        {/* INTERFACE 2: CREATE ACCOUNT (SIGN UP)                             */}
        {/* ================================================================= */}
        {authTab === 'signup' && (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono text-left">
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

            {/* Email or Phone */}
            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-white/60 text-[11px]">EMAIL ADDRESS *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. prince@lpu.in or name@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white placeholder-white/30 text-xs focus:border-[#C6FF3D] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-1">
              <label className="text-white/60 text-[11px]">MOBILE NUMBER *</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. 9876543210 (10-digit mobile)"
                  value={formData.phone}
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
              <label className="text-white/60 text-[11px]">YOUR RECEIVING UPI ID (OPTIONAL)</label>
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

            {/* Password */}
            <div className="space-y-1">
              <label className="text-white/60 text-[11px]">PASSWORD *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Create a password (min. 4 characters)"
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

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#C6FF3D] hover:bg-[#b2f022] text-[#0B0C16] font-bold text-xs uppercase tracking-wider font-['Space_Grotesk'] active:scale-95 transition-all shadow-lg shadow-[#C6FF3D]/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-[#0B0C16] border-t-transparent animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Register &amp; Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Switch to Login */}
            <div className="text-center pt-2 text-[11px] text-white/50">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => switchTab('login')}
                className="text-[#C6FF3D] font-bold underline hover:text-white cursor-pointer ml-1"
              >
                Sign in here
              </button>
            </div>
          </form>
        )}

        {/* ================================================================= */}
        {/* INTERFACE 3: DEDICATED FORGOT & RESET PASSWORD INTERFACE          */}
        {/* ================================================================= */}
        {authTab === 'forgot' && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono text-left pt-1">
            
            {/* Registered Account Identifier */}
            <div className="space-y-1">
              <label className="text-white/70 text-[11px]">REGISTERED EMAIL OR MOBILE NUMBER *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  name="email"
                  required
                  placeholder="Enter registered email or 10-digit mobile"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white placeholder-white/30 text-xs focus:border-[#C6FF3D] focus:outline-none transition-colors"
                />
              </div>
              <span className="text-[10px] text-white/40 font-mono block">
                Enter either your registered email or phone to update password
              </span>
            </div>

            {/* 1. Enter New Password */}
            <div className="space-y-1">
              <label className="text-[#C6FF3D] text-[11px] font-bold">1. ENTER NEW PASSWORD *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C6FF3D]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Enter new password (min. 4 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0B0C16] border border-[#C6FF3D]/40 text-white placeholder-white/30 text-xs focus:border-[#C6FF3D] focus:outline-none transition-colors"
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

            {/* 2. Confirm Password */}
            <div className="space-y-1">
              <label className="text-[#C6FF3D] text-[11px] font-bold">2. CONFIRM PASSWORD *</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C6FF3D]" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0B0C16] border border-[#C6FF3D]/40 text-white placeholder-white/30 text-xs focus:border-[#C6FF3D] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setShowConfirmPassword(prev => !prev);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer p-0.5"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    <span>Resetting password...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Password &amp; Sign In</span>
                  </>
                )}
              </button>
            </div>

            {/* Back to Login */}
            <div className="text-center pt-2 text-[11px] text-white/50">
              Remembered your password?{' '}
              <button
                type="button"
                onClick={() => switchTab('login')}
                className="text-[#C6FF3D] font-bold underline hover:text-white cursor-pointer ml-1"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        <div className="text-[10px] text-white/40 text-center flex items-center justify-center gap-1 pt-4">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0082FB]" />
          <span>Encrypted credentials • Razorpay API Rails</span>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
