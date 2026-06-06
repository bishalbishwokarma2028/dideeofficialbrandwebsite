import { useState, useEffect } from "react";
import { useCreateOrder, useGetCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useCartContext } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, ShoppingBag, ChevronRight } from "lucide-react";

const NEPAL_DISTRICTS = [
  "Achham","Arghakhanchi","Baglung","Baitadi","Bajhang","Bajura","Banke","Bara","Bardiya",
  "Bhaktapur","Bhojpur","Chitwan","Dadeldhura","Dailekh","Dang","Darchula","Dhading",
  "Dhankuta","Dhanusa","Dolakha","Dolpa","Doti","Eastern Rukum","Gorkha","Gulmi",
  "Humla","Ilam","Jajarkot","Jhapa","Jumla","Kailali","Kalikot","Kanchanpur","Kapilvastu",
  "Kaski","Kathmandu","Kavrepalanchok","Khotang","Lalitpur","Lamjung","Mahottari",
  "Makwanpur","Manang","Morang","Mugu","Mustang","Myagdi","Nawalpur","Nawalparasi East",
  "Nawalparasi West","Nuwakot","Okhaldhunga","Palpa","Panchthar","Parbat","Parsa",
  "Pyuthan","Ramechhap","Rasuwa","Rautahat","Rolpa","Rukum West","Rupandehi","Salyan",
  "Sankhuwasabha","Saptari","Sarlahi","Sindhuli","Sindhupalchok","Siraha","Solukhumbu",
  "Sunsari","Surkhet","Syangja","Tanahu","Taplejung","Tehrathum","Udayapur"
];

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { sessionId } = useCartContext();
  const { authenticated, loading: authLoading, user } = useCustomerAuth();
  const { toast } = useToast();

  const { data: cart, isLoading: cartLoading } = useGetCart({ sessionId }, {
    query: { enabled: !!sessionId, queryKey: getGetCartQueryKey({ sessionId }) }
  });

  const createOrderMutation = useCreateOrder();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    district: "",
    city: "",
    landmark: "",
    paymentMethod: "cod",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || prev.customerName,
        customerEmail: user.email || prev.customerEmail,
        customerPhone: user.phone || prev.customerPhone,
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) return;
    if (!authenticated) { setLocation("/login"); return; }

    createOrderMutation.mutate({
      data: {
        ...formData,
        district: formData.district,
        landmark: formData.landmark || undefined,
        notes: formData.notes || undefined,
        items: cart.items.map(item => ({
          productId: item.productId,
          variantId: item.variantId || undefined,
          quantity: item.quantity,
          price: item.price,
        })),
      } as any
    }, {
      onSuccess: (order) => {
        toast({
          title: "Order Placed!",
          description: `Order #${order.id} confirmed. We'll contact you shortly.`,
        });
        setLocation("/account");
      },
      onError: (err: any) => {
        toast({
          title: "Order Failed",
          description: err?.message ?? "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#C9A86A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[#C9A86A]" />
          </div>
          <h1 className="font-serif text-3xl mb-3">Sign in to Checkout</h1>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            You need to be logged in to place an order. Sign in or create a free account to continue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login">
              <Button className="w-full sm:w-auto rounded-none bg-foreground text-background hover:bg-[#C9A86A] transition-colors tracking-widest uppercase text-xs px-8 py-3 h-auto">
                Sign In
              </Button>
            </Link>
            <Link href="/login?tab=register">
              <Button variant="outline" className="w-full sm:w-auto rounded-none tracking-widest uppercase text-xs px-8 py-3 h-auto">
                Create Account
              </Button>
            </Link>
          </div>
          <div className="mt-6">
            <Link href="/cart" className="text-xs text-muted-foreground underline hover:text-foreground transition-colors flex items-center justify-center gap-1">
              <ChevronRight className="w-3 h-3 rotate-180" /> Back to Cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <ShoppingBag className="w-12 h-12 opacity-30" />
        <p className="font-serif text-xl">Your cart is empty</p>
        <Link href="/shop">
          <Button className="rounded-none tracking-widest uppercase text-sm">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  const shipping = cart.subtotal >= 3000 ? 0 : 100;

  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="container mx-auto px-4 max-w-6xl">

        <div className="mb-10 flex items-center gap-3 text-xs text-muted-foreground">
          <Link href="/cart" className="hover:text-foreground transition-colors">Cart</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Checkout</span>
        </div>

        <h1 className="font-serif text-4xl mb-10">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
          <div className="lg:w-3/5">
            <form onSubmit={handleSubmit} className="space-y-10">

              {/* Contact Info */}
              <section className="space-y-5">
                <h2 className="text-xs font-semibold tracking-[0.25em] uppercase border-b border-border pb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input required name="customerName" value={formData.customerName} onChange={handleChange}
                      placeholder="Your full name"
                      className="rounded-none border-border focus-visible:ring-0 focus-visible:border-foreground h-11" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input required type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange}
                      placeholder="your@email.com"
                      className="rounded-none border-border focus-visible:ring-0 focus-visible:border-foreground h-11" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Input required name="customerPhone" value={formData.customerPhone} onChange={handleChange}
                      placeholder="+977-98XXXXXXXX"
                      className="rounded-none border-border focus-visible:ring-0 focus-visible:border-foreground h-11" />
                    <p className="text-xs text-muted-foreground mt-1.5">We'll call this number for delivery confirmation.</p>
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="space-y-5">
                <h2 className="text-xs font-semibold tracking-[0.25em] uppercase border-b border-border pb-4">
                  Delivery Address
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
                      Street / Area <span className="text-red-500">*</span>
                    </label>
                    <Input required name="shippingAddress" value={formData.shippingAddress} onChange={handleChange}
                      placeholder="Street, tole, or area name"
                      className="rounded-none border-border focus-visible:ring-0 focus-visible:border-foreground h-11" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
                        District <span className="text-red-500">*</span>
                      </label>
                      <select required name="district" value={formData.district} onChange={handleChange}
                        className="w-full border border-border bg-background px-3 h-11 text-sm focus:outline-none focus:border-foreground transition-colors">
                        <option value="">Select District</option>
                        {NEPAL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
                        City / Municipality <span className="text-red-500">*</span>
                      </label>
                      <Input required name="city" value={formData.city} onChange={handleChange}
                        placeholder="e.g. Kathmandu, Pokhara"
                        className="rounded-none border-border focus-visible:ring-0 focus-visible:border-foreground h-11" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
                      Nearest Landmark
                    </label>
                    <Input name="landmark" value={formData.landmark} onChange={handleChange}
                      placeholder="e.g. Near XYZ school, opposite ABC hospital"
                      className="rounded-none border-border focus-visible:ring-0 focus-visible:border-foreground h-11" />
                    <p className="text-xs text-muted-foreground mt-1.5">Helps our delivery team find you faster.</p>
                  </div>
                </div>
              </section>

              {/* Payment */}
              <section className="space-y-5">
                <h2 className="text-xs font-semibold tracking-[0.25em] uppercase border-b border-border pb-4">
                  Payment Method <span className="text-red-500">*</span>
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "cod", label: "Cash on Delivery", icon: "💵" },
                    { id: "esewa", label: "eSewa", icon: "💚" },
                    { id: "khalti", label: "Khalti", icon: "💜" },
                    { id: "card", label: "Credit / Debit Card", icon: "💳" },
                  ].map(method => (
                    <label key={method.id}
                      className={`border p-4 cursor-pointer flex items-center gap-3 transition-colors select-none ${formData.paymentMethod === method.id ? "border-foreground bg-neutral-bg" : "border-border hover:border-foreground/50"}`}>
                      <input type="radio" name="paymentMethod" value={method.id}
                        checked={formData.paymentMethod === method.id} onChange={handleChange}
                        className="accent-foreground shrink-0" />
                      <span className="text-sm font-medium leading-tight">{method.icon} {method.label}</span>
                    </label>
                  ))}
                </div>
                {formData.paymentMethod === "cod" && (
                  <p className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 px-4 py-3">
                    For Cash on Delivery — please have exact change ready. Our delivery partner will collect payment.
                  </p>
                )}
              </section>

              {/* Order Notes */}
              <section className="space-y-3">
                <h2 className="text-xs font-semibold tracking-[0.25em] uppercase border-b border-border pb-4">
                  Order Notes <span className="text-muted-foreground font-normal">(optional)</span>
                </h2>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3}
                  placeholder="Any special instructions for delivery or the order..."
                  className="w-full border border-border bg-background px-3 py-3 text-sm focus:outline-none focus:border-foreground transition-colors resize-none" />
              </section>

              <Button
                type="submit"
                disabled={createOrderMutation.isPending}
                className="w-full h-14 rounded-none tracking-widest uppercase text-sm bg-foreground text-background hover:bg-[#C9A86A] hover:text-white transition-colors disabled:opacity-60"
              >
                {createOrderMutation.isPending
                  ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Placing Order…</>
                  : "Place Order"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By placing your order you agree to our terms. Fields marked <span className="text-red-500">*</span> are required.
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-2/5">
            <div className="bg-neutral-bg p-6 sm:p-8 sticky top-24">
              <h2 className="font-serif text-2xl mb-6 border-b border-border/50 pb-4">Your Order</h2>

              <div className="space-y-4 mb-6 border-b border-border/50 pb-6 max-h-[40vh] overflow-y-auto pr-1">
                {cart.items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-14 h-18 sm:w-16 sm:h-20 shrink-0 bg-background relative">
                      <img src={item.product?.images?.[0] || "/images/product-2.png"} alt={item.product?.name}
                        className="w-full h-full object-cover" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background text-xs flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 text-sm">
                      <p className="font-medium line-clamp-2">{item.product?.name}</p>
                      {item.variant && (
                        <p className="text-muted-foreground text-xs mt-1">
                          {[item.variant.size && `Size: ${item.variant.size}`, item.variant.color && `Color: ${item.variant.color}`].filter(Boolean).join(" / ")}
                        </p>
                      )}
                    </div>
                    <div className="text-sm font-medium shrink-0">
                      NPR {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm mb-6 border-b border-border/50 pb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">NPR {cart.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? "Free" : `NPR ${shipping}`}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600">Free shipping on orders above NPR 3,000!</p>
                )}
              </div>

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>NPR {(cart.subtotal + shipping).toLocaleString()}</span>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-muted-foreground mt-3">
                  Add NPR {(3000 - cart.subtotal).toLocaleString()} more for free shipping.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
