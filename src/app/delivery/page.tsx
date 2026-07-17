import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, ReceiptText, PackageCheck } from 'lucide-react';

export const metadata: Metadata = { title: 'Delivery', description: 'Choose your Mrembo destination and check the Binti delivery amount before continuing.' };

export default function DeliveryPage() {
  const ratesApproved = process.env.DELIVERY_RATE_CARD_APPROVED === 'true';
  return <main className="min-h-screen bg-brand-cream text-brand-dark">
    <section className="bg-[#310516] px-5 py-20 text-white sm:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[.24em] text-brand-gold">Binti delivery</p><h1 className="mt-4 max-w-5xl font-serif text-5xl leading-[.96] sm:text-7xl">From Binti to your exact destination.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-clay">Choose your address or an agreed drop-off point. Binti will {ratesApproved ? 'show the delivery price' : 'confirm the delivery amount'} before you continue.</p><Link href="/checkout" className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 font-bold text-brand-dark">Check delivery <ArrowRight className="h-4 w-4"/></Link></div></section>

    <section className="px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="grid gap-5 md:grid-cols-3">
      <article className="rounded-[2rem] bg-white p-8 shadow-[0_16px_50px_rgba(77,15,40,.08)]"><MapPin className="h-8 w-8 text-brand-berry"/><p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-brand-gold-dark">Step 1</p><h2 className="mt-3 font-serif text-3xl">Choose the place.</h2><p className="mt-4 leading-relaxed text-brand-dark-light">Search for an address, or set a pin on the exact doorway, gate or agreed drop-off point.</p></article>
      <article className="rounded-[2rem] bg-brand-cream-dark p-8"><ReceiptText className="h-8 w-8 text-brand-berry"/><p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-brand-gold-dark">Step 2</p><h2 className="mt-3 font-serif text-3xl">{ratesApproved ? 'See the delivery price.' : 'Confirm delivery.'}</h2><p className="mt-4 leading-relaxed text-brand-dark-light">{ratesApproved ? 'The delivery price is shown for the destination you select and updates if you choose another location.' : 'Binti uses the selected destination to prepare and confirm the delivery amount with you.'}</p></article>
      <article className="rounded-[2rem] bg-brand-berry p-8 text-white"><PackageCheck className="h-8 w-8 text-brand-gold"/><p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-brand-gold">Step 3</p><h2 className="mt-3 font-serif text-3xl">Confirm and pay.</h2><p className="mt-4 leading-relaxed text-brand-clay">Binti confirms stock and payment before the order is released for dispatch.</p></article>
    </div></div></section>

    <section className="bg-brand-cream-dark px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-brand-gold-dark">Clear before you continue</p><h2 className="mt-4 max-w-4xl font-serif text-4xl leading-tight sm:text-6xl">One destination. {ratesApproved ? 'One visible delivery price.' : 'One confirmed delivery amount.'}</h2><p className="mt-5 max-w-3xl text-lg leading-relaxed text-brand-dark-light">Choose where Mrembo is going. {ratesApproved ? 'The checkout shows the delivery amount for that location.' : 'Binti confirms the amount before asking you to pay.'}</p></div><Link href="/checkout" className="inline-flex items-center gap-2 rounded-full bg-brand-berry px-7 py-3.5 font-bold text-white">Choose my location <ArrowRight className="h-4 w-4"/></Link></div></section>

    <section className="px-5 py-20 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 rounded-[2.5rem] bg-[#26030f] p-8 text-white sm:p-12 lg:flex-row lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-brand-gold">Ready when she needs it</p><h2 className="mt-3 font-serif text-4xl sm:text-5xl">Choose Mrembo, then choose the destination.</h2></div><Link href="/shop" className="rounded-full bg-brand-gold px-7 py-3.5 font-bold text-brand-dark">Shop Mrembo</Link></div></section>
  </main>;
}
