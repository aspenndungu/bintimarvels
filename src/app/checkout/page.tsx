'use client';

import React, { useState } from 'react';
import { useCart } from '@/components/CartContext';

export default function CheckoutPage() {
  const { cart, totalPrice, purchaseType } = useCart();
  
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'success'>('form');
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingEmail, setShippingEmail] = useState('');
  const [shippingCounty, setShippingCounty] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [consentCheckboxes, setConsentCheckboxes] = useState({
    trans: false,
    remind: false,
    mark: false
  });

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentCheckboxes.trans) {
      alert("Transactional consent is legally required by ODPC. Please check the first consent box to proceed.");
      return;
    }
    setCheckoutStep('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-brand-cream min-h-screen text-brand-dark overflow-x-hidden font-sans relative">
      
      <main className="pt-24 pb-20">
        <section className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-brand-dark">Secure Checkout</h1>
            <p className="text-brand-dark-light mt-2">Complete your order securely. Payment is settled on delivery via M-Pesa.</p>
          </div>

          <div className="bg-white rounded-2xl w-full border border-brand-clay shadow-xl overflow-hidden p-6 relative">
              {checkoutStep === 'success' ? (
                <div className="text-center py-8 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-brand-teal flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                  <h3 className="font-display font-bold text-brand-dark text-xl">Mrembo Order Successfully Received!</h3>
                  <p className="text-xs text-brand-dark-light max-w-sm mx-auto leading-relaxed">
                    We've received your order! Our team is preparing your package and will contact you shortly to confirm delivery.
                  </p>

                  <div className="p-4 bg-[#FAF7F2] rounded-xl border border-brand-clay text-left space-y-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-brand-gold block">Order Details:</span>
                    <div className="text-xs text-[#4E2F23]/80 space-y-1">
                      <div>Receiver: <span className="text-brand-dark font-medium">{shippingName}</span></div>
                      <div>Phone: <span className="text-brand-dark font-medium">{shippingPhone}</span></div>
                      <div>Order Updates: <span className="text-brand-teal font-medium">Opted In</span></div>
                      <div>Monthly Reminder: <span className="text-brand-dark font-medium">{consentCheckboxes.remind ? 'Opted In' : 'Not Requested'}</span></div>
                      <div>Mrembo News: <span className="text-brand-dark font-medium">{consentCheckboxes.mark ? 'Opted In' : 'Not Requested'}</span></div>
                    </div>
                  </div>

                  <a
                    href="/"
                    className="inline-block px-6 py-2.5 bg-brand-berry hover:bg-brand-berry-dark text-white rounded-xl text-xs font-display font-semibold uppercase cursor-pointer"
                  >
                    Continue Browsing
                  </a>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <h3 className="font-display font-bold text-brand-dark text-xl">Your cart is empty</h3>
                  <p className="text-xs text-brand-dark-light max-w-sm mx-auto">
                    Add some Mrembo bundles to your cart before proceeding to checkout.
                  </p>
                  <a
                    href="/#mrembo-range"
                    className="inline-block px-6 py-2.5 bg-brand-berry hover:bg-brand-berry-dark text-white rounded-xl text-xs font-display font-semibold uppercase cursor-pointer"
                  >
                    Shop Mrembo Packs
                  </a>
                </div>
              ) : (
                <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs font-semibold">
                  <div className="border-b border-brand-cream-dark pb-3 space-y-1">
                    <h3 className="font-display font-bold text-brand-dark text-lg">Checkout Mrembo Comfort Bundle</h3>
                    <p className="text-xs text-brand-dark-light font-sans font-normal">Please confirm delivery details. Payment is settled on delivery via M-Pesa.</p>
                  </div>

                  <div className="space-y-1.5 bg-brand-cream p-3 rounded-xl border border-brand-clay">
                    <div className="flex justify-between font-display font-medium text-xs text-brand-dark">
                      <span>Selected Pack Option:</span>
                      <span>{purchaseType === 'subscription' ? ' predictive subscription' : 'One-Time Purchase'}</span>
                    </div>
                    {cart.map((c) => (
                      <div key={c.product.id} className="flex justify-between items-baseline pt-1">
                        <span className="font-extrabold text-brand-dark">{c.product.name} x{c.qty}</span>
                        <span className="font-mono text-xs font-bold text-[#5C0632]">KSh {purchaseType === 'subscription' ? Math.round(c.product.priceKsh * 0.9 * c.qty) : (c.product.priceKsh * c.qty)}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-brand-clay/40 flex justify-between font-display font-extrabold text-sm text-brand-dark">
                      <span>Total Amount (Delivery Included):</span>
                      <span className="text-brand-berry font-mono">KSh {totalPrice}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-brand-dark-light block font-medium">Customer Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Wanjiku Nduta"
                        className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-medium"
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-brand-dark-light block font-medium">WhatsApp / Mobile Line</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 0712345678"
                          className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-mono font-medium"
                          value={shippingPhone}
                          onChange={(e) => setShippingPhone(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-brand-dark-light block font-medium">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. wanjiko@domain.ke"
                          className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-medium"
                          value={shippingEmail}
                          onChange={(e) => setShippingEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-brand-dark-light block font-medium">County</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Nairobi, Nakuru"
                          className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-medium"
                          value={shippingCounty}
                          onChange={(e) => setShippingCounty(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-brand-dark-light block font-medium">Detailed shipping coordinates / Estate Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Kilimani Area, Wood Avenue"
                          className="w-full bg-brand-cream border border-brand-clay rounded-lg p-2.5 outline-hidden focus:border-brand-berry font-medium"
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] rounded-xl border border-brand-clay space-y-3 text-[10px]">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="checkout-trans"
                        checked={consentCheckboxes.trans}
                        onChange={(e) => setConsentCheckboxes({ ...consentCheckboxes, trans: e.target.checked })}
                        className="mt-0.5 shrink-0 accent-brand-berry w-3.5 h-3.5 cursor-pointer"
                      />
                      <label htmlFor="checkout-trans" className="text-brand-dark-light cursor-pointer leading-relaxed font-medium">
                        <strong className="text-brand-dark font-medium">Order Updates:</strong> I agree that Binti Marvels and our delivery partners can contact me via WhatsApp or SMS to confirm and deliver this order.
                      </label>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="checkout-remind"
                        checked={consentCheckboxes.remind}
                        onChange={(e) => setConsentCheckboxes({ ...consentCheckboxes, remind: e.target.checked })}
                        className="mt-0.5 shrink-0 accent-brand-berry w-3.5 h-3.5 cursor-pointer"
                      />
                      <label htmlFor="checkout-remind" className="text-brand-dark-light cursor-pointer leading-relaxed font-medium">
                        <strong className="text-brand-dark font-medium">Monthly Reminders (Optional):</strong> Send me a discreet reorder reminder every 28 days via WhatsApp/SMS so I never run out. I can cancel anytime.
                      </label>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="checkout-mark"
                        checked={consentCheckboxes.mark}
                        onChange={(e) => setConsentCheckboxes({ ...consentCheckboxes, mark: e.target.checked })}
                        className="mt-0.5 shrink-0 accent-brand-berry w-3.5 h-3.5 cursor-pointer"
                      />
                      <label htmlFor="checkout-mark" className="text-brand-dark-light cursor-pointer leading-relaxed font-medium">
                        <strong className="text-brand-dark font-medium">Mrembo News (Optional):</strong> Keep me updated about new bundles, community events, and special offers. Reply STOP at any time.
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <button
                      type="submit"
                      className="w-full text-center py-3 bg-brand-berry hover:bg-brand-berry-dark text-white rounded-xl text-xs font-display font-semibold uppercase cursor-pointer"
                    >
                      Confirm Purchase
                    </button>
                  </div>
                </form>
              )}
          </div>
        </section>
      </main>
    </div>
  );
}
