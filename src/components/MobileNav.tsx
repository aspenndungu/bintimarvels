'use client';
import { X, ChevronRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useModalDialog } from './useModalDialog';

const links = [['/','Home'],['/our-story','Our Story'],['/shop','Shop Mrembo'],['/binti-circles','Binti Circles'],['/binti-charity','Binti Charity'],['/binti-charity#donate','Donate to schools'],['/contact','Contact']] as const;

export default function MobileNav({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const dialogRef = useModalDialog(isOpen, onClose);
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 lg:hidden"><button className="absolute inset-0 bg-black/50" onClick={onClose} aria-label="Close menu backdrop"/><div ref={dialogRef} className="relative flex h-full w-[86%] max-w-sm flex-col bg-brand-cream shadow-2xl" role="dialog" aria-modal="true" aria-label="Site navigation"><div className="flex items-center justify-between border-b border-brand-clay p-5"><strong id="mobile-nav-title" className="font-display text-xl text-brand-dark">BINTI MARVELS</strong><button onClick={onClose} aria-label="Close menu" className="rounded-full p-2"><X className="h-5 w-5"/></button></div><nav className="flex-1 overflow-y-auto p-3">{links.map(([href,label])=><Link key={href} href={href} onClick={onClose} className={`flex items-center justify-between rounded-xl px-4 py-4 font-bold ${href.includes('#donate') ? 'bg-brand-berry text-white' : 'text-brand-dark hover:bg-white'}`}>{label}<ChevronRight className={`h-4 w-4 ${href.includes('#donate') ? 'text-brand-gold' : 'text-brand-gold-dark'}`}/></Link>)}</nav><div className="border-t border-brand-clay p-5"><a href="https://wa.me/254717345841" target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#15803d] py-3 font-bold text-white"><MessageCircle className="h-5 w-5"/> WhatsApp support</a></div></div></div>;
}
