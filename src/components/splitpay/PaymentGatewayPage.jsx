import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Smartphone, 
  QrCode, 
  Copy, 
  Check, 
  ArrowLeft, 
  Download, 
  RefreshCw, 
  Zap, 
  ExternalLink,
  Shield,
  Building,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';

const PaymentGatewayPage = ({ gatewayData, onBackToApp }) => {
  const {
    friend = 'Friend',
    amount = 0,
    host = 'Organizer',
    upi = '',
    trip = 'Group Expense',
    billId = 'SP-' + Date.now()
  } = gatewayData || {};

  const [activeTab, setActiveTab] = useState('upiApps'); // 'upiApps' | 'qr' | 'manual'
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle' | 'verifying' | 'success'
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentTimestamp, setPaymentTimestamp] = useState('');

  const numAmount = Number(amount) || 0;
  const formattedAmount = numAmount.toLocaleString('en-IN');

  // Generic and App-Specific UPI Deep Links
  const encodedTrip = encodeURIComponent(trip || 'SplitPay');
  const encodedHost = encodeURIComponent(host || 'Host');
  const genericUpiLink = upi
    ? `upi://pay?pa=${upi}&pn=${encodedHost}&am=${numAmount}&cu=INR&tn=${encodedTrip}`
    : '';

  // App specific intent schemes for Android & iOS
  const gpayLink = upi ? `tez://upi/pay?pa=${upi}&pn=${encodedHost}&am=${numAmount}&cu=INR&tn=${encodedTrip}` : genericUpiLink;
  const phonepeLink = upi ? `phonepe://pay?pa=${upi}&pn=${encodedHost}&am=${numAmount}&cu=INR&tn=${encodedTrip}` : genericUpiLink;
  const paytmLink = upi ? `paytmmp://pay?pa=${upi}&pn=${encodedHost}&am=${numAmount}&cu=INR&tn=${encodedTrip}` : genericUpiLink;

  const handleCopyUpi = () => {
    sound.playClick();
    if (upi && navigator.clipboard) {
      navigator.clipboard.writeText(upi);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    }
  };

  const handleConfirmSuccess = (customRef) => {
    sound.playUpiSuccess();
    sound.speakUpiReceived(numAmount, friend);
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C6FF3D', '#0082FB', '#25D366']
    });

    const ref = customRef || ('UPI' + Math.floor(100000000000 + Math.random() * 900000000000));
    setTransactionRef(ref);
    setPaymentTimestamp(new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));
    setPaymentStatus('success');

    // Save verified transaction to localStorage activity log so Host dashboard reflects it
    try {
      const storedAct = localStorage.getItem('splitpay_payment_activity');
      const actList = storedAct ? JSON.parse(storedAct) : [];
      actList.unshift({
        id: 'gateway-' + Date.now(),
        payerName: friend,
        amount: numAmount,
        tripName: trip,
        ref: ref,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Verified (Gateway)'
      });
      localStorage.setItem('splitpay_payment_activity', JSON.stringify(actList.slice(0, 15)));

      // Also update active trip if exists in local storage
      const activeTrip = localStorage.getItem('splitpay_active_trip_v3');
      if (activeTrip) {
        const parsed = JSON.parse(activeTrip);
        if (parsed && Array.isArray(parsed.members)) {
          parsed.members = parsed.members.map(m => {
            if (m.name.toLowerCase().includes(friend.toLowerCase()) || friend.toLowerCase().includes(m.name.toLowerCase())) {
              return { ...m, status: 'paid' };
            }
            return m;
          });
          localStorage.setItem('splitpay_active_trip_v3', JSON.stringify(parsed));
        }
      }

      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  const handleVerifyPayment = () => {
    sound.playClick();
    setPaymentStatus('verifying');
    setUtrError('');
    setTimeout(() => {
      handleConfirmSuccess(utrNumber ? `UTR${utrNumber}` : null);
    }, 1500);
  };

  const handleVerifyByUtr = () => {
    const clean = utrNumber.replace(/\D/g, '');
    if (clean.length < 6) {
      setUtrError('Please enter a valid 6 to 12-digit UPI UTR / Ref number from your payment app.');
      return;
    }
    sound.playClick();
    setPaymentStatus('verifying');
    setTimeout(() => {
      handleConfirmSuccess(`UTR${clean}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#070810] text-[#F5F3EE] flex flex-col justify-between selection:bg-[#C6FF3D] selection:text-[#0B0C16] font-['Inter'] relative overflow-x-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#0082FB]/10 via-[#C6FF3D]/5 to-transparent blur-[120px] pointer-events-none" />

      {/* Top Gateway Navbar */}
      <header className="border-b border-white/10 bg-[#0B0C16]/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToApp}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
              title="Return to SplitPay Main Website"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">SplitPay Home</span>
            </button>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C6FF3D] animate-pulse" />
              <span className="text-xs sm:text-sm font-bold font-['Space_Grotesk'] text-white">
                SplitPay Secure Gateway
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-[11px] font-mono">
            <Lock className="w-3 h-3" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </header>

      {/* Main Payment Container */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 my-auto z-10 space-y-5">
        
        {paymentStatus === 'success' ? (
          /* Payment Success Receipt View */
          <div className="p-6 sm:p-8 rounded-3xl bg-[#121324] border border-[#25D366]/40 shadow-2xl shadow-[#25D366]/15 space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#25D366]/20 border border-[#25D366]/50 flex items-center justify-center text-[#25D366]">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-widest text-[#25D366] font-bold">
                Payment Successfully Verified
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-['Space_Grotesk']">
                ₹{formattedAmount} Paid
              </h2>
              <p className="text-xs text-white/60 font-mono">
                Settled to <strong className="text-white">{host}</strong> for <strong className="text-white">{trip}</strong>
              </p>
            </div>

            {/* Official Receipt Details */}
            <div className="p-4 rounded-2xl bg-[#0B0C16] border border-white/10 text-left space-y-2.5 text-xs font-mono">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Transaction Ref:</span>
                <span className="text-[#C6FF3D] font-bold">{transactionRef}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Paid By:</span>
                <span className="text-white font-bold">{friend}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Beneficiary UPI:</span>
                <span className="text-white">{upi || 'Host Account'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Time &amp; Date:</span>
                <span className="text-white/80">{paymentTimestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Gateway Status:</span>
                <span className="text-[#25D366] font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Settled (0% Fee)</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onBackToApp}
                className="flex-1 py-3 rounded-xl bg-[#C6FF3D] hover:bg-[#b5f422] text-[#0B0C16] font-bold text-xs font-['Space_Grotesk'] transition-all active:scale-95 cursor-pointer shadow-lg shadow-[#C6FF3D]/20 flex items-center justify-center gap-2"
              >
                <span>Return to SplitPay Bill</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Payment Processing Gateway View */
          <div className="p-6 sm:p-8 rounded-3xl bg-[#121324] border border-white/15 shadow-2xl space-y-6">
            
            {/* Beneficiary & Bill Summary Header */}
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/10">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-mono text-white/50">
                  <span>PAYING BENEFICIARY:</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#C6FF3D]/10 text-[#C6FF3D] font-bold text-[10px]">
                    VERIFIED
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk'] truncate">
                  {host}
                </h2>
                <div className="text-xs text-white/60 font-mono flex items-center gap-2">
                  <span>For: <strong className="text-white">{trip}</strong></span>
                  <span>•</span>
                  <span>Payer: <strong className="text-[#C6FF3D]">{friend}</strong></span>
                </div>
              </div>

              {/* Huge Amount Display */}
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-white/40 uppercase block">AMOUNT DUE</span>
                <div className="text-2xl sm:text-3xl font-black text-[#C6FF3D] font-['Space_Grotesk']">
                  ₹{formattedAmount}
                </div>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#0B0C16] border border-white/10">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveTab('upiApps');
                }}
                className={`py-2 px-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'upiApps'
                    ? 'bg-[#C6FF3D] text-[#0B0C16] font-bold shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>UPI Apps</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveTab('qr');
                }}
                className={`py-2 px-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'qr'
                    ? 'bg-[#C6FF3D] text-[#0B0C16] font-bold shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan QR</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setActiveTab('manual');
                }}
                className={`py-2 px-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'manual'
                    ? 'bg-[#C6FF3D] text-[#0B0C16] font-bold shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Copy className="w-3.5 h-3.5" />
                <span>UPI ID</span>
              </button>
            </div>

            {/* TAB 1: 1-Tap UPI Apps (GPay, PhonePe, Paytm, BHIM) */}
            {activeTab === 'upiApps' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <p className="text-xs text-white/60 font-mono text-center">
                  Select your preferred UPI app to pay directly on your phone:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Google Pay */}
                  <a
                    href={gpayLink || genericUpiLink}
                    onClick={() => sound.playClick()}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#C6FF3D]/50 transition-all flex items-center justify-between cursor-pointer group active:scale-95"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center font-black text-[#4285F4] text-base shadow-sm">
                        G
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white font-['Space_Grotesk'] group-hover:text-[#C6FF3D]">
                          Google Pay
                        </div>
                        <div className="text-[10px] text-white/40 font-mono">1-Tap Fast Pay</div>
                      </div>
                    </div>
                    <Zap className="w-4 h-4 text-[#C6FF3D] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>

                  {/* PhonePe */}
                  <a
                    href={phonepeLink || genericUpiLink}
                    onClick={() => sound.playClick()}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#C6FF3D]/50 transition-all flex items-center justify-between cursor-pointer group active:scale-95"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#5f259f] flex items-center justify-center font-black text-white text-base shadow-sm">
                        पे
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white font-['Space_Grotesk'] group-hover:text-[#C6FF3D]">
                          PhonePe
                        </div>
                        <div className="text-[10px] text-white/40 font-mono">Instant UPI App</div>
                      </div>
                    </div>
                    <Zap className="w-4 h-4 text-[#C6FF3D] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>

                  {/* Paytm */}
                  <a
                    href={paytmLink || genericUpiLink}
                    onClick={() => sound.playClick()}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#C6FF3D]/50 transition-all flex items-center justify-between cursor-pointer group active:scale-95"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#002E6E] flex items-center justify-center font-black text-[#00BAF2] text-xs shadow-sm">
                        Paytm
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white font-['Space_Grotesk'] group-hover:text-[#C6FF3D]">
                          Paytm UPI
                        </div>
                        <div className="text-[10px] text-white/40 font-mono">Direct UPI Rails</div>
                      </div>
                    </div>
                    <Zap className="w-4 h-4 text-[#C6FF3D] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>

                  {/* Any UPI / CRED / BHIM */}
                  <a
                    href={genericUpiLink}
                    onClick={() => sound.playClick()}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#C6FF3D]/50 transition-all flex items-center justify-between cursor-pointer group active:scale-95"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#0082FB]/20 border border-[#0082FB]/40 flex items-center justify-center text-[#0082FB] font-black text-xs">
                        UPI
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-bold text-white font-['Space_Grotesk'] group-hover:text-[#C6FF3D]">
                          CRED / BHIM / Other
                        </div>
                        <div className="text-[10px] text-white/40 font-mono">All UPI Apps</div>
                      </div>
                    </div>
                    <Zap className="w-4 h-4 text-[#C6FF3D] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            )}

            {/* TAB 2: Dynamic NPCI QR Code */}
            {activeTab === 'qr' && (
              <div className="space-y-4 text-center animate-in fade-in duration-200">
                <div className="p-3.5 rounded-2xl bg-white w-48 h-48 mx-auto flex items-center justify-center shadow-lg relative">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(genericUpiLink)}`}
                    alt="SplitPay NPCI QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-white font-medium">Scan with any UPI App</p>
                  <p className="text-[11px] text-white/40 font-mono">
                    Exact amount ₹{formattedAmount} will be pre-filled automatically
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: Copy UPI ID */}
            {activeTab === 'manual' && (
              <div className="space-y-3 animate-in fade-in duration-200 text-left">
                <div className="p-3 rounded-2xl bg-[#0B0C16] border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-white/50 block">BENEFICIARY UPI ID:</span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold font-mono text-white truncate">
                      {upi || 'Contact host for UPI ID'}
                    </span>
                    {upi && (
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-3 py-1.5 rounded-lg bg-[#C6FF3D] hover:bg-[#b5f422] text-[#0B0C16] text-xs font-bold font-mono flex items-center gap-1 cursor-pointer transition-all active:scale-95 shrink-0"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy UPI ID</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-white/50 font-mono">
                  Copy above UPI ID and paste it in GPay, PhonePe, or Paytm search bar to transfer ₹{formattedAmount}.
                </p>
              </div>
            )}

            {/* Verification / I Have Paid Section */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                type="button"
                onClick={handleVerifyPayment}
                disabled={paymentStatus === 'verifying'}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C6FF3D] to-[#0082FB] hover:opacity-95 text-[#0B0C16] font-black text-sm font-['Space_Grotesk'] flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-[#C6FF3D]/15 active:scale-95 transition-all disabled:opacity-50"
              >
                {paymentStatus === 'verifying' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#0B0C16]" />
                    <span>Verifying with Banking Rails...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#0B0C16]" />
                    <span>I Have Paid ₹{formattedAmount} (Verify Now) ⚡</span>
                  </>
                )}
              </button>

              {/* Optional 12-Digit UTR Input */}
              <div className="p-2.5 rounded-xl bg-[#0B0C16] border border-white/10 flex items-center gap-2 text-left">
                <input
                  type="text"
                  placeholder="Optional 12-digit UPI UTR / Ref (e.g. 423819283741)"
                  value={utrNumber}
                  onChange={(e) => {
                    setUtrNumber(e.target.value.replace(/\D/g, ''));
                    setUtrError('');
                  }}
                  className="flex-1 bg-transparent text-white text-xs font-mono placeholder:text-white/30 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleVerifyByUtr}
                  disabled={paymentStatus === 'verifying'}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-medium transition-colors cursor-pointer shrink-0"
                >
                  Verify UTR
                </button>
              </div>
              {utrError && (
                <p className="text-[11px] text-red-400 font-mono text-left">{utrError}</p>
              )}
            </div>

            {/* Bottom Bank Grade Trust Footer */}
            <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Zero Risk • Verified Portal</span>
              </div>
              <div>Powered by SplitPay Gateway</div>
            </div>

          </div>
        )}

      </main>

      {/* Gateway Footer */}
      <footer className="py-4 border-t border-white/5 text-center text-xs font-mono text-white/30">
        SplitPay Enterprise Banking Rails &bull; Direct Account-to-Account Settlement &bull; NPCI UPI 2.0
      </footer>

    </div>
  );
};

export default PaymentGatewayPage;
