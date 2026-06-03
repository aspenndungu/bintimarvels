import { Metadata } from 'next';
export const metadata: Metadata = { title: 'Returns & Refunds' };
export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 min-h-screen">
      <h1 className="font-display font-black text-4xl text-brand-dark mb-8">Returns & Refunds</h1>
      <div className="bg-white rounded-2xl p-8 border border-brand-clay shadow-sm space-y-6 text-brand-dark-light text-sm leading-relaxed">
        <p>Your comfort and satisfaction are our priority, but due to the sanitary nature of our products, we enforce strict return guidelines.</p>
        <h2 className="text-lg font-bold text-brand-dark mt-6">Eligible Returns</h2>
        <p>Returns are only accepted if the product packaging is unopened, sealed, and in its original condition, or if the product arrived damaged/defective. You must report any issues within 48 hours of delivery.</p>
        <h2 className="text-lg font-bold text-brand-dark mt-6">Refund Process</h2>
        <p>If a return is approved, we will process a replacement or a full refund via M-Pesa or your original payment method within 3 business days.</p>
        <p>To initiate a return, please contact us on WhatsApp at +254 717 345 841.</p>
      </div>
    </div>
  );
}
