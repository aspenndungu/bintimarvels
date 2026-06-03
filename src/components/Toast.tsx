'use client';
import { useEffect } from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-toast">
      <div className="bg-brand-dark text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 border border-brand-dark-light">
        <div className="w-6 h-6 bg-brand-teal/20 text-brand-teal rounded-full flex items-center justify-center">
          <Check className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
