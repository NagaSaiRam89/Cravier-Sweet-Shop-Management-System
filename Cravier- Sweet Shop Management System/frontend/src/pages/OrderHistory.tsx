import { Navbar } from '@/components/Navbar';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { Package, Calendar, DollarSign, ShoppingBag, User } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function OrderHistory() {
  const { userOrders } = useOrders();
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Order History</h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? 'View all orders from all users' : 'View all your past orders'}
          </p>
        </div>

        {userOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No orders yet
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {isAdmin 
                ? 'No orders have been placed yet.'
                : 'Your order history will appear here after you make a purchase.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-2xl bg-card sweet-shadow border border-border/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl gradient-primary">
                      <Package className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{order.id}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(new Date(order.createdAt), 'PPp')}
                      </div>
                      {isAdmin && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <User className="w-3 h-3" />
                          <span>{order.userName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={order.status === 'completed' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {order.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-lg font-bold text-foreground">
                      <DollarSign className="w-4 h-4" />
                      {order.totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Items:</p>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-foreground">
                          {item.sweetName} × {item.quantity}
                        </span>
                        <span className="text-muted-foreground">
                          ${(item.pricePerUnit * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
