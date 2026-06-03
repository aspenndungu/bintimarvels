import React, { useState, useEffect } from 'react';
import MremboLandingPage from './MremboLandingPage';
import { Smartphone, Monitor, Smartphone as PhoneIcon, MessageCircle, Send, ShieldAlert, CheckCircle, Smartphone as NotNotch, X } from 'lucide-react';
import { ChatMessage } from '../types';

export default function InteractiveDevicePreview() {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('mobile');
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [mockCartCount, setMockCartCount] = useState(0);

  // Chat simulator states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [chatStep, setChatStep] = useState<number>(0);
  const [selectedProductInChat, setSelectedProductInChat] = useState<{ name: string; price: number } | null>(null);

  // Initial greeting
  useEffect(() => {
    if (showChatDrawer && chatMessages.length === 0) {
      setChatMessages([
        {
          id: '1',
          sender: 'bot',
          text: 'Jambo! Bula! 👋 Thank you for contacting Binti Marvels Ltd. I am Amina, your personal Mrembo Comfort Assistant.',
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

    // Chatbot response tree mapping out compliant workflows
    setTimeout(() => {
      if (chatStep === 1) {
        if (cleanText.includes('yes') || cleanText.includes('sawa') || cleanText.includes('agree') || cleanText.includes('y') || cleanText.includes('accept')) {
          setChatMessages(prev => [
            ...prev,
            {
              id: String(Date.now() + 1),
              sender: 'bot',
              text: 'Sawa! Transactional consent successfully recorded in our central audit sheet. ✅',
              timestamp: 'Just now'
            },
            {
              id: String(Date.now() + 2),
              sender: 'bot',
              text: `I noticed you are interested in ordering the Mrembo Comfort Pad Bundle! That bundle is highly secure. Would you like to proceed with shipping coordinates for Nairobi or other Kenyan counties?`,
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
              : 'No problem, cycle telemetry remains stopped. Proceeding with one-time delivery parameters.',
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
    <div className="space-y-6">
      {/* Device Frame View controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#FAF7F2] rounded-xl border border-brand-clay select-none">
        <div>
          <h3 className="font-display font-bold text-brand-dark text-base flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-brand-berry" />
            <span>Interactive Device Simulator Frame</span>
          </h3>
          <p className="text-[11px] text-brand-dark-light">Toggle between layout sizes to test real-world user flow density.</p>
        </div>

        <div className="bg-brand-clay/30 p-1 rounded-lg flex items-center gap-1">
          <button
            onClick={() => setDevice('mobile')}
            className={`py-1.5 px-3.5 rounded-md font-display text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer pointer-events-auto transition-all ${
              device === 'mobile' ? 'bg-brand-berry text-white' : 'text-brand-dark-light hover:text-brand-dark'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile (375px)</span>
          </button>
          <button
            onClick={() => setDevice('desktop')}
            className={`py-1.5 px-3.5 rounded-md font-display text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer pointer-events-auto transition-all ${
              device === 'desktop' ? 'bg-brand-berry text-white' : 'text-brand-dark-light hover:text-brand-dark'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>
      </div>

      {/* Render selected device Container Frame */}
      {device === 'desktop' ? (
        <div className="border border-brand-clay rounded-2xl overflow-hidden shadow-xs relative bg-white min-h-[700px]">
          <div className="bg-neutral-100 px-4 py-2 border-b border-brand-clay flex items-center gap-2 text-xs select-none">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
            </div>
            <div className="bg-white border border-brand-clay rounded-sm px-6 py-0.5 text-[10px] text-brand-dark-light w-full max-w-sm mx-auto flex items-center justify-between font-mono">
              <span>https://bintimarvels.com</span>
              <span className="opacity-50">🔒 Secure</span>
            </div>
          </div>
          <MremboLandingPage
            onOrderViaChat={triggerChatOrder}
            mockCartCount={mockCartCount}
            setMockCartCount={setMockCartCount}
            activeDevice="desktop"
          />
        </div>
      ) : (
        <div className="flex justify-center select-none">
          {/* Simulated Mobile Frame Shell representing physical mobile device sizes */}
          <div className="relative w-[375px] h-[780px] bg-neutral-900 rounded-[50px] p-3 border-4 border-neutral-800 shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Speaker & camera Notch bar */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black h-5 w-36 rounded-full z-40 flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800"></span>
              <span className="w-12 h-1.5 rounded-full bg-neutral-800"></span>
            </div>

            {/* Simulated Content Pane */}
            <div className="w-full h-full bg-brand-cream rounded-[38px] overflow-hidden flex flex-col justify-between relative border border-black/40">
              {/* Internal Mock status icons */}
              <div className="bg-white px-6 pt-3 pb-1.5 flex justify-between items-center text-[10px] font-bold text-brand-dark border-b border-brand-cream-dark z-20">
                <span className="font-mono">12:30</span>
                <div className="flex items-center gap-1">
                  <span>📶 5G</span>
                  <span>🔋 98%</span>
                </div>
              </div>

              {/* Scrollable Area */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <MremboLandingPage
                  onOrderViaChat={triggerChatOrder}
                  mockCartCount={mockCartCount}
                  setMockCartCount={setMockCartCount}
                  activeDevice="mobile"
                />
              </div>

              {/* Sticky bottom CTA and checkout strip inside Mobile representation to lock high conversion values */}
              <div className="bg-white/95 backdrop-blur-md p-3 border-t border-brand-clay flex gap-2 z-20 shadow-lg">
                <button
                  onClick={() => triggerChatOrder('Mrembo Starter Bundle', 500)}
                  className="flex-1 bg-[#10B981] hover:bg-emerald-600 text-white font-display font-semibold text-center text-[11px] uppercase tracking-wide py-3 rounded-lg flex items-center justify-center gap-1 cursor-pointer pointer-events-auto"
                >
                  <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>WhatsApp Order</span>
                </button>
                <a
                  href="#mrembo-range"
                  className="flex-1 bg-brand-berry hover:bg-brand-berry-dark text-white font-display font-semibold text-center text-[11px] uppercase tracking-wide py-3 rounded-lg block cursor-pointer pointer-events-auto"
                >
                  Shop Box Packs
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up Interactive WhatsApp assistant Drawer/Widget */}
      {showChatDrawer && (
        <div className="fixed bottom-6 right-6 w-full max-w-[350px] bg-white border border-[#DDD3CD] shadow-2xl rounded-2xl overflow-hidden z-50 pointer-events-auto animate-fade-in flex flex-col">
          {/* Header */}
          <div className="p-4 bg-[#075E54] text-white flex justify-between items-center select-none">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-300 font-extrabold flex items-center justify-center text-dark text-xs border border-white">
                AM
              </div>
              <div>
                <h4 className="font-semibold text-xs text-white">Amina - Mrembo Support</h4>
                <span className="text-[9px] text-teal-100 block">🟢 Online | Verified Assistant</span>
              </div>
            </div>
            <button
              onClick={() => setShowChatDrawer(false)}
              className="p-1 hover:bg-[#128C7E] rounded-full text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Guidelines warning strip inside custom widget */}
          <div className="bg-amber-50 p-2.5 border-b border-[#DDD3CD] text-[9px] text-amber-900 leading-relaxed font-semibold">
            🛡️ A2P Privacy: Automated messages cannot fire unless you grant Amina consent first. Consent parameters are un-ticked below.
          </div>

          {/* Chat Messages Body Area */}
          <div className="p-4 h-[250px] overflow-y-auto bg-[#E5DDD5] space-y-3 flex flex-col text-[11px] leading-relaxed">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] rounded-lg p-2.5 shadow-5xs ${
                  msg.sender === 'client'
                    ? 'bg-[#DCF8C6] text-brand-dark self-end'
                    : 'bg-white text-brand-dark self-start'
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-[8px] opacity-40 text-right block mt-1">{msg.timestamp}</span>
              </div>
            ))}
          </div>

          {/* Form and Quick Actions */}
          <div className="p-3 bg-[#FAF7F2] border-t border-[#DDD3CD]">
            {chatStep === 1 && (
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setChatMessages(prev => [
                      ...prev,
                      { id: String(Date.now()), sender: 'client', text: 'I agree, please start ordering.', timestamp: 'Just now' },
                      { id: String(Date.now() + 1), sender: 'bot', text: 'Thank you! Operational consent recorded. ✅ In which town or estate should we deliver your Mrembo comfort packs?', timestamp: 'Just now' }
                    ]);
                    setChatStep(2);
                  }}
                  className="flex-1 text-center py-2 bg-[#075E54] text-white rounded text-[10px] font-bold hover:bg-[#128C7E] cursor-pointer"
                >
                  Sawa, I Consent
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChatMessages(prev => [
                      ...prev,
                      { id: String(Date.now()), sender: 'client', text: 'No thanks.', timestamp: 'Just now' },
                      { id: String(Date.now() + 1), sender: 'bot', text: 'No problem. Consent denied.', timestamp: 'Just now' }
                    ]);
                    setChatStep(0);
                  }}
                  className="flex-1 text-center py-2 bg-slate-200 text-brand-dark rounded text-[10px] font-bold hover:bg-slate-300 cursor-pointer"
                >
                  Skip Consent
                </button>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex gap-1.5">
              <input
                type="text"
                placeholder="Type 'YES' to consent/agree..."
                className="flex-1 bg-white border border-[#DDD3CD] rounded-lg p-2 text-[10px] outline-hidden focus:border-[#075E54] font-medium"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
              />
              <button
                type="submit"
                className="p-1 px-2.5 bg-[#075E54] hover:bg-[#128C7E] text-white rounded-lg cursor-pointer transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
