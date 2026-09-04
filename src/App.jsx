import React, { useState, useEffect } from 'react';
import ThreeScene from './components/splitpay/ThreeScene';
import Navbar from './components/splitpay/Navbar';
import Hero3D from './components/splitpay/Hero3D';
import TripSplitterSection from './components/splitpay/TripSplitterSection';
import ProblemSection from './components/splitpay/ProblemSection';
import HowItWorks3D from './components/splitpay/HowItWorks3D';
import FeaturesGrid from './components/splitpay/FeaturesGrid';
import LiveSandbox from './components/splitpay/LiveSandbox';
import TrustRazorpay from './components/splitpay/TrustRazorpay';
import WaitlistSection from './components/splitpay/WaitlistSection';
import Footer from './components/splitpay/Footer';
import AuthModal from './components/splitpay/AuthModal';
import { sound } from './utils/audio';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Load persisted user session on mount (only if account actually exists in registered database)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('splitpay_user');
      const registeredRaw = localStorage.getItem('splitpay_registered_users');
      const registeredList = registeredRaw ? JSON.parse(registeredRaw) : [];

      if (stored) {
        const user = JSON.parse(stored);
        // Verify user is in registered list
        const exists = registeredList.some(u => u.email === user.email);
        if (exists) {
          setCurrentUser(user);
        } else {
          localStorage.removeItem('splitpay_user');
          setCurrentUser(null);
        }
      }
    } catch (e) {
      console.error(e);
      setCurrentUser(null);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleSignOut = () => {
    localStorage.removeItem('splitpay_user');
    setCurrentUser(null);
  };

  const scrollToWaitlist = () => {
    sound.playClick();
    const el = document.getElementById('waitlist');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSandbox = () => {
    sound.playClick();
    const el = document.getElementById('create-split');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#0B0C16] text-[#F5F3EE] relative selection:bg-[#C6FF3D] selection:text-[#0B0C16] overflow-x-hidden font-['Inter']">
      {/* 3D Three.js Interactive Background */}
      <ThreeScene />

      {/* Floating Navigation Header */}
      <Navbar 
        onOpenWaitlist={scrollToWaitlist} 
        onOpenDemo={scrollToSandbox}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Hero Section with 3D Gyroscopic Bill Card */}
      <Hero3D 
        onOpenWaitlist={scrollToWaitlist} 
        onOpenDemo={scrollToSandbox}
      />

      {/* Dedicated Trip Bill Creator & Member Splitter Section */}
      <TripSplitterSection 
        currentUser={currentUser} 
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* The 3 Campus Problems */}
      <ProblemSection />

      {/* How SplitPay Works (3 Steps) */}
      <HowItWorks3D />

      {/* Asymmetric 3D Bento Features Grid */}
      <FeaturesGrid />

      {/* Interactive 3D Bill Splitting Playground */}
      <LiveSandbox />

      {/* Powered by Razorpay Security Vault */}
      <TrustRazorpay />

      {/* Campus VIP Early Access Waitlist */}
      <WaitlistSection />

      {/* Footer */}
      <Footer />

      {/* Authentication Modal (Sign In / Create Account) */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </main>
  );
}

export default App;