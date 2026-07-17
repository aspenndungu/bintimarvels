'use client';
import { useCallback } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';
import { useModalDialog } from './useModalDialog';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
  const { cart, cartCount, totalPrice, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useCart();
  const close = useCallback(() => setIsCartOpen(false), [setIsCartOpen]);
  const dialogRef = useModalDialog(isCartOpen, close);
  if (!isCartOpen) return null;

  return <>
    <button className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={close} aria-label="Close basket backdrop" />
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="basket-title" className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-brand-cream shadow-2xl animate-slide-in-right">
      <div className="flex items-center justify-between border-b border-brand-clay bg-white p-4"><h2 id="basket-title" className="flex items-center gap-2 font-display text-xl font-bold text-brand-dark"><ShoppingBag className="h-5 w-5 text-brand-berry"/>Your Basket ({cartCount})</h2><button onClick={close} aria-label="Close basket" className="rounded-full p-2 hover:bg-brand-clay"><X className="h-5 w-5"/></button></div>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {cart.length===0?<div className="flex h-64 flex-col items-center justify-center gap-4 text-center"><ShoppingBag className="h-12 w-12 text-brand-clay-dark"/><p>Your basket is empty.</p><button onClick={close} className="rounded-full bg-brand-berry px-6 py-2 text-xs font-bold uppercase tracking-wider text-white">Browse products</button></div>:cart.map((item)=><div key={item.product.id} className="flex gap-4 rounded-xl border border-brand-clay bg-white p-4"><div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-brand-clay/30"><Image src={item.product.imageSrc} alt="" fill sizes="80px" className="object-contain p-1"/></div><div className="flex flex-1 flex-col justify-between"><div className="flex items-start justify-between gap-2"><div><h3 className="font-display text-sm font-bold leading-tight">{item.product.name}</h3><p className="mt-1 text-sm font-bold text-brand-gold">KSh {item.product.priceKsh.toLocaleString()}</p></div><button onClick={()=>removeFromCart(item.product.id)} aria-label={`Remove ${item.product.name} from basket`} className="p-1 text-brand-clay-dark hover:text-red-600"><X className="h-4 w-4"/></button></div><div className="mt-3 flex items-center justify-between"><div className="flex items-center rounded-lg border border-brand-clay bg-brand-cream"><button onClick={()=>updateQuantity(item.product.id,-1)} aria-label={`Decrease ${item.product.name} quantity`} className="px-3 py-2"><Minus className="h-3.5 w-3.5"/></button><span className="border-x border-brand-clay px-3 py-2 text-xs font-bold" aria-label={`Quantity ${item.qty}`}>{item.qty}</span><button onClick={()=>updateQuantity(item.product.id,1)} aria-label={`Increase ${item.product.name} quantity`} className="px-3 py-2"><Plus className="h-3.5 w-3.5"/></button></div><span className="text-xs font-bold">KSh {(item.product.priceKsh*item.qty).toLocaleString()}</span></div></div></div>)}
      </div>
      {cart.length>0&&<div className="space-y-4 border-t border-brand-clay bg-white p-4"><div className="flex justify-between text-sm"><span>Product subtotal</span><strong>KSh {totalPrice.toLocaleString()}</strong></div><p className="rounded-xl bg-brand-cream p-3 text-xs text-brand-dark-light">The server calculates and shows the approved delivery fee and final total before Pesapal payment.</p><Link href="/checkout" onClick={close} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-dark py-4 text-sm font-bold uppercase tracking-widest text-white">Proceed to checkout<ShoppingBag className="h-4 w-4"/></Link></div>}
    </div>
  </>;
}
