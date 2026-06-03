'use client';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
  const { cart, cartCount, totalPrice, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-cream z-50 shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-4 border-b border-brand-clay flex items-center justify-between bg-white">
          <h2 className="font-display font-bold text-xl text-brand-dark flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-berry" />
            Your Basket ({cartCount})
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-brand-clay rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-brand-dark-light" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-brand-clay-dark" />
              <p className="text-brand-dark-light">Your basket is empty.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2 bg-brand-berry text-white rounded-full font-bold uppercase tracking-wider text-xs hover:bg-brand-berry-dark transition-colors cursor-pointer"
              >
                Browse Products
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex gap-4 p-4 bg-white rounded-xl border border-brand-clay">
                <div className="w-20 h-20 bg-brand-clay/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🩸</span>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-display font-bold text-sm text-brand-dark leading-tight">
                        {item.product.name}
                      </h3>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-brand-clay-dark hover:text-red-500 transition-colors p-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-brand-gold font-bold text-sm mt-1">
                      KSh {item.product.priceKsh.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-brand-clay rounded-lg bg-brand-cream">
                      <button 
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="px-2 py-1 text-brand-dark hover:bg-brand-clay transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 text-xs font-bold font-mono border-x border-brand-clay">
                        {item.qty}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="px-2 py-1 text-brand-dark hover:bg-brand-clay transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs font-bold text-brand-dark-light">
                      KSh {(item.product.priceKsh * item.qty).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t border-brand-clay bg-white space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-brand-dark-light font-medium">Subtotal</span>
              <span className="font-bold text-brand-dark">KSh {totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-brand-dark-light font-medium">Delivery</span>
              <span className="font-bold text-brand-teal uppercase text-xs tracking-wider">Calculated at checkout</span>
            </div>
            <div className="border-t border-brand-clay pt-3 flex justify-between items-center">
              <span className="font-display font-bold text-lg text-brand-dark">Total</span>
              <span className="font-display font-black text-xl text-brand-berry">
                KSh {totalPrice.toLocaleString()}
              </span>
            </div>
            
            <Link 
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full py-4 bg-brand-dark text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Proceed to Checkout
              <ShoppingBag className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
