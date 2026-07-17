'use client';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { catalogById, type CatalogProduct } from '@/lib/catalog';

export interface CartItem { product: CatalogProduct; qty: number }
interface StoredItem { productId: string; qty: number }
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CatalogProduct) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
  isCartOpen: boolean;
  hydrated: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = 'binti-mrembo-cart-v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as StoredItem[];
        setCart(stored.flatMap((item) => {
          const product = catalogById.get(item.productId);
          const qty = Math.min(20, Math.max(1, Number(item.qty) || 1));
          return product ? [{ product, qty }] : [];
        }));
      } catch { localStorage.removeItem(STORAGE_KEY); }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(cart.map(({ product, qty }) => ({ productId: product.id, qty }))));
  }, [cart, hydrated]);

  const addToCart = (product: CatalogProduct) => {
    setCart((current) => {
      const found = current.find((item) => item.product.id === product.id);
      return found
        ? current.map((item) => item.product.id === product.id ? { ...item, qty: Math.min(20, item.qty + 1) } : item)
        : [...current, { product, qty: 1 }];
    });
    setIsCartOpen(true);
  };
  const updateQuantity = (productId: string, delta: number) => setCart((current) => current.map((item) => item.product.id === productId ? { ...item, qty: Math.min(20, Math.max(1, item.qty + delta)) } : item));
  const removeFromCart = (productId: string) => setCart((current) => current.filter((item) => item.product.id !== productId));
  const clearCart = useCallback(() => setCart([]), []);
  const value = useMemo(() => ({
    cart, addToCart, updateQuantity, removeFromCart, clearCart,
    cartCount: cart.reduce((sum, item) => sum + item.qty, 0),
    totalPrice: cart.reduce((sum, item) => sum + item.product.priceKsh * item.qty, 0),
    isCartOpen, hydrated, setIsCartOpen,
  }), [cart, isCartOpen, hydrated, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used within CartProvider');
  return value;
}
