'use client';
import { ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';
import type { CatalogProduct } from '@/lib/catalog';

export default function AddToCartButton({ product }: { product: CatalogProduct }) {
  const { addToCart, hydrated } = useCart();
  return (
    <button disabled={!hydrated} onClick={() => addToCart(product)} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-berry px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-berry-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold disabled:cursor-wait disabled:opacity-60">
      <ShoppingBag className="h-4 w-4" aria-hidden /> Add to basket
    </button>
  );
}
