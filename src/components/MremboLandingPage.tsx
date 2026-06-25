'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from './CartContext';
import Toast from './Toast';
import Link from 'next/link';
import { MREMBO_PRODUCTS } from '../data';
import { MremboProduct } from '../types';
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



export default function MremboLandingPage() {
  const { cart, addToCart, purchaseType, setPurchaseType } = useCart();


  // Proof tabs state
  const [activeProofTab, setActiveProofTab] = useState<'leak' | 'skin' | 'fit' | 'integrity'>('leak');

  

  
  const [toastMessage, setToastMessage] = useState('');

  const addProductToCart = (p: MremboProduct) => {
    setToastMessage(`Great choice! "${p.name}" has been added to your order basket.`);
    addToCart(p);
  };
  
  const onOrderViaChat = (productName: string, priceKsh: number) => {
    window.open(`https://wa.me/254717345841?text=Hi, I'd like to order the ${productName} (KSh ${priceKsh}). Please confirm availability and delivery.`, '_blank');
  };






  return (
    <div className="bg-brand-cream min-h-screen text-brand-dark overflow-x-hidden font-sans relative">
      {/* Hero Banner Area (High-End Full Width Editorial Redesign) */}
      <section className="relative overflow-hidden pt-0 lg:pt-12 pb-16 lg:pb-24 border-b border-[#EFE4DF] bg-[#FAF7F2]" id="hero-top">
        
        {/* Full Left-to-Right Hero Background Image for Desktop (Wider image specified by user) */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none hidden lg:block">
          <div className="absolute inset-y-0 right-0 h-full w-full lg:w-[85%] xl:w-[80%] [mask-image:linear-gradient(to_right,transparent,black_15%,black_100%)]">
            <Image src="/hero_image wider.png" alt="Mrembo Image" width={1875} height={839} quality={100} priority className="w-full h-full object-cover object-[65%_top]" style={{ objectFit: "cover" }} />
          </div>
        </div>

        {/* Mobile-First Image displayed on top of the section (Visible only on mobile/tablet) */}
        <div className="block lg:hidden w-full h-[45vh] min-h-[340px] max-h-[500px] overflow-hidden relative z-10 select-none pointer-events-none border-b border-[#EFE4DF]/50 bg-white">
          <Image src="/hero_image wider.png" alt="Mrembo Image" width={1875} height={839} quality={100} priority className="w-full h-full object-cover object-[80%_center] scale-120 origin-[80%_center]" style={{ objectFit: "cover" }} />
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
                setToastMessage('Subscription selected — 10% off applied!');
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
                    <Image src={p.imageSrc} alt={p.name} width={1200} height={1200} className="absolute inset-0 w-full h-full object-contain transition-all grayscale-20 group-hover:grayscale-0 duration-300" style={{ objectFit: "contain" }} />
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
            <h3 className="font-serif font-bold text-brand-dark text-xl leading-snug">Did you know? &ldquo;Binti is the girl. Mrembo is the woman she becomes.&rdquo;</h3>
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

        {/* How to Order */}
        <div className="mt-16 bg-white rounded-2xl border border-brand-clay p-8">
          <div className="text-center mb-8">
            <h3 className="font-display font-bold text-2xl text-brand-dark">How to Order</h3>
            <p className="text-xs text-brand-dark-light mt-2 italic">We&apos;ll only message you about this order unless you opt in to more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center text-2xl border border-brand-clay">🛍️</div>
              <h4 className="font-display font-bold text-sm">1. Choose Your Bundle</h4>
              <p className="text-xs text-brand-dark-light">Browse our Mrembo range and pick your comfort pack</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center text-2xl border border-brand-clay">📍</div>
              <h4 className="font-display font-bold text-sm">2. Confirm Delivery</h4>
              <p className="text-xs text-brand-dark-light">Tell us your county and delivery address</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center text-2xl border border-brand-clay">💳</div>
              <h4 className="font-display font-bold text-sm">3. Pay on Arrival</h4>
              <p className="text-xs text-brand-dark-light">Settle via M-Pesa when your order arrives</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center text-2xl border border-brand-clay">📦</div>
              <h4 className="font-display font-bold text-sm">4. Get Updates</h4>
              <p className="text-xs text-brand-dark-light">Receive WhatsApp confirmation and tracking</p>
            </div>
          </div>
        </div>


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
            <Image src="/mrembo-on-motorbike.jpeg" alt="Mrembo Image" width={1200} height={1200} className="absolute inset-0 w-full h-full object-cover" style={{ objectFit: "cover" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171320] via-transparent to-transparent"></div>
            <span className="absolute bottom-4 left-4 bg-[#171320]/80 backdrop-blur-xs text-[9px] font-mono text-brand-gold px-3 py-1.5 rounded border border-white/10">
              Fast, discreet delivery direct to your door.
            </span>
          </div>
        </div>
      </section>




      {/* Cart Checkout Inline Section */}
    </div>
  );
}
