export interface OrderItem {
  sweetId: string;
  sweetName: string;
  quantity: number;
  pricePerUnit: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: Date;
  status: 'completed' | 'pending' | 'cancelled';
}
