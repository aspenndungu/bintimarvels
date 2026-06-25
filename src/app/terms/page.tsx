import { Metadata } from 'next';
export const metadata: Metadata = { title: 'Terms of Service' };
export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 min-h-screen">
      <h1 className="font-display font-black text-4xl text-brand-dark mb-8">Terms of Service</h1>
      <div className="bg-white rounded-2xl p-8 border border-brand-clay shadow-sm space-y-6 text-brand-dark-light text-sm leading-relaxed">
        <p>Welcome to BINTI MARVELS LIMITED. By using our website and purchasing our products, you agree to these terms.</p>
        <p><strong className="text-brand-dark">Legal business:</strong> BINTI MARVELS LIMITED, registered in Kenya. Registered business address: CIATA MALL, KIAMBU ROAD, P.O. BOX 35316-00200, KIAMBU, KENYA. Email: binticreationsllc@gmail.com.</p>
        <h2 className="text-lg font-bold text-brand-dark mt-6">Product Use & Medical Disclaimer</h2>
        <p>Mrembo Pads are designed for everyday comfort and menstrual hygiene. They are not intended to cure or prevent any medical condition. Please discontinue use if irritation occurs.</p>
        <h2 className="text-lg font-bold text-brand-dark mt-6">Purchasing & Resale</h2>
        <p>Products purchased on this site are for personal use unless you are an approved authorized stockist. Unauthorized resale is prohibited.</p>
        <h2 className="text-lg font-bold text-brand-dark mt-6">Changes to Terms</h2>
        <p>We reserve the right to update these terms at any time. Continued use of the site constitutes acceptance of the new terms.</p>
      </div>
    </div>
  );
}
