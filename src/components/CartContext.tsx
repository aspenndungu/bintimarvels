'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MremboProduct } from '@/types';

export interface CartItem {
  product: MremboProduct;
  qty: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: MremboProduct) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  cartCount: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  purchaseType: 'once' | 'subscription';
  setPurchaseType: (type: 'once' | 'subscription') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [purchaseType, setPurchaseType] = useState<'once' | 'subscription'>('once');

  const addToCart = (product: MremboProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  
  // Apply 10% discount if subscription
  const rawTotal = cart.reduce((acc, item) => acc + item.product.priceKsh * item.qty, 0);
  const totalPrice = purchaseType === 'subscription' ? Math.round(rawTotal * 0.9) : rawTotal;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        cartCount,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        purchaseType,
        setPurchaseType,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
