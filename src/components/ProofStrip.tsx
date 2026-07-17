import { Check } from 'lucide-react';

export default function ProofStrip({ items, dark = false }: { items: readonly string[]; dark?: boolean }) {
  return (
    <div className={dark ? 'bg-[#26030f] text-white' : 'border-y border-brand-clay bg-white text-brand-dark'}>
      <div className="mx-auto grid max-w-7xl gap-px sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item} className={`flex min-h-16 items-center gap-3 px-5 py-4 text-sm font-bold ${dark ? 'border-white/10' : 'border-brand-clay'} sm:border-r`}>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gold text-brand-dark"><Check className="h-4 w-4" /></span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
