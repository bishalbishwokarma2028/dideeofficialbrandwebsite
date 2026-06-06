import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2, ArrowRight, Lock, LogIn } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCartContext } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";

export default function Wishlist() {
  const { items, remove, clear } = useWishlist();
  const { addItem } = useCartContext();
  const { authenticated, loading } = useCustomerAuth();
  const [, navigate] = useLocation();

  async function moveToCart(item: typeof items[0]) {
    await addItem(item.id, 1);
    remove(item.id);
  }

  // Show loading skeleton while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A86A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Auth wall — redirect unauthenticated users
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#F5F3EF]">
        <div className="bg-[#0A0A0A] text-white py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] tracking-[0.5em] uppercase text-white/40 mb-4 font-black">
              My Wishlist
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-serif text-5xl md:text-6xl font-medium">
              Saved for Later
            </motion.h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="w-24 h-24 rounded-full bg-white border-2 border-[#C9A86A]/20 flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Lock className="w-10 h-10 text-[#C9A86A]/60" />
            </div>
            <h2 className="font-serif text-3xl mb-4">Sign in to use your Wishlist</h2>
            <p className="text-muted-foreground leading-relaxed mb-10 max-w-sm mx-auto">
              Create a free account or sign in to save your favourite DIDEE pieces and access your wishlist from any device.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-[#0A0A0A] text-white px-10 py-4 text-[11px] font-black tracking-[0.25em] uppercase hover:bg-[#C9A86A] transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                href="/login?tab=register"
                className="inline-flex items-center justify-center gap-2 border border-[#0A0A0A] px-10 py-4 text-[11px] font-black tracking-[0.25em] uppercase hover:bg-[#0A0A0A] hover:text-white transition-colors"
              >
                Create Account
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-8">
              Continue browsing?{" "}
              <Link href="/shop" className="underline hover:text-[#C9A86A] transition-colors font-medium">
                Explore the shop
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      {/* Header */}
      <div className="bg-[#0A0A0A] text-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] tracking-[0.5em] uppercase text-white/40 mb-4 font-black">
            My Wishlist
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-serif text-5xl md:text-6xl font-medium">
            Saved for Later
          </motion.h1>
          {items.length > 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/50 mt-3 text-sm">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </motion.p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-white border-2 border-border flex items-center justify-center mx-auto mb-8">
              <Heart className="w-9 h-9 text-muted-foreground/30" />
            </div>
            <h2 className="font-serif text-3xl mb-3">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed">
              Save items you love by clicking the heart icon on any product. They'll appear here for easy access later.
            </p>
            <Link href="/shop" className="inline-flex items-center gap-3 bg-[#0A0A0A] text-white px-10 py-4 text-[11px] font-black tracking-[0.25em] uppercase hover:bg-[#C9A86A] transition-colors">
              Browse Collection <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <button onClick={clear} className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5 font-medium uppercase tracking-widest">
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border border-border group relative overflow-hidden"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
                      <Link href={`/products/${item.slug}`}>
                        <img
                          src={item.images[0] ?? "/images/product-2.png"}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>
                      {item.isNew && (
                        <span className="absolute top-3 left-3 bg-[#0A0A0A] text-white text-[10px] font-black px-2.5 py-1 tracking-widest uppercase">NEW</span>
                      )}
                      {item.comparePrice && item.comparePrice > item.price && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 tracking-widest uppercase">SALE</span>
                      )}
                      <button
                        onClick={() => remove(item.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                        aria-label="Remove from wishlist"
                      >
                        <Heart className="w-4 h-4 fill-[#C9A86A] text-[#C9A86A]" />
                      </button>
                    </div>

                    <div className="p-5">
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="font-medium text-sm mb-1 hover:text-[#C9A86A] transition-colors">{item.name}</h3>
                      </Link>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm font-medium text-foreground">NPR {item.price.toLocaleString()}</span>
                        {item.comparePrice && item.comparePrice > item.price && (
                          <span className="text-xs text-muted-foreground line-through">NPR {item.comparePrice.toLocaleString()}</span>
                        )}
                      </div>
                      <button
                        onClick={() => moveToCart(item)}
                        className="w-full flex items-center justify-center gap-2 bg-[#0A0A0A] text-white py-3 text-[11px] font-black tracking-[0.2em] uppercase hover:bg-[#C9A86A] transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="text-center mt-16">
              <Link href="/shop" className="inline-flex items-center gap-3 border border-[#0A0A0A] px-10 py-4 text-[11px] font-black tracking-[0.25em] uppercase hover:bg-[#0A0A0A] hover:text-white transition-colors">
                Continue Shopping <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
