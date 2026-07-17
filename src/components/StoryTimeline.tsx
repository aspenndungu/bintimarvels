'use client';

import { motion, useReducedMotion } from 'motion/react';
import { COMPANY_TIMELINE } from '@/content/site-content';

export default function StoryTimeline({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion();
  const entries = compact ? COMPANY_TIMELINE.slice(-3) : COMPANY_TIMELINE;
  return (
    <div className={`grid gap-4 ${compact ? 'lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-5'}`}>
      {entries.map((step, index) => (
        <motion.article key={step.year} initial={reduce ? false : { opacity: 0, y: 18 }} whileInView={reduce ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .45, delay: index * .06 }} className="relative rounded-[1.75rem] border border-white/12 bg-white/7 p-6 backdrop-blur-sm">
          <p className="text-sm font-black text-brand-gold">{step.year}</p>
          <h3 className="mt-4 font-serif text-2xl leading-tight text-white">{step.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-brand-clay">{step.text}</p>
        </motion.article>
      ))}
    </div>
  );
}
