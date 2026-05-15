/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { Product } from '../lib/api';

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  stock: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'luxury-cnc-cart';

function loadCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    return (JSON.parse(raw) as Array<Partial<CartItem>>).map((item) => ({
      productId: item.productId || '',
      slug: item.slug || '',
      name: item.name || '',
      price: item.price || 0,
      imageUrl: item.imageUrl,
      quantity: Math.max(1, item.quantity || 1),
      stock: Math.max(0, item.stock || 0),
    })).filter((item) => item.productId && item.slug && item.name);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      return;
    }

    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        const nextQuantity = Math.min(existing.quantity + quantity, product.stock);
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: nextQuantity, stock: product.stock }
            : item,
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.basePrice,
          imageUrl: product.images[0]?.imageUrl,
          quantity: Math.min(quantity, product.stock),
          stock: product.stock,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current.map((item) => {
        if (item.productId !== productId) {
          return item;
        }

        const nextQuantity = item.stock > 0 ? Math.max(1, Math.min(quantity, item.stock)) : Math.max(1, quantity);
        return { ...item, quantity: nextQuantity };
      }),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      itemCount,
      subtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    };
  }, [addToCart, clearCart, items, removeFromCart, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider.');
  }
  return context;
}
