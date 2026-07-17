'use client';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartHandshake, Menu, ShoppingBag, MessageSquare } from 'lucide-react';
import { useCart } from './CartContext';
import MobileNav from './MobileNav';

const links = [
  ['/our-story','Our Story'], ['/shop','Shop Mrembo'], ['/binti-circles','Binti Circles'], ['/binti-charity','Binti Charity'], ['/contact','Contact'],
] as const;
export default function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const [open, setOpen] = useState(false);
  const closeMenu = useCallback(() => setOpen(false), []);
  return <><div className="bg-[#2D0616] px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[.16em] text-brand-cream">Binti Marvels · Home of Mrembo sanitary pads</div><header className="sticky top-0 z-40 border-b border-brand-clay/70 bg-brand-cream/95 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6"><Link href="/" className="flex items-center" aria-label="Binti Marvels home"><Image src="/binti-marvels-wordmark.png" alt="Binti Marvels" width={500} height={274} priority className="h-12 w-auto object-contain object-left sm:h-14"/></Link><nav className="hidden items-center gap-5 text-[11px] font-bold uppercase tracking-wider text-brand-dark-light lg:flex">{links.map(([href,label])=><Link key={href} href={href} className="transition hover:text-brand-berry">{label}</Link>)}<Link href="/binti-charity#donate" className="inline-flex items-center gap-2 rounded-full bg-brand-berry px-4 py-2.5 text-white transition hover:bg-brand-dark"><HeartHandshake className="h-4 w-4"/> Donate</Link></nav><div className="flex items-center gap-1"><a href="https://wa.me/254717345841" target="_blank" rel="noreferrer" aria-label="WhatsApp Binti Marvels" className="rounded-full p-2 text-brand-dark-light hover:text-brand-teal"><MessageSquare className="h-5 w-5"/></a><button onClick={()=>setIsCartOpen(true)} aria-label={`Open basket with ${cartCount} items`} className="relative rounded-full p-2 text-brand-berry"><ShoppingBag className="h-5 w-5"/>{cartCount>0&&<span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-gold px-1 text-[9px] font-black text-brand-dark">{cartCount}</span>}</button><button onClick={()=>setOpen(true)} aria-label="Open menu" className="rounded-full p-2 lg:hidden"><Menu className="h-6 w-6"/></button></div></div></header><MobileNav isOpen={open} onClose={closeMenu}/></>;
}
