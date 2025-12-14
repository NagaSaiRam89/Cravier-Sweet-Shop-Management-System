//Manages the temporary collection of items the user intends to buy. calculates totals before the final purchase.

// THe Shpping cart context handles adding, removing, and updating item quantities, 
// as well as processing the checkout by interacting with the sweets API and order context.

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Sweet } from '@/types/sweet';
import { useSweets } from '@/context/SweetContext';
import { useOrders } from '@/context/OrderContext';
import { sweetsApi } from '@/services/api';
import { toast } from 'sonner';

export interface CartItem {
  sweet: Sweet;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (sweet: Sweet) => void;
  removeFromCart: (sweetId: string) => void;
  updateQuantity: (sweetId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
  isCheckingOut: boolean;
  getCartQuantity: (sweetId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { refresh } = useSweets();
  const { addOrder } = useOrders();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.sweet.price * item.quantity), 0);

  const getCartQuantity = useCallback((sweetId: string): number => {
    const item = items.find(i => i.sweet.id === sweetId);
    return item?.quantity || 0;
  }, [items]);

  const addToCart = useCallback((sweet: Sweet) => {
    setItems(prev => {
      const existing = prev.find(item => item.sweet.id === sweet.id);
      if (existing) {
        // Check if we can add more
        if (existing.quantity >= sweet.quantity) {
          toast.error('Cannot add more', { description: 'Not enough stock available.' });
          return prev;
        }
        return prev.map(item =>
          item.sweet.id === sweet.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { sweet, quantity: 1 }];
    });
    toast.success(`Added ${sweet.name} to cart`);
  }, []);

  const removeFromCart = useCallback((sweetId: string) => {
    setItems(prev => {
      const item = prev.find(i => i.sweet.id === sweetId);
      if (item) {
        toast.info(`Removed ${item.sweet.name} from cart`);
      }
      return prev.filter(i => i.sweet.id !== sweetId);
    });
  }, []);

  const updateQuantity = useCallback((sweetId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sweetId);
      return;
    }
    
    setItems(prev => {
      const item = prev.find(i => i.sweet.id === sweetId);
      if (item && quantity > item.sweet.quantity) {
        toast.error('Cannot add more', { description: 'Not enough stock available.' });
        return prev;
      }
      return prev.map(item =>
        item.sweet.id === sweetId
          ? { ...item, quantity }
          : item
      );
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const checkout = useCallback(async () => {
    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setIsCheckingOut(true);
    try {
      // Process purchases for all items
      for (const item of items) {
        for (let i = 0; i < item.quantity; i++) {
          await sweetsApi.purchase(item.sweet.id);
        }
      }
      
      // Add order to history
      addOrder(items, totalPrice);
      
      toast.success('Order placed successfully!', {
        description: `Total: ${totalPrice.toFixed(2)}/-`,
      });
      
      setItems([]);
      await refresh();
    } catch (error) {
      toast.error('Checkout failed', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsCheckingOut(false);
    }
  }, [items, totalPrice, refresh, addOrder]);

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    isCheckingOut,
    getCartQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
