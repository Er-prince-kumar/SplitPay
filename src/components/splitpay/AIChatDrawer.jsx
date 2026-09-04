import { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  RotateCcw, 
  Copy, 
  Check, 
  MessageCircle, 
  ArrowRight, 
  Zap, 
  Bot,
  User,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/audio';
import { processUserMessage } from '../../utils/aiEngine';
import { openWhatsAppDirect } from '../../utils/whatsapp';

const AIChatDrawer = ({ isOpen, onToggle, onApplyToSplitter, currentTripData }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hey! I'm **SplitPay AI** — your campus split co-pilot. ⚡\n\nDescribe any bill to split (e.g. *\"Split ₹4,800 Goa cab between Rohit, Priya, Aman, and me\"*) or ask me to draft a funny WhatsApp reminder!",
      time: 'Just now'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const chatEndRef = useRef(null);

  const quickPrompts = [
    "🏖️ Split ₹4,800 Goa cab among 4 friends",
    "🎭 Write Bollywood meme reminder for Rohit",
    "🍗 Split ₹1,800 midnight biryani for 3 people",
    "⚡ How does 1-tap UPI settlement work?"
  ];

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    sound.playClick();
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    // Process with AI Engine
    setTimeout(async () => {
      const response = await processUserMessage(text, currentTripData);
      setIsTyping(false);
      sound.playUpiSuccess();

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.content,
        data: response.data,
        reminderText: response.reminderText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  const handleApply = (data) => {
    sound.playClick();
    sound.playUpiSuccess();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#C6FF3D', '#0082FB', '#25D366']
    });

    if (onApplyToSplitter) {
      onApplyToSplitter(data);
    }
  };

  const handleCopy = (id, text) => {
    sound.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleWhatsAppSend = (text) => {
    sound.playClick();
    openWhatsAppDirect('9876543210', text);
  };

  const handleClearChat = () => {
    sound.playClick();
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: "Chat cleared! How can I help you split or calculate expenses today?",
        time: 'Just now'
      }
    ]);
  };

  return (
    <>
      {/* Floating Action Button Trigger in Bottom-Right Corner */}
      {!isOpen && (
        <button
          onClick={() => {
            sound.playClick();
            onToggle();
          }}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-[#121324] hover:bg-[#1B1B3A] border border-[#C6FF3D]/40 hover:border-[#C6FF3D] text-white font-medium text-xs sm:text-sm shadow-2xl shadow-[#C6FF3D]/15 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer"
          title="Open SplitPay AI Assistant"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6FF3D] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C6FF3D]" />
          </span>
          <Sparkles className="w-4 h-4 text-[#C6FF3D] group-hover:rotate-12 transition-transform" />
          <span className="font-['Space_Grotesk'] font-bold">SplitPay AI</span>
        </button>
      )}

      {/* Slide-up Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[560px] max-h-[85vh] bg-[#121324] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="px-5 py-4 bg-[#0B0C16] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#C6FF3D]/15 border border-[#C6FF3D]/40 flex items-center justify-center text-[#C6FF3D]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-white font-['Space_Grotesk'] flex items-center gap-1.5">
                  <span>SplitPay AI</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#C6FF3D]/20 text-[#C6FF3D] font-mono">
                    ONLINE
                  </span>
                </div>
                <div className="text-[10px] text-white/50 font-mono">Campus Split &amp; Nudge Co-pilot</div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Clear Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onToggle();
                }}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Minimize Chat"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-lg bg-[#C6FF3D]/20 text-[#C6FF3D] flex items-center justify-center shrink-0 text-[11px] font-bold mt-0.5">
                    AI
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`p-3 rounded-2xl leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-[#C6FF3D] text-[#0B0C16] font-medium font-sans'
                        : 'bg-[#0B0C16] text-white/90 border border-white/10 font-sans'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Render Structured Bill Card if Parsed */}
                  {msg.data && (
                    <div className="p-3.5 rounded-xl bg-[#0B0C16] border border-[#C6FF3D]/40 space-y-2.5 font-mono text-[11px] text-left shadow-lg">
                      <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                        <span className="text-[#C6FF3D] font-bold uppercase tracking-wider">AI Bill Calculation</span>
                        <span className="text-white/40">{msg.data.memberCount} Members</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-white/40 block text-[10px]">TOTAL EXPENSE</span>
                          <span className="text-white font-bold font-['Space_Grotesk'] text-sm">
                            ₹{msg.data.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[#C6FF3D] block text-[10px]">EACH PERSON OWES</span>
                          <span className="text-[#C6FF3D] font-black font-['Space_Grotesk'] text-sm">
                            ₹{msg.data.perPersonShare.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="text-[10px] text-white/60">
                        Friends: <span className="text-white">{msg.data.members.join(', ')}</span>
                      </div>

                      <button
                        onClick={() => handleApply(msg.data)}
                        className="w-full py-2 rounded-lg bg-[#C6FF3D] hover:bg-[#b5f422] text-[#0B0C16] font-bold text-xs font-['Space_Grotesk'] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#C6FF3D]/15"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Apply to Trip Bill Creator</span>
                      </button>
                    </div>
                  )}

                  {/* Render Structured Reminder Card if Generated */}
                  {msg.reminderText && (
                    <div className="p-3 rounded-xl bg-[#0B0C16] border border-[#25D366]/40 space-y-2 text-left text-xs font-mono">
                      <div className="text-[10px] text-[#25D366] font-bold uppercase tracking-wider flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>Ready-to-Send WhatsApp Text</span>
                      </div>

                      <p className="text-white/90 italic font-sans text-xs bg-white/5 p-2 rounded-lg">
                        "{msg.reminderText}"
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleWhatsAppSend(msg.reminderText)}
                          className="flex-1 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-[#0B0C16] font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <MessageCircle className="w-3 h-3 fill-current" />
                          <span>Open WhatsApp</span>
                        </button>

                        <button
                          onClick={() => handleCopy(msg.id, msg.reminderText)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-[#C6FF3D]" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-white/60" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="text-[9px] text-white/30 font-mono px-1">
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
                <div className="w-6 h-6 rounded-lg bg-[#C6FF3D]/20 text-[#C6FF3D] flex items-center justify-center text-[10px]">
                  AI
                </div>
                <div className="flex items-center gap-1 bg-[#0B0C16] px-3 py-2 rounded-xl border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF3D] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Starter Chips */}
          {messages.length <= 3 && (
            <div className="px-3 py-2 bg-[#0B0C16]/60 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#C6FF3D]/15 text-white/70 hover:text-[#C6FF3D] border border-white/10 text-[11px] whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#0B0C16] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask AI or type a bill to split..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#121324] border border-white/10 text-white placeholder-white/30 text-xs focus:border-[#C6FF3D] focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2.5 rounded-xl bg-[#C6FF3D] text-[#0B0C16] font-bold hover:bg-[#b5f422] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};

export default AIChatDrawer;
