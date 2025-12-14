//The Cash Register System for Cravier's Sweet Shop

// Finalizes the transaction. Converts the temporary shopping cart into a permanent Order Record in the database.

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Order, OrderItem } from '@/types/order';
import type { CartItem } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/services/api'; // Import the API

interface OrderContextType {
  orders: Order[];
  userOrders: Order[];
  addOrder: (items: CartItem[], totalPrice: number) => Promise<void>; // Changed to Promise
  getOrderById: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

/**
   * BUSINESS LOGIC: Add Order
   * 1. Verifies the customer is logged in.
   * 2. Translates the "Shopping Cart" into a formal "Order Record".
   * 3. Saves the record to the database for the shop owner to see.
   * 4. Updates the local screen instantly for a snappy user experience.
   */

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user, isAdmin } = useAuth();

  // 1. Fetch real orders from DB when user logs in
  useEffect(() => {
    if (user) {
      ordersApi.getAll()
        .then(data => setOrders(data))
        .catch(err => console.error("Failed to load orders:", err));
    } else {
      setOrders([]);
    }
  }, [user]);

  const userOrders = isAdmin 
    ? orders 
    : orders.filter(order => order.userId === user?.id);

  const addOrder = useCallback(async (cartItems: CartItem[], totalPrice: number) => {
    if (!user) throw new Error('User must be logged in to place an order');

    // 2. Prepare data for Backend
    const orderData = {
      items: cartItems.map(item => ({
        sweetId: item.sweet.id,
        sweetName: item.sweet.name,
        quantity: item.quantity,
        pricePerUnit: item.sweet.price,
      })),
      totalPrice,
      userName: user.name
    };

    try {
      // 3. Save to Database
      const savedOrder = await ordersApi.create(orderData);
      
      // 4. Update Local State with the REAL saved order (which has the correct DB ID)
      setOrders(prev => [savedOrder, ...prev]);
    } catch (error) {
      console.error("Failed to save order:", error);
      throw error;
    }
  }, [user]);

  const getOrderById = useCallback((id: string): Order | undefined => {
    return orders.find(order => order.id === id);
  }, [orders]);

  const value: OrderContextType = {
    orders,
    userOrders,
    addOrder,
    getOrderById,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}