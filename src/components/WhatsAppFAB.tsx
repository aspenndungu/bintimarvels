'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

const HIDDEN_PATHS = new Set(['/checkout', '/contact', '/delivery', '/privacy', '/terms', '/returns', '/consent', '/data-request', '/shop', '/binti-charity', '/our-story']);

export default function WhatsAppFAB() {
  const pathname = usePathname();
  if (HIDDEN_PATHS.has(pathname)) return null;
  return <a href="https://wa.me/254717345841" aria-label="Chat with Binti on WhatsApp" className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-[#25D366] text-white shadow-xl transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"><MessageCircle className="h-7 w-7" /></a>;
}
