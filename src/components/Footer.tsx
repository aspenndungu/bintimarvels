'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [showCookieBanner, setShowCookieBanner] = useState(true);

  return (
    <>
      <footer className="bg-brand-dark text-white py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="space-y-4">
            <h4 className="font-display font-bold text-xl">Binti Marvels Ltd</h4>
            <p className="text-sm text-brand-clay-dark leading-relaxed">
              Premium African period care. Comfort for the woman who keeps showing up.
            </p>
            <div className="pt-2 text-xs text-brand-clay-dark space-y-1">
              <p>📍 Serving all 47 Kenyan counties</p>
              <p>✉️ binti@bintimarvels.com</p>
              <p>📞 +254 717 345 841</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-display font-bold text-lg text-brand-gold">Shop Mrembo</h4>
            <ul className="space-y-2 text-brand-clay/80 font-normal">
              <li><Link href="/#mrembo-range" className="hover:text-white transition-colors">Daily Comfort Packs</Link></li>
              <li><Link href="/#mrembo-range" className="hover:text-white transition-colors">Monthly Bundles</Link></li>
              <li><Link href="/stockists" className="hover:text-white transition-colors">Find a Stockist</Link></li>
              <li><Link href="/stockists" className="hover:text-white transition-colors">Wholesale & Salons</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-bold text-lg text-brand-gold">Our Mission</h4>
            <ul className="space-y-2 text-brand-clay/80 font-normal">
              <li><Link href="/about" className="hover:text-white transition-colors">Our Founder Story</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Local Manufacturing</Link></li>
              <li><Link href="/impact" className="hover:text-white transition-colors">School Distribution</Link></li>
              <li><Link href="/impact" className="hover:text-white transition-colors">Partner with Binti</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-bold text-lg text-brand-gold">Help & Legal</h4>
            <ul className="space-y-2 text-sm text-brand-clay-dark">
              <li><Link href="/delivery" className="hover:text-white transition-colors">Delivery & Shipping</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/consent" className="hover:text-white transition-colors">Consent & Messaging</Link></li>
              <li><Link href="/data-request" className="hover:text-white transition-colors">Data Request</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 pt-8 border-t border-white/10 text-xs text-brand-clay-dark flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Binti Marvels Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            <span>ODPC Data Protection Compliant</span>
            <span>Made in Kenya 🇰🇪</span>
          </div>
        </div>
      </footer>

      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#FAF7F2] border-t border-[#DFCDC5] p-4 sm:p-6 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] select-none">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-display font-bold text-[#22140F] mb-1">Your Privacy & Consent</h4>
              <p className="text-xs text-[#3D2921] leading-relaxed">
                Binti Marvels uses cookies to ensure our checkout works, improve delivery routing, and measure social media campaigns. 
                We process personal data securely in Kenya. Read our <Link href="/privacy" className="underline text-brand-berry">Privacy Policy</Link>.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <button 
                onClick={() => setShowCookieBanner(false)}
                className="flex-1 md:flex-none px-4 py-2 bg-white border border-[#DFCDC5] text-[#22140F] rounded-lg text-xs font-bold hover:bg-[#EFE4DF] transition-colors cursor-pointer"
              >
                Functional Only
              </button>
              <button 
                onClick={() => setShowCookieBanner(false)}
                className="flex-1 md:flex-none px-6 py-2 bg-[#5A082C] text-white rounded-lg text-xs font-bold hover:bg-[#3D041C] transition-colors cursor-pointer"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
