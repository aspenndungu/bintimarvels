'use client';

import React from 'react';
import Image from 'next/image';
import { Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-brand-cream min-h-screen text-brand-dark overflow-x-hidden font-sans relative">
      
      <main className="pt-24 pb-20">
        <section className="py-12 max-w-7xl mx-auto px-4" id="founder-trust">
          <div className="text-center mb-16">
            <span className="text-[#B5840B] font-display font-black tracking-[0.25em] text-[10px] sm:text-xs uppercase block mb-3">Our Story</span>
            <h1 className="font-serif font-bold text-4xl md:text-5xl text-brand-dark">The Binti Marvels Journey</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[340px] aspect-[4/5] bg-brand-clay-dark/30 rounded-2xl relative overflow-hidden border border-brand-clay shadow-md flex flex-col justify-end group">
                <Image src="/lorna-joyce-binti.jpeg" alt="Mrembo Image" width={1200} height={1200} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectFit: "cover" }} />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/35 to-transparent"></div>
                <div className="relative p-6 space-y-1.5 z-10 text-white">
                  <span className="bg-brand-gold text-brand-dark font-mono text-[9px] uppercase font-bold py-1 px-2.5 rounded-full inline-block">
                    CEO / Owner Representative
                  </span>
                  <span className="text-[10px] font-mono text-brand-gold uppercase block font-bold">Lorna Joyce Binti</span>
                  <h4 className="font-display text-white font-bold text-lg">Lorna Joyce, CEO & Founder</h4>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-brand-clay/40 border border-brand-clay px-3 py-1.5 rounded-full text-[10px] font-mono uppercase font-bold text-brand-dark tracking-wider">
                <Award className="w-3.5 h-3.5 text-brand-berry" />
                <span>Women-Led Manufacturing Enterprise</span>
              </div>

              <h2 className="font-serif font-semibold text-3xl sm:text-4xl text-brand-dark leading-none">
                &ldquo;Dignity is a right, not a luxury. We support women who keep showing up.&rdquo;
              </h2>

              <p className="text-brand-dark-light text-sm sm:text-base leading-relaxed font-sans">
                BINTI MARVELS LIMITED was born from the conviction that menstruating should never hold a woman back or force a girl to stay home from school. As a proudly women-led Kenyan manufacturer, we oversee our quality lines directly. We employ local women, pay living wages, and distribute clean sanitary pads for everyday menstrual care.
              </p>

              <div className="p-5 bg-white border border-brand-clay rounded-xl space-y-3 shadow-2xs">
                <h4 className="font-display font-semibold text-xs text-brand-dark">Local Manufacturing Guarantee:</h4>
                <p className="text-[11px] text-brand-dark-light leading-relaxed italic">
                  &ldquo;Our warehouse stock is produced, stored, and loaded under strict sanitary protocols in Kenya. We prepare stock for retail, wholesale, and dignity-distribution partners across Kenya.&rdquo;
                </p>
                <div className="relative pt-3 border-t border-brand-cream-dark flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="w-20 h-14 rounded-lg overflow-hidden border border-brand-clay shrink-0 bg-zinc-100 relative">
                    <Image src="/lorna-at-warehouse-binti.jpeg" alt="Mrembo Image" width={1200} height={1200} className="w-full h-full object-cover" style={{ objectFit: "cover" }} />
                  </div>
                  <div>
                    <span className="text-[9.5px] text-brand-dark font-mono block font-bold uppercase tracking-wider text-brand-berry">Warehouse Approved Stock</span>
                    <span className="text-[10px] text-brand-dark-light font-mono block">Nairobi Production Facility</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
