import Link from 'next/link';
import { CheckCircle2, Clock3, MessageCircle, ShieldAlert } from 'lucide-react';
import { validatePaymentStatusProof } from '@/server/request-security';

export default async function PaymentStatusPage({ searchParams }: { searchParams: Promise<{ reference?: string; state?: string; proof?: string; cancelled?: string }> }) {
  const params = await searchParams;
  const reference = (params.reference ?? '').replace(/[^A-Za-z0-9._:-]/g, '').slice(0, 50);
  const state = (params.state ?? '').replace(/[^a-z_]/g, '').slice(0, 40);
  const proved = validatePaymentStatusProof(reference, state, params.proof ?? '');
  const cancelled = params.cancelled === '1';
  const success = proved && ['paid', 'completed', 'duplicate'].includes(state);
  const review = proved && ['payment_review', 'reversal_review'].includes(state);
  const Icon = success ? CheckCircle2 : review ? ShieldAlert : Clock3;
  const title = success ? 'Payment verified.' : review ? 'Payment needs a team check.' : cancelled ? 'Payment not completed.' : 'We are checking your payment.';
  const message = success
    ? 'Thank you. Binti has verified the payment and will continue with the next step.'
    : review
      ? 'Please do not pay again. The Binti team will compare the Pesapal record and contact you if anything is needed.'
      : cancelled
        ? 'No completed payment was confirmed. You can return to the relevant page when you are ready.'
        : 'Please do not pay twice. If Pesapal completed the payment, its notification will update Binti’s record.';
  return <main className="min-h-[70svh] bg-brand-cream px-5 py-20 sm:px-8"><div className="mx-auto max-w-2xl rounded-[2.5rem] border border-brand-clay bg-white p-8 text-center shadow-[0_24px_80px_rgba(77,15,40,.1)] sm:p-12"><Icon className={`mx-auto h-14 w-14 ${success ? 'text-[#1f7a43]' : review ? 'text-amber-700' : 'text-brand-berry'}`}/><p className="mt-6 text-xs font-bold uppercase tracking-[.22em] text-brand-gold-dark">Pesapal payment</p><h1 className="mt-3 font-serif text-4xl text-brand-dark sm:text-5xl">{title}</h1><p className="mx-auto mt-5 max-w-xl leading-relaxed text-brand-dark-light">{message}</p>{reference && <p className="mt-5 text-sm text-brand-dark-light">Reference: <strong className="text-brand-dark">{reference}</strong></p>}<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/shop" className="rounded-full bg-brand-berry px-7 py-3.5 font-bold text-white">Return to shop</Link><a href="https://wa.me/254717345841" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-clay px-7 py-3.5 font-bold text-brand-berry"><MessageCircle className="h-4 w-4"/> Contact Binti</a></div></div></main>;
}
