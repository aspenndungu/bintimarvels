import { ArrowUpRight } from 'lucide-react';
import { SOCIAL_LINKS } from '@/content/site-content';

export default function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? 'flex flex-wrap gap-x-5 gap-y-3' : 'grid gap-3 sm:grid-cols-2'}>
      {SOCIAL_LINKS.map((item) => (
        <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className={`${compact ? 'text-sm' : 'rounded-2xl border border-brand-clay bg-white px-5 py-4'} inline-flex items-center justify-between gap-2 font-bold text-brand-berry hover:underline`}>
          {item.label}<ArrowUpRight className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
