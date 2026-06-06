import { useState, useEffect, useRef } from "react";
import { useGetProduct, getGetProductQueryKey, useGetRelatedProducts, getGetRelatedProductsQueryKey, useAddToCart } from "@workspace/api-client-react";
import { useParams, useLocation } from "wouter";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { motion, useInView } from "framer-motion";
import { Star, ShieldCheck, Truck, RotateCcw, Heart, CheckCircle, Lock } from "lucide-react";

// Animated counter hook
function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const steps = 60;
    const increment = target / steps;
    const stepMs = duration / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, stepMs);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { count, ref };
}

// Static review stats for the brand review section
const BRAND_STATS = [
  { label: "Happy Customers", value: 2847 },
  { label: "Reviews", value: 1203 },
  { label: "5-Star Ratings", value: 986 },
  { label: "Countries Shipped", value: 14 },
];

const SAMPLE_REVIEWS = [
  {
    name: "Priya M.",
    rating: 5,
    location: "Kathmandu",
    date: "May 2025",
    tag: "Streetwear Set",
    text: "The quality is unreal for the price. I've worn it 20 times and it still looks brand new. DIDEE is the real deal.",
    helpful: 24,
  },
  {
    name: "Rajan K.",
    rating: 4,
    location: "Pokhara",
    date: "Apr 2025",
    tag: "Wide-Leg Denim",
    text: "Finally a Nepali brand that competes with international labels. Craftsmanship is top-tier. Would give 5 stars if delivery was a bit faster, but absolutely worth it.",
    helpful: 18,
  },
  {
    name: "Anisha T.",
    rating: 5,
    location: "Biratnagar",
    date: "Apr 2025",
    tag: "Dark Accessories Set",
    text: "Ordered the streetwear set and got so many compliments. The accessories are heavy and well-made — not cheap plastic. Fast delivery too, arrived in 2 days.",
    helpful: 31,
  },
  {
    name: "Saurav B.",
    rating: 5,
    location: "Lalitpur",
    date: "Mar 2025",
    tag: "Wide-Leg Denim",
    text: "DIDEE is everything. The wide-leg denim fits perfectly and the fabric weight is exactly as described. Size chart is accurate too.",
    helpful: 14,
  },
  {
    name: "Nisha G.",
    rating: 4,
    location: "Bhaktapur",
    date: "Mar 2025",
    tag: "Crop Top",
    text: "Love the aesthetic and the fit. The color is exactly as shown in photos. Took off one star because I wish the size range went a bit larger, but the cut is incredible.",
    helpful: 9,
  },
  {
    name: "Aarav S.",
    rating: 5,
    location: "Kathmandu",
    date: "Feb 2025",
    tag: "Chain Set",
    text: "The chain accessories are genuinely heavy-weight silver-tone, not the cheap stuff. I've had mine for 3 months and it hasn't tarnished at all. Insane value.",
    helpful: 22,
  },
];

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`${sz} ${i <= rating ? "fill-[#C9A86A] text-[#C9A86A]" : "fill-border text-border"}`} />
      ))}
    </div>
  );
}

function AnimatedStat({ label, value }: { label: string; value: number }) {
  const { count, ref } = useCountUp(value);
  return (
    <div className="text-center py-6">
      <span ref={ref} className="text-4xl md:text-5xl font-bold font-serif block mb-2">
        {count.toLocaleString()}
      </span>
      <p className="text-xs font-black tracking-[0.2em] uppercase text-muted-foreground">{label}</p>
    </div>
  );
}

export default function ProductShow() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";
  const { sessionId } = useCartContext();
  const { authenticated } = useCustomerAuth();
  const { isWishlisted, toggle: toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);

  const { data: product, isLoading } = useGetProduct(slug, {
    query: { enabled: !!slug, queryKey: getGetProductQueryKey(slug) }
  });

  const { data: relatedProducts } = useGetRelatedProducts(slug, {
    query: { enabled: !!slug, queryKey: getGetRelatedProductsQueryKey(slug) }
  });

  const addToCartMutation = useAddToCart();
  const wishlisted = product ? isWishlisted(product.id) : false;

  const handleAddToCart = () => {
    if (!authenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
      });
      navigate("/login");
      return;
    }
    if (!product) return;
    if (!selectedSize && product.variants?.some(v => v.size)) {
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }
    const variant = product.variants?.find(v =>
      (!selectedSize || v.size === selectedSize) && (!selectedColor || v.color === selectedColor)
    );
    addToCartMutation.mutate({
      data: { sessionId, productId: product.id, variantId: variant?.id, quantity: 1 }
    }, {
      onSuccess: () => toast({ title: "Added to cart", description: `${product.name} has been added to your cart.` })
    });
  };

  const handleWishlist = () => {
    if (!authenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save items to your wishlist.",
      });
      navigate("/login");
      return;
    }
    if (!product) return;
    toggleWishlist({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.comparePrice,
      images: product.images ?? [],
      isNew: product.isNew ?? false,
    });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground text-sm tracking-widest uppercase">Loading...</div></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Product not found</div>;

  const sizes = [...new Set(product.variants?.map(v => v.size).filter(Boolean) as string[])];
  const colors = [...new Set(product.variants?.map(v => v.color).filter(Boolean) as string[])];

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="flex flex-col lg:flex-row">
        {/* Images */}
        <div className="lg:w-3/5">
          {/* Main image */}
          <div className="aspect-[3/4] md:aspect-[4/5] lg:aspect-auto lg:h-[90vh] overflow-hidden bg-neutral-bg relative">
            {product.images?.length ? (
              <motion.img
                key={activeImg}
                src={product.images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
            )}
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-[#C9A86A] text-white text-[10px] font-black px-3 py-1.5 tracking-widest uppercase">New</span>
            )}
            {product.isBestSeller && (
              <span className="absolute top-4 right-4 bg-black text-white text-[10px] font-black px-3 py-1.5 tracking-widest uppercase">Best Seller</span>
            )}
          </div>
          {/* Thumbnail strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 p-3 bg-background overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`shrink-0 w-20 h-24 overflow-hidden border-2 transition-colors ${i === activeImg ? "border-foreground" : "border-transparent hover:border-border"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info sidebar */}
        <div className="lg:w-2/5 px-6 md:px-10 lg:px-14 py-10 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <div className="max-w-md">
            {/* Breadcrumb */}
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-black mb-6">
              {product.collectionSlug || "DIDEE"} {product.categorySlug ? `/ ${product.categorySlug}` : ""}
            </p>

            <h1 className="font-serif text-4xl md:text-5xl mb-5 leading-tight">{product.name}</h1>

            {/* Rating preview */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-[#C9A86A] text-[#C9A86A]" />)}
              </div>
              <span className="text-xs text-muted-foreground font-bold">(124 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-10">
              <span className="text-2xl font-bold">NPR {product.price.toLocaleString()}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <>
                  <span className="line-through text-muted-foreground text-base">NPR {product.comparePrice.toLocaleString()}</span>
                  <span className="text-xs font-black text-green-600 bg-green-50 px-2 py-0.5">
                    Save NPR {(product.comparePrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Color */}
            {colors.length > 0 && (
              <div className="mb-8">
                <div className="text-[11px] font-black tracking-widest uppercase mb-4">Color: <span className="text-muted-foreground font-medium">{selectedColor || "Select"}</span></div>
                <div className="flex flex-wrap gap-3">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color === selectedColor ? null : color)}
                      className={`h-9 w-9 rounded-full border-2 transition-all ${selectedColor === color ? "ring-2 ring-foreground ring-offset-2 border-foreground" : "border-border hover:border-foreground"}`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-[11px] font-black tracking-widest uppercase">Size: <span className="text-muted-foreground font-medium">{selectedSize || "Select"}</span></div>
                  <button className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">Size Guide</button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                      className={`py-3 text-sm font-bold border-2 transition-all ${selectedSize === size ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-3 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
                className="flex-1 h-14 bg-foreground text-background hover:bg-[#C9A86A] rounded-none text-[11px] tracking-widest uppercase font-black"
              >
                {!authenticated
                  ? <><Lock className="w-3.5 h-3.5 mr-2" />Sign In to Buy</>
                  : addToCartMutation.isPending ? "Adding..." : "Add to Cart"
                }
              </Button>
              <button
                onClick={handleWishlist}
                title={authenticated ? (wishlisted ? "Remove from wishlist" : "Add to wishlist") : "Sign in to wishlist"}
                className={`w-14 h-14 border-2 flex items-center justify-center transition-all ${wishlisted ? "border-[#C9A86A] bg-[#C9A86A]/5" : "border-border hover:border-foreground"}`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-[#C9A86A] text-[#C9A86A]" : "text-muted-foreground"}`} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mb-10 py-5 border-t border-b border-border">
              <div className="text-center">
                <ShieldCheck className="w-5 h-5 mx-auto mb-1.5 text-[#C9A86A]" />
                <p className="text-[10px] font-black tracking-wide uppercase text-muted-foreground">Authentic</p>
              </div>
              <div className="text-center">
                <Truck className="w-5 h-5 mx-auto mb-1.5 text-[#C9A86A]" />
                <p className="text-[10px] font-black tracking-wide uppercase text-muted-foreground">Fast Delivery</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-5 h-5 mx-auto mb-1.5 text-[#C9A86A]" />
                <p className="text-[10px] font-black tracking-wide uppercase text-muted-foreground">Easy Returns</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6 text-sm text-muted-foreground">
              {product.description && (
                <div>
                  <h4 className="text-foreground font-black mb-2 tracking-widest uppercase text-[11px]">Description</h4>
                  <p className="leading-relaxed">{product.description}</p>
                </div>
              )}
              <div className="pt-4 border-t border-border">
                <h4 className="text-foreground font-black mb-2 tracking-widest uppercase text-[11px]">Details & Care</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Premium heavy-weight fabric</li>
                  <li>Handcrafted and made in Nepal</li>
                  <li>Machine wash cold, lay flat to dry</li>
                  <li>Do not bleach or tumble dry</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-border">
                <h4 className="text-foreground font-black mb-2 tracking-widest uppercase text-[11px]">Shipping</h4>
                <p>Free shipping within Kathmandu Valley on orders over NPR 5,000. Standard delivery 2–3 business days. Pan-Nepal delivery available.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Review Stats — Animated counters */}
      <div className="border-t border-b border-border bg-[#F5F3EF] mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {BRAND_STATS.map((stat) => (
              <AnimatedStat key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="container mx-auto px-4 py-24">
        <div className="mb-14">
          <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground font-black mb-3">What Customers Say</p>
          <h2 className="font-serif text-4xl md:text-5xl font-medium mb-10">Customer Reviews</h2>

          {/* Rating Summary Panel */}
          <div className="bg-[#F5F3EF] border border-border p-8 flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Score */}
            <div className="text-center shrink-0">
              <p className="font-serif text-7xl font-medium text-foreground leading-none mb-2">4.8</p>
              <StarRating rating={5} size="lg" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-2 font-black">out of 5</p>
              <p className="text-xs text-muted-foreground mt-1">Based on 1,203 reviews</p>
            </div>

            <div className="w-px h-24 bg-border hidden md:block self-center" />

            {/* Bar breakdown */}
            <div className="flex-1 w-full space-y-2.5">
              {[
                { stars: 5, pct: 72, count: 866 },
                { stars: 4, pct: 22, count: 265 },
                { stars: 3, pct: 4,  count: 48 },
                { stars: 2, pct: 1,  count: 12 },
                { stars: 1, pct: 1,  count: 12 },
              ].map(({ stars, pct, count }) => (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16 shrink-0">
                    <span className="text-xs font-bold text-muted-foreground">{stars}</span>
                    <Star className="w-3.5 h-3.5 fill-[#C9A86A] text-[#C9A86A]" />
                  </div>
                  <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: (5 - stars) * 0.1 }}
                      className="h-full bg-[#C9A86A] rounded-full"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-10 text-right">{count}</span>
                </div>
              ))}
            </div>

            <div className="w-px h-24 bg-border hidden md:block self-center" />

            {/* Category ratings */}
            <div className="shrink-0 space-y-3 min-w-[160px]">
              {[
                { label: "Quality", score: 4.9 },
                { label: "Fit & Sizing", score: 4.7 },
                { label: "Value", score: 4.8 },
                { label: "Delivery", score: 4.6 },
              ].map(({ label, score }) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-[#C9A86A] rounded-full" style={{ width: `${(score / 5) * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold">{score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review cards — 2 col on desktop, 3 col on xl */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {SAMPLE_REVIEWS.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.07 }}
              className="border border-border bg-background hover:border-[#C9A86A]/40 hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {/* Card header — gold accent bar */}
              <div className="h-0.5 bg-gradient-to-r from-[#C9A86A] to-transparent" />

              <div className="p-6 flex flex-col flex-1">
                {/* Stars + product tag */}
                <div className="flex items-start justify-between mb-4 gap-3">
                  <StarRating rating={review.rating} />
                  <span className="text-[9px] font-black tracking-widest uppercase border border-border px-2 py-1 text-muted-foreground shrink-0">
                    {review.tag}
                  </span>
                </div>

                {/* Review text */}
                <p className="text-sm text-foreground/75 leading-relaxed flex-1 mb-5">
                  "{review.text}"
                </p>

                {/* Footer */}
                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 ${
                      review.rating === 5 ? "bg-[#0A0A0A]" : "bg-[#4A4A4A]"
                    }`}>
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{review.name}</p>
                      <p className="text-[11px] text-muted-foreground">{review.location} · {review.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span className="text-[9px] font-black tracking-wider uppercase text-green-600">Verified</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{review.helpful} found helpful</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load more */}
        <div className="text-center mt-12">
          <button className="border border-border px-10 py-3.5 text-[11px] font-black tracking-[0.3em] uppercase hover:border-foreground hover:bg-[#F5F3EF] transition-all">
            Load More Reviews
          </button>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 border-t border-border pt-20">
          <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground font-black mb-3 text-center">You May Also Like</p>
          <h2 className="font-serif text-4xl font-medium mb-12 text-center">Complete the Look</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-8 sm:gap-y-12">
            {relatedProducts.slice(0, 4).map((rp, index) => (
              <ProductCard key={rp.id} product={rp} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
