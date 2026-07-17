'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import { useState } from 'react';
import { FOUNDER_VIDEO } from '@/content/site-content';

export default function VideoStory() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="overflow-hidden rounded-[2.5rem] bg-[#26030f] text-white shadow-2xl">
      <div className="grid lg:grid-cols-[1.3fr_.7fr]">
        <div className="relative aspect-video bg-black">
          {playing ? (
            <iframe className="absolute inset-0 h-full w-full" src={FOUNDER_VIDEO.embed} title={FOUNDER_VIDEO.title} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          ) : (
            <button onClick={() => setPlaying(true)} className="group absolute inset-0 w-full text-left" aria-label={`Play: ${FOUNDER_VIDEO.title}`}>
              <Image src={FOUNDER_VIDEO.image} alt="Lorna Joyce during the founder interview" fill sizes="(max-width:1024px) 100vw, 65vw" className="object-cover opacity-80 transition group-hover:scale-[1.02]" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute bottom-6 left-6 flex items-center gap-3 rounded-full bg-white px-5 py-3 font-bold text-brand-dark shadow-xl"><Play className="h-5 w-5 fill-brand-berry text-brand-berry" /> Play interview</span>
            </button>
          )}
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <p className="text-xs font-bold uppercase tracking-[.24em] text-brand-gold">Founder conversation</p>
          <h3 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">The truth behind rebuilding Binti.</h3>
          <p className="mt-5 leading-relaxed text-brand-clay">Lorna Joyce speaks about entrepreneurship, period poverty and what it took to begin again.</p>
          <p className="mt-6 text-sm font-bold text-white/70">Published by {FOUNDER_VIDEO.publisher}</p>
        </div>
      </div>
    </div>
  );
}
