import { useState, useEffect } from 'react';
import PerformanceBackground from './components/splitpay/PerformanceBackground';
import Navbar from './components/splitpay/Navbar';
import Hero3D from './components/splitpay/Hero3D';
import TripSplitterSection from './components/splitpay/TripSplitterSection';
import ProblemSection from './components/splitpay/ProblemSection';
import HowItWorks3D from './components/splitpay/HowItWorks3D';
import FeaturesGrid from './components/splitpay/FeaturesGrid';
import TrustRazorpay from './components/splitpay/TrustRazorpay';
import WaitlistSection from './components/splitpay/WaitlistSection';
import Footer from './components/splitpay/Footer';
import AuthModal from './components/splitpay/AuthModal';
import AIChatDrawer from './components/splitpay/AIChatDrawer';
import { sound } from './utils/audio';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [appliedAITripData, setAppliedAITripData] = useState(null);

  // Load persisted user session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('splitpay_user');
      const registeredRaw = localStorage.getItem('splitpay_registered_users');
      const registeredList = registeredRaw ? JSON.parse(registeredRaw) : [];

      if (stored) {
        const user = JSON.parse(stored);
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

  const scrollToSplitter = () => {
    sound.playClick();
    const el = document.getElementById('trip-splitter') || document.getElementById('create-split');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Called when user clicks "⚡ Apply to Trip Bill Creator" inside AI Chatbot
  const handleApplyAITrip = (tripData) => {
    setAppliedAITripData(tripData);
    scrollToSplitter();
  };

  return (
    <main className="min-h-screen bg-[#0B0C16] text-[#F5F3EE] relative selection:bg-[#C6FF3D] selection:text-[#0B0C16] overflow-x-hidden font-['Inter']">
      {/* High-Performance Hardware-Accelerated Ambient Backdrop */}
      <PerformanceBackground />

      {/* Floating Navigation Header */}
      <Navbar 
        onOpenWaitlist={scrollToWaitlist} 
        onOpenDemo={scrollToSplitter}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Clean, Fast Hero Section with Interactive Preview */}
      <Hero3D 
        onOpenWaitlist={scrollToWaitlist} 
        onOpenDemo={scrollToSplitter}
      />

      {/* The 3 Campus Problems */}
      <ProblemSection />

      {/* How SplitPay Works (3 Steps) */}
      <HowItWorks3D />

      {/* Dedicated Trip Bill Creator & Member Splitter Section */}
      <TripSplitterSection 
        currentUser={currentUser} 
        onOpenAuth={() => setIsAuthOpen(true)}
        externalTripData={appliedAITripData}
      />

      {/* Clean Feature Grid */}
      <FeaturesGrid />

      {/* Powered by Razorpay Security Vault */}
      <TrustRazorpay />

      {/* Campus VIP Early Access Waitlist */}
      <WaitlistSection />

      {/* Footer */}
      <Footer />

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* SplitPay AI Chatbot Drawer */}
      <AIChatDrawer 
        isOpen={isAIChatOpen}
        onToggle={() => setIsAIChatOpen(prev => !prev)}
        onApplyToSplitter={handleApplyAITrip}
        currentTripData={{
          tripName: 'Goa Trip',
          hostUpi: currentUser?.upiId || 'prince@oksbi'
        }}
      />
    </main>
  );
}

export default App;