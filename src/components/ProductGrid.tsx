import Image from 'next/image';
import { CATALOG } from '@/lib/catalog';
import AddToCartButton from './AddToCartButton';

export default function ProductGrid({ compact = false, purchasable = false }: { compact?: boolean; purchasable?: boolean }) {
  const products = compact ? CATALOG.slice(0, 3) : CATALOG;
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <article key={product.id} className="group flex flex-col overflow-hidden rounded-[2rem] border border-brand-clay bg-white shadow-[0_18px_50px_rgba(77,15,40,.08)]">
          <div className="relative aspect-square overflow-hidden bg-[radial-gradient(circle_at_top,#fff_0,#f5efeb_72%)]">
            <Image src={product.imageSrc} alt="One Mrembo sanitary-pad pack" fill sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 25vw" className="object-contain p-6 transition duration-500 group-hover:scale-105" />
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-berry shadow-sm">{product.badge}</span>
            <span className="absolute bottom-4 right-4 rounded-full bg-brand-dark px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">1 pack pictured</span>
          </div>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-gold-dark">{product.packs} packs · {product.totalPads} pads</p>
              <h3 className="mt-2 font-display text-xl font-bold text-brand-dark">{product.name}</h3>
            </div>
            <p className="flex-1 text-sm leading-relaxed text-brand-dark-light">{product.description}</p>
            {purchasable ? <><div className="flex items-end justify-between gap-3"><div><p className="text-xs text-brand-dark-light">Approved bundle price</p><p className="font-display text-2xl font-black text-brand-berry">KSh {product.priceKsh.toLocaleString()}</p></div></div><AddToCartButton product={product} /></> : <><p className="text-xs leading-relaxed text-brand-dark-light">Price and stock are confirmed directly by Binti before ordering.</p><a href="https://wa.me/254717345841" className="rounded-full bg-brand-berry px-5 py-3 text-center text-sm font-bold text-white">Ask price & availability</a></>}
          </div>
        </article>
      ))}
    </div>
  );
}
