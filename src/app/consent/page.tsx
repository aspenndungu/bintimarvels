import { Metadata } from 'next';
export const metadata: Metadata = { title: 'Messaging & Consent Policy' };
export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 min-h-screen">
      <h1 className="font-display font-black text-4xl text-brand-dark mb-8">Messaging & Consent</h1>
      <div className="bg-white rounded-2xl p-8 border border-brand-clay shadow-sm space-y-6 text-brand-dark-light text-sm leading-relaxed">
        <p>We respect your inbox and your WhatsApp. Here is how we communicate with you:</p>
        <h2 className="text-lg font-bold text-brand-dark mt-6">Order Updates (Utility)</h2>
        <p>When you place an order, you agree to receive essential updates (order confirmation, delivery tracking, and payment receipts) via WhatsApp or SMS. These are necessary to fulfill your purchase.</p>
        <h2 className="text-lg font-bold text-brand-dark mt-6">Marketing & Reminders</h2>
        <p>We will never send you promotional offers or cycle reminders unless you explicitly check the optional opt-in boxes during checkout or signup.</p>
        <h2 className="text-lg font-bold text-brand-dark mt-6">How to Opt-Out</h2>
        <p>You can withdraw your consent at any time. Simply reply <strong>STOP</strong> to any of our marketing messages on WhatsApp or SMS, and you will be immediately removed from our marketing lists.</p>
      </div>
    </div>
  );
}
