'use client';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppFAB() {
  const handleClick = () => {
    window.open('https://wa.me/254717345841?text=Hi,%20I%27d%20like%20to%20order%20Mrembo%20Pads', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center border-2 border-white cursor-pointer"
      aria-label="Order on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </button>
  );
}
