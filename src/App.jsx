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
import ReceiptOcrSection from './components/splitpay/ReceiptOcrSection';
import PaymentGatewayPage from './components/splitpay/PaymentGatewayPage';
import { sound } from './utils/audio';

function App() {
  const [gatewayData, setGatewayData] = useState(null);
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
          // Purge any old fake auto-generated UPI from previous sessions
          if (user.upiId && (user.upiId.includes('9876543210') || user.upiId.endsWith('@campus.splitpay') || user.upiId === 'prince@oksbi' || user.upiId === 'prince@upi' || user.upiId.endsWith('@upi'))) {
            user.upiId = '';
            localStorage.setItem('splitpay_user', JSON.stringify(user));
          }
          setCurrentUser(user);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Detect if user opened the URL via a verified payment gateway link (?pay=true)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      let hashParams = null;
      if (window.location.hash.includes('?')) {
        hashParams = new URLSearchParams(window.location.hash.substring(window.location.hash.indexOf('?')));
      }

      const isPay = searchParams.get('pay') === 'true' || hashParams?.get('pay') === 'true';
      if (isPay) {
        setGatewayData({
          friend: searchParams.get('friend') || hashParams?.get('friend') || 'Friend',
          amount: Number(searchParams.get('amount') || hashParams?.get('amount') || 0),
          host: searchParams.get('host') || hashParams?.get('host') || 'Organizer',
          upi: searchParams.get('upi') || hashParams?.get('upi') || '',
          trip: searchParams.get('trip') || hashParams?.get('trip') || 'Group Expense',
          billId: searchParams.get('billId') || hashParams?.get('billId') || 'SP-' + Date.now()
        });
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

  // If opened via payment gateway link, render the verified Payment Gateway Page
  if (gatewayData) {
    return (
      <PaymentGatewayPage
        gatewayData={gatewayData}
        onBackToApp={() => {
          setGatewayData(null);
          try {
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.pushState({}, '', cleanUrl);
          } catch (e) {}
        }}
      />
    );
  }

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

          {/* Smart Receipt OCR & Auto-Itemized Split */}
          <ReceiptOcrSection 
            currentUser={currentUser}
            onApplyToSplitter={handleApplyAITrip}
          />
        </div>
      ) : (
        /* Public Visitor Experience: Complete Landing Page Before Login */
        <div className="pt-16 space-y-0">
          <Hero3D 
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenHowItWorks={() => {
              const el = document.getElementById('how-it-works');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                setIsHowItWorksOpen(true);
              }
            }}
            onOpenDemo={() => setIsAuthOpen(true)}
          />

          {/* How SplitPay Works (Visible immediately before login) */}
          <HowItWorks3D 
            onOpenInteractiveDemo={() => setIsHowItWorksOpen(true)} 
            onOpenAuth={() => setIsAuthOpen(true)} 
          />

          {/* The Shared Bill Problem Section */}
          <ProblemSection />

          {/* Core Features Section */}
          <FeaturesGrid />

          {/* Enterprise Payment Infrastructure / Razorpay Security */}
          <TrustRazorpay />
        </div>
      )}

      {/* Footer */}
      <Footer onOpenHowItWorks={() => setIsHowItWorksOpen(true)} />

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
          tripName: 'Group Split',
          hostName: currentUser?.name || 'You (Host)',
          hostUpi: currentUser?.upiId || ''
        }}
        currentUser={currentUser}
      />
    </main>
  );
}

export default App;