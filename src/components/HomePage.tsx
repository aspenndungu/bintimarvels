import Image, { getImageProps } from 'next/image';
import Link from 'next/link';
import { ArrowRight, HeartHandshake, MapPin, MessageCircle, PackageCheck, Sparkles, Truck } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import StoryTimeline from '@/components/StoryTimeline';
import SectionHeading from '@/components/SectionHeading';
import PressGrid from '@/components/PressGrid';
import { GOLF_SUPPORTERS } from '@/content/site-content';

export default function HomePage() {
  const { props: desktopHero } = getImageProps({ src: '/hero_image_desktop.webp', alt: '', width: 1875, height: 839, priority: true, sizes: '100vw' });
  const { props: mobileHero } = getImageProps({ src: '/hero_image_mobile.webp', alt: '', width: 1080, height: 1007, priority: true, sizes: '100vw' });
  return (
    <main className="overflow-hidden bg-brand-cream text-brand-dark">
      <section className="relative overflow-hidden bg-[#23020d] text-white lg:min-h-[80svh]">
        <div className="relative aspect-[1080/1007] w-full bg-[#f8e8dc] lg:absolute lg:inset-0 lg:aspect-auto">
          <picture>
            <source media="(max-width: 1023px)" srcSet={mobileHero.srcSet} sizes={mobileHero.sizes} />
            <img {...desktopHero} alt="Woman beside a sealed Mrembo sanitary-pad pack" className="absolute inset-0 h-full w-full object-cover object-center lg:object-[60%_center]" />
          </picture>
          <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(35,2,13,1)_0%,rgba(35,2,13,.96)_24%,rgba(35,2,13,.82)_38%,rgba(35,2,13,.34)_50%,rgba(35,2,13,0)_62%)] lg:block" />
        </div>
        <div className="absolute inset-y-0 left-0 hidden w-1 bg-brand-gold/80 lg:block" />
        <div className="relative border-l-4 border-brand-gold/80 bg-[#23020d] px-5 pb-24 pt-12 sm:px-8 sm:py-16 lg:mx-auto lg:flex lg:min-h-[80svh] lg:max-w-7xl lg:items-center lg:border-l-0 lg:bg-transparent lg:pb-28 lg:pt-24">
          <div className="max-w-xl lg:max-w-2xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[.28em] text-brand-gold">Made in Kenya · Built by Binti Marvels</p>
            <h1 className="font-serif text-5xl leading-[.95] sm:text-7xl lg:text-8xl">Made here. Made for her.</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#f7eaf0] sm:text-xl">Mrembo is locally made period care for the woman who shows up for everyone — and deserves comfort that shows up for her.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 font-bold text-brand-dark transition hover:bg-[#efc654]">Shop Mrembo <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/our-story" className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur-sm transition hover:bg-white/20">Meet Binti</Link>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Mrembo at a glance" className="relative z-10 -mt-10 px-4 pb-10 sm:px-8 lg:-mt-12 lg:pb-14">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#fffaf5]/95 shadow-[0_24px_70px_rgba(49,5,22,.18)] backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
          {[
            { eyebrow: 'Our origin', value: 'Made in Kenya', Icon: MapPin },
            { eyebrow: 'Inside each pack', value: '8 unscented regular pads', Icon: PackageCheck },
            { eyebrow: 'Where you need it', value: 'Binti delivery to your location', Icon: Truck },
            { eyebrow: 'A real person', value: 'Human support on WhatsApp', Icon: MessageCircle },
          ].map(({ eyebrow, value, Icon }, index) => (
            <article key={value} className={`group flex min-h-28 items-center gap-4 px-5 py-5 sm:px-6 ${index > 0 ? 'border-t border-brand-clay sm:border-t-0 sm:[&:nth-child(2n)]:border-l lg:border-l' : ''} ${index > 1 ? 'sm:border-t lg:border-t-0' : ''}`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-berry text-brand-gold shadow-[inset_0_0_0_1px_rgba(255,255,255,.12)] transition-transform duration-300 group-hover:-translate-y-0.5"><Icon className="h-5 w-5" strokeWidth={1.8} /></span>
              <span><span className="block text-[10px] font-bold uppercase tracking-[.2em] text-brand-gold-dark">{eyebrow}</span><strong className="mt-1 block font-display text-base leading-snug text-brand-dark">{value}</strong></span>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#310516] px-5 py-20 text-white sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Binti to Mrembo" title="The mission stayed. The model grew stronger." light>
            <p>Binti began with access and dignity. After years of importing, the business paused and rebuilt closer to home. Mrembo is the result: Binti Marvels’ first locally produced product.</p>
          </SectionHeading>
          <div className="mt-12"><StoryTimeline compact /></div>
          <Link href="/our-story" className="mt-9 inline-flex items-center gap-2 font-bold text-brand-gold">Read the whole story <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-28" id="shop-mrembo">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionHeading eyebrow="Stock up your way" title="Choose your kind of ready.">
              <p>One honest pack image. Four clearly labelled bundles. Every pack contains 8 regular pads.</p>
            </SectionHeading>
            <Link href="/shop" className="inline-flex shrink-0 items-center gap-2 font-bold text-brand-berry">See all bundles <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <ProductGrid compact />
        </div>
      </section>

      <section className="grid lg:grid-cols-2">
        <div className="relative min-h-[520px] overflow-hidden bg-brand-clay">
          <Image src="/story/made-in-kenya.webp" alt="Lorna Joyce holding a Mrembo pack during the Made in Kenya journey" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover object-center" />
          <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-brand-berry backdrop-blur">A real founder journey</span>
        </div>
        <div className="flex items-center bg-brand-cream-dark px-6 py-16 sm:px-12 lg:px-16">
          <div className="max-w-xl"><MapPin className="h-8 w-8 text-brand-gold-dark" /><p className="mt-5 text-xs font-bold uppercase tracking-[.24em] text-brand-gold-dark">Closer to home</p><h2 className="mt-3 font-serif text-4xl leading-tight sm:text-6xl">Local production changed what was possible.</h2><p className="mt-5 text-lg leading-relaxed text-brand-dark-light">Mrembo is made in Kenya through a local contract-manufacturing partner. That means a shorter, more stable path between the product, the team and the women it serves.</p><Link href="/our-story" className="mt-7 inline-flex items-center gap-2 font-bold text-brand-berry">See how Mrembo came to life <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Binti Charity · Schools first" title="Help her stay ready for school.">
            <p>Schools are the heart of Binti’s charity work. Product support is coordinated with an approved school, delivered as a real project and recorded by the team.</p>
          </SectionHeading>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="group overflow-hidden rounded-[2.5rem] bg-white shadow-[0_20px_70px_rgba(77,15,40,.12)]">
              <div className="relative aspect-[16/10]"><Image src="/impact/school-pad-delivery-anonymised.webp" alt="An anonymised Binti school pad-support group scene outside a school building" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover object-[center_43%] transition duration-500 group-hover:scale-[1.02]" /></div>
              <div className="p-7 sm:p-9"><p className="text-xs font-bold uppercase tracking-[.2em] text-brand-gold-dark">From the Binti school-outreach archive · anonymised</p><h3 className="mt-3 font-serif text-3xl">Pads should not decide whether she sits in class.</h3><p className="mt-4 leading-relaxed text-brand-dark-light">Binti brings product support together with schools, community partners and people who want to help.</p></div>
            </article>
            <article className="flex flex-col justify-center rounded-[2.5rem] bg-brand-berry p-8 text-white sm:p-12"><HeartHandshake className="h-10 w-10 text-brand-gold"/><p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-brand-gold">Support a school</p><h3 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">Donate through Pesapal or plan a named school project.</h3><p className="mt-5 leading-relaxed text-brand-clay">Choose a contribution online, or speak to Binti first for a large quantity, CSR programme or specific school destination.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/binti-charity#donate" className="rounded-full bg-brand-gold px-6 py-3.5 text-center font-bold text-brand-dark">Donate to schools</Link><Link href="/contact?type=binti_charity" className="rounded-full border border-white/25 px-6 py-3.5 text-center font-bold text-white">Plan a project</Link></div></article>
          </div>
          <Link href="/binti-charity" className="mt-8 inline-flex items-center gap-2 font-bold text-brand-berry">Explore Binti Charity <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="bg-brand-cream-dark px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[.24em] text-brand-gold-dark">One event. Many hands.</p>
          <h2 className="mt-4 max-w-4xl font-serif text-4xl leading-tight sm:text-5xl">Supporters named in Binti’s 2024 Charity Golf announcement.</h2>
          <div className="mt-8 flex flex-wrap gap-3">{GOLF_SUPPORTERS.map((name) => <span key={name} className="rounded-full border border-brand-clay-dark bg-white px-5 py-3 text-sm font-bold text-brand-dark">{name}</span>)}</div>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-brand-dark-light">These names relate specifically to the Binti Charity Golf Tournament held at Sigona Golf Club on 1 November 2024.</p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="As seen and heard" title="The story beyond our own pages."><p>Independent interviews and profiles trace Binti’s beginnings, hard lessons and locally made next chapter.</p></SectionHeading>
          <div className="mt-10"><PressGrid /></div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <article className="rounded-[2.5rem] bg-brand-berry p-8 text-white sm:p-12"><Sparkles className="h-8 w-8 text-brand-gold" /><p className="mt-6 text-xs font-bold uppercase tracking-[.24em] text-brand-gold">Binti Circles</p><h2 className="mt-3 font-serif text-4xl">Where women lift as they rise.</h2><p className="mt-5 leading-relaxed text-brand-clay">Conversation, community activations and menstrual-health learning — with women at the centre.</p><Link href="/binti-circles" className="mt-8 inline-flex items-center gap-2 font-bold">Explore Binti Circles <ArrowRight className="h-4 w-4" /></Link></article>
          <article className="rounded-[2.5rem] border border-brand-clay bg-white p-8 sm:p-12"><HeartHandshake className="h-8 w-8 text-brand-berry" /><p className="mt-6 text-xs font-bold uppercase tracking-[.24em] text-brand-gold-dark">Binti Charity</p><h2 className="mt-3 font-serif text-4xl">Put product support behind a school.</h2><p className="mt-5 leading-relaxed text-brand-dark-light">Donate online through Pesapal or work with Binti to fund Mrembo supply for an agreed school project.</p><Link href="/binti-charity#donate" className="mt-8 inline-flex items-center gap-2 font-bold text-brand-berry">Donate to schools <ArrowRight className="h-4 w-4" /></Link></article>
        </div>
      </section>

      <section className="bg-[#26030f] px-5 py-16 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div><p className="text-xs font-bold uppercase tracking-[.24em] text-brand-gold">Ready when she needs it</p><h2 className="mt-3 font-serif text-4xl sm:text-5xl">Keep Mrembo within reach.</h2></div>
          <div className="flex flex-col gap-3 sm:flex-row"><Link href="/shop" className="rounded-full bg-brand-gold px-7 py-3.5 text-center font-bold text-brand-dark">Shop bundles</Link><a href="https://wa.me/254717345841?text=Hi%2C%20I%27d%20like%20to%20order%20Mrembo%20Pads" className="rounded-full border border-white/25 px-7 py-3.5 text-center font-bold">Order on WhatsApp</a></div>
        </div>
      </section>
    </main>
  );
}
