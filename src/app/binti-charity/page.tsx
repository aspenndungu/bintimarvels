import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpenCheck, Building2, HeartHandshake, PackageCheck } from 'lucide-react';
import SchoolSupportForm from '@/components/SchoolSupportForm';
import SectionHeading from '@/components/SectionHeading';
import { CHARITY_PROJECTS, GOLF_SOURCE, GOLF_SUPPORTERS } from '@/content/site-content';
import { assertSchoolSupportApproved, paymentRuntimeReady } from '@/lib/commerce';
import { pesapalConfigFromEnv } from '@/lib/pesapal';

export const metadata: Metadata = {
  title: 'Binti Charity — Support Schools',
  description: 'See Binti Marvels’ school menstrual-care work and support approved school pad deliveries through Pesapal.',
};

const golfImages = [
  ['/impact/charity-golf-team.webp', 'Adult golfers at the 2024 Binti Charity Golf Tournament'],
  ['/impact/charity-golf-course.webp', 'Golfers on the course at Sigona Golf Club'],
  ['/impact/charity-golf-branding.webp', 'Binti Charity Golf event flags at Sigona Golf Club'],
  ['/impact/charity-golf-panorama.webp', 'A golfer teeing off during the Binti Charity Golf Tournament'],
] as const;

export default function BintiCharityPage() {
  let paymentEnabled = false;
  try {
    assertSchoolSupportApproved();
    pesapalConfigFromEnv();
    paymentEnabled = paymentRuntimeReady();
  } catch {
    paymentEnabled = false;
  }
  const schoolProject = CHARITY_PROJECTS.find((project) => project.title.includes('Primary Schools'));
  return (
    <main className="overflow-hidden bg-brand-cream text-brand-dark">
      <section className="bg-[#310516] text-white">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-clay sm:aspect-[16/8] lg:aspect-[2200/820]">
          <Image src="/impact/school-pad-delivery-anonymised.webp" alt="An anonymised Binti school pad-support group scene outside a school building" fill priority sizes="100vw" className="object-cover object-[center_42%]"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#310516]/85 via-[#310516]/5 to-transparent"/>
          <p className="absolute bottom-4 left-4 max-w-[75vw] rounded-2xl bg-black/55 px-4 py-2 text-left text-[10px] font-bold uppercase tracking-[.14em] text-white backdrop-blur sm:bottom-6 sm:left-6">From the Binti school-outreach archive · intentionally anonymised</p>
        </div>
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:flex lg:items-end lg:justify-between lg:gap-12 lg:py-20"><div className="max-w-4xl"><p className="text-xs font-bold uppercase tracking-[.26em] text-brand-gold">Binti Charity · Schools first</p><h1 className="mt-5 font-serif text-5xl leading-[.96] sm:text-7xl">Help a girl stay ready for school.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-clay">Schools are at the heart of Binti’s charity work. We coordinate menstrual-care product support with approved schools and community partners, then document the delivery as a real project.</p></div><div className="mt-8 flex shrink-0 flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col"><a href="#donate" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 font-bold text-brand-dark">Donate to school support <HeartHandshake className="h-4 w-4"/></a><Link href="/contact?type=binti_charity" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 font-bold text-white">Plan a school project <ArrowRight className="h-4 w-4"/></Link></div></div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Why schools" title="Pads should not decide whether she sits in class."><p>Binti works with schools, organised groups, companies and individuals who want their support to reach an agreed school in a practical, accountable way.</p></SectionHeading><div className="mt-12 grid gap-5 md:grid-cols-3">{[
        { icon: Building2, title: 'An approved school', text: 'Binti confirms the destination and a responsible school or project contact before allocation.' },
        { icon: PackageCheck, title: 'Product for the project', text: 'Verified support is used for menstrual-care product supply and the agreed delivery work.' },
        { icon: BookOpenCheck, title: 'A recorded handover', text: 'The team keeps the project and delivery record without collecting pupils’ personal menstrual data.' },
      ].map(({ icon: Icon, title, text }) => <article key={title} className="rounded-[2rem] border border-brand-clay bg-white p-7"><Icon className="h-8 w-8 text-brand-berry"/><h2 className="mt-5 font-serif text-3xl">{title}</h2><p className="mt-4 text-sm leading-relaxed text-brand-dark-light">{text}</p></article>)}</div></div></section>

      {schoolProject && <section className="bg-brand-cream-dark px-5 py-20 sm:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[.85fr_1.15fr]"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-brand-gold-dark">{schoolProject.year} · School outreach</p><h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">{schoolProject.title}</h2><p className="mt-5 max-w-xl text-lg leading-relaxed text-brand-dark-light">{schoolProject.summary}</p><a href={schoolProject.source} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 font-bold text-brand-berry">View the dated source <ArrowUpRight className="h-4 w-4"/></a></div><div className="relative aspect-[16/9] overflow-hidden rounded-[2.5rem] bg-brand-clay shadow-[0_20px_70px_rgba(77,15,40,.14)]"><Image src="/impact/school-pad-delivery-anonymised.webp" alt="An anonymised Binti school pad-support group scene" fill sizes="(max-width:1024px) 100vw, 58vw" className="object-cover object-[center_43%]"/></div></div></section>}

      <section id="donate" className="scroll-mt-28 bg-[#26030f] px-5 py-20 text-white sm:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16"><div className="lg:sticky lg:top-36"><p className="text-xs font-bold uppercase tracking-[.24em] text-brand-gold">Donate through Pesapal</p><h2 className="mt-4 font-serif text-5xl leading-[.96] sm:text-6xl">Put your support behind a school.</h2><p className="mt-6 text-lg leading-relaxed text-brand-clay">Choose an amount, add your contact details and continue to Pesapal. Binti verifies the payment before it enters the school-support record.</p><ul className="mt-8 space-y-4 text-sm leading-relaxed text-brand-clay"><li className="flex gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-gold"/>No pupil names, cycle dates or health details are collected.</li><li className="flex gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-gold"/>Payment details are entered only on Pesapal’s secure page.</li><li className="flex gap-3"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-gold"/>For a named school, large quantity or CSR project, contact Binti first so the destination and scope can be agreed.</li></ul></div><SchoolSupportForm enabled={paymentEnabled}/></div></section>

      <section className="px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Recent work" title="Real projects. Dated stories."><p>School support is the centre of this work, alongside carefully documented community and institutional projects.</p></SectionHeading><div className="mt-12 grid gap-6 lg:grid-cols-2">{CHARITY_PROJECTS.filter((project) => project !== schoolProject).slice(0,4).map((project)=><article key={project.title} className="group overflow-hidden rounded-[2.5rem] bg-white shadow-[0_18px_60px_rgba(77,15,40,.1)]">{project.image&&<div className="relative aspect-[4/3]"><Image src={project.image} alt={project.imageAlt??''} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"/></div>}<div className="p-7 sm:p-9"><p className="text-xs font-bold uppercase tracking-[.2em] text-brand-gold-dark">{project.year}</p><h2 className="mt-3 font-serif text-3xl">{project.title}</h2><p className="mt-4 leading-relaxed text-brand-dark-light">{project.summary}</p><a href={project.source} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-berry">View the source <ArrowUpRight className="h-4 w-4"/></a></div></article>)}</div></div></section>

      <section className="bg-[#26030f] px-5 py-20 text-white sm:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="1 November 2024 · Sigona Golf Club" title="The first Binti Charity Golf Tournament." light><p>A day that brought business, sport and menstrual dignity into the same conversation.</p></SectionHeading><div className="mt-12 grid auto-rows-[260px] gap-4 sm:grid-cols-2 lg:grid-cols-4">{golfImages.map(([src,alt],index)=><figure key={src} className={`relative overflow-hidden rounded-[2rem] ${index===1?'lg:col-span-2':''}`}><Image src={src} alt={alt} fill sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw" className="object-cover transition duration-500 hover:scale-[1.03]"/></figure>)}</div><div className="mt-12"><p className="text-xs font-bold uppercase tracking-[.22em] text-brand-gold">Named in Binti’s event announcement</p><div className="mt-5 flex flex-wrap gap-3">{GOLF_SUPPORTERS.map(name=><span key={name} className="rounded-full border border-white/15 bg-white/7 px-4 py-2 text-sm font-bold">{name}</span>)}</div><a href={GOLF_SOURCE} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 font-bold text-brand-gold">See the 2024 announcement <ArrowUpRight className="h-4 w-4"/></a></div></div></section>
    </main>
  );
}
