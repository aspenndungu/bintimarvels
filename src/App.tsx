import React, { useState, useEffect } from 'react';
import MremboLandingPage from './components/MremboLandingPage';
import {
  Send,
  X,
  BookmarkCheck
} from 'lucide-react';
import { ChatMessage } from './types';

export default function App() {
  // Lifting up persistent states for checkout, shopping basket and compliance assistant
  const [cartCount, setCartCount] = useState(0);
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [chatStep, setChatStep] = useState<number>(0);
  const [selectedProductInChat, setSelectedProductInChat] = useState<{ name: string; price: number } | null>(null);

  // Initialize compliance WhatsApp conversational system greeting
  useEffect(() => {
    if (showChatDrawer && chatMessages.length === 0) {
      setChatMessages([
        {
          id: '1',
          sender: 'bot',
          text: 'Jambo! 👋 Thank you for contacting Binti Marvels Ltd. I am Amina, your personal Mrembo Comfort Assistant.',
          timestamp: 'Just now'
        },
        {
          id: '2',
          sender: 'bot',
          text: 'To legally assist you with your booking, may we verify: Are you happy for us to use this WhatsApp session to book your order and coordinate shipping receipts? Note: Binti will never sell your contacts.',
          timestamp: 'Just now',
          actionRequired: true
        }
      ]);
      setChatStep(1);
    }
  }, [showChatDrawer]);

  // Handle messages in compliance simulator chat widget
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'client',
      text: typedMessage,
      timestamp: 'Just now'
    };

    setChatMessages(prev => [...prev, userMsg]);
    const cleanText = typedMessage.toLowerCase();
    setTypedMessage('');

    // Compliant chatbot response tree mapping
    setTimeout(() => {
      if (chatStep === 1) {
        if (cleanText.includes('yes') || cleanText.includes('sawa') || cleanText.includes('agree') || cleanText.includes('y') || cleanText.includes('accept')) {
          setChatMessages(prev => [
            ...prev,
            {
              id: String(Date.now() + 1),
              sender: 'bot',
              text: 'Sawa! Transactional consent successfully recorded in our central audit database. ✅',
              timestamp: 'Just now'
            },
            {
              id: String(Date.now() + 2),
              sender: 'bot',
              text: `I noticed you are interested in ordering the Mrembo Comfort Pad Bundle! Would you like to proceed with shipping coordinates for Nairobi, Nakuru, or other Kenyan counties?`,
              timestamp: 'Just now'
            }
          ]);
          setChatStep(2);
        } else {
          setChatMessages(prev => [
            ...prev,
            {
              id: String(Date.now() + 1),
              sender: 'bot',
              text: 'Understood. In accordance with the Kenya Data Protection regulations, we can only complete orders if transactional coordination is permitted. Feel free to call us directly on 0717 345 841!',
              timestamp: 'Just now'
            }
          ]);
        }
      } else if (chatStep === 2) {
        setChatMessages(prev => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'bot',
            text: `Perfect! We have noted that location: "${userMsg.text}". Let's finalize your bundle order. To keep your deliveries consistent, would you like to optional opt-in to receive Period Cycle Predictor Reminders every 28 days? (Reply YES or NO)`,
            timestamp: 'Just now'
          }
        ]);
        setChatStep(3);
      } else if (chatStep === 3) {
        const agreedRemind = cleanText.includes('yes') || cleanText.includes('agree');
        setChatMessages(prev => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'bot',
            text: agreedRemind
              ? 'Excellent! Discreet period alerts successfully scheduled. You are all set! 📅'
              : 'No problem, cycle alerts remains stopped. Proceeding with one-time delivery parameters.',
            timestamp: 'Just now'
          },
          {
            id: String(Date.now() + 2),
            sender: 'bot',
            text: 'Your order was successfully compiled in the booking logs! A human dispatch coordinator will WhatsApp you directly within 15 minutes with your final tracking invoice. Assanteni sana for choosing Mrembo! 🌸',
            timestamp: 'Just now'
          }
        ]);
        setChatStep(4);
      } else {
        setChatMessages(prev => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'bot',
            text: 'Thank you! If you have additional inquiries, please chat with us or visit Binti Marvels offices on Nairobi pipeline roads.',
            timestamp: 'Just now'
          }
        ]);
      }
    }, 1000);
  };

  const triggerChatOrder = (productName: string, priceKsh: number) => {
    setSelectedProductInChat({ name: productName, price: priceKsh });
    setChatMessages([]);
    setChatStep(0);
    setShowChatDrawer(true);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-brand-dark font-sans relative flex flex-col justify-between selection:bg-brand-berry selection:text-white">
      
      {/* Absolute fullscreen responsive commerce landing page */}
      <div className="w-full min-h-screen flex flex-col">
        <MremboLandingPage
          onOrderViaChat={triggerChatOrder}
          mockCartCount={cartCount}
          setMockCartCount={setCartCount}
          activeDevice="desktop"
        />
      </div>

      {/* Global Floating WhatsApp compliant assistant (Amina bot window) */}
      {showChatDrawer && (
        <div className="fixed bottom-6 right-6 w-full max-w-[360px] bg-white border border-[#DDD3CD] shadow-2xl rounded-2xl overflow-hidden z-50 animate-fade-in flex flex-col font-sans">
          {/* Chat Head */}
          <div className="p-4 bg-[#075E54] text-white flex justify-between items-center select-none">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-100 font-extrabold text-brand-berry flex items-center justify-center text-xs border border-white">
                AM
              </div>
              <div>
                <h4 className="font-semibold text-xs text-white">Amina - Mrembo Support</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  <span className="text-[9px] text-[#A2E2C9] block">Online | Verified Assistant</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowChatDrawer(false)}
              className="p-1.5 hover:bg-[#128C7E] rounded-full text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Privacy/Compliance Warn Banner */}
          <div className="bg-amber-50 p-2.5 border-b border-[#DDD3CD] text-[9.5px] text-amber-900 leading-relaxed font-semibold">
            🛡️ ODPC Kenya: Consent options remain unselected. By continuing, you can test transactional cycle coordination securely.
          </div>

          {/* Chat Messenger Container */}
          <div className="p-4 h-[260px] overflow-y-auto bg-[#E5DDD5] space-y-3 flex flex-col text-[11px] leading-relaxed">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] rounded-lg p-2.5 shadow-xs ${
                  msg.sender === 'client'
                    ? 'bg-[#DCF8C6] text-brand-dark self-end'
                    : 'bg-white text-brand-dark self-start border border-[#DECBC3]/30'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span className="text-[8px] opacity-40 text-right block mt-1">{msg.timestamp}</span>
              </div>
            ))}
          </div>

          {/* Form / Direct Interactive buttons */}
          <div className="p-3 bg-white border-t border-[#DDD3CD]">
            {chatStep === 1 && (
              <div className="flex gap-2 mb-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const agreeMsg: ChatMessage = {
                      id: String(Date.now()),
                      sender: 'client',
                      text: 'I agree, please record consent.',
                      timestamp: 'Just now'
                    };
                    const botMsg1: ChatMessage = {
                      id: String(Date.now() + 1),
                      sender: 'bot',
                      text: 'Sawa! Transactional consent successfully noted in the workspace register. ✅',
                      timestamp: 'Just now'
                    };
                    const botMsg2: ChatMessage = {
                      id: String(Date.now() + 2),
                      sender: 'bot',
                      text: `Where should standard Mrembo comfort packs be shipped? (State your county coordinate, e.g. Nakuru or Nairobi)`,
                      timestamp: 'Just now'
                    };
                    setChatMessages(prev => [...prev, agreeMsg, botMsg1, botMsg2]);
                    setChatStep(2);
                  }}
                  className="flex-1 text-center py-2 bg-[#075E54] text-white rounded-lg text-[10px] font-bold hover:bg-[#128C7E] cursor-pointer"
                >
                  I Consent
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const refuseMsg: ChatMessage = {
                      id: String(Date.now()),
                      sender: 'client',
                      text: 'No, do not record.',
                      timestamp: 'Just now'
                    };
                    const botMsg1: ChatMessage = {
                      id: String(Date.now() + 1),
                      sender: 'bot',
                      text: 'Transaction stopped. Under the Data Protection Act we cannot coordinate shipments via automation without active consent. Please visit local stores to purchase.',
                      timestamp: 'Just now'
                    };
                    setChatMessages(prev => [...prev, refuseMsg, botMsg1]);
                    setChatStep(0);
                  }}
                  className="flex-1 text-center py-2 bg-zinc-200 text-brand-dark rounded-lg text-[10px] font-bold hover:bg-zinc-300 cursor-pointer"
                >
                  Decline
                </button>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-1.5">
              <input
                type="text"
                placeholder="Type 'YES' to consent/agree..."
                className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-[10.5px] outline-hidden focus:border-[#075E54] focus:bg-white font-medium"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
              />
              <button
                type="submit"
                className="p-2 bg-[#075E54] hover:bg-[#128C7E] text-white rounded-lg cursor-pointer transition-colors"
                title="Send messages to Amina"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Corporate Meta / Compliance Legal Strip at foot of viewport */}
      <footer className="bg-white border-t border-brand-clay p-4 text-center select-none z-10">
        <p className="text-[10px] text-brand-dark-light font-medium uppercase font-mono tracking-wider flex items-center justify-center gap-1.5">
          <BookmarkCheck className="w-4 h-4 text-brand-teal" />
          <span>Binti Marvels Ltd | Mrembo Pads Comfort Campaign | Nakuru Pipeline Highway | ODPC KDPA 2019 Compliant</span>
        </p>
      </footer>

    </div>
  );
}
