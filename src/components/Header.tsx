'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, ShoppingBag, MessageSquare, ChevronDown } from 'lucide-react';
import { useCart } from './CartContext';
import MobileNav from './MobileNav';

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <>
      <div className="bg-[#2D0616] text-[#FAF7F2] py-2.5 px-4 text-xs select-none border-b border-black/20 font-semibold z-40 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-between gap-4">
          <div className="hidden sm:flex items-center gap-2 sm:gap-3.5 text-[11px] uppercase tracking-wider font-bold">
            <span>🇰🇪 Proudly Kenyan</span>
            <span className="opacity-40 select-none">•</span>
            <span>👩‍👧 Women-led</span>
          </div>
          <div className="text-[10px] sm:text-[11px] md:text-xs font-black text-[#EFE4DF] flex items-center gap-1.5 bg-[#4D0F28]/40 px-3 py-1 rounded-full border border-brand-gold/10 whitespace-nowrap">
            <span>🚚</span>
            <span>Free delivery in Nairobi over KSh 1,500</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 bg-[#FAF7F2] border-b border-[#EFE4DF]/80 z-35 select-none transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 pointer-events-auto cursor-pointer">
            <div className="h-11 w-11 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-xs border-2 border-[#D9A520]">
              <Image
                src="/mrembo_logo.jpg"
                alt="Mrembo Pads Logo"
                width={44}
                height={44}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="font-display font-black tracking-tighter text-[#2D0616] leading-none text-left">
              <div className="text-lg sm:text-xl font-display font-extrabold uppercase select-none">MREMBO</div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#B5840B] font-bold select-none">PADS</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-black uppercase tracking-wider text-brand-dark-light">
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#5A082C] transition-colors pointer-events-auto py-4">
              <span>Shop Mrembo</span>
              <ChevronDown className="w-3 h-3 text-[#B5840B] stroke-[2.5]" />
              <div className="absolute top-full left-0 w-48 bg-white border border-brand-clay shadow-xl rounded-xl p-2 hidden group-hover:block transition-all opacity-0 group-hover:opacity-100 z-50">
                <Link href="/#mrembo-range" className="block px-4 py-2 text-brand-dark hover:bg-brand-cream rounded-lg">All Bundles</Link>
                <Link href="/checkout" className="block px-4 py-2 text-brand-dark hover:bg-brand-cream rounded-lg">Quick Checkout</Link>
              </div>
            </div>
            <Link href="/#mrembo-range" className="hover:text-[#5A082C] transition-colors">Bundles</Link>
            <Link href="/about" className="hover:text-[#5A082C] transition-colors">About Us</Link>
            <Link href="/impact" className="hover:text-[#5A082C] transition-colors">Binti Impact</Link>
            <Link href="/stockists" className="hover:text-[#5A082C] transition-colors">Stockists</Link>
            <Link href="/contact" className="hover:text-[#5A082C] transition-colors">Contact Us</Link>
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <button onClick={() => window.open('https://wa.me/254717345841', '_blank')} className="p-2 text-brand-dark-light hover:text-emerald-600 transition-colors pointer-events-auto cursor-pointer">
              <MessageSquare className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </button>
            <div className="w-px h-6 bg-brand-clay mx-1 hidden sm:block"></div>
            
            <button onClick={() => setIsCartOpen(true)} className="p-2 text-brand-berry hover:text-brand-berry-dark transition-colors relative pointer-events-auto cursor-pointer group">
              <ShoppingBag className="w-5 h-5 sm:w-5.5 sm:h-5.5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-gold text-white text-[9px] font-black font-mono rounded-full flex items-center justify-center border-2 border-[#FAF7F2]">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button onClick={() => setIsMobileNavOpen(true)} className="p-2 text-brand-dark-light hover:text-brand-berry transition-colors lg:hidden pointer-events-auto cursor-pointer">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </>
  );
}
