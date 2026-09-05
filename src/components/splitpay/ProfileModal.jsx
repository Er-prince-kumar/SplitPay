import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Smartphone, 
  School, 
  Home, 
  CheckCircle2, 
  Sparkles, 
  Save, 
  ShieldCheck, 
  Copy, 
  Check,
  AlertCircle
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

const avatarsList = ['👑', '👨‍💻', '👩‍🎨', '🎒', '🕶️', '⚡', '🚀', '🏄', '🎧', '🎸', '⚽', '🎯'];

const ProfileModal = ({ isOpen, onClose, currentUser, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    upiId: '',
    college: campuses[0],
    roomNo: '',
    avatar: '👑'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        upiId: currentUser.upiId || '',
        college: currentUser.college || campuses[0],
        roomNo: currentUser.roomNo || '',
        avatar: currentUser.avatar || '👑'
      });
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  // Calculate profile completion percentage
  let completionScore = 0;
  if (formData.name.trim()) completionScore += 20;
  if (formData.email.trim()) completionScore += 20;
  if (formData.phone.trim()) completionScore += 20;
  if (formData.upiId.trim()) completionScore += 20;
  if (formData.college.trim()) completionScore += 10;
  if (formData.roomNo.trim()) completionScore += 10;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSavedSuccess(false);
  };

  const handleSelectAvatar = (av) => {
    sound.playClick();
    setFormData(prev => ({ ...prev, avatar: av }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sound.playClick();
    sound.playUpiSuccess();

    const updatedUser = {
      ...currentUser,
      ...formData,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      upiId: formData.upiId.trim(),
      roomNo: formData.roomNo.trim()
    };

    // Update in local storage
    localStorage.setItem('splitpay_user', JSON.stringify(updatedUser));

    // Update in registered users list
    try {
      const storedUsers = localStorage.getItem('splitpay_registered_users');
      const registeredList = storedUsers ? JSON.parse(storedUsers) : [];
      let found = false;
      const updatedList = registeredList.map(u => {
        const match = (u.email && updatedUser.email && u.email.toLowerCase() === updatedUser.email.toLowerCase()) ||
                      (u.phone && updatedUser.phone && u.phone.replace(/\D/g, '') === updatedUser.phone.replace(/\D/g, ''));
        if (match) {
          found = true;
          return { ...u, ...updatedUser };
        }
        return u;
      });
      if (!found) {
        updatedList.push(updatedUser);
      }
      localStorage.setItem('splitpay_registered_users', JSON.stringify(updatedList));
    } catch (err) {
      console.warn("Could not sync registered users", err);
    }

    if (onUpdateProfile) {
      onUpdateProfile(updatedUser);
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#C6FF3D', '#0082FB', '#25D366']
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto">
      <div className="w-full max-w-lg my-auto max-h-[92vh] overflow-y-auto rounded-3xl bg-[#14152A] border border-[#C6FF3D]/40 p-5 sm:p-7 text-white shadow-2xl shadow-[#C6FF3D]/10 relative animate-in zoom-in-95 duration-200">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#C6FF3D]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C6FF3D]/10 border border-[#C6FF3D]/40 flex items-center justify-center text-[#C6FF3D] font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg font-['Space_Grotesk'] text-white">
                Member Profile & Details
              </h3>
              <p className="text-[11px] font-mono text-white/50">
                Complete your details for automatic UPI settlements & split links
              </p>
            </div>
          </div>

          <button 
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Completion Meter */}
        <div className="p-3.5 rounded-2xl bg-[#0B0C16] border border-white/10 my-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white/70 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C6FF3D]" />
              <span>Profile Completion</span>
            </span>
            <span className="font-bold text-[#C6FF3D]">{completionScore}% Completed</span>
          </div>

          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#0082FB] to-[#C6FF3D] rounded-full transition-all duration-300"
              style={{ width: `${completionScore}%` }}
            />
          </div>

          <p className="text-[10px] text-white/40 font-mono">
            {completionScore < 100 
              ? "Tip: Add your Phone Number and Hostel Room to reach 100% and enable 1-tap WhatsApp notifications."
              : "✓ Your profile is 100% complete and fully verified!"}
          </p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          
          {/* Avatar Selector */}
          <div className="space-y-1.5">
            <label className="text-white/60 block">CHOOSE YOUR AVATAR</label>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {avatarsList.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => handleSelectAvatar(av)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 transition-all cursor-pointer ${
                    formData.avatar === av
                      ? 'bg-[#C6FF3D]/20 border-2 border-[#C6FF3D] scale-110'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name & Email Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-white/60 block">FULL NAME</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Prince Kumar"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0B0C16] border border-white/15 text-white focus:border-[#C6FF3D] focus:outline-none transition-colors"
                />
                <User className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-white/60 block">EMAIL ADDRESS</label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  name="email"
                  value={formData.email}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0B0C16]/50 border border-white/10 text-white/50 cursor-not-allowed"
                />
                <Mail className="w-3.5 h-3.5 text-white/30 absolute left-2.5 top-3" />
              </div>
            </div>
          </div>

          {/* Phone Number & UPI ID Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-white/60 block">PHONE (FOR WHATSAPP NUDGES)</label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0B0C16] border border-white/15 text-white focus:border-[#C6FF3D] focus:outline-none transition-colors"
                />
                <Phone className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-3" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-white/60 block">PRIMARY UPI ID (FOR RECEIVING MONEY)</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  placeholder="e.g. prince@oksbi"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0B0C16] border border-white/15 text-white font-bold focus:border-[#C6FF3D] focus:outline-none transition-colors"
                />
                <Smartphone className="w-3.5 h-3.5 text-[#C6FF3D] absolute left-2.5 top-3" />
              </div>
            </div>
          </div>

          {/* College / University */}
          <div className="space-y-1.5">
            <label className="text-white/60 block">CAMPUS / UNIVERSITY</label>
            <div className="relative">
              <select
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0B0C16] border border-white/15 text-white focus:border-[#C6FF3D] focus:outline-none transition-colors appearance-none cursor-pointer"
              >
                {campuses.map(c => (
                  <option key={c} value={c} className="bg-[#0B0C16] text-white">{c}</option>
                ))}
              </select>
              <School className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Hostel / Flat Room */}
          <div className="space-y-1.5">
            <label className="text-white/60 block">HOSTEL / FLAT / ROOM NUMBER</label>
            <div className="relative">
              <input
                type="text"
                name="roomNo"
                value={formData.roomNo}
                onChange={handleChange}
                placeholder="e.g. Hostel BH-4, Room 302 / Sunrise Apts Flat 2B"
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0B0C16] border border-white/15 text-white focus:border-[#C6FF3D] focus:outline-none transition-colors"
              />
              <Home className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Success Alert */}
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] flex items-center gap-2 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Profile details successfully updated and saved!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#C6FF3D] hover:bg-[#b5f422] text-[#0B0C16] font-bold font-['Space_Grotesk'] text-sm transition-all shadow-md shadow-[#C6FF3D]/20 cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ProfileModal;
