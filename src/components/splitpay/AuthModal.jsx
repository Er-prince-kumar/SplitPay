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
  // 3 distinct views: 'login' | 'signup' | 'forgot'
  const [authTab, setAuthTab] = useState('login');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: campuses[0],
    upiId: ''
  });

  const [showPassword, setShowPassword] = useState(false);
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

    const cleanIdentifier = formData.email.trim().toLowerCase();
    const cleanPassword = formData.password.trim();

    if (!cleanIdentifier) {
      setErrorMessage("Please enter your email or mobile number.");
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

      // ==========================================
      // 1. SIGN IN (LOGIN) INTERFACE FLOW
      // ==========================================
      if (authTab === 'login') {
        const matchedUser = registeredUsers.find(u => 
          (u.email && u.email.toLowerCase() === cleanIdentifier) ||
          (u.phone && u.phone.replace(/[\s+-]/g, '') === cleanIdentifier.replace(/[\s+-]/g, ''))
        );

        if (!matchedUser) {
          // Seamless auto-provisioning so user is never locked out
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

        // Matched user exists: verify password
        if (matchedUser.password && matchedUser.password !== cleanPassword) {
          sound.playHover();
          setErrorMessage("Incorrect password. Click 'Forgot Password' above to reset your password.");
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
        return;
      }

      // ==========================================
      // 2. CREATE ACCOUNT (SIGN UP) INTERFACE FLOW
      // ==========================================
      if (authTab === 'signup') {
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
          setErrorMessage("An account already exists with this email/phone! Please switch to Sign In.");
          return;
        }

        const isEmail = cleanIdentifier.includes('@');
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
        return;
      }

      // ==========================================
      // 3. FORGOT PASSWORD INTERFACE FLOW
      // ==========================================
      if (authTab === 'forgot') {
        if (cleanPassword.length < 4) {
          setErrorMessage("New password must be at least 4 characters long.");
          return;
        }

        if (cleanPassword !== formData.confirmPassword.trim()) {
          setErrorMessage("New password and confirm password do not match!");
          return;
        }

        let found = false;
        let updatedUser = null;

        const updatedList = registeredUsers.map(u => {
          if ((u.email && u.email.toLowerCase() === cleanIdentifier) || 
              (u.phone && u.phone.replace(/[\s+-]/g, '') === cleanIdentifier.replace(/[\s+-]/g, ''))) {
            found = true;
            updatedUser = { ...u, password: cleanPassword };
            return updatedUser;
          }
          return u;
        });

        if (!found) {
          // If user didn't exist in cache, create them with the new password
          const isEmail = cleanIdentifier.includes('@');
          updatedUser = {
            name: isEmail ? cleanIdentifier.split('@')[0] : 'Campus Member',
            email: isEmail ? cleanIdentifier : `${cleanIdentifier}@campus.splitpay`,
            phone: !isEmail ? cleanIdentifier : '9876543210',
            password: cleanPassword,
            college: campuses[0],
            upiId: `${cleanIdentifier.replace(/[^a-zA-Z0-9]/g, '')}@upi`,
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
      }

    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto">
      <div className="w-full max-w-md my-auto max-h-[92vh] overflow-y-auto rounded-3xl bg-[#15162B] border border-[#C6FF3D]/40 p-5 sm:p-7 text-white shadow-2xl shadow-[#C6FF3D]/10 relative glass-card animate-in zoom-in-95 duration-200">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#C6FF3D]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1B1B3A] border border-[#C6FF3D]/50 flex items-center justify-center text-[#C6FF3D] font-mono font-bold text-xs">
              S/P
            </div>
            <div>
              <h3 className="font-bold text-lg font-['Space_Grotesk'] text-white">
                {authTab === 'login' && "Member Sign In"}
                {authTab === 'signup' && "Create Account"}
                {authTab === 'forgot' && "Forgot Password"}
              </h3>
              <p className="text-[11px] font-mono text-white/50">
                {authTab === 'login' && "Sign in to your registered SplitPay account"}
                {authTab === 'signup' && "Register to manage and split campus bills"}
                {authTab === 'forgot' && "Reset your password and regain instant access"}
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

        {/* 3 Dedicated Segmented Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#0B0C16] my-4 border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => switchTab('login')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer font-bold flex items-center justify-center gap-1.5 ${
              authTab === 'login' ? 'bg-[#C6FF3D] text-[#0B0C16] shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          
          <button
            type="button"
            onClick={() => switchTab('signup')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer font-bold flex items-center justify-center gap-1.5 ${
              authTab === 'signup' ? 'bg-[#C6FF3D] text-[#0B0C16] shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="truncate">Sign Up</span>
          </button>

          <button
            type="button"
            onClick={() => switchTab('forgot')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer font-bold flex items-center justify-center gap-1.5 ${
              authTab === 'forgot' ? 'bg-[#C6FF3D] text-[#0B0C16] shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="truncate">Forgot</span>
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-[#FF6B4A]/15 border border-[#FF6B4A]/40 text-[#FF6B4A] text-xs font-mono flex items-start gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-snug text-left flex-1">{errorMessage}</div>
          </div>
        )}

        {/* Success Alert Box */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-[#C6FF3D]/15 border border-[#C6FF3D]/40 text-[#C6FF3D] text-xs font-mono flex items-start gap-2 animate-in fade-in duration-150">
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
                  placeholder="e.g. prince@lpu.in or 9876543210"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white placeholder-white/30 text-xs focus:border-[#C6FF3D] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password with Eye Toggle */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-white/60 text-[11px]">PASSWORD *</label>
                <button
                  type="button"
                  onClick={() => switchTab('forgot')}
                  className="text-[10px] text-[#C6FF3D]/80 hover:text-[#C6FF3D] cursor-pointer"
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
            <div className="space-y-1">
              <label className="text-white/60 text-[11px]">EMAIL OR MOBILE NUMBER *</label>
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
        {/* INTERFACE 3: FORGOT PASSWORD                                      */}
        {/* ================================================================= */}
        {authTab === 'forgot' && (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono text-left">
            {/* Email or Phone */}
            <div className="space-y-1">
              <label className="text-white/60 text-[11px]">REGISTERED EMAIL OR MOBILE NUMBER *</label>
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

            {/* New Password */}
            <div className="space-y-1">
              <label className="text-white/60 text-[11px]">NEW PASSWORD *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Enter new password (min. 4 characters)"
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

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label className="text-white/60 text-[11px]">CONFIRM NEW PASSWORD *</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="Re-enter new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#0B0C16] border border-white/15 text-white placeholder-white/30 text-xs focus:border-[#C6FF3D] focus:outline-none transition-colors"
                />
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
                    <span>Updating password...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>Update Password &amp; Sign In</span>
                  </>
                )}
              </button>
            </div>

            {/* Switch back to Login */}
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
