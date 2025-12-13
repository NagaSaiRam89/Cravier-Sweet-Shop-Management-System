import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Order, OrderItem } from '@/types/order';
import type { CartItem } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface OrderContextType {
  orders: Order[];
  userOrders: Order[];
  addOrder: (items: CartItem[], totalPrice: number) => Order;
  getOrderById: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user, isAdmin } = useAuth();

  const userOrders = isAdmin 
    ? orders 
    : orders.filter(order => order.userId === user?.id);

  const addOrder = useCallback((cartItems: CartItem[], totalPrice: number): Order => {
    if (!user) throw new Error('User must be logged in to place an order');

    const orderItems: OrderItem[] = cartItems.map(item => ({
      sweetId: item.sweet.id,
      sweetName: item.sweet.name,
      quantity: item.quantity,
      pricePerUnit: item.sweet.price,
    }));

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      items: orderItems,
      totalPrice,
      createdAt: new Date(),
      status: 'completed',
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
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
