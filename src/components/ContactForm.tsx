'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function ContactForm() {
  const params = useSearchParams();
  const initial = params.get('type') ?? 'general';
  const allowed = ['order_support','binti_charity','binti_circles','stockist','media','general'];
  const [state, setState] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [message, setMessage] = useState('');
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setState('sending'); setMessage('');
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, followUpConsent: body.followUpConsent === 'on', idempotencyKey: crypto.randomUUID() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Not sent');
      setState('sent'); setMessage(`Received. Reference: ${data.leadReference}`); event.currentTarget.reset();
    } catch (error) { setState('error'); setMessage(error instanceof Error ? error.message : 'Your enquiry was not sent.'); }
  }
  return <form onSubmit={submit} className="space-y-5 rounded-[2rem] border border-brand-clay bg-white p-6 shadow-xl sm:p-9">
    <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold">Name<input required name="name" maxLength={100} className="mt-2 w-full rounded-xl border border-brand-clay bg-brand-cream p-3 font-normal" /></label><label className="text-sm font-bold">Organisation (optional)<input name="organisation" maxLength={160} className="mt-2 w-full rounded-xl border border-brand-clay bg-brand-cream p-3 font-normal" /></label></div>
    <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold">Phone / WhatsApp<input required name="phone" type="tel" maxLength={20} className="mt-2 w-full rounded-xl border border-brand-clay bg-brand-cream p-3 font-normal" /></label><label className="text-sm font-bold">Email (optional)<input name="email" type="email" maxLength={160} className="mt-2 w-full rounded-xl border border-brand-clay bg-brand-cream p-3 font-normal" /></label></div>
    <label className="text-sm font-bold">Enquiry type<select name="enquiryType" defaultValue={allowed.includes(initial) ? initial : 'general'} className="mt-2 w-full rounded-xl border border-brand-clay bg-brand-cream p-3 font-normal"><option value="general">General enquiry</option><option value="order_support">Order support</option><option value="binti_charity">Binti Charity / school / CSR</option><option value="binti_circles">Binti Circles</option><option value="stockist">Stockist / wholesale</option><option value="media">Media</option></select></label>
    <label className="text-sm font-bold">County (optional)<input name="county" maxLength={80} className="mt-2 w-full rounded-xl border border-brand-clay bg-brand-cream p-3 font-normal" /></label>
    <label className="text-sm font-bold">How can we help?<textarea required name="message" minLength={10} maxLength={2000} rows={6} className="mt-2 w-full rounded-xl border border-brand-clay bg-brand-cream p-3 font-normal" /></label>
    <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
    <label className="flex items-start gap-3 text-sm text-brand-dark-light"><input required name="followUpConsent" type="checkbox" className="mt-1 accent-brand-berry" />Binti Marvels may contact me about this enquiry. This does not opt me into marketing.</label>
    <button disabled={state==='sending'} className="w-full rounded-full bg-brand-berry px-6 py-3.5 font-bold text-white disabled:opacity-60">{state==='sending'?'Sending…':'Send enquiry'}</button>
    {message && <p role="status" className={state==='sent'?'text-sm text-brand-teal':'text-sm text-red-700'}>{message}</p>}
    {state==='error' && <a href="https://wa.me/254717345841" className="inline-block text-sm font-bold text-brand-berry underline">Use WhatsApp instead</a>}
  </form>;
}
