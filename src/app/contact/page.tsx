import { Suspense } from 'react';
import type { Metadata } from 'next';
import { HeartHandshake, MessageCircle, Newspaper, ShoppingBag, Store, Users } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import SocialLinks from '@/components/SocialLinks';

export const metadata: Metadata = { title: 'Contact Binti Marvels', description: 'Contact Binti Marvels about Mrembo orders, Binti Charity, Binti Circles, stockists, wholesale and media.' };

const intents = [
  { icon: ShoppingBag, title: 'Order help', text: 'Bundle, stock or delivery questions.' },
  { icon: Store, title: 'Stockist & wholesale', text: 'Bring Mrembo closer to your customers.' },
  { icon: HeartHandshake, title: 'Binti Charity', text: 'Fund product supply for an agreed community.' },
  { icon: Users, title: 'Binti Circles', text: 'Community, conversation and activations.' },
  { icon: Newspaper, title: 'Media', text: 'Founder, product and company enquiries.' },
] as const;

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-brand-cream">
      <section className="px-5 pb-12 pt-16 sm:px-8 lg:pb-16 lg:pt-24"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[.25em] text-brand-gold-dark">Contact Binti</p><h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[.96] sm:text-7xl">Start the right conversation.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-dark-light">Order Mrembo, find a stockist, discuss Binti Charity or invite the team into a wider conversation.</p></div></section>
      <section className="px-5 pb-20 sm:px-8 lg:pb-28"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">{intents.map(({icon:Icon,title,text})=><article key={title} className="flex gap-4 rounded-2xl border border-brand-clay bg-white p-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-cream-dark text-brand-berry"><Icon className="h-5 w-5"/></span><div><h2 className="font-display text-lg font-bold">{title}</h2><p className="mt-1 text-sm leading-relaxed text-brand-dark-light">{text}</p></div></article>)}</div><a href="https://wa.me/254717345841" className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#15803d] px-6 py-3.5 font-bold text-white"><MessageCircle className="h-5 w-5"/> WhatsApp Binti</a><div className="mt-8 rounded-[2rem] bg-[#26030f] p-7 text-white"><p className="text-xs font-bold uppercase tracking-[.2em] text-brand-gold">Direct contact</p><p className="mt-4 text-sm leading-relaxed text-brand-clay"><strong className="text-white">Phone / WhatsApp</strong><br/>+254 717 345 841</p><p className="mt-4 text-sm leading-relaxed text-brand-clay"><strong className="text-white">Email</strong><br/>binticreationsllc@gmail.com</p><p className="mt-4 text-sm leading-relaxed text-brand-clay"><strong className="text-white">Fulfilment</strong><br/>Binti coordinates orders from Mombasa Road and confirms the exact delivery destination with each customer.</p></div></div><Suspense fallback={<div className="rounded-[2rem] bg-white p-8">Loading form…</div>}><ContactForm /></Suspense></div></section>
      <section className="bg-brand-cream-dark px-5 py-20 sm:px-8"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[.22em] text-brand-gold-dark">Follow Binti & Mrembo</p><h2 className="mt-4 font-serif text-4xl sm:text-5xl">Stay close to products, people and projects.</h2><div className="mt-8 max-w-3xl"><SocialLinks /></div></div></section>
    </main>
  );
}
