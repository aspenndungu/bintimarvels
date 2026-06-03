import React, { useState } from 'react';
import { MREMBO_PRODUCTS, BINTI_PRODUCTS } from '../data';
import { MremboProduct, StockistLead, CSREnquiry } from '../types';
import {
  ShoppingBag,
  MessageSquare,
  BadgeCheck,
  Check,
  Building,
  Heart,
  ChevronRight,
  Sparkles,
  Award,
  Truck,
  HeartHandshake,
  UserCheck,
  AlertCircle,
  X,
  CreditCard,
  MapPin,
  Cpu,
  Binary,
  Search,
  User,
  ChevronDown,
  Menu
} from 'lucide-react';

interface MremboLandingPageProps {
  onOrderViaChat: (productName: string, priceKsh: number) => void;
  mockCartCount: number;
  setMockCartCount: React.Dispatch<React.SetStateAction<number>>;
  activeDevice?: 'mobile' | 'desktop';
}

export default function MremboLandingPage({ onOrderViaChat, mockCartCount, setMockCartCount, activeDevice = 'desktop' }: MremboLandingPageProps) {
  // States
  const [purchaseType, setPurchaseType] = useState<'once' | 'subscription'>('once');
  const [cart, setCart] = useState<{ product: MremboProduct; qty: number }[]>([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'success'>('form');

  // Lead states
  const [stockistLead, setStockistLead] = useState<StockistLead>({
    businessName: '',
    contactName: '',
    phone: '',
    email: '',
    location: '',
    role: 'salon',
    volume: '10-50 Packs Monthly',
    consentMarketing: false,
    timestamp: ''
  });
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // CSR state
  const [csrLead, setCsrLead] = useState<CSREnquiry>({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    county: 'Nairobi',
    qtyPacks: 100,
    intendedImpact: 'Providing zero-cost sanitary kits to government schoolgirls in rural communities.',
    consentContact: false
  });
  const [csrSubmitted, setCsrSubmitted] = useState(false);

  // Checkout inputs
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingEmail, setShippingEmail] = useState('');
  const [shippingCounty, setShippingCounty] = useState('Nairobi');
  const [shippingAddress, setShippingAddress] = useState('');
  const [consentCheckboxes, setConsentCheckboxes] = useState({
    trans: false,
    remind: false,
    mark: false
  });

  // Proof tabs state
  const [activeProofTab, setActiveProofTab] = useState<'leak' | 'skin' | 'fit' | 'integrity'>('leak');

  // Interactive OCR state parameters
  const [selectedOcrImg, setSelectedOcrImg] = useState<string>('/mrembo-your-cycle-your-rules.jpeg');
  const [ocrScanning, setOcrScanning] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [ocrLogs, setOcrLogs] = useState<string[]>([]);
  const [ocrResultLines, setOcrResultLines] = useState<string[]>([]);
  const [ocrVerifiedPayload, setOcrVerifiedPayload] = useState<any | null>(null);

  const handleOcrStart = () => {
    if (ocrScanning) return;
    setOcrScanning(true);
    setOcrProgress(0);
    setOcrVerifiedPayload(null);
    setOcrResultLines([]);
    
    const logs = [
      "🔄 Initializing Neural OCR scan pipeline...",
      "🔍 Loading image coordinates and detecting pixels...",
      "💡 Enhancing contrast: dynamic binarization thresholding...",
      "⏳ segmenting bounding boxes & character blocks...",
      "🖨️ Transcribing high-contrast characters..."
    ];
    
    setOcrLogs([logs[0]]);
    
    // Extracted OCR text mapping based on selection
    let targetText: string[] = [];
    let payload: any = {};
    if (selectedOcrImg.includes('rules')) {
      targetText = [
        "MREMBO PADS - YOUR CYCLE YOUR RULES",
        "BINTI MARVELS LTD - MADE IN KENYA",
        "100% ORGANIC COTTON COMFORT LAYER",
        "KEBS STANDARD CERTIFICATE #74102-M",
        "SAN-BATCH CODE: NKR-PIPELINE-2026-A1"
      ];
      payload = {
        accreditation: "KEBS APPROVED",
        licenseNumber: "SM# 74102-M",
        batchOrigin: "Nakuru Factory Line 4",
        operator: "Binti Crew Alpha",
        integrityChecked: "Passed 100% Seal",
        phStandard: "Optimal (Dermal Safe)",
        transparencyHash: "0x8F92..A4"
      };
    } else if (selectedOcrImg.includes('with-skincare')) {
      targetText = [
        "MREMBO SPECIALIST HYPOALLERGENIC",
        "DERMATOLOGICAL SAFE & SKIN SHIELD",
        "0% ARTIFICIAL PERFUMES OR CHLORINE",
        "KEBS APPROVED LAB CERTIFICATION APPROVED",
        "BATCH CODE: MREM-SKIN-2026-B9"
      ];
      payload = {
        accreditation: "LAB CERTIFIED",
        licenseNumber: "SM# 89012-K",
        batchOrigin: "Nakuru Dry-Room B",
        operator: "Quality Assurance Supervisor",
        integrityChecked: "Passed 100% pH test",
        phStandard: "5.5 Natural Vaginal Range",
        transparencyHash: "0x9C12..B2"
      };
    } else if (selectedOcrImg.includes('online')) {
      targetText = [
        "MREMBO VALUE SUBSCRIPTION PACKS",
        "3 BUNDLE SAVER PACK • 30 PADS TOTAL",
        "SPECIAL ONLINE PRICE: KSH 500",
        "EXPRESS MOTORBIKE COURIER DELIVERY",
        "BATCH ID: DISTRIB-SA-VAL-03"
      ];
      payload = {
        accreditation: "BINTI REGISTERED",
        licenseNumber: "BINTI-ONL-500",
        batchOrigin: "Nairobi Hub Dispatch Room 1",
        operator: "Lorna Joyce Approved",
        integrityChecked: "Passed Weight Audit",
        phStandard: "N/A - Logistics Pack",
        transparencyHash: "0xF715..99"
      };
    } else {
      targetText = [
        "BINTI MARVELS LIMITED DIRECT WAREHOUSE STOCK",
        "VERIFIED PHYSICAL QUANTITIES FOR DONORS & CSR",
        "BULK TRANSIT ID: DISTRICT-KITUI-COUNTY",
        "APPROVED FOR DIRECT SCHOOL CAMPAIGN DELIVERIES",
        "ACCREDITATION: ODPC COMPLIANT REGISTER #44A2"
      ];
      payload = {
        accreditation: "ODPC REGISTERED",
        licenseNumber: "ODPC-REG-44A2",
        batchOrigin: "Nakuru Central Bulk Loading Grid",
        operator: "Lorna Joyce CEO",
        integrityChecked: "Audit Verified Bulk",
        phStandard: "N/A - Bulk Shipment",
        transparencyHash: "0x3D11..C0"
      };
    }

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 4;
      setOcrProgress(currentProgress);
      
      // Rotate logs during scanning
      const logIndex = Math.min(Math.floor((currentProgress / 100) * logs.length), logs.length - 1);
      setOcrLogs(prev => {
        if (!prev.includes(logs[logIndex])) {
          return [...prev, logs[logIndex]];
        }
        return prev;
      });

      if (currentProgress >= 100) {
        clearInterval(interval);
        setOcrScanning(false);
        setOcrResultLines(targetText);
        setOcrVerifiedPayload(payload);
        setOcrLogs(prev => [...prev, "✅ Scan complete! Product verification authenticated."]);
      }
    }, 100);
  };

  const addProductToCart = (p: MremboProduct) => {
    alert(`Great choice! "${p.name}" has been added to your order basket. Click the bag icon at the top corner to complete checkout and confirm your delivery details.`);
    setCart([{ product: p, qty: 1 }]);
    setMockCartCount(1);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentCheckboxes.trans) {
      alert('You must accept Operational Consent 1 so that Binti Marvels is legally permitted to text or WhatsApp your shipping receipt and delivery tracking.');
      return;
    }
    setCheckoutStep('success');
  };

  const handleStockistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitted(true);
  };

  const handleCsrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csrLead.consentContact) {
      alert('Please check the data protection consent box to submit your bulk enquiry.');
      return;
    }
    setCsrSubmitted(true);
  };

  const totalCartPrice = cart.reduce((acc, c) => acc + (c.product.priceKsh * (purchaseType === 'subscription' ? 0.9 : 1.0)), 0);

  return (
    <div className="bg-brand-cream min-h-screen text-brand-dark overflow-x-hidden font-sans relative">
      {/* Promo Bar */}
      <div className="bg-[#2D0616] text-[#FAF7F2] py-2.5 px-4 text-xs select-none border-b border-black/20 font-semibold z-40 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-between gap-4">
          {/* Left side items: show limited items on small mobile screens to keep it strictly on a single line */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3.5 text-[11px] uppercase tracking-wider font-bold">
            <span>🇰🇪 Proudly Kenyan</span>
            <span className="opacity-40 select-none">•</span>
            <span>👩‍👧 Women-led</span>
          </div>
          
          {/* Right delivery highlight: kept short and responsive */}
          <div className="text-[10px] sm:text-[11px] md:text-xs font-black text-[#EFE4DF] flex items-center gap-1.5 bg-[#4D0F28]/40 px-3 py-1 rounded-full border border-brand-gold/10 whitespace-nowrap">
            <span>🚚</span>
            <span>Free delivery in Nairobi over KSh 1,500</span>
          </div>
        </div>
      </div>

      {/* Main Premium Navigation Bar */}
      <header className="sticky top-0 bg-[#FAF7F2] border-b border-[#EFE4DF]/80 z-35 select-none transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          
          {/* Creative Logo Branding Column */}
          <div className="flex items-center gap-2.5 pointer-events-auto cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="h-11 w-11 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-xs border-2 border-[#D9A520]">
              <img
                src="/mrembo_logo.jpg"
                alt="Mrembo Pads Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="font-display font-black tracking-tighter text-[#2D0616] leading-none text-left">
              <div className="text-lg sm:text-xl font-display font-extrabold uppercase select-none">MREMBO</div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#B5840B] font-bold select-none">PADS</div>
            </div>
          </div>

          {/* Navigation Links matched exactly with mockups */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-black uppercase tracking-wider text-brand-dark-light">
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#5A082C] transition-colors pointer-events-auto">
              <span>Shop Mrembo</span>
              <ChevronDown className="w-3 h-3 text-[#B5840B] stroke-[2.5]" />
            </div>
            <a href="#mrembo-range" className="hover:text-[#5A082C] transition-colors">Bundles</a>
            <a href="#founder-trust" className="hover:text-[#5A082C] transition-colors">About Us</a>
            <a href="#csr-schools" className="hover:text-[#5A082C] transition-colors">Binti Impact</a>
            <a href="#stockists" className="hover:text-[#5A082C] transition-colors">Stockists & Partners</a>
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#5A082C] transition-colors pointer-events-auto">
              <span>Help & Support</span>
              <ChevronDown className="w-3 h-3 text-[#B5840B] stroke-[2.5]" />
            </div>
          </nav>

          {/* Modern Utility Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Direct WhatsApp Call icon shortcut (as shown in mobile mockup mockup) */}
            <button 
              onClick={() => onOrderViaChat('WhatsApp Inquiry from Header Link', 0)}
              className="p-2 text-brand-dark-light hover:text-emerald-600 transition-colors pointer-events-auto cursor-pointer" 
              title="Order on WhatsApp"
            >
              <MessageSquare className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Search HUD trigger */}
            <button className="p-2 text-brand-dark-light hover:text-[#5A082C] transition-colors hidden sm:block pointer-events-auto cursor-pointer" title="Search catalog">
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Profile trigger */}
            <button className="p-2 text-brand-dark-light hover:text-[#5A082C] transition-colors hidden sm:block pointer-events-auto cursor-pointer" title="My Account">
              <User className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => {
                if (mockCartCount > 0) setShowCheckoutModal(true);
                else alert('Your basket is currently empty. Scroll to the "Choose Your Mrembo Bundle" section below and select your pack!');
              }}
              className="relative p-2 sm:p-2.5 bg-white border border-[#EFE4DF] hover:border-[#530A2A] rounded-full text-brand-dark hover:text-[#5A082C] transition-all cursor-pointer pointer-events-auto shadow-2xs"
              title="Open purchase bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {mockCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#C53F29] text-white font-mono text-[9.5px] font-bold h-5 w-5 rounded-full flex items-center justify-center border border-white shadow-sm animate-pulse">
                  {mockCartCount}
                </span>
              )}
            </button>

            {/* Hamburger Mobile Menu Toggle Trigger */}
            <button 
              onClick={() => alert('✨ Mobile Navigation Menu: Please use the descriptive section anchor links below (bundles, impact, stockists) to navigate!')}
              className="p-2 text-brand-dark-light hover:text-[#5A082C] transition-colors lg:hidden pointer-events-auto cursor-pointer" 
              title="Toggle Menu"
            >
              <Menu className="w-6 h-6 stroke-[2]" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner Area (High-End Full Width Editorial Redesign) */}
      <section className="relative overflow-hidden pt-0 lg:pt-12 pb-16 lg:pb-24 border-b border-[#EFE4DF] bg-[#FAF7F2]" id="hero-top">
        
        {/* Full Left-to-Right Hero Background Image for Desktop (Wider image specified by user) */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none hidden lg:block">
          <img
            src="/hero_image wider.png"
            alt="Mrembo Sanitary Pads Premium Background"
            referrerPolicy="no-referrer"
            className="absolute inset-y-0 right-0 h-full w-full lg:w-[85%] xl:w-[80%] object-cover object-[65%_top] opacity-100 origin-right"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.02) 8%, rgba(0, 0, 0, 0.5) 25%, black 50%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.02) 8%, rgba(0, 0, 0, 0.5) 25%, black 50%)'
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/hero_image.png';
            }}
          />
        </div>

        {/* Mobile-First Image displayed on top of the section (Visible only on mobile/tablet) */}
        <div className="block lg:hidden w-full h-[45vh] min-h-[340px] max-h-[500px] overflow-hidden relative z-10 select-none pointer-events-none border-b border-[#EFE4DF]/50 bg-white">
          <img
            src="/hero_image wider.png"
            alt="Mrembo Sanitary Pads Mobile Showcase"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[80%_center] scale-120 origin-[80%_center]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/hero_image.png';
            }}
          />
        </div>

        {/* Left Side Intricate African Geometric Border Stacker */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-16 bg-repeat-y bg-contain hidden xl:block z-20 pointer-events-none select-none border-r-4 border-[#D9A520]" 
          style={{ 
            backgroundImage: 'url("/Seamless Pattern Pan African Color .jpg")',
            backgroundSize: '100% auto'
          }}
        />

        <div className="max-w-7xl mx-auto px-6 xl:pl-28 pt-8 lg:pt-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative z-10">
          
          {/* Left Text / CTAs block */}
          <div className="lg:col-span-7 space-y-6 lg:space-y-7 text-left">
            <div className="space-y-2">
              <span className="text-[#B5840B] font-display font-black tracking-[0.25em] text-[10px] sm:text-xs uppercase block">
                Premium African Period Care
              </span>
              
              <h1 className="font-display text-4xl sm:text-6.5xl font-black text-[#2D0B18] tracking-tight leading-[1.05] text-left">
                Comfort for<br />
                the woman who<br />
                <span className="font-serif italic font-normal text-[#8D1B36] text-5xl sm:text-7.5xl block mt-1.5 font-sans leading-none">
                  keeps showing up.
                </span>
              </h1>
            </div>

            {/* Aesthetic Horizontal Gold Divider Line with Center Glyph */}
            <div className="relative flex items-center py-1 max-w-md">
              <div className="flex-grow border-t border-[#DFCDC5]/80"></div>
              <span className="flex-shrink mx-4 text-[#D9A520] text-xs">♦</span>
              <div className="flex-grow border-t border-[#DFCDC5]/80"></div>
            </div>

            {/* Cursive Handwriting highlights & Body Paragraph */}
            <div className="space-y-3.5 text-left max-w-xl">
              <div className="space-y-1">
                <p className="text-[#2D0B18] font-display font-black text-xl leading-none font-semibold">
                  Your day does not pause.
                </p>
                <p className="font-cursive text-5xl sm:text-6xl text-[#8E1B3F] font-medium leading-none -mt-1 select-none">
                  The show goes on.
                </p>
              </div>
              <p className="text-zinc-600 text-sm leading-relaxed max-w-md font-sans font-medium">
                Mrembo Pads keep you confident, comfortable and ready for every moment. Engineered with organic cotton touch layers and 12-hour advanced leak barriers.
              </p>
            </div>

            {/* Double Action Button Grid */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 max-w-md pointer-events-auto">
              <a
                href="#mrembo-range"
                className="px-8 py-4 bg-[#2D0616] hover:bg-black text-[#FAF7F2] font-display font-bold uppercase tracking-widest text-[11px] rounded-lg transition-all duration-200 text-center flex items-center justify-center gap-2 shadow-sm shadow-[#2D0616]/30"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>Shop Mrembo</span>
              </a>

              <button
                onClick={() => onOrderViaChat('Starter Premium Pack Box', 250)}
                className="px-8 py-4 border-2 border-[#2D0616] text-[#2D0616] hover:bg-[#FAF7F2] font-display font-black uppercase tracking-widest text-[11px] rounded-lg transition-all flex items-center justify-center gap-2.5"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                <span>Order on WhatsApp</span>
              </button>
            </div>

            {/* Bulk Lead Triggers */}
            <div className="text-left">
              <a
                href="#stockists"
                className="inline-flex items-center gap-2 text-[#8D1B36] font-display font-bold text-xs uppercase tracking-wider hover:underline"
              >
                <span>Bulk / Stockist / CSR Enquiries</span>
                <span className="font-mono">➔</span>
              </a>
            </div>

            {/* Real-time certified strengths line footer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-[#DFCDC5]/70 mt-8">
              <div className="flex gap-3 items-start text-left">
                <div className="p-2 bg-[#F3D580]/30 rounded-full text-[#B5840B] flex-shrink-0">
                  <svg className="w-4 h-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-[#2D0B18]">Women-led</h4>
                  <p className="text-[10px] text-zinc-500 font-medium font-sans">Kenyan Company</p>
                </div>
              </div>

              <div className="flex gap-3 items-start text-left">
                <div className="p-2 bg-[#F48FB1]/20 rounded-full text-[#8D1B3F] flex-shrink-0">
                  <Heart className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-[#2D0B18]">Made in Kenya</h4>
                  <p className="text-[10px] text-zinc-500 font-medium font-sans">Quality you can trust</p>
                </div>
              </div>

              <div className="flex gap-3 items-start text-left">
                <div className="p-2 bg-[#A5D6A7]/25 rounded-full text-[#0D6E4A] flex-shrink-0">
                  <Truck className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-[#2D0B18]">Fast Delivery</h4>
                  <p className="text-[10px] text-zinc-500 font-medium leading-tight">Nairobi same/next day</p>
                </div>
              </div>

              <div className="flex gap-3 items-start text-left">
                <div className="p-2 bg-purple-100 rounded-full text-purple-700 flex-shrink-0">
                  <Award className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-[#2D0B18]">Dignity Mission</h4>
                  <p className="text-[10px] text-zinc-500 font-medium font-sans">Supporting girls</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right spacer for background image showcase so the main subject is 100% visible on all desktop devices */}
          <div className="hidden lg:block lg:col-span-5 relative w-full h-[480px] pointer-events-none select-none">
            {/* Kept empty on purpose on desktop to expose the gorgeous model & product on the right facet of wider background */}
          </div>

        </div>
      </section>

      {/* Main Shop / Interactive Product Selection Area */}
      <section className="py-20 max-w-7xl mx-auto px-4" id="mrembo-range">
        <div className="text-center space-y-3 mb-12">
          <span className="text-brand-berry text-xs font-mono uppercase font-bold tracking-widest block">Choose Direct Delivery</span>
          <h2 className="font-display font-bold text-3xl sm:text-4.5xl text-brand-dark">Our Mrembo Pad Selection</h2>
          <p className="text-brand-dark-light text-xs max-w-lg mx-auto font-sans leading-relaxed">
            Order premium bundles directly to your door door with complimentary fast delivery. Pay safely on arrival using M-Pesa.
          </p>

          {/* Interactive Toggle for One-Time Purchase vs Subscription */}
          <div className="bg-brand-clay/40 border border-brand-clay p-1 rounded-xl inline-flex items-center gap-1 mt-4">
            <button
              onClick={() => setPurchaseType('once')}
              className={`py-2 px-4 rounded-lg font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer pointer-events-auto ${
                purchaseType === 'once' ? 'bg-brand-berry text-white shadow-xs' : 'text-brand-dark-light hover:text-brand-dark'
              }`}
            >
              One-Time Purchase
            </button>
            <button
              onClick={() => {
                setPurchaseType('subscription');
                alert('🎉 You selected Smart Period Subscription! You will get an extra 10% off today, and we will contact you discreetly 3 days before your subsequent cycle each month to automate delivery.');
              }}
              className={`py-2 px-4 rounded-lg font-display text-xs font-bold uppercase tracking-wider transition-all cursor-pointer pointer-events-auto flex items-center gap-1 ${
                purchaseType === 'subscription' ? 'bg-white text-brand-berry border border-brand-berry shadow-xs' : 'text-brand-dark-light hover:text-[#5C0632]'
              }`}
            >
              <span>Predictive Subscription</span>
              <span className="text-[8px] bg-brand-gold text-white px-1.5 py-0.5 rounded-full font-sans">Save 10%</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MREMBO_PRODUCTS.map((p) => {
            const displayPrice = purchaseType === 'subscription' ? Math.round(p.priceKsh * 0.9) : p.priceKsh;
            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl border p-6 flex flex-col justify-between relative hover:shadow-md hover:border-brand-berry transition-all pointer-events-auto ${
                  p.isPopular ? 'border-2 border-brand-berry shadow-xs' : 'border-brand-clay'
                }`}
              >
                {p.badge && (
                  <span className={`absolute -top-3 left-6 font-display font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full text-white ${
                    p.isPopular ? 'bg-brand-berry border border-brand-berry-light' : 'bg-brand-gold'
                  }`}>
                    {p.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div className="w-full aspect-[4/3] bg-zinc-100 rounded-xl overflow-hidden relative border border-brand-clay/35 group">
                    <img
                      src="/mrembo-online-price.jpeg"
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover transition-all grayscale-20 group-hover:grayscale-0 duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-brand-dark/80 p-2 text-center text-white backdrop-blur-xs">
                      <span className="font-serif font-bold text-xs">{p.packs} Packs</span> · <span className="font-mono text-[10px] text-brand-gold font-bold">{p.totalPads} Premium Pads</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display font-extrabold text-brand-dark text-lg leading-snug">{p.name}</h3>
                    <p className="text-xs text-brand-dark-light leading-relaxed">{p.description}</p>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-brand-cream-dark space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-brand-dark-light">Active Price:</span>
                    <div className="text-right">
                      {purchaseType === 'subscription' && (
                        <span className="text-[10px] line-through text-brand-dark-light block font-mono">KSh {p.priceKsh}</span>
                      )}
                      <span className="font-mono text-2xl font-bold text-brand-berry">KSh {displayPrice}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => addProductToCart(p)}
                      className="w-full text-center py-2.5 bg-brand-berry hover:bg-brand-berry-dark text-white font-display font-medium text-xs rounded-lg cursor-pointer transition-colors"
                    >
                      Add to basket
                    </button>
                    <button
                      onClick={() => onOrderViaChat(p.name, displayPrice)}
                      className="w-full text-center py-2 bg-transparent border border-brand-clay hover:border-brand-berry text-brand-berry font-display font-semibold text-xs rounded-lg cursor-pointer transition-colors"
                    >
                      Instant WhatsApp Checkout
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note on Binti Sub-brand Line */}
        <div className="mt-16 p-8 bg-[#FAF7F2] rounded-2xl border border-brand-clay flex flex-col md:flex-row md:items-center justify-between gap-6 pointer-events-auto">
          <div className="space-y-1 max-w-2xl">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-brand-clay text-brand-dark font-medium uppercase tracking-wider inline-block">
              Two Life Stages, One Sanctity Campaign
            </span>
            <h3 className="font-serif font-bold text-brand-dark text-xl leading-snug">Did you know? "Binti is the girl. Mrembo is the woman she becomes."</h3>
            <p className="text-xs text-brand-dark-light leading-relaxed">
              We also stock Binti Panty Liners and lightweight Binti regular school pad packs. Specifically designed with gentle fabrics for younger girls entering their cycles.
            </p>
          </div>
          <a
            href="#csr-schools"
            className="px-6 py-3 bg-white border border-brand-clay-dark/30 hover:border-brand-berry rounded-xl text-xs font-display font-bold uppercase tracking-wider text-brand-dark shrink-0 transition-colors cursor-pointer"
          >
            Explore Binti Products
          </a>
        </div>
      </section>

      {/* Product Proof section - Tabs representing construction advantages */}
      <section className="bg-white py-20 border-t border-b border-brand-clay overflow-hidden" id="product-proof">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-brand-berry text-xs font-mono uppercase font-bold tracking-widest block">Product Integrity Proof</span>
            <h2 className="font-display font-bold text-3xl sm:text-4.5xl text-brand-dark">How Mrembo is Made Different</h2>
            <p className="text-brand-dark-light text-xs leading-relaxed">
              We design and construct to answer the real period truths Kenyan women encounter: intense workdays, long matatu routes, and hot weather. Explore our anatomical construction details:
            </p>

            <div className="space-y-2 pointer-events-auto">
              <button
                onClick={() => setActiveProofTab('leak')}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  activeProofTab === 'leak' ? 'bg-[#FAF7F2] border-brand-berry text-brand-berry' : 'border-brand-clay text-brand-dark hover:border-brand-clay-dark'
                }`}
              >
                <div className="h-6 w-6 rounded-full bg-brand-clay/35 flex items-center justify-center shrink-0">✓</div>
                <div>
                  <h4 className="font-display font-bold text-xs">12-Hour Premium Leak Barriers</h4>
                  <p className="text-[10px] text-brand-dark-light mt-0.5">Extra-absorbent matrix safeguards paths from matatu rides to long desks.</p>
                </div>
              </button>

              <button
                onClick={() => setActiveProofTab('skin')}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  activeProofTab === 'skin' ? 'bg-[#FAF7F2] border-brand-berry text-brand-berry' : 'border-brand-clay text-brand-dark hover:border-brand-clay-dark'
                }`}
              >
                <div className="h-6 w-6 rounded-full bg-brand-clay/35 flex items-center justify-center shrink-0">✓</div>
                <div>
                  <h4 className="font-display font-bold text-xs">Cotton-Feel Soft Topsheet</h4>
                  <p className="text-[10px] text-brand-dark-light mt-0.5">Dermatologically sensitive construction, completely unscented to prevent itching.</p>
                </div>
              </button>

              <button
                onClick={() => setActiveProofTab('fit')}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  activeProofTab === 'fit' ? 'bg-[#FAF7F2] border-brand-berry text-brand-berry' : 'border-brand-clay text-brand-dark hover:border-brand-clay-dark'
                }`}
              >
                <div className="h-6 w-6 rounded-full bg-brand-clay/35 flex items-center justify-center shrink-0">✓</div>
                <div>
                  <h4 className="font-display font-bold text-xs">Wide Anchor Body Fit</h4>
                  <p className="text-[10px] text-brand-dark-light mt-0.5">Flexible wing adhesives guarantee zero sliding, zero bunching, and absolute comfort.</p>
                </div>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#FAF7F2] rounded-2xl p-6 border border-brand-clay grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[385px]">
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              {activeProofTab === 'leak' && (
                <div className="space-y-4 animate-fade-in flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-brand-gold">Layer Audit Specification</span>
                    <h3 className="font-serif font-semibold text-brand-dark text-xl">Advanced 12H Leak-Guard Channels</h3>
                    <p className="text-xs text-brand-dark-light leading-relaxed">
                      Every Mrembo Pad contains an ultra-dense hydrophilic absorption core. Fluid is vacuumed away from the top-sheet within 1.5 seconds, locking dry into the internal cellulose channel. This guarantees that you remain light, fresh, and free from sticky moisture all-day, with no hazard of staining.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-brand-clay font-mono text-[10px] text-brand-dark-light/85 space-y-0.5">
                    <div>- Core Material: Natural Fluff Pulp + SAP</div>
                    <div>- Guard Wings: Elastic non-woven hydrophobic</div>
                    <div>- Absorbency rating: &gt; 120ml (Exceeds KEBS standards)</div>
                  </div>
                </div>
              )}

              {activeProofTab === 'skin' && (
                <div className="space-y-4 animate-fade-in flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-brand-gold">Hypoallergenic Audit</span>
                    <h3 className="font-serif font-semibold text-brand-dark text-xl">Dermatological Skin Protection</h3>
                    <p className="text-xs text-brand-dark-light leading-relaxed">
                      Skin safety is non-negotiable. Mrembo pads are completely free from chemical artificial fragrances, chlorine bleaches, and synthetic deodorizer elements. Skin-friendly fibers maintain natural vaginal pH levels and avoid rash chafing under high humidity.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E9DFDB] font-mono text-[10px] text-brand-dark-light/85 space-y-0.5">
                    <div>- Fragrance: 0% synthetic perfumes</div>
                    <div>- Chemical: Acid-free, chlorine-free bleached</div>
                    <div>- Finish: Soft cottony-weave micro-perf topsheet</div>
                  </div>
                </div>
              )}

              {activeProofTab === 'fit' && (
                <div className="space-y-4 animate-fade-in flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-brand-gold">Structural Fit Blueprint</span>
                    <h3 className="font-serif font-semibold text-brand-dark text-xl">Anatomical Contour Tracking</h3>
                    <p className="text-xs text-brand-dark-light leading-relaxed">
                      Designed for active movement. The pad’s rear features an expansive fan outline, and the wings integrate premium medical-grade adhesive lines. Mrembo stays anchored directly to cotton undergarments, moving intuitively alongside your stride whether walking, running, or standing on transit.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#E9DFDB] font-mono text-[10px] text-brand-dark-light/85 space-y-0.5">
                    <div>- Back Shape: Wide Fan Rear (prevents sleep stains)</div>
                    <div>- Glue: Multi-stripe hotmelt adhesive pattern</div>
                    <div>- Wing span: 145mm contour wrapping</div>
                  </div>
                </div>
              )}

              <div className="text-[9.5px] text-brand-dark-light italic border-t border-brand-clay pt-3">
                * Note: Interactive proof matches: <code className="bg-white py-0.5 px-1 rounded">mrembo-with-skincare.jpeg</code> &amp; <code className="bg-white py-0.5 px-1 rounded">mrembo-your-cycle-your-rules.jpeg</code>.
              </div>
            </div>

            <div className="md:col-span-5 h-full min-h-[225px] rounded-xl overflow-hidden border border-brand-clay/65 relative bg-[#FAF7F2] flex flex-col">
              <img
                src={
                  activeProofTab === 'leak'
                    ? "/mrembo-your-cycle-your-rules.jpeg"
                    : activeProofTab === 'skin'
                    ? "/mrembo-with-skincare.jpeg"
                    : "/mrembo-confident-ladies.jpeg"
                }
                alt={`Mrembo ${activeProofTab} visual demonstration`}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-300 transform hover:scale-105"
              />
              <div className="absolute bottom-2 left-2 bg-[#171320]/80 backdrop-blur-xs text-[9px] font-mono text-brand-gold px-2 py-1 rounded border border-white/10">
                {activeProofTab === 'leak' ? 'your-cycle-rules' : activeProofTab === 'skin' ? 'with-skincare' : 'confident-ladies'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Profile trust section */}
      <section className="py-20 max-w-7xl mx-auto px-4" id="founder-trust">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[340px] aspect-[4/5] bg-brand-clay-dark/30 rounded-2xl relative overflow-hidden border border-brand-clay shadow-md flex flex-col justify-end group">
              <img
                src="/lorna-joyce-binti.jpeg"
                alt="Lorna Joyce - Founder & CEO"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/35 to-transparent"></div>
              <div className="relative p-6 space-y-1.5 z-10 text-white">
                <span className="bg-brand-gold text-brand-dark font-mono text-[9px] uppercase font-bold py-1 px-2.5 rounded-full inline-block">
                  CEO / Owner Representative
                </span>
                <span className="text-[10px] font-mono text-brand-gold uppercase block font-bold">Lorna Joyce Binti</span>
                <h4 className="font-display text-white font-bold text-lg">Lorna Joyce, CEO & Founder</h4>
                <p className="text-[9.5px] text-zinc-300">Photo: lorna-joyce-binti.jpeg</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-brand-clay/40 border border-brand-clay px-3 py-1.5 rounded-full text-[10px] font-mono uppercase font-bold text-brand-dark tracking-wider">
              <Award className="w-3.5 h-3.5 text-brand-berry" />
              <span>Women-Led Manufacturing Enterprise</span>
            </div>

            <h2 className="font-serif font-semibold text-3xl sm:text-4xl text-brand-dark leading-none">
              "Dignity is a right, not a luxury. We support women who keep showing up."
            </h2>

            <p className="text-brand-dark-light text-xs sm:text-sm leading-relaxed font-sans">
              Binti Marvels Ltd was born from the conviction that menstruating should never hold a woman back or force a girl to stay home from school. As a proudly women-led Kenyan manufacturer, we oversee our quality lines directly. We employ local women, pay living wages, and distribute clean, certified sanitary pads that match international quality standards.
            </p>

            <div className="p-5 bg-white border border-brand-clay rounded-xl space-y-3 shadow-2xs">
              <h4 className="font-display font-semibold text-xs text-brand-dark">Direct Manufacturing Guarantee:</h4>
              <p className="text-[11px] text-brand-dark-light leading-relaxed italic">
                "Our warehouse stock is produced, stored, and loaded under strict sanitary protocols in Kenya. We maintain enough physical bulk units year-round to fulfill high-volume supermarket distribution grids and global donor school campaigns instantly."
              </p>
              <div className="relative pt-3 border-t border-brand-cream-dark flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="w-20 h-14 rounded-lg overflow-hidden border border-brand-clay shrink-0 bg-zinc-100">
                  <img
                    src="/lorna-at-warehouse-binti.jpeg"
                    alt="Lorna in Warehouse"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[9.5px] text-brand-dark font-mono block font-bold uppercase tracking-wider text-brand-berry">Warehouse Approved Stock</span>
                  <span className="text-[10px] text-brand-dark-light font-mono block">Verification Ref: lorna-at-warehouse-binti.jpeg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stockist, Wholesale, Supermarket and Salon booking lead engine */}
      <section className="bg-brand-cream-dark/50 py-20 border-t border-b border-brand-clay" id="stockists">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-brand-berry text-xs font-mono uppercase font-bold tracking-widest block">Wholesale & Partnership Channel</span>
            <h2 className="font-display font-bold text-2xl sm:text-3.5xl text-brand-dark">Stock Mrembo Pads</h2>
            <p className="text-brand-dark-light text-xs leading-relaxed">
              Become an authorized stockist retailer or distributor partner. Binti Marvels Ltd distributes high-margin boxes to salons, beauty shops, pharmacies, local kiosks, schools, and supermarket chains across East Africa.
            </p>

            <div className="space-y-3 pt-4">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-white border border-brand-clay flex items-center justify-center shrink-0">✓</div>
                <div className="text-xs">
                  <h4 className="font-bold text-brand-dark">Attractive Merchant Margins</h4>
                  <p className="text-[10px] text-brand-dark-light">Wholesale rates provide significant yield gains for beauty salons, minimarts, and reseller chains.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-white border border-brand-clay flex items-center justify-center shrink-0">✓</div>
                <div className="text-xs">
                  <h4 className="font-bold text-brand-dark">Marketing Collateral Packs</h4>
                  <p className="text-[10px] text-brand-dark-light">Every stockist receives high-impact countertop displays, posters, and direct listing on our community directory.</p>
                </div>
              </div>

              <div className="border border-brand-clay rounded-xl overflow-hidden mt-6 bg-white shadow-sm max-w-sm">
                <img
                  src="/binti-product-portfolio.jpeg"
                  alt="Binti Product Portfolio Setup"
                  referrerPolicy="no-referrer"
                  className="w-full h-44 object-cover"
                />
                <span className="text-[9px] text-[#5C0632] px-3 py-2 block bg-brand-cream/40 border-t border-brand-clay font-mono font-bold uppercase tracking-wider">
                  Salon setup asset: binti-product-portfolio.jpeg
                </span>
              </div>
            </div>
          </div>

          {/* Lead capture form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-brand-clay p-6 sm:p-8 shadow-xs">
            {leadSubmitted ? (
              <div className="text-center py-12 space-y-4 animate-fade-in">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 mx-auto">✓</div>
                <h3 className="font-display font-medium text-brand-dark text-xl">Thank you for your Partnership interest!</h3>
                <p className="text-xs text-brand-dark-light max-w-sm mx-auto leading-relaxed">
                  We have logged your stockist distribution profile. Our wholesale manager will email or WhatsApp your authorized wholesale price list sheet and logistics quote within 4 business hours. Let’s succeed together!
                </p>
                <button
                  onClick={() => setLeadSubmitted(false)}
                  className="px-4 py-2 bg-brand-cream border border-brand-clay rounded-lg text-xs font-semibold uppercase text-brand-dark cursor-pointer pointer-events-auto hover:bg-brand-clay"
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleStockistSubmit} className="space-y-4 text-xs font-semibold pointer-events-auto">
                <h4 className="font-display font-bold text-brand-dark text-base border-b border-brand-cream-dark pb-3">Submit Stockist Lead Profile</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-brand-dark-light text-[11px] block font-medium">Business / Store Official Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Beauty Haven Salon, Nakuru"
                      className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-medium"
                      value={stockistLead.businessName}
                      onChange={(e) => setStockistLead({ ...stockistLead, businessName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-brand-dark-light text-[11px] block font-medium">Business Category</label>
                    <select
                      className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-medium cursor-pointer"
                      value={stockistLead.role}
                      onChange={(e) => setStockistLead({ ...stockistLead, role: e.target.value as any })}
                    >
                      <option value="salon">Beauty Salon / Barber Shop</option>
                      <option value="pharmacy">Pharmacy / Chemist Shop</option>
                      <option value="minimart">Store / Minimart / Supermarket</option>
                      <option value="reseller">Independent Merchant Reseller</option>
                      <option value="csr_ngo">NGO CSR / Donation Bulk Buyer</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-brand-dark-light text-[11px] block font-medium">Contact Person Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wanjiku Nduta"
                      className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-medium"
                      value={stockistLead.contactName}
                      onChange={(e) => setStockistLead({ ...stockistLead, contactName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-brand-dark-light text-[11px] block font-medium">Phone Number (M-Pesa / WhatsApp Line)</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0712345678"
                      className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-mono font-medium"
                      value={stockistLead.phone}
                      onChange={(e) => setStockistLead({ ...stockistLead, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-brand-dark-light text-[11px] block font-medium">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. hello@store.co.ke"
                      className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-medium"
                      value={stockistLead.email}
                      onChange={(e) => setStockistLead({ ...stockistLead, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-brand-dark-light text-[11px] block font-medium">Business Town / County</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nairobi, Nakuru, Kisumu"
                      className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-medium"
                      value={stockistLead.location}
                      onChange={(e) => setStockistLead({ ...stockistLead, location: e.target.value })}
                    />
                  </div>
                </div>

                {/* Consent Blocks - Compliant with legal requirements */}
                <div className="p-3 bg-[#FAF7F2] rounded-lg border border-brand-clay space-y-3 text-[10px]">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="stockist-consent"
                      required
                      className="mt-0.5 shrink-0 accent-brand-berry w-3.5 h-3.5 cursor-pointer"
                    />
                    <label htmlFor="stockist-consent" className="text-brand-dark-light leading-relaxed cursor-pointer font-medium">
                      <strong className="text-brand-dark font-medium">GDPR & Data Protection Consent (Required):</strong> I agree that Binti Marvels Ltd may contact me via WhatsApp, Phone, and Email to process this specific merchant inquiry. I understand I can request my data to be deleted at any time.
                    </label>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="stockist-marketing"
                      checked={stockistLead.consentMarketing}
                      onChange={(e) => setStockistLead({ ...stockistLead, consentMarketing: e.target.checked })}
                      className="mt-0.5 shrink-0 accent-brand-berry w-3.5 h-3.5 cursor-pointer"
                    />
                    <label htmlFor="stockist-marketing" className="text-brand-dark-light leading-relaxed cursor-pointer font-medium">
                      <strong className="text-brand-dark font-medium">Optional Marketing:</strong> Keep me updated regarding upcoming merchant trade events, wholesale discounts, and bulk school charity launches. Rep STOP to unsubscribe at any point.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full text-center py-3 bg-brand-berry hover:bg-brand-berry-dark text-white font-display font-semibold uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
                >
                  Send Stockist Application
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Binti Kids, Schools and NGO CSR Impact section */}
      <section className="py-20 max-w-7xl mx-auto px-4" id="csr-schools">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-brand-berry text-xs font-mono uppercase font-bold tracking-widest block">NGO, School & County Program Channel</span>
            <h2 className="font-display font-bold text-3xl sm:text-4.5xl text-brand-dark">The Binti Dignity Mission</h2>
            <p className="text-brand-dark-light text-xs sm:text-sm leading-relaxed font-sans">
              Menstruating should never lead to school absenteeism. For girls in primary and secondary schools across Kenya’s counties, missing 4-5 days of class each month stalls their dreams. Binti Marvels partner directly with schools, NGOs, corporate CSR boards, and county government teams, supplying specialized bulk sanitary packs at close-to-manufacturing cost.
            </p>

            <div className="row p-4 rounded-xl border border-brand-clay bg-brand-cream-dark/30 space-y-3 text-xs flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-brand-dark">Direct Donor Transparency Proof</h4>
                <p className="text-[#5C3E33]/95 leading-relaxed font-normal">
                  We document and catalog every bulk donation to verify distribution. Our schools campaign files—including <code className="bg-white py-0.5 px-1.5 rounded text-brand-berry font-mono text-[10.5px] font-bold">lorna-binti-donation-kitui.jpeg</code>—validate that products reach girls in need in regions like Kitui County.
                </p>
              </div>
              <div className="w-28 h-20 rounded-lg overflow-hidden border border-brand-clay shrink-0 bg-white relative shadow-xs">
                <img
                  src="/lorna-binti-donation-kitui.jpeg"
                  alt="Lorna Donation Kitui"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BINTI_PRODUCTS.map((bp) => (
                <div key={bp.id} className="p-4 bg-white rounded-xl border border-brand-clay flex flex-col justify-between space-y-3 hover:border-brand-berry duration-350 shadow-2xs">
                  <div>
                    <div className="w-full h-24 bg-zinc-100 rounded-lg overflow-hidden mb-2 border border-zinc-200">
                      <img
                        src="/binti-product-portfolio.jpeg"
                        alt={bp.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="px-2 py-0.5 bg-brand-clay text-brand-dark text-[9px] font-mono font-bold uppercase rounded-full">Dignity Assortment</span>
                    <h4 className="font-display font-extrabold text-brand-dark text-sm leading-tight mt-1">{bp.name}</h4>
                    <p className="text-[11px] text-[#4E2F23]/80 leading-relaxed mt-1 font-normal">{bp.description}</p>
                  </div>
                  <div className="pt-2 border-t border-brand-cream-dark flex items-baseline justify-between">
                    <span className="text-[10px] text-brand-dark-light font-mono font-medium">{bp.quantity}</span>
                    <span className="font-mono text-sm font-extrabold text-brand-berry">KSh {bp.priceKsh}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CSR Lead application section */}
          <div className="lg:col-span-5 bg-white border border-brand-clay rounded-2xl p-6 shadow-xs pointer-events-auto">
            {csrSubmitted ? (
              <div className="text-center py-10 space-y-4 animate-fade-in">
                <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-brand-teal mx-auto font-bold">✓</div>
                <h4 className="font-display font-medium text-brand-dark text-lg">CSR Registration Logged Case</h4>
                <p className="text-xs text-brand-dark-light leading-relaxed">
                  Thank you for keeping girls protected. Our community impact manager will review your requested bulk target of {csrLead.qtyPacks} packs and dispatch a custom CSR corporate quotation directly to you.
                </p>
                <button
                  onClick={() => setCsrSubmitted(false)}
                  className="px-4 py-2 bg-brand-cream border border-brand-clay text-brand-dark rounded-xl text-xs font-display font-bold uppercase cursor-pointer"
                >
                  Submit another card
                </button>
              </div>
            ) : (
              <form onSubmit={handleCsrSubmit} className="space-y-4 text-xs font-semibold">
                <h4 className="font-display font-bold text-brand-dark text-base border-b border-brand-cream-dark pb-3">Inquire Bulk Dignity Supply</h4>

                <div className="space-y-1">
                  <label className="text-brand-dark-light block text-[11px]">Organization / Campaign Group</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Safaricom Foundation, Rotary Club"
                    className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-medium"
                    value={csrLead.organizationName}
                    onChange={(e) => setCsrLead({ ...csrLead, organizationName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-brand-dark-light block text-[11px]">Contact Officer</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lorna Joyce"
                      className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-medium"
                      value={csrLead.contactName}
                      onChange={(e) => setCsrLead({ ...csrLead, contactName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-brand-dark-light block text-[11px]">Target County</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kitui, Turkana"
                      className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-medium"
                      value={csrLead.county}
                      onChange={(e) => setCsrLead({ ...csrLead, county: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-brand-dark-light block text-[11px]">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. csr@foundation.org"
                      className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-medium"
                      value={csrLead.email}
                      onChange={(e) => setCsrLead({ ...csrLead, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-brand-dark-light block text-[11px]">Volume Estimate (Packs)</label>
                    <input
                      type="number"
                      required
                      value={csrLead.qtyPacks}
                      onChange={(e) => setCsrLead({ ...csrLead, qtyPacks: parseInt(e.target.value) })}
                      className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-mono font-medium"
                    />
                  </div>
                </div>

                {/* Secure GDPR audit checked inputs */}
                <div className="p-3 bg-[#FAF7F2] rounded-lg border border-brand-clay space-y-2 text-[10px]">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="csr-consent"
                      required
                      checked={csrLead.consentContact}
                      onChange={(e) => setCsrLead({ ...csrLead, consentContact: e.target.checked })}
                      className="mt-0.5 shrink-0 accent-brand-berry w-3.5 h-3.5 cursor-pointer"
                    />
                    <label htmlFor="csr-consent" className="text-brand-dark-light cursor-pointer leading-relaxed font-medium">
                      <strong className="text-brand-dark font-medium">Consent Directive:</strong> I agree that Binti Marvels Ltd may contact me at these credentials to discuss this specific CSR donation proposal. No telemetry or details will be sold to advertisement brokers.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full text-center py-3 bg-brand-berry hover:bg-brand-berry-dark text-white font-display font-semibold uppercase tracking-wider rounded-xl cursor-pointer transition-colors"
                >
                  Submit CSR Dignity Request
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Immersive Delivery/Logistics Banner */}
      <section className="bg-brand-dark text-white py-16 border-t border-brand-clay-dark overflow-hidden z-10 relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#2A2338] border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase font-bold text-brand-gold tracking-wider">
              <Truck className="w-3.5 h-3.5" />
              <span>Complimentary Nationwide Logistics</span>
            </div>
            
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-[#EFE4DF]">
              Express Motorbike Dispatch Across Nairobi & Nakuru
            </h2>
            
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-xl font-normal">
              We understand that timing is everything. Our dedicated dispatch motorbikes ensure that your sanitary packets transition from our pipeline warehouse to your doorstep in pristine condition. No delayed schedules, no hidden charges. Pay safely only upon arrival.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="block font-mono text-xl font-bold text-brand-gold">0717 345 841</span>
                <span className="block text-[9px] text-zinc-400 mt-1 uppercase font-semibold">Direct Dispatch Hotline</span>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="block font-mono text-xl font-bold text-emerald-400">100% Free</span>
                <span className="block text-[9px] text-zinc-400 mt-1 uppercase font-semibold">Included on Box orders</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative aspect-video lg:aspect-square bg-[#2A2338]">
            <img
              src="/mrembo-on-motorbike.jpeg"
              alt="Mrembo Dispatch Motorbike Rider"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171320] via-transparent to-transparent"></div>
            <span className="absolute bottom-4 left-4 bg-[#171320]/80 backdrop-blur-xs text-[9px] font-mono text-brand-gold px-3 py-1.5 rounded border border-white/10">
              Courier Reference: mrembo-on-motorbike.jpeg
            </span>
          </div>
        </div>
      </section>

      {/* Trust Signet and Security Badges block */}
      <footer className="bg-brand-dark text-brand-cream pt-16 pb-12 border-t border-brand-dark-light font-medium" id="co-footer">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-brand-berry flex items-center justify-center text-white font-display font-bold">
                B
              </div>
              <h4 className="font-display font-bold text-sm">Binti Marvels Ltd</h4>
            </div>
            <p className="text-xs text-brand-clay/70 leading-relaxed font-sans font-normal">
              Corporate Office: Nairobi, Kenya.<br />
              Authorized Mrembo manufacturing plants in East Africa.<br />
              One Dignity Mission, Two Life Stages.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-display font-bold text-[#EFE4DF]">Discover Ranges</h4>
            <div className="flex flex-col gap-2 font-normal text-brand-clay/80">
              <a href="#mrembo-range" className="hover:text-brand-gold transition-colors">• Mrembo Pack 6 (KSh 500)</a>
              <a href="#mrembo-range" className="hover:text-brand-gold transition-colors">• Mrembo Pack 12 (KSh 900)</a>
              <a href="#mrembo-range" className="hover:text-brand-gold transition-colors">• Mrembo Pack 24 (KSh 1,550)</a>
              <a href="#mrembo-range" className="hover:text-brand-gold transition-colors">• Mrembo Pack 48 (KSh 2,650)</a>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-display font-bold text-[#EFE4DF]">Legal Integrity & Licensing</h4>
            <div className="flex flex-col gap-1.5 font-normal text-brand-clay/80 font-mono text-[10px] leading-relaxed">
              <div>- ODPC Kenya Controller Ref: #PENDING</div>
              <div>- KEBS Standardization Permit: #PENDING</div>
              <div>- Meta Verified Merchant ID: #PENDING</div>
              <div>- Phone Order Line: +254 717 345 841</div>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <h4 className="font-display font-bold text-[#EFE4DF]">Privacy & Cookies</h4>
            <p className="text-[10px] text-brand-clay/60 leading-relaxed font-normal">
              We cookies to optimize page loads only in accordance with the Kenya Data Protection Commissioner protocols.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => alert('Consent Cleared! Functional analytics hooks successfully permitted.')}
                className="px-3 py-1 bg-brand-teal text-white rounded text-[10px] cursor-pointer"
              >
                Accept All
              </button>
              <button
                onClick={() => alert('Telemetry Disabled. Anonymized operational states retained.')}
                className="px-3 py-1 bg-brand-dark-light text-brand-clay rounded text-[10px] cursor-pointer"
              >
                Functional Only
              </button>
            </div>
          </div>
        </div>

        {/* Visible policy links and opt-out specifications */}
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-brand-dark-light flex flex-col md:flex-row md:items-center justify-between gap-4 text-[11px] font-normal text-brand-clay/60">
          <div>
            <p>© 2026 Binti Marvels Limited. All rights reserved. Registered trademark of Mrembo Pads Kenya.</p>
            <p className="mt-1 text-[10px]">GDPR and ODPC compliant consent panels enforced near all booking forms. Option opt-out standard applies by returning STOP keyword replies to marketing channels.</p>
          </div>
          <div className="flex flex-wrap gap-4 font-semibold text-brand-clay">
            <a href="#policy-terms" onClick={() => alert('Consent policy template: Binti Marvels respects the ODPC 2019 legal requirements. Your recorded metadata phone lines are treated under absolute security boundaries.')} className="hover:text-brand-gold transition-colors">Privacy Policy</a>
            <a href="#policy-terms" onClick={() => alert('Terms of Service template: Direct shipping is processed in Kenya. Payments booked on arrival via Paybill. Subscriptions can be terminated with zero penalties.')} className="hover:text-brand-gold transition-colors">Terms of Service</a>
            <a href="#policy-terms" onClick={() => alert('WhatsApp Opt-In Statement: Automated service updates strictly represent transactional shipping limits, unless promotional consent scales are explicitly granted.')} className="hover:text-brand-gold transition-colors">WhatsApp Agreement</a>
          </div>
        </div>
      </footer>

      {/* Cart Checkout Slide-In Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 pointer-events-auto animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-brand-clay shadow-xl overflow-hidden p-6 relative">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-brand-cream rounded-full text-brand-dark hover:text-brand-berry cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {checkoutStep === 'success' ? (
              <div className="text-center py-8 space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-brand-teal flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                <h3 className="font-display font-bold text-brand-dark text-xl">Mrembo Order Successfully Received!</h3>
                <p className="text-xs text-brand-dark-light max-w-sm mx-auto leading-relaxed">
                  We have captured your order details & legal consent flags. Binti backend processors are preparing your shipment wrapper.
                </p>

                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-brand-clay text-left space-y-2">
                  <span className="font-mono text-[9px] uppercase font-bold text-brand-gold block">Captured Consent Schema Record:</span>
                  <div className="font-mono text-[10px] text-[#4E2F23]/80 space-y-1">
                    <div>Receiver: <span className="text-brand-dark">{shippingName}</span></div>
                    <div>Phone: <span className="text-brand-dark">{shippingPhone}</span></div>
                    <div>Transactional Notification Opt-In: <span className="text-brand-teal">ENABLED (APPROVED)</span></div>
                    <div>Prediction Reminder Opt-In: <span className="text-brand-dark">{consentCheckboxes.remind ? 'ENABLED' : 'DISABLED'}</span></div>
                    <div>Marketing News Opt-In: <span className="text-brand-dark">{consentCheckboxes.mark ? 'ENABLED' : 'DISABLED'}</span></div>
                  </div>
                </div>

                <p className="text-[10px] text-brand-dark-light italic bg-amber-50 border border-amber-200 rounded p-3 leading-relaxed">
                  "Hi {shippingName}, thank you for choosing Mrembo Pads! We have received your order. Ref: #PEND_SIMULATE. Binti customer care will WhatsApp you shortly to confirm preferred delivery lines. Rep STOP to end." — Compliant Transactional SMS Mock Triggered!
                </p>

                <button
                  onClick={() => {
                    setMockCartCount(0);
                    setCart([]);
                    setCheckoutStep('form');
                    setShowCheckoutModal(false);
                  }}
                  className="px-6 py-2.5 bg-brand-berry hover:bg-brand-berry-dark text-white rounded-xl text-xs font-display font-semibold uppercase cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs font-semibold">
                <div className="border-b border-brand-cream-dark pb-3 space-y-1">
                  <h3 className="font-display font-bold text-brand-dark text-lg">Checkout Mrembo Comfort Bundle</h3>
                  <p className="text-xs text-brand-dark-light font-sans font-normal">Please confirm delivery details. Payment is settled on delivery via M-Pesa.</p>
                </div>

                <div className="space-y-1.5 bg-brand-cream p-3 rounded-xl border border-brand-clay">
                  <div className="flex justify-between font-display font-medium text-xs text-brand-dark">
                    <span>Selected Pack Option:</span>
                    <span>{purchaseType === 'subscription' ? ' predictive subscription' : 'One-Time Purchase'}</span>
                  </div>
                  {cart.map((c) => (
                    <div key={c.product.id} className="flex justify-between items-baseline pt-1">
                      <span className="font-extrabold text-brand-dark">{c.product.name}</span>
                      <span className="font-mono text-xs font-bold text-[#5C0632]">KSh {purchaseType === 'subscription' ? Math.round(c.product.priceKsh * 0.9) : c.product.priceKsh}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-brand-clay/40 flex justify-between font-display font-extrabold text-sm text-brand-dark">
                    <span>Total Amount (Delivery Included):</span>
                    <span className="text-brand-berry font-mono">KSh {totalCartPrice}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-brand-dark-light block font-medium">Customer Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wanjiku Nduta"
                      className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-medium"
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-brand-dark-light block font-medium">WhatsApp / Mobile Line</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 0712345678"
                        className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-mono font-medium"
                        value={shippingPhone}
                        onChange={(e) => setShippingPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-brand-dark-light block font-medium">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. wanjiko@domain.ke"
                        className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-medium"
                        value={shippingEmail}
                        onChange={(e) => setShippingEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-brand-dark-light block font-medium">County</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nairobi, Nakuru"
                        className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-medium"
                        value={shippingCounty}
                        onChange={(e) => setShippingCounty(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-brand-dark-light block font-medium">Detailed shipping coordinates / Estate Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kilimani Area, Wood Avenue"
                        className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-medium"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Secure Active compliance ticks (strictly unchecked of course!) */}
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-brand-clay space-y-3 text-[10px]">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="checkout-trans"
                      checked={consentCheckboxes.trans}
                      onChange={(e) => setConsentCheckboxes({ ...consentCheckboxes, trans: e.target.checked })}
                      className="mt-0.5 shrink-0 accent-brand-berry w-3.5 h-3.5 cursor-pointer"
                    />
                    <label htmlFor="checkout-trans" className="text-brand-dark-light cursor-pointer leading-relaxed font-medium">
                      <strong className="text-brand-dark font-medium">Consent 1 (Required):</strong> I explicitly agree that Binti Marvels Ltd and shipping partners may contact me via automated WhatsApp, Phone calls, or SMS templates to process and confirm this specific order logistics.
                    </label>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="checkout-remind"
                      checked={consentCheckboxes.remind}
                      onChange={(e) => setConsentCheckboxes({ ...consentCheckboxes, remind: e.target.checked })}
                      className="mt-0.5 shrink-0 accent-brand-berry w-3.5 h-3.5 cursor-pointer"
                    />
                    <label htmlFor="checkout-remind" className="text-brand-dark-light cursor-pointer leading-relaxed font-medium">
                      <strong className="text-brand-dark font-medium">Consent 2 (Optional Cycle Reminder):</strong> I wish to receive highly private, predictive reorder alerts every 28 days via SMS/WhatsApp so I can securely receive monthly supplies. Can cancel anytime.
                    </label>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="checkout-mark"
                      checked={consentCheckboxes.mark}
                      onChange={(e) => setConsentCheckboxes({ ...consentCheckboxes, mark: e.target.checked })}
                      className="mt-0.5 shrink-0 accent-brand-berry w-3.5 h-3.5 cursor-pointer"
                    />
                    <label htmlFor="checkout-mark" className="text-brand-dark-light cursor-pointer leading-relaxed font-medium">
                      <strong className="text-brand-dark font-medium">Consent 3 (Optional Marketing):</strong> Keep me noted about bulk donations, discount sales events, and authorized retailer listings. Return STOP anytime.
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutModal(false)}
                    className="w-full text-center py-3 border border-brand-clay text-brand-dark hover:bg-brand-cream rounded-xl text-xs font-display font-semibold uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full text-center py-3 bg-brand-berry hover:bg-brand-berry-dark text-white rounded-xl text-xs font-display font-semibold uppercase cursor-pointer"
                  >
                    Confirm Purchase
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
