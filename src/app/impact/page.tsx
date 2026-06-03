'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BINTI_PRODUCTS } from '@/data';
import { CSREnquiry } from '@/types';

export default function ImpactPage() {
  const [csrLead, setCsrLead] = useState<CSREnquiry>({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    county: 'Nairobi',
    qtyPacks: 100,
    intendedImpact: 'Providing zero-cost sanitary kits to government schoolgirls in rural communities.',
    consentContact: false
  });
  const [csrSubmitted, setCsrSubmitted] = useState(false);

  const handleCsrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCsrSubmitted(true);
  };

  return (
    <div className="bg-brand-cream min-h-screen text-brand-dark overflow-x-hidden font-sans relative">
      
      <main className="pt-24 pb-20">
        <section className="max-w-7xl mx-auto px-4" id="csr-schools">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-brand-berry text-xs font-mono uppercase font-bold tracking-widest block">NGO, School & County Program Channel</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-dark">The Binti Dignity Mission</h2>
              <p className="text-brand-dark-light text-sm leading-relaxed font-sans">
                Menstruating should never lead to school absenteeism. For girls in primary and secondary schools across Kenya’s counties, missing 4-5 days of class each month stalls their dreams. Binti Marvels partner directly with schools, NGOs, corporate CSR boards, and county government teams, supplying specialized bulk sanitary packs at close-to-manufacturing cost.
              </p>

              <div className="p-5 rounded-xl border border-brand-clay bg-brand-cream-dark/30 space-y-3 text-sm flex flex-col md:flex-row items-start md:items-center gap-5">
                <div className="flex-1 space-y-1.5">
                  <h4 className="font-bold text-brand-dark">Verified Impact Distribution</h4>
                  <p className="text-[#5C3E33]/95 leading-relaxed font-normal text-xs">
                    We ensure every bulk donation reaches the girls who need it most. From rural schools in Kitui to community centers across Kenya, our distribution network guarantees that your dignity kits make a real difference.
                  </p>
                </div>
                <div className="w-32 h-24 rounded-lg overflow-hidden border border-brand-clay shrink-0 bg-white relative shadow-xs">
                  <Image src="/lorna-binti-donation-kitui.jpeg" alt="Mrembo Image" width={1200} height={1200} className="w-full h-full object-cover" style={{ objectFit: "cover" }} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BINTI_PRODUCTS.map((bp) => (
                  <div key={bp.id} className="p-4 bg-white rounded-xl border border-brand-clay flex flex-col justify-between space-y-3 hover:border-brand-berry duration-350 shadow-2xs">
                    <div>
                      <div className="w-full h-28 bg-zinc-100 rounded-lg overflow-hidden mb-2 border border-zinc-200">
                        <Image src="/binti-product-portfolio.jpeg" alt="Mrembo Image" width={1200} height={1200} className="w-full h-full object-cover" style={{ objectFit: "cover" }} />
                      </div>
                      <span className="px-2 py-0.5 bg-brand-clay text-brand-dark text-[9px] font-mono font-bold uppercase rounded-full">Dignity Assortment</span>
                      <h4 className="font-display font-extrabold text-brand-dark text-sm leading-tight mt-1">{bp.name}</h4>
                      <p className="text-[11px] text-[#4E2F23]/80 leading-relaxed mt-1 font-normal">{bp.description}</p>
                    </div>
                    <div className="pt-2 border-t border-brand-cream-dark flex items-baseline justify-between">
                      <span className="text-[10px] text-brand-dark-light font-mono font-medium">{bp.quantity}</span>
                      <span className="font-mono text-sm font-extrabold text-brand-berry">KSh {bp.priceKsh}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CSR Lead application section */}
            <div className="lg:col-span-5 bg-white border border-brand-clay rounded-2xl p-6 shadow-xs pointer-events-auto">
              {csrSubmitted ? (
                <div className="text-center py-10 space-y-4 animate-fade-in">
                  <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center text-brand-teal mx-auto font-bold text-xl">✓</div>
                  <h4 className="font-display font-medium text-brand-dark text-xl">CSR Registration Logged Case</h4>
                  <p className="text-sm text-brand-dark-light leading-relaxed max-w-sm mx-auto">
                    Thank you for keeping girls protected. Our community impact manager will review your requested bulk target of {csrLead.qtyPacks} packs and dispatch a custom CSR corporate quotation directly to you.
                  </p>
                  <button
                    onClick={() => setCsrSubmitted(false)}
                    className="px-5 py-2.5 bg-brand-cream border border-brand-clay text-brand-dark rounded-xl text-xs font-display font-bold uppercase cursor-pointer hover:bg-brand-clay mt-4 transition-colors"
                  >
                    Submit another card
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCsrSubmit} className="space-y-4 text-sm font-semibold">
                  <h4 className="font-display font-bold text-brand-dark text-lg border-b border-brand-cream-dark pb-3">Inquire Bulk Dignity Supply</h4>

                  <div className="space-y-1.5">
                    <label className="text-brand-dark-light block text-xs">Organization / Campaign Group</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Safaricom Foundation, Rotary Club"
                      className="w-full bg-brand-cream border border-brand-clay rounded-lg p-3 outline-hidden focus:border-brand-berry font-medium"
                      value={csrLead.organizationName}
                      onChange={(e) => setCsrLead({ ...csrLead, organizationName: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-brand-dark-light block text-xs">Contact Officer</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lorna Joyce"
                        className="w-full bg-brand-cream border border-brand-clay rounded-lg p-3 outline-hidden focus:border-brand-berry font-medium"
                        value={csrLead.contactName}
                        onChange={(e) => setCsrLead({ ...csrLead, contactName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-brand-dark-light block text-xs">Target County</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kitui, Turkana"
                        className="w-full bg-brand-cream border border-brand-clay rounded-lg p-3 outline-hidden focus:border-brand-berry font-medium"
                        value={csrLead.county}
                        onChange={(e) => setCsrLead({ ...csrLead, county: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-brand-dark-light block text-xs">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. csr@foundation.org"
                        className="w-full bg-brand-cream border border-brand-clay rounded-lg p-3 outline-hidden focus:border-brand-berry font-medium"
                        value={csrLead.email}
                        onChange={(e) => setCsrLead({ ...csrLead, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-brand-dark-light block text-xs">Volume Estimate (Packs)</label>
                      <input
                        type="number"
                        required
                        value={csrLead.qtyPacks}
                        onChange={(e) => setCsrLead({ ...csrLead, qtyPacks: parseInt(e.target.value) })}
                        className="w-full bg-brand-cream border border-brand-clay rounded-lg p-3 outline-hidden focus:border-brand-berry font-mono font-medium"
                      />
                    </div>
                  </div>

                  {/* Secure GDPR audit checked inputs */}
                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-brand-clay space-y-2 text-xs">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="csr-consent"
                        required
                        checked={csrLead.consentContact}
                        onChange={(e) => setCsrLead({ ...csrLead, consentContact: e.target.checked })}
                        className="mt-0.5 shrink-0 accent-brand-berry w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="csr-consent" className="text-brand-dark-light cursor-pointer leading-relaxed font-medium">
                        <strong className="text-brand-dark font-medium">Follow-up Permission:</strong> I agree that Binti Marvels may contact me via WhatsApp, phone, or email to discuss this CSR proposal.
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full text-center py-4 bg-brand-berry hover:bg-brand-berry-dark text-white font-display font-semibold uppercase tracking-wider rounded-xl cursor-pointer transition-colors mt-2"
                  >
                    Submit CSR Dignity Request
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
