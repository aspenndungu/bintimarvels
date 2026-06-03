import { Metadata } from 'next';
import { Mail, MessageSquare, Clock, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact & Support',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-brand-cream relative overflow-hidden selection:bg-brand-berry selection:text-white pb-20">
      
      {/* Decorative BG */}
      <div className="absolute top-0 right-0 w-full md:w-2/3 h-96 bg-[#4D0F28] rounded-bl-[100px] z-0 opacity-5 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 pt-24 md:pt-32">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-clay/30 border border-brand-clay/50 text-brand-dark font-medium text-xs tracking-wider uppercase mb-6">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>We're Here For You</span>
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-brand-dark mb-6 leading-tight tracking-tight">
            Let's keep the <br/><span className="text-brand-berry">conversation going.</span>
          </h1>
          <p className="text-brand-dark-light text-base md:text-lg leading-relaxed">
            Whether you need help with an order, want to discuss a bulk purchase, or just have a question about Mrembo Pads, our team is ready to support you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
          {/* WhatsApp Card */}
          <div className="bg-white rounded-3xl p-8 border border-brand-clay shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-[#25D366]/10 text-[#25D366] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-2xl text-brand-dark mb-2">WhatsApp Us</h3>
            <p className="text-brand-dark-light text-sm leading-relaxed mb-6">
              The fastest way to reach us. Chat with our support team for immediate assistance with orders or general inquiries.
            </p>
            <a href="https://wa.me/254717345841" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full bg-[#25D366] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#1EBE5D] transition-colors shadow-sm">
              Chat on WhatsApp
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-3xl p-8 border border-brand-clay shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-brand-berry/10 text-brand-berry rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-2xl text-brand-dark mb-2">Email Support</h3>
            <p className="text-brand-dark-light text-sm leading-relaxed mb-6">
              For official correspondence, media inquiries, or if you prefer to communicate via email. We typically reply within 24 hours.
            </p>
            <a href="mailto:binti@bintimarvels.com" className="inline-flex items-center justify-center w-full bg-brand-dark text-brand-cream font-bold py-3 px-6 rounded-xl hover:bg-[#1A030C] transition-colors shadow-sm">
              binti@bintimarvels.com
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 max-w-3xl mx-auto bg-[#FAF7F2] rounded-3xl p-6 md:p-8 border border-brand-clay flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-brand-gold shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-brand-dark">Business Hours</h4>
              <p className="text-sm text-brand-dark-light mt-1">Monday - Saturday<br/>8:00 AM - 6:00 PM (EAT)</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-brand-clay"></div>
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-brand-gold shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-brand-dark">Our Location</h4>
              <p className="text-sm text-brand-dark-light mt-1">Nairobi, Kenya<br/>(Delivery Nationwide)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
