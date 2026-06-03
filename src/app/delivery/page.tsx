import { Metadata } from 'next';
export const metadata: Metadata = { title: 'Delivery Policy' };
export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 min-h-screen">
      <h1 className="font-display font-black text-4xl text-brand-dark mb-8">Delivery Policy</h1>
      <div className="bg-white rounded-2xl p-8 border border-brand-clay shadow-sm space-y-6 text-brand-dark-light text-sm leading-relaxed">
        <p>We aim to get your Mrembo Pads to you securely and swiftly.</p>
        <h2 className="text-lg font-bold text-brand-dark mt-6">Delivery Times</h2>
        <p>Orders within Nairobi are typically delivered within 24 hours. Nationwide deliveries via trusted couriers take 1-3 business days.</p>
        <h2 className="text-lg font-bold text-brand-dark mt-6">Delivery Fees</h2>
        <p>Enjoy free delivery within Nairobi for orders over KSh 1,500. For other regions, standard courier rates apply and will be confirmed via WhatsApp before dispatch.</p>
        <h2 className="text-lg font-bold text-brand-dark mt-6">Missed Deliveries</h2>
        <p>If you are unavailable at the agreed delivery time, our rider will attempt to contact you to reschedule. Repeated failed attempts may incur an additional delivery fee.</p>
      </div>
    </div>
  );
}
