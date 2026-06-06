import { Link, useLocation } from "wouter";
import { Product } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : "/images/product-2.png";
  const hoverImageUrl = product.images && product.images.length > 1 ? product.images[1] : imageUrl;
  const { isWishlisted, toggle } = useWishlist();
  const { authenticated } = useCustomerAuth();
  const wishlisted = isWishlisted(product.id);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!authenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save items to your wishlist.",
      });
      navigate("/login");
      return;
    }

    toggle({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.comparePrice,
      images: product.images ?? [],
      isNew: product.isNew,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-bg mb-4">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <img
            src={hoverImageUrl}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          {product.isNew && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-black px-2.5 py-1 tracking-widest uppercase">
              New
            </div>
          )}
          {product.comparePrice && product.comparePrice > product.price && (
            <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-[10px] font-black px-2.5 py-1 tracking-widest uppercase">
              Sale
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm border transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 ${wishlisted ? "border-[#C9A86A]" : "border-transparent hover:border-[#C9A86A]"}`}
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-200 ${wishlisted ? "fill-[#C9A86A] text-[#C9A86A]" : "text-foreground"}`}
            />
          </button>

          {/* Quick view overlay on hover */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="bg-white/95 backdrop-blur-sm py-3 text-center text-[11px] font-black tracking-[0.2em] uppercase text-foreground hover:bg-[#C9A86A] hover:text-white transition-colors">
              Quick View
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <h3 className="font-medium text-sm tracking-wide group-hover:text-[#C9A86A] transition-colors">{product.name}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className={product.comparePrice && product.comparePrice > product.price ? "text-destructive font-semibold" : "text-foreground font-medium"}>
              NPR {product.price.toLocaleString()}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="line-through text-muted-foreground text-xs">NPR {product.comparePrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
