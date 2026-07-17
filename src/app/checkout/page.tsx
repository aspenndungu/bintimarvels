'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { CreditCard, LoaderCircle, MapPin, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import DeliveryLocationPicker from '@/components/DeliveryLocationPicker';
import ProductGrid from '@/components/ProductGrid';
import type { DeliveryLocation } from '@/lib/commerce';

type State = 'form' | 'quoting' | 'review' | 'failed';
type PaymentState = 'idle' | 'submitting' | 'error';
type Quote = {
  subtotalKsh: number;
  deliveryFeeKsh: number | null;
  totalKsh: number | null;
  manualQuote: boolean;
  destinationAddress: string;
  destinationType: 'doorstep' | 'drop_off';
  onlinePaymentAvailable: boolean;
};

const fieldClass = 'mt-2 w-full rounded-xl border border-brand-clay bg-white p-3.5 font-normal outline-none focus:border-brand-berry focus:ring-2 focus:ring-brand-berry/20';

export default function CheckoutPage() {
  const { cart } = useCart();
  const [state, setState] = useState<State>('form');
  const [error, setError] = useState('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [location, setLocation] = useState<DeliveryLocation | null>(null);
  const [county, setCounty] = useState('Nairobi');
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  const [paymentMessage, setPaymentMessage] = useState('');

  const formRef = useRef<HTMLFormElement>(null);
  const idempotencyKey = useRef<string | null>(null);

  const whatsappUrl = useMemo(() => {
    const lines = cart.map(({ product, qty }) => `• ${qty} × ${product.name} — KSh ${(product.priceKsh * qty).toLocaleString()}`);
    const message = [
      'Hello Binti Marvels, I would like to order Mrembo:',
      ...lines,
      quote ? `Product subtotal: KSh ${quote.subtotalKsh.toLocaleString()}` : '',
      quote ? `Delivery destination: ${quote.destinationAddress}` : '',
      quote?.deliveryFeeKsh !== null && quote ? `Delivery: KSh ${quote.deliveryFeeKsh.toLocaleString()}` : 'Delivery: please confirm the amount',
      quote?.totalKsh !== null && quote ? `Total for this location: KSh ${quote.totalKsh.toLocaleString()}` : '',
      `County: ${county}`,
      location?.landmark ? `Landmark: ${location.landmark}` : '',
      `Destination: ${location?.destinationType === 'drop_off' ? 'agreed drop-off point' : 'customer address'}`,
      '',
      'Please confirm stock, delivery and payment details.',
    ].filter(Boolean).join('\n');
    return `https://wa.me/254717345841?text=${encodeURIComponent(message)}`;
  }, [cart, county, location, quote]);

  async function reviewTotal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current?.reportValidity() || !location) {
      setError('Select a delivery address or an exact pin first.');
      return;
    }
    setState('quoting');
    setError('');
    try {
      const response = await fetch('/api/checkout/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.map(({ product, qty }) => ({ productId: product.id, quantity: qty })), delivery: location }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'The delivery amount could not be prepared.');
      setQuote(result);
      setState('review');
    } catch (cause) {
      setState('failed');
      setError(cause instanceof Error ? cause.message : 'The delivery amount could not be prepared.');
    }
  }

  async function startPayment() {
    if (!quote?.onlinePaymentAvailable || quote.totalKsh === null || !location || !formRef.current?.reportValidity()) return;
    const data = new FormData(formRef.current);
    const key = idempotencyKey.current ?? crypto.randomUUID();
    idempotencyKey.current = key;
    setPaymentState('submitting');
    setPaymentMessage('');
    try {
      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(({ product, qty }) => ({ productId: product.id, quantity: qty })),
          customer: {
            fullName: String(data.get('fullName') ?? ''),
            phone: String(data.get('phone') ?? ''),
            email: String(data.get('email') ?? ''),
            county,
          },
          delivery: location,
          consent: { transactional: true, marketing: data.get('marketing') === 'on' },
          idempotencyKey: key,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.retryWithNewKey === true) idempotencyKey.current = null;
        throw new Error(result.error || 'The Pesapal payment could not be started.');
      }
      const redirect = new URL(String(result.redirectUrl));
      if (redirect.protocol !== 'https:' || !['pay.pesapal.com', 'cybqa.pesapal.com'].includes(redirect.hostname)) throw new Error('The payment redirect could not be verified.');
      sessionStorage.setItem('binti-last-payment', JSON.stringify({ orderReference: result.orderReference, statusToken: result.statusToken }));
      setPaymentMessage(result.message || 'Opening Pesapal securely…');
      window.location.assign(redirect.toString());
    } catch (cause) {
      setPaymentState('error');
      setPaymentMessage(cause instanceof Error ? cause.message : 'The Pesapal payment could not be started.');
    }
  }

  function invalidate(nextLocation?: DeliveryLocation | null) {
    if (nextLocation !== undefined) setLocation(nextLocation);
    setQuote(null);
    setState('form');
    setError('');
    setPaymentState('idle');
    setPaymentMessage('');

    idempotencyKey.current = null;
  }

  if (cart.length === 0) return <main className="min-h-screen bg-brand-cream px-5 py-20 sm:px-8"><div className="mx-auto max-w-7xl text-center"><p className="text-xs font-bold uppercase tracking-[.22em] text-brand-gold-dark">Your basket</p><h1 className="mt-4 font-serif text-5xl">Nothing here yet — let’s fix that.</h1><p className="mx-auto mt-4 max-w-xl text-brand-dark-light">Choose the Mrembo bundle that fits your kind of ready.</p><Link href="/shop" className="mt-7 inline-flex rounded-full bg-brand-berry px-7 py-3 font-bold text-white">Shop Mrembo</Link><div className="mt-14 text-left"><ProductGrid compact /></div></div></main>;

  return <main className="min-h-screen bg-brand-cream px-5 py-12 sm:px-8 lg:py-20"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_.85fr]">
    <section><p className="text-xs font-bold uppercase tracking-[.22em] text-brand-gold-dark">Binti delivery</p><h1 className="mt-3 font-serif text-5xl leading-tight">Show us where Mrembo is going.</h1><p className="mt-4 max-w-2xl text-lg leading-relaxed text-brand-dark-light">Search for an address or place the pin at the exact doorstep or agreed drop-off point. Binti will show or confirm the delivery amount before you continue.</p>
      <form ref={formRef} onSubmit={reviewTotal} className="mt-8 space-y-6 rounded-[2rem] border border-brand-clay bg-white p-6 shadow-[0_20px_70px_rgba(77,15,40,.08)] sm:p-8">
        <DeliveryLocationPicker value={location} onChange={invalidate}/>
        <label className="block text-sm font-bold">County<input required value={county} onChange={(event) => { setCounty(event.target.value); invalidate(); }} minLength={2} maxLength={80} autoComplete="address-level1" className={fieldClass}/></label>
        {!quote && <button disabled={state === 'quoting' || !location} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-dark py-4 text-sm font-bold uppercase tracking-widest text-white disabled:cursor-not-allowed disabled:opacity-50">{state === 'quoting' && <LoaderCircle className="h-4 w-4 animate-spin"/>} Check delivery</button>}
        {quote && <div className="space-y-4 rounded-2xl border border-brand-gold/40 bg-brand-cream p-5">
          <div className="flex justify-between gap-5 text-sm"><span>Products</span><strong>KSh {quote.subtotalKsh.toLocaleString()}</strong></div>
          <div className="flex justify-between gap-5 text-sm"><span>Delivery</span><strong>{quote.deliveryFeeKsh === null ? 'Binti will confirm' : `KSh ${quote.deliveryFeeKsh.toLocaleString()}`}</strong></div>
          {quote.totalKsh !== null && <div className="flex justify-between gap-5 border-t border-brand-clay pt-3 text-lg"><span>Total for this location</span><strong>KSh {quote.totalKsh.toLocaleString()}</strong></div>}
          <p className="text-xs leading-relaxed text-brand-dark-light">Change the destination and the delivery amount updates. Binti confirms stock and payment before dispatch.</p>

          {quote.onlinePaymentAvailable && <div className="space-y-4 border-t border-brand-clay pt-4">
            <div><h2 className="font-display text-xl font-bold">Pay securely with Pesapal</h2><p className="mt-1 text-sm text-brand-dark-light">Continue to Pesapal to choose an available payment method, including M-Pesa or card when enabled for Binti’s account.</p></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold">Full name<input name="fullName" required minLength={2} maxLength={100} autoComplete="name" className={fieldClass}/></label>
              <label className="text-sm font-bold">Mobile number<input name="phone" required minLength={9} maxLength={20} autoComplete="tel" inputMode="tel" className={fieldClass}/></label>
            </div>
            <label className="block text-sm font-bold">Email <span className="font-normal text-brand-dark-light">(optional)</span><input name="email" type="email" maxLength={160} autoComplete="email" className={fieldClass}/></label>
            <label className="flex items-start gap-3 text-sm"><input name="transactional" type="checkbox" required className="mt-1 h-4 w-4 accent-brand-berry"/><span>I agree to receive order, payment and delivery updates. <Link href="/consent" className="font-bold text-brand-berry underline">Messaging terms</Link></span></label>
            <label className="flex items-start gap-3 text-sm"><input name="marketing" type="checkbox" className="mt-1 h-4 w-4 accent-brand-berry"/><span>Send me occasional Mrembo news and offers.</span></label>
            {paymentState === 'error' && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{paymentMessage}</p>}
            <button type="button" onClick={startPayment} disabled={paymentState === 'submitting'} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-berry py-4 text-sm font-bold uppercase tracking-wider text-white disabled:opacity-60">{paymentState === 'submitting' ? <LoaderCircle className="h-5 w-5 animate-spin"/> : <CreditCard className="h-5 w-5"/>} Continue to Pesapal · KSh {quote.totalKsh?.toLocaleString()}</button>
            <p className="text-xs leading-relaxed text-brand-dark-light">Binti never asks for your M-Pesa PIN or card details. Enter payment details only on Pesapal’s secure page.</p>
          </div>}

          {!quote.onlinePaymentAvailable && <p className="rounded-xl bg-white/70 p-3 text-sm text-brand-dark-light">Pesapal payment is not active on this review. Continue with Binti to confirm the order and payment method.</p>}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#15803d] py-4 text-sm font-bold uppercase tracking-wider text-white"><MessageCircle className="h-5 w-5"/> Continue with Binti</a>
        </div>}
        {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}
      </form>
    </section>
    <aside className="space-y-5 lg:pt-20"><div className="rounded-[2rem] bg-[#310516] p-7 text-white"><Truck className="h-7 w-7 text-brand-gold"/><h2 className="mt-5 font-serif text-3xl">Binti handles the delivery.</h2><ol className="mt-5 space-y-4 text-sm leading-relaxed text-brand-clay"><li><strong className="text-white">1. Choose a location.</strong><br/>Your address or an agreed drop-off point.</li><li><strong className="text-white">2. Check delivery.</strong><br/>Binti shows or confirms the delivery amount for the destination.</li><li><strong className="text-white">3. Confirm and pay.</strong><br/>Binti confirms stock and payment before dispatch.</li></ol></div><div className="rounded-[2rem] border border-brand-clay bg-white p-7"><MapPin className="h-7 w-7 text-brand-berry"/><h2 className="mt-4 font-display text-xl font-bold">Delivered where you need it</h2><p className="mt-3 text-sm leading-relaxed text-brand-dark-light">Every order goes to your address or an agreed drop-off point selected with Binti.</p></div><div className="rounded-[2rem] border border-brand-clay bg-white p-7"><ShieldCheck className="h-7 w-7 text-brand-teal"/><h2 className="mt-4 font-display text-xl font-bold">Your location stays private</h2><p className="mt-3 text-sm leading-relaxed text-brand-dark-light">The selected address or pin is used to price and coordinate this delivery. Binti does not publish it or use it for advertising.</p></div></aside>
  </div></main>;
}
