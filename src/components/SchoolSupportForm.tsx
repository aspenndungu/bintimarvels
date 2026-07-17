'use client';

import { useRef, useState } from 'react';
import { ArrowUpRight, HeartHandshake, LoaderCircle } from 'lucide-react';

const fieldClass = 'mt-2 w-full rounded-xl border border-brand-clay bg-white p-3.5 font-normal outline-none focus:border-brand-berry focus:ring-2 focus:ring-brand-berry/20';
const presets = [500, 1000, 2500, 5000];

export default function SchoolSupportForm({ enabled }: { enabled: boolean }) {
  const [amount, setAmount] = useState(1000);
  const [state, setState] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const idempotencyKey = useRef<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || !formRef.current?.reportValidity()) return;
    const data = new FormData(formRef.current);
    const key = idempotencyKey.current ?? crypto.randomUUID();
    idempotencyKey.current = key;
    setState('submitting');
    setMessage('');
    try {
      const response = await fetch('/api/school-support/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: String(data.get('fullName') ?? ''),
          phone: String(data.get('phone') ?? ''),
          email: String(data.get('email') ?? ''),
          amountKsh: amount,
          message: String(data.get('message') ?? ''),
          consent: data.get('consent') === 'on',
          idempotencyKey: key,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.retryWithNewKey === true) idempotencyKey.current = null;
        throw new Error(result.error || 'Pesapal could not start the payment.');
      }
      const redirect = new URL(String(result.redirectUrl));
      if (redirect.protocol !== 'https:' || !['pay.pesapal.com', 'cybqa.pesapal.com'].includes(redirect.hostname)) throw new Error('The payment redirect could not be verified.');
      sessionStorage.setItem('binti-last-school-support', JSON.stringify({ reference: result.reference }));
      window.location.assign(redirect.toString());
    } catch (cause) {
      setState('error');
      setMessage(cause instanceof Error ? cause.message : 'Pesapal could not start the payment.');
    }
  }

  return <form ref={formRef} onSubmit={submit} className="rounded-[2.25rem] bg-white p-6 shadow-[0_24px_80px_rgba(77,15,40,.13)] sm:p-9">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-berry text-brand-gold"><HeartHandshake className="h-6 w-6"/></div>
    <h2 className="mt-5 font-serif text-4xl leading-tight text-brand-dark">Support pads for a school.</h2>
    <p className="mt-4 text-sm leading-relaxed text-brand-dark-light">Choose an amount and continue to Pesapal. Binti allocates verified support to approved school pad deliveries and keeps the project record internally.</p>
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{presets.map(value => <button key={value} type="button" onClick={() => setAmount(value)} className={`rounded-xl border px-3 py-3 text-sm font-bold ${amount === value ? 'border-brand-berry bg-brand-berry text-white' : 'border-brand-clay bg-brand-cream text-brand-dark'}`}>KSh {value.toLocaleString()}</button>)}</div>
    <label className="mt-5 block text-sm font-bold text-brand-dark">Other amount (KSh)<input aria-label="Other amount in Kenyan shillings" type="number" min={100} max={1000000} step={50} value={amount} onChange={(event) => setAmount(Number(event.target.value))} required className={fieldClass}/></label>
    <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-brand-dark">Full name<input name="fullName" required minLength={2} maxLength={100} autoComplete="name" className={fieldClass}/></label><label className="text-sm font-bold text-brand-dark">Mobile number<input name="phone" required minLength={9} maxLength={20} autoComplete="tel" inputMode="tel" className={fieldClass}/></label></div>
    <label className="mt-4 block text-sm font-bold text-brand-dark">Email <span className="font-normal text-brand-dark-light">(optional)</span><input name="email" type="email" maxLength={160} autoComplete="email" className={fieldClass}/></label>
    <label className="mt-4 block text-sm font-bold text-brand-dark">Message <span className="font-normal text-brand-dark-light">(optional)</span><textarea name="message" rows={3} maxLength={500} className={fieldClass}/></label>
    <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-brand-dark-light"><input name="consent" type="checkbox" required className="mt-1 h-4 w-4 accent-brand-berry"/><span>I agree to receive payment and school-support updates about this contribution.</span></label>
    {state === 'error' && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">{message}</p>}
    {!enabled && <p className="mt-5 rounded-xl border border-brand-gold/40 bg-brand-cream p-4 text-sm leading-relaxed text-brand-dark-light">Online school-support payments are being prepared. Please contact Binti to plan a school contribution in the meantime.</p>}
    <button disabled={!enabled || state === 'submitting' || amount < 100} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gold py-4 text-sm font-black uppercase tracking-wider text-brand-dark disabled:cursor-not-allowed disabled:opacity-55">{state === 'submitting' ? <LoaderCircle className="h-5 w-5 animate-spin"/> : <ArrowUpRight className="h-5 w-5"/>} Donate securely with Pesapal</button>
    <p className="mt-4 text-xs leading-relaxed text-brand-dark-light">This payment supports Binti’s school pad work. Binti does not represent this payment as tax-deductible and does not issue a tax-deductible donation receipt.</p>
  </form>;
}
