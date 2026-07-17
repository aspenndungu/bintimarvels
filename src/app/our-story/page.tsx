import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Factory, Heart, RefreshCw } from 'lucide-react';
import StoryTimeline from '@/components/StoryTimeline';
import SectionHeading from '@/components/SectionHeading';
import VideoStory from '@/components/VideoStory';
import PressGrid from '@/components/PressGrid';
import { TEAM } from '@/content/site-content';

export const metadata: Metadata = { title: 'Our Story | Binti Marvels', description: 'How Binti Marvels rebuilt from imported Binti Pads to locally produced Mrembo period care.' };

export default function OurStoryPage() {
  return (
    <main className="overflow-hidden bg-brand-cream text-brand-dark">
      <section className="grid min-h-[72svh] lg:grid-cols-2">
        <div className="flex items-end px-5 py-16 sm:px-8 lg:items-center lg:px-16 lg:py-24"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.24em] text-brand-gold-dark">Our story</p><h1 className="mt-4 font-serif text-5xl leading-[.96] sm:text-7xl">Binti built the mission. Mrembo is the next chapter.</h1><p className="mt-6 text-lg leading-relaxed text-brand-dark-light">What began as a fight for better access became a hard lesson in supply, resilience and building closer to home.</p></div></div>
        <div className="relative min-h-[500px] bg-[#4b0a27]"><Image src="/story/lorna-joyce.webp" alt="Lorna Joyce, founder and CEO of Binti Marvels" fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover object-top"/><div className="absolute inset-0 bg-gradient-to-t from-[#26030f]/75 via-transparent to-transparent"/><p className="absolute bottom-6 left-6 right-6 max-w-xl text-sm leading-relaxed text-white"><strong>Lorna Joyce:</strong> founder and CEO of Binti Marvels, the company behind Mrembo.</p></div>
      </section>

      <section className="bg-[#310516] px-5 py-20 text-white sm:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="2020 → 2026" title="A company that chose to begin again." light><p>Binti’s story is not a straight line. It is a series of decisions to keep the mission and change what was no longer working.</p></SectionHeading><div className="mt-12"><StoryTimeline /></div></div></section>

      <section className="px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="What changed. What stayed." title="A new product model, the same reason for showing up."/><div className="mt-12 grid gap-6 lg:grid-cols-2"><article className="rounded-[2.5rem] bg-white p-8 shadow-[0_18px_60px_rgba(77,15,40,.08)] sm:p-11"><RefreshCw className="h-8 w-8 text-brand-gold-dark"/><h2 className="mt-5 font-serif text-4xl">What changed</h2><p className="mt-5 text-lg leading-relaxed text-brand-dark-light">The original Binti products depended on imports. After the 2025 pause, Binti Marvels rebuilt around local contract manufacturing and launched Mrembo as its first locally produced product.</p></article><article className="rounded-[2.5rem] bg-brand-berry p-8 text-white sm:p-11"><Heart className="h-8 w-8 text-brand-gold"/><h2 className="mt-5 font-serif text-4xl">What stayed</h2><p className="mt-5 text-lg leading-relaxed text-brand-clay">The belief that menstrual care is about more than a packet. It is confidence, access and the freedom to keep showing up at school, work and life.</p></article></div></div></section>

      <section className="grid bg-brand-cream-dark lg:grid-cols-2"><div className="relative min-h-[560px]"><Image src="/story/founder-delivery.webp" alt="Lorna Joyce with Mrembo packs during a customer delivery" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover"/></div><div className="flex items-center px-6 py-16 sm:px-12 lg:px-16"><div className="max-w-xl"><Factory className="h-9 w-9 text-brand-gold-dark"/><p className="mt-6 text-xs font-bold uppercase tracking-[.24em] text-brand-gold-dark">Made in Kenya</p><h2 className="mt-4 font-serif text-4xl leading-tight sm:text-6xl">Closer to the product. Closer to the customer.</h2><p className="mt-6 text-lg leading-relaxed text-brand-dark-light">Mrembo is made in Kenya through a local contract-manufacturing partner, giving Binti a closer and more stable path from production to the women it serves.</p><Link href="/shop" className="mt-8 inline-flex items-center gap-2 font-bold text-brand-berry">Meet Mrembo <ArrowRight className="h-4 w-4"/></Link></div></div></section>

      <section className="px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Leadership" title="The people carrying the work forward."><p>Binti is currently led by Lorna and Banns, with Mrembo product growth and school-support delivery at the centre.</p></SectionHeading><div className="mt-12 grid max-w-4xl gap-6 md:grid-cols-2">{TEAM.map(member=><article key={member.name} className="overflow-hidden rounded-[2.25rem] bg-white shadow-[0_18px_60px_rgba(77,15,40,.09)]"><div className="relative aspect-[4/5]"><Image src={member.image} alt={`${member.name}, ${member.role} at Binti Marvels`} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover object-top"/></div><div className="p-7"><p className="text-xs font-bold uppercase tracking-[.2em] text-brand-gold-dark">{member.role}</p><h2 className="mt-3 font-serif text-3xl">{member.name}</h2><p className="mt-4 text-sm leading-relaxed text-brand-dark-light">{member.bio}</p></div></article>)}</div></div></section>

      <section className="bg-brand-cream-dark px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="In her own words" title="The rebuild, without the polished version."><p>A founder conversation about period poverty, business pressure and choosing to start again.</p></SectionHeading><div className="mt-10"><VideoStory /></div></div></section>

      <section className="px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Press" title="Follow the story through independent voices."/><div className="mt-10"><PressGrid /></div></div></section>

      <section className="bg-[#26030f] px-5 py-16 text-white sm:px-8"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.24em] text-brand-gold">The next chapter is in your hands</p><h2 className="mt-3 font-serif text-4xl sm:text-5xl">Bring Mrembo home.</h2></div><div className="flex flex-col gap-3 sm:flex-row"><Link href="/shop" className="rounded-full bg-brand-gold px-7 py-3.5 text-center font-bold text-brand-dark">Shop Mrembo</Link><Link href="/binti-charity" className="rounded-full border border-white/25 px-7 py-3.5 text-center font-bold">Explore Binti Charity</Link></div></div></section>
    </main>
  );
}
