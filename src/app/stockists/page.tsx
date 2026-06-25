'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function StockistsPage() {
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [stockistLead, setStockistLead] = useState({
    businessName: '',
    role: 'salon',
    contactName: '',
    phone: '',
    email: '',
    location: '',
    consentMarketing: false
  });

  const handleStockistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitted(true);
    // Simulate webhook POST to backend CRM.
  };

  return (
    <div className="bg-brand-cream min-h-screen text-brand-dark overflow-x-hidden font-sans relative">
      
      <main className="pt-24 pb-20">
        <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-brand-berry text-xs font-mono uppercase font-bold tracking-widest block">Wholesale & Partnership Channel</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-dark">Stock Mrembo Pads</h2>
            <p className="text-brand-dark-light text-sm leading-relaxed">
              Become an authorized stockist retailer or distributor partner. BINTI MARVELS LIMITED distributes period-care products to salons, beauty shops, pharmacies, local kiosks, schools, and supermarket chains across East Africa.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-white border border-brand-clay flex items-center justify-center shrink-0 text-brand-berry font-bold">✓</div>
                <div className="text-sm">
                  <h4 className="font-bold text-brand-dark">Attractive Merchant Margins</h4>
                  <p className="text-xs text-brand-dark-light mt-1">Wholesale rates provide significant yield gains for beauty salons, minimarts, and reseller chains.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-white border border-brand-clay flex items-center justify-center shrink-0 text-brand-berry font-bold">✓</div>
                <div className="text-sm">
                  <h4 className="font-bold text-brand-dark">Marketing Collateral Packs</h4>
                  <p className="text-xs text-brand-dark-light mt-1">Every stockist receives high-impact countertop displays, posters, and direct listing on our community directory.</p>
                </div>
              </div>

              <div className="border border-brand-clay rounded-xl overflow-hidden mt-8 bg-white shadow-sm max-w-sm">
                <Image src="/binti-product-portfolio.jpeg" alt="Mrembo Image" width={1200} height={1200} className="w-full h-56 object-cover" style={{ objectFit: "cover" }} />
                <span className="text-[9px] text-[#5C0632] px-3 py-2 block bg-brand-cream/40 border-t border-brand-clay font-mono font-bold uppercase tracking-wider">
                  Official Merchandising Display
                </span>
              </div>
            </div>
          </div>

          {/* Lead capture form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-brand-clay p-6 sm:p-8 shadow-xs">
            {leadSubmitted ? (
              <div className="text-center py-16 space-y-4 animate-fade-in">
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 mx-auto text-2xl font-bold">✓</div>
                <h3 className="font-display font-medium text-brand-dark text-2xl">Thank you for your Partnership interest!</h3>
                <p className="text-sm text-brand-dark-light max-w-md mx-auto leading-relaxed">
                  We have logged your stockist distribution profile. Our wholesale manager will email or WhatsApp your authorized wholesale price list sheet and logistics quote within 4 business hours. Let’s succeed together!
                </p>
                <button
                  onClick={() => setLeadSubmitted(false)}
                  className="mt-4 px-6 py-3 bg-brand-cream border border-brand-clay rounded-xl text-xs font-semibold uppercase text-brand-dark cursor-pointer pointer-events-auto hover:bg-brand-clay transition-colors"
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleStockistSubmit} className="space-y-5 text-sm font-semibold pointer-events-auto">
                <h4 className="font-display font-bold text-brand-dark text-lg border-b border-brand-cream-dark pb-3">Submit Stockist Lead Profile</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-brand-dark-light text-xs block font-medium">Business / Store Official Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Beauty Haven Salon, Nakuru"
                      className="w-full bg-brand-cream border border-brand-clay rounded-lg p-3 outline-hidden focus:border-brand-berry font-medium"
                      value={stockistLead.businessName}
                      onChange={(e) => setStockistLead({ ...stockistLead, businessName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-brand-dark-light text-xs block font-medium">Business Category</label>
                    <select
                      className="w-full bg-brand-cream border border-brand-clay rounded-lg p-3 outline-hidden focus:border-brand-berry font-medium cursor-pointer"
                      value={stockistLead.role}
                      onChange={(e) => setStockistLead({ ...stockistLead, role: e.target.value })}
                    >
                      <option value="salon">Beauty Salon / Barber Shop</option>
                      <option value="pharmacy">Pharmacy / Chemist Shop</option>
                      <option value="minimart">Store / Minimart / Supermarket</option>
                      <option value="reseller">Independent Merchant Reseller</option>
                      <option value="csr_ngo">NGO CSR / Donation Bulk Buyer</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-brand-dark-light text-xs block font-medium">Contact Person Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wanjiku Nduta"
                      className="w-full bg-brand-cream border border-brand-clay rounded-lg p-3 outline-hidden focus:border-brand-berry font-medium"
                      value={stockistLead.contactName}
                      onChange={(e) => setStockistLead({ ...stockistLead, contactName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-brand-dark-light text-xs block font-medium">Phone Number (M-Pesa / WhatsApp Line)</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0712345678"
                      className="w-full bg-brand-cream border border-brand-clay rounded-lg p-3 outline-hidden focus:border-brand-berry font-mono font-medium"
                      value={stockistLead.phone}
                      onChange={(e) => setStockistLead({ ...stockistLead, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-brand-dark-light text-xs block font-medium">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. hello@store.co.ke"
                      className="w-full bg-brand-cream border border-brand-clay rounded-lg p-3 outline-hidden focus:border-brand-berry font-medium"
                      value={stockistLead.email}
                      onChange={(e) => setStockistLead({ ...stockistLead, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-brand-dark-light text-xs block font-medium">Business Town / County</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nairobi, Nakuru, Kisumu"
                      className="w-full bg-brand-cream border border-brand-clay rounded-lg p-3 outline-hidden focus:border-brand-berry font-medium"
                      value={stockistLead.location}
                      onChange={(e) => setStockistLead({ ...stockistLead, location: e.target.value })}
                    />
                  </div>
                </div>

                {/* Consent Blocks - Compliant with legal requirements */}
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-brand-clay space-y-3 text-xs">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="stockist-consent"
                      required
                      className="mt-0.5 shrink-0 accent-brand-berry w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="stockist-consent" className="text-brand-dark-light leading-relaxed cursor-pointer font-medium">
                      <strong className="text-brand-dark font-medium">Follow-up Permission:</strong> I agree that Binti Marvels may contact me via WhatsApp, phone, or email regarding this stockist application.
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="stockist-marketing"
                      checked={stockistLead.consentMarketing}
                      onChange={(e) => setStockistLead({ ...stockistLead, consentMarketing: e.target.checked })}
                      className="mt-0.5 shrink-0 accent-brand-berry w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="stockist-marketing" className="text-brand-dark-light leading-relaxed cursor-pointer font-medium">
                      <strong className="text-brand-dark font-medium">B2B Newsletter (Optional):</strong> Keep me updated regarding upcoming wholesale events, discounts, and new product launches.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full text-center py-4 bg-brand-berry hover:bg-brand-berry-dark text-white font-display font-semibold uppercase tracking-wider rounded-xl cursor-pointer transition-colors mt-2"
                >
                  Send Stockist Application
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
