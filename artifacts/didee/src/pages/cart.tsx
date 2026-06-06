import { useGetCart, getGetCartQueryKey, useRemoveCartItem, useUpdateCartItem } from "@workspace/api-client-react";
import { useCartContext } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Cart() {
  const { sessionId } = useCartContext();
  const { authenticated, loading: authLoading } = useCustomerAuth();

  const { data: cart, isLoading } = useGetCart({ sessionId }, {
    query: { enabled: !!sessionId, queryKey: getGetCartQueryKey({ sessionId }) }
  });

  const removeMutation = useRemoveCartItem();
  const updateMutation = useUpdateCartItem();

  const handleRemove = (itemId: number) => {
    removeMutation.mutate({ itemId });
  };

  const handleUpdateQuantity = (itemId: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    updateMutation.mutate({ itemId, data: { quantity: newQuantity } });
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="font-serif text-3xl sm:text-4xl mb-10 sm:mb-12">Your Cart</h1>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">Loading your cart…</div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="text-center py-20 border border-border">
            <h2 className="font-serif text-2xl mb-4">Your cart is empty</h2>
            <Link href="/shop">
              <Button className="rounded-none tracking-widest uppercase text-sm">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
            <div className="lg:w-2/3 space-y-6 sm:space-y-8">
              {cart.items.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  key={item.id}
                  className="flex gap-4 sm:gap-6 border-b border-border pb-6 sm:pb-8"
                >
                  <Link href={`/products/${item.product?.slug}`} className="w-20 h-28 sm:w-24 sm:h-32 shrink-0 bg-neutral-bg">
                    <img src={item.product?.images?.[0] || "/images/product-2.png"} alt={item.product?.name}
                      className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between gap-2 mb-1.5">
                        <Link href={`/products/${item.product?.slug}`}
                          className="font-medium text-sm sm:text-base hover:text-[#C9A86A] transition-colors line-clamp-2">
                          {item.product?.name}
                        </Link>
                        <span className="font-medium text-sm shrink-0">NPR {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                      {item.variant && (
                        <div className="text-xs sm:text-sm text-muted-foreground flex gap-3">
                          {item.variant.size && <span>Size: {item.variant.size}</span>}
                          {item.variant.color && <span>Color: {item.variant.color}</span>}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">NPR {item.price.toLocaleString()} each</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border">
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                          disabled={updateMutation.isPending || item.quantity <= 1}
                          className="px-2.5 sm:px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 sm:px-4 py-1.5 text-sm font-medium border-x border-border">{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          disabled={updateMutation.isPending}
                          className="px-2.5 sm:px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button onClick={() => handleRemove(item.id)} disabled={removeMutation.isPending}
                        className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1.5 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:w-1/3">
              <div className="bg-neutral-bg p-6 sm:p-8 lg:sticky lg:top-24">
                <h2 className="font-serif text-xl sm:text-2xl mb-6">Order Summary</h2>
                <div className="space-y-3 text-sm mb-6 border-b border-border/50 pb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({cart.itemCount} items)</span>
                    <span className="font-medium">NPR {cart.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-xs">
                      {cart.subtotal >= 3000
                        ? <span className="text-green-600 font-medium">Free</span>
                        : "NPR 100"}
                    </span>
                  </div>
                  {cart.subtotal < 3000 && (
                    <p className="text-xs text-muted-foreground">
                      Add NPR {(3000 - cart.subtotal).toLocaleString()} more for free shipping.
                    </p>
                  )}
                </div>
                <div className="flex justify-between text-base sm:text-lg font-semibold mb-8">
                  <span>Estimated Total</span>
                  <span>NPR {(cart.subtotal + (cart.subtotal >= 3000 ? 0 : 100)).toLocaleString()}</span>
                </div>

                {authenticated ? (
                  <Link href="/checkout" className="block">
                    <Button className="w-full h-12 sm:h-14 rounded-none tracking-widest uppercase text-sm bg-foreground text-background hover:bg-[#C9A86A] hover:text-white transition-colors flex items-center justify-center gap-2">
                      Proceed to Checkout <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link href="/login" className="block">
                      <Button className="w-full h-12 sm:h-14 rounded-none tracking-widest uppercase text-sm bg-foreground text-background hover:bg-[#C9A86A] hover:text-white transition-colors flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4" /> Sign in to Checkout
                      </Button>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground">
                      You need an account to place an order.{" "}
                      <Link href="/login?tab=register" className="underline hover:text-foreground transition-colors">Create one free →</Link>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
