import { Metadata } from 'next';
export const metadata: Metadata = { title: 'Data Access & Deletion' };
export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 min-h-screen">
      <h1 className="font-display font-black text-4xl text-brand-dark mb-8">Data Access & Deletion</h1>
      <div className="bg-white rounded-2xl p-8 border border-brand-clay shadow-sm space-y-6 text-brand-dark-light text-sm leading-relaxed">
        <p>In accordance with the Kenya Data Protection Act, you have full control over the personal data you share with BINTI MARVELS LIMITED.</p>
        <h2 className="text-lg font-bold text-brand-dark mt-6">Requesting Your Data</h2>
        <p>You can request a copy of the data we hold on you, including order history and consent logs, by emailing us.</p>
        <h2 className="text-lg font-bold text-brand-dark mt-6">Deleting Your Data</h2>
        <p>You can request that we permanently delete your personal information from our systems. Note that some transaction records may be retained temporarily for legal and accounting compliance.</p>
        <h2 className="text-lg font-bold text-brand-dark mt-6">Contact</h2>
        <p>Please send all data access, correction, or deletion requests to <a href="mailto:binticreationsllc@gmail.com" className="text-brand-berry font-bold hover:underline">binticreationsllc@gmail.com</a>.</p>
      </div>
    </div>
  );
}
