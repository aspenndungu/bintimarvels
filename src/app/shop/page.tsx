import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Layers3, MapPin, MessageCircle, MoonStar, Sparkles } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import ProofStrip from '@/components/ProofStrip';
import SectionHeading from '@/components/SectionHeading';
import { DISTRIBUTION_REGIONS, PRODUCT_FEATURES } from '@/content/site-content';

export const metadata: Metadata = { title: 'Shop Mrembo', description: 'Shop locally made Mrembo sanitary-pad bundles from Binti Marvels.' };

export default function ShopPage() {
  const purchasable = process.env.CATALOG_VISIBLE === 'true' && process.env.CATALOG_APPROVED === 'true';
  return (
    <main className="min-h-screen bg-brand-cream">
      <section className="px-5 py-10 sm:px-8 lg:py-14">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2.75rem] bg-white shadow-[0_24px_80px_rgba(77,15,40,.1)] lg:grid-cols-[.9fr_1.1fr]">
          <div className="flex items-center px-7 py-14 sm:px-12 lg:px-16 lg:py-20"><div><p className="text-xs font-bold uppercase tracking-[.24em] text-brand-gold-dark">Mrembo bundles</p><h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[.96] text-brand-dark sm:text-7xl">Care for the woman who keeps showing up.</h1><p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-dark-light">Made in Kenya. Easy to keep close. Choose the bundle that fits your home, your month or the women you care for.</p><a href="#bundles" className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-berry px-7 py-3.5 font-bold text-white">Choose a bundle <ArrowRight className="h-4 w-4"/></a></div></div>
          <div className="relative min-h-[360px] overflow-hidden bg-[#eef0f5] lg:min-h-[620px]"><Image src="/mrembo-pack-product.png" alt="One sealed Mrembo sanitary-pad pack" fill priority sizes="(max-width:1024px) 100vw, 55vw" className="object-cover object-center"/></div>
        </div>
      </section>
      <ProofStrip items={PRODUCT_FEATURES.map((item) => item.title)} />
      <section className="px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Mrembo formats" title="The care format she needs, clearly named."><p>Regular is the current photographed Mrembo pack. For Ultra Long pads and panty liners, ask Binti to confirm the current pack, price and stock before ordering.</p></SectionHeading><div className="mt-10 grid gap-5 md:grid-cols-3">{[
        { title: 'Regular pads', status: 'Current format — confirm stock', text: 'The photographed Mrembo pack contains 8 regular pads. Ask Binti to confirm current stock and price before ordering.', icon: Layers3, available: false },
        { title: 'Ultra Long pads', status: 'Ask availability', text: 'A longer pad format for customers who prefer extended coverage. Binti will confirm the current Mrembo option.', icon: MoonStar, available: false },
        { title: 'Panty liners', status: 'Ask availability', text: 'A lighter daily-care format in Binti’s wider product experience. Binti will confirm the current Mrembo option.', icon: Sparkles, available: false },
      ].map(({ title, status, text, icon: Icon, available }) => <article key={title} className={`rounded-[2rem] border p-7 ${available ? 'border-brand-gold/60 bg-white shadow-[0_18px_50px_rgba(77,15,40,.08)]' : 'border-brand-clay bg-brand-cream-dark'}`}><Icon className="h-8 w-8 text-brand-berry"/><p className={`mt-5 inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[.16em] ${available ? 'bg-[#e6f6eb] text-[#23663a]' : 'bg-white text-brand-gold-dark'}`}>{status}</p><h2 className="mt-4 font-serif text-3xl text-brand-dark">{title}</h2><p className="mt-4 text-sm leading-relaxed text-brand-dark-light">{text}</p>{!available && <a href={`https://wa.me/254717345841?text=${encodeURIComponent(`Hi Binti, please confirm current Mrembo ${title} availability.`)}`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 font-bold text-brand-berry">Ask Binti <ArrowRight className="h-4 w-4"/></a>}</article>)}</div></div></section>
      <section id="bundles" className="scroll-mt-28 px-5 py-14 sm:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><ProductGrid purchasable={purchasable} /></div></section>
      <section className="bg-[#310516] px-5 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Simple care, clearly labelled" title="What’s inside every pack." light><p>Mrembo contains 8 regular pads. The pack describes them as unscented, cotton-feel, soft and comfortable.</p></SectionHeading><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{PRODUCT_FEATURES.map((feature) => <article key={feature.title} className="rounded-[1.75rem] border border-white/10 bg-white/7 p-6"><h3 className="font-display text-xl font-bold">{feature.title}</h3><p className="mt-3 text-sm leading-relaxed text-brand-clay">{feature.text}</p></article>)}</div></div>
      </section>
      <section className="px-5 py-20 sm:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2"><article className="rounded-[2.5rem] bg-white p-8 shadow-[0_20px_60px_rgba(77,15,40,.08)] sm:p-10"><MapPin className="h-8 w-8 text-brand-gold-dark"/><h2 className="mt-5 font-serif text-4xl">Delivered by Binti.</h2><p className="mt-4 leading-relaxed text-brand-dark-light">Add your bundle and choose your destination. Binti will show or confirm the delivery amount before you continue.</p><Link href="/checkout" className="mt-7 inline-flex items-center gap-2 font-bold text-brand-berry">Check delivery <ArrowRight className="h-4 w-4"/></Link></article><article className="rounded-[2.5rem] bg-brand-cream-dark p-8 sm:p-10"><MessageCircle className="h-8 w-8 text-brand-berry"/><h2 className="mt-5 font-serif text-4xl">Prefer a nearby shop?</h2><p className="mt-4 leading-relaxed text-brand-dark-light">Mrembo has been available through selected shops and minimarts in {DISTRIBUTION_REGIONS.join(', ')}. Ask us to confirm the closest current stockist.</p><a href="https://wa.me/254717345841?text=Hi%2C%20please%20help%20me%20find%20a%20Mrembo%20stockist." className="mt-7 inline-flex items-center gap-2 font-bold text-brand-berry">Find a stockist <ArrowRight className="h-4 w-4"/></a></article></div></section>
    </main>
  );
}
