import { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy' };
export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 min-h-screen">
      <h1 className="font-display font-black text-4xl text-brand-dark mb-8">Privacy Policy</h1>
      <div className="bg-white rounded-2xl p-8 border border-brand-clay shadow-sm space-y-6 text-brand-dark-light text-sm leading-relaxed">
        <p>At BINTI MARVELS LIMITED, we respect your privacy. This policy explains how we collect and use your data when you visit bintimarvels.com.</p>
        <p><strong className="text-brand-dark">Legal business:</strong> BINTI MARVELS LIMITED, registered in Kenya. Registered business address: CIATA MALL, KIAMBU ROAD, P.O. BOX 35316-00200, KIAMBU, KENYA.</p>
        <h2 className="text-lg font-bold text-brand-dark mt-6">What We Collect</h2>
        <p>We only collect data necessary to fulfill your order or request: Name, Phone/WhatsApp Number, Delivery Address, and specific order preferences.</p>
        <h2 className="text-lg font-bold text-brand-dark mt-6">How We Use It</h2>
        <p>Your data is used strictly for order fulfillment, delivery updates, and customer support. If you explicitly opt-in, we may send you marketing or cycle reminders.</p>
        <h2 className="text-lg font-bold text-brand-dark mt-6">Third-Party Sharing</h2>
        <p>We share your data only with trusted partners necessary for service delivery, such as delivery riders and our WhatsApp Business provider. We do not sell your data to advertising brokers.</p>
        <h2 className="text-lg font-bold text-brand-dark mt-6">Your Rights (ODPC Compliance)</h2>
        <p>Under the Kenya Data Protection Act, you have the right to access, correct, or delete your personal data. You can also withdraw consent at any time.</p>
        <p>Contact us at <a href="mailto:binticreationsllc@gmail.com" className="text-brand-berry font-bold hover:underline">binticreationsllc@gmail.com</a> for any data requests.</p>
      </div>
    </div>
  );
}
