import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetDescription } from '@/components/ui/sheet';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Plus, Minus, Trash2, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Cart() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, checkout, isCheckingOut, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckout = async () => {
    await checkout();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-xl">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center animate-in zoom-in">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Shopping Cart
            {totalItems > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({totalItems} item{totalItems !== 1 ? 's' : ''})
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
      View and manage items in your shopping cart
        </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground text-sm">
              Add some sweet treats to get started!
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.sweet.id}
                  className="flex gap-3 p-3 rounded-xl bg-muted/50 border border-border/50"
                >
                  <img
                    src={item.sweet.image}
                    alt={item.sweet.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-1">{item.sweet.name}</h4>
                    <p className="text-primary font-semibold">{item.sweet.price.toFixed(2)}/-</p>
                    <p className="text-xs text-muted-foreground">
                      Stock: {item.sweet.quantity}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => updateQuantity(item.sweet.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => updateQuantity(item.sweet.id, item.quantity + 1)}
                        disabled={item.quantity >= item.sweet.quantity}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeFromCart(item.sweet.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <SheetFooter className="flex-col gap-3 border-t pt-4">
              <div className="w-full flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-primary">{totalPrice.toFixed(2)}/-</span>
              </div>
              
              <div className="w-full flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={clearCart}
                  disabled={isCheckingOut}
                >
                  Clear Cart
                </Button>
                <Button
                  className="flex-1 rounded-xl gradient-primary"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Processing...
                    </>
                  ) : (
                    'Checkout'
                  )}
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
