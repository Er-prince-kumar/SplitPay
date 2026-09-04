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
import UserDashboard from './components/splitpay/UserDashboard';
import ProfileModal from './components/splitpay/ProfileModal';
import HowItWorksModal from './components/splitpay/HowItWorksModal';
import { sound } from './utils/audio';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [appliedAITripData, setAppliedAITripData] = useState(null);

  // Load persisted user session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('splitpay_user');
      if (stored) {
        const user = JSON.parse(stored);
        if (user && user.email) {
          setCurrentUser(user);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Called when user clicks "Open in Splitter" on any trip in UserDashboard
  const handleSelectTrip = (trip) => {
    setAppliedAITripData(trip);
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
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
      />

      {/* Logged-In User Experience: User Dashboard is Top Hero! */}
      {currentUser ? (
        <div className="pt-20 space-y-4">
          <UserDashboard 
            currentUser={currentUser}
            onSelectTrip={handleSelectTrip}
            onOpenAIChat={() => setIsAIChatOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
          />

          {/* Active Trip Bill Splitter */}
          <TripSplitterSection 
            currentUser={currentUser} 
            onOpenAuth={() => setIsAuthOpen(true)}
            externalTripData={appliedAITripData}
          />

          {/* How It Works & Value Proposition */}
          <HowItWorks3D />
          <ProblemSection />

          {/* Core Features & Security */}
          <FeaturesGrid />
          <TrustRazorpay />
        </div>
      ) : (
        /* Public Visitor Experience: Clean Single-Screen Hero Experience */
        <div className="min-h-screen flex flex-col justify-between pt-16">
          <Hero3D 
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
            onOpenDemo={() => setIsAuthOpen(true)}
          />
          <footer className="py-3 px-4 border-t border-white/10 text-center text-xs text-white/40 font-mono">
            &copy; {new Date().getFullYear()} SplitPay &bull; Fast, simple UPI bill splitting for campus &amp; trips.
          </footer>
        </div>
      )}

      {/* Footer (Rendered when logged in) */}
      {currentUser && (
        <Footer onOpenHowItWorks={() => setIsHowItWorksOpen(true)} />
      )}

      {/* Interactive How It Works Walkthrough Modal */}
      <HowItWorksModal 
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onOpenSplitter={scrollToSplitter}
      />

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* User Profile & Details Completion Modal */}
      <ProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={(updated) => setCurrentUser(updated)}
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