import { ArrowUpRight } from 'lucide-react';
import { PRESS_LINKS } from '@/content/site-content';

export default function PressGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {PRESS_LINKS.map((item) => (
        <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="group flex min-h-44 flex-col justify-between rounded-[1.75rem] border border-brand-clay bg-white p-6 transition hover:-translate-y-1 hover:border-brand-gold hover:shadow-xl">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-brand-gold-dark">{item.outlet}</p>
            <h3 className="mt-4 font-serif text-2xl leading-tight text-brand-dark">{item.title}</h3>
          </div>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-berry">Read the story <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
        </a>
      ))}
    </div>
  );
}
