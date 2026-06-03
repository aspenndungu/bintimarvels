'use client';
import { X, ChevronRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />
      <div className="fixed top-0 left-0 h-full w-full max-w-[280px] bg-[#FAF7F2] z-50 shadow-2xl flex flex-col animate-slide-in-left lg:hidden">
        <div className="p-4 border-b border-brand-clay flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-brand-gold">
              <Image src="/mrembo_logo.jpg" alt="Logo" width={32} height={32} />
            </div>
            <span className="font-display font-black text-brand-dark uppercase">Mrembo</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-brand-clay rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-brand-dark-light" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex flex-col space-y-1">
            <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-clay-dark">
              Shop
            </div>
            <Link href="/#mrembo-range" onClick={onClose} className="px-4 py-3 flex items-center justify-between text-brand-dark font-medium hover:bg-white transition-colors">
              Bundles & Packs
              <ChevronRight className="w-4 h-4 text-brand-clay-dark" />
            </Link>
            <Link href="/#checkout" onClick={onClose} className="px-4 py-3 flex items-center justify-between text-brand-dark font-medium hover:bg-white transition-colors">
              Quick Checkout
              <ChevronRight className="w-4 h-4 text-brand-clay-dark" />
            </Link>
            
            <div className="px-4 py-2 mt-4 text-xs font-bold uppercase tracking-wider text-brand-clay-dark">
              About
            </div>
            <Link href="/#founder-trust" onClick={onClose} className="px-4 py-3 flex items-center justify-between text-brand-dark font-medium hover:bg-white transition-colors">
              About Us & Founder
              <ChevronRight className="w-4 h-4 text-brand-clay-dark" />
            </Link>
            <Link href="/#csr-schools" onClick={onClose} className="px-4 py-3 flex items-center justify-between text-brand-dark font-medium hover:bg-white transition-colors">
              Binti Impact
              <ChevronRight className="w-4 h-4 text-brand-clay-dark" />
            </Link>
            <Link href="/#stockists" onClick={onClose} className="px-4 py-3 flex items-center justify-between text-brand-dark font-medium hover:bg-white transition-colors">
              Stockists & Partners
              <ChevronRight className="w-4 h-4 text-brand-clay-dark" />
            </Link>
            
            <div className="px-4 py-2 mt-4 text-xs font-bold uppercase tracking-wider text-brand-clay-dark">
              Support
            </div>
            <Link href="/contact" onClick={onClose} className="px-4 py-3 flex items-center justify-between text-brand-dark font-medium hover:bg-white transition-colors">
              Contact Us
              <ChevronRight className="w-4 h-4 text-brand-clay-dark" />
            </Link>
          </nav>
        </div>
        
        <div className="p-4 border-t border-brand-clay bg-white">
          <button 
            onClick={() => {
              window.open('https://wa.me/254717345841?text=Hi,%20I%20need%20help%20with%20Mrembo%20Pads', '_blank');
              onClose();
            }}
            className="w-full py-3 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-[#20bd5a] transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp Support
          </button>
        </div>
      </div>
    </>
  );
}
