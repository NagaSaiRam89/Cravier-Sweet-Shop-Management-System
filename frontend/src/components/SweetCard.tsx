
// Visual representation of a product. Calculates real-time availability by checking warehouse stock against the customer's current cart.

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import type { Sweet } from '@/types/sweet';
import { ShoppingCart, Package, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SweetCardProps {
  sweet: Sweet;
}

/**
   * INVENTORY CHECK:
   * Calculates "Real-Time Availability" by subtracting items currently 
   * sitting in the customer's cart from the total warehouse stock.
   */

// Define category colors for badges
const categoryColors: Record<string, string> = {
  Chocolates: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  Candies: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  Cakes: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  Cookies: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  Pastries: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'Ice Cream': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  Traditional: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
};
// SweetCard Component
export function SweetCard({ sweet }: SweetCardProps) {
  const { addToCart, items } = useCart();
  const { isAdmin } = useAuth(); // Get Admin status
  
  const cartItem = items.find(item => item.sweet.id === sweet.id);
  const availableStock = sweet.quantity - (cartItem?.quantity || 0);
  const isOutOfStock = availableStock <= 0;
  const isLowStock = availableStock > 0 && availableStock <= 5;

  const handleAddToCart = () => {
    if (availableStock > 0) {
      addToCart(sweet);
    }
  };

  return (
    <div className={cn(
      "group rounded-2xl bg-card overflow-hidden transition-all duration-300",
      "sweet-shadow hover:sweet-shadow-hover hover:-translate-y-1",
      isOutOfStock && "opacity-75"
    )}>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={sweet.image}
          alt={sweet.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Category Badge */}
        <Badge 
          className={cn(
            "absolute top-3 left-3 font-medium",
            categoryColors[sweet.category] || 'bg-muted text-muted-foreground'
          )}
        >
          {sweet.category}
        </Badge>

        {/* Stock Status */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center gap-2 text-destructive font-medium">
              <AlertCircle className="w-5 h-5" />
              Out of Stock
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {sweet.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {sweet.description}
          </p>
        </div>

        {/* Stock Indicator */}
        <div className="flex items-center gap-2">
          <Package className={cn(
            "w-4 h-4",
            isOutOfStock ? "text-destructive" : isLowStock ? "text-warning" : "text-success"
          )} />
          <span className={cn(
            "text-sm font-medium",
            isOutOfStock ? "text-destructive" : isLowStock ? "text-warning" : "text-success"
          )}>
            {isOutOfStock ? 'Out of Stock' : `${availableStock} available`}
            {isLowStock && !isOutOfStock && ' (Low)'}
          </span>
          {cartItem && !isAdmin && ( // Hide "in cart" text for admin too
            <span className="text-xs text-primary font-medium">
              ({cartItem.quantity} in cart)
            </span>
          )}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="text-xl font-bold text-primary">
            {sweet.price.toFixed(2)}/-
          </div>
          
          {/* HIDE BUTTON IF ADMIN */}
          {!isAdmin && (
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              size="sm"
              className="gap-2 rounded-xl"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}