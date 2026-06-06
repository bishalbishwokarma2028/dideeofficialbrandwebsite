import { useState, FormEvent, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, LogOut, Package, Plus, Trash2, Check, Loader2, MessageCircle, Clock, ChevronRight, AlertCircle, XCircle } from "lucide-react";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { apiUrl } from "@/lib/api";

type Tab = "orders" | "messages" | "profile" | "addresses" | "logout";

type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  district: string;
  isDefault: boolean;
};

type OrderItem = {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  size: string | null;
  color: string | null;
};

type Order = {
  id: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  total: number;
  subtotal: number;
  shippingCost: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string | null;
  district: string | null;
  city: string | null;
  landmark: string | null;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
};

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  adminReply: string | null;
  repliedAt: string | null;
  createdAt: string;
};

const ADDRESSES_KEY = "didee_addresses";

function loadAddresses(): Address[] {
  try { return JSON.parse(localStorage.getItem(ADDRESSES_KEY) ?? "[]"); }
  catch { return []; }
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: "Pending",    color: "#B45309", bg: "#FEF3C7" },
  confirmed:  { label: "Confirmed",  color: "#1D4ED8", bg: "#DBEAFE" },
  processing: { label: "Processing", color: "#7C3AED", bg: "#EDE9FE" },
  shipped:    { label: "Shipped",    color: "#0F766E", bg: "#CCFBF1" },
  delivered:  { label: "Delivered",  color: "#15803D", bg: "#DCFCE7" },
  cancelled:  { label: "Cancelled",  color: "#B91C1C", bg: "#FEE2E2" },
  refunded:   { label: "Refunded",   color: "#4B5563", bg: "#F3F4F6" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: "#4B5563", bg: "#F3F4F6" };
  return (
    <span className="inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded"
      style={{ color: cfg.color, background: cfg.bg }}>
      {cfg.label}
    </span>
  );
}

function OrderCard({ order, onCancel }: { order: Order; onCancel: (id: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const canCancel = order.status === "pending";

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      const res = await fetch(apiUrl(`/api/orders/${order.id}`), { method: "DELETE", credentials: "include" });
      if (res.ok) onCancel(order.id);
      else {
        const data = await res.json();
        alert(data.error ?? "Could not cancel order.");
      }
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="border border-border">
      <button onClick={() => setExpanded(e => !e)}
        className="w-full flex flex-wrap sm:flex-nowrap items-start sm:items-center gap-3 px-5 py-4 text-left hover:bg-muted/20 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="font-medium text-sm">Order #{order.id}</p>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "long", year: "numeric" })}
            {" · "}{order.items.length} item{order.items.length !== 1 ? "s" : ""}
            {" · "}{order.paymentMethod?.toUpperCase() ?? "—"}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <p className="font-semibold text-sm">NPR {order.total.toLocaleString()}</p>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border">
            <div className="px-5 py-5 space-y-5">

              {/* Items */}
              <div>
                <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground mb-3">Items Ordered</p>
                <div className="space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <span className="font-medium">{item.productName}</span>
                        {(item.size || item.color) && (
                          <span className="text-muted-foreground ml-2 text-xs">
                            {[item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`].filter(Boolean).join(" / ")}
                          </span>
                        )}
                        <span className="text-muted-foreground ml-2">×{item.quantity}</span>
                      </div>
                      <span className="font-medium shrink-0 ml-4">NPR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground mb-2">Delivery Address</p>
                  <div className="text-sm text-muted-foreground space-y-0.5">
                    {order.shippingAddress && <p>{order.shippingAddress}</p>}
                    {(order.district || order.city) && <p>{[order.district, order.city].filter(Boolean).join(", ")}</p>}
                    {order.landmark && <p className="text-xs">Near: {order.landmark}</p>}
                    {order.customerPhone && <p>📞 {order.customerPhone}</p>}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground mb-2">Price Breakdown</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex justify-between"><span>Subtotal</span><span>NPR {order.subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span>{order.shippingCost === 0 ? "Free" : `NPR ${order.shippingCost}`}</span></div>
                    <div className="flex justify-between font-semibold text-foreground border-t border-border pt-1 mt-1">
                      <span>Total</span><span>NPR {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground mb-1">Order Notes</p>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </div>
              )}

              {/* Actions */}
              {canCancel && (
                <div className="pt-2 border-t border-border">
                  <button onClick={handleCancel} disabled={cancelling}
                    className="flex items-center gap-2 text-xs font-medium text-red-600 hover:text-red-800 transition-colors disabled:opacity-50">
                    {cancelling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                    Cancel this order
                  </button>
                  <p className="text-xs text-muted-foreground mt-1">Orders can only be cancelled while in Pending status.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Account() {
  const { authenticated, loading, user, logout, updateProfile } = useCustomerAuth();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<Tab>("orders");

  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [addresses, setAddresses] = useState<Address[]>(loadAddresses);
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, "id" | "isDefault">>({
    label: "Home", fullName: "", phone: "", street: "", city: "", district: "",
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(apiUrl("/api/auth/orders"), { credentials: "include" });
      if (res.ok) setOrders(await res.json());
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) loadOrders();
  }, [authenticated, loadOrders]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!authenticated) {
    navigate("/login");
    return null;
  }

  function handleTabChange(id: Tab) {
    if (id === "logout") { logout().then(() => navigate("/")); return; }
    setTab(id);
    if (id === "profile") {
      setProfileName(user?.name ?? "");
      setProfilePhone(user?.phone ?? "");
      setProfileError("");
      setProfileSaved(false);
    }
    if (id === "messages") loadMessages();
    if (id === "orders") loadOrders();
  }

  async function loadMessages() {
    setMessagesLoading(true);
    try {
      const res = await fetch(apiUrl("/api/contact/my"), { credentials: "include" });
      if (res.ok) setMessages(await res.json());
    } finally {
      setMessagesLoading(false);
    }
  }

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    setProfileError("");
    setProfileSaving(true);
    const result = await updateProfile({ name: profileName.trim(), phone: profilePhone.trim() });
    setProfileSaving(false);
    if (result.ok) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } else {
      setProfileError(result.error ?? "Failed to save.");
    }
  }

  function addAddress(e: FormEvent) {
    e.preventDefault();
    const addr: Address = { ...newAddress, id: Date.now().toString(), isDefault: addresses.length === 0 };
    const updated = [...addresses, addr];
    setAddresses(updated);
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(updated));
    setAddingAddress(false);
    setNewAddress({ label: "Home", fullName: "", phone: "", street: "", city: "", district: "" });
  }

  function deleteAddress(id: string) {
    const next = addresses.filter((a) => a.id !== id);
    if (next.length > 0 && !next.some((a) => a.isDefault)) next[0].isDefault = true;
    setAddresses(next);
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(next));
  }

  function setDefault(id: string) {
    const next = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    setAddresses(next);
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(next));
  }

  function handleOrderCancelled(id: number) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "cancelled" } : o));
  }

  const navItems: { id: Tab; label: string; icon: any }[] = [
    { id: "orders", label: "My Orders", icon: Package },
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "profile", label: "Profile Details", icon: User },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
    { id: "logout", label: "Log Out", icon: LogOut },
  ];

  const unreplied = messages.filter(m => !m.adminReply).length;

  return (
    <div className="min-h-screen bg-[#F5F3EF] pt-24 pb-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-10">
          <h1 className="font-serif text-4xl sm:text-5xl font-medium">My Account</h1>
          <p className="text-muted-foreground mt-2">Welcome back, <span className="text-foreground font-medium">{user?.name}</span></p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Sidebar */}
          <aside className="md:w-52 shrink-0">
            <div className="bg-background border border-border p-4 sm:p-5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#C9A86A] text-white flex items-center justify-center text-lg font-bold shrink-0">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
            </div>
            <nav className="space-y-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => handleTabChange(id)}
                  className={`w-full flex items-center gap-3 px-0 py-3 text-sm font-medium transition-colors text-left border-b border-border/50 ${tab === id && id !== "logout" ? "text-foreground font-semibold" : id === "logout" ? "text-destructive hover:text-destructive/80" : "text-muted-foreground hover:text-foreground"}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="tracking-wide uppercase text-xs flex-1">{label}</span>
                  {id === "messages" && unreplied > 0 && tab !== "messages" && (
                    <span className="text-[10px] bg-[#C9A86A] text-white font-bold px-1.5 py-0.5 rounded-full">{unreplied}</span>
                  )}
                  {id === "orders" && orders.length > 0 && (
                    <span className="text-[10px] bg-foreground text-background font-bold px-1.5 py-0.5 rounded-full">{orders.length}</span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 bg-background border border-border p-5 sm:p-8 min-h-[400px]">
            <AnimatePresence mode="wait">

              {/* Orders */}
              {tab === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
                    <h2 className="text-xs font-medium tracking-[0.25em] uppercase text-muted-foreground">My Orders</h2>
                    <button onClick={loadOrders} className="text-xs text-muted-foreground hover:text-foreground transition-colors">↻ Refresh</button>
                  </div>
                  {ordersLoading ? (
                    <div className="text-center py-16">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p className="font-serif text-xl mb-2">No orders yet</p>
                      <p className="text-sm mb-8">Your order history will appear here after your first purchase.</p>
                      <a href="/shop" className="inline-block border-b border-foreground text-foreground pb-1 text-xs font-medium uppercase tracking-widest hover:text-[#C9A86A] hover:border-[#C9A86A] transition-colors">Start Shopping</a>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map(order => (
                        <OrderCard key={order.id} order={order} onCancel={handleOrderCancelled} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Messages */}
              {tab === "messages" && (
                <motion.div key="messages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
                    <h2 className="text-xs font-medium tracking-[0.25em] uppercase text-muted-foreground">Messages with DIDEE</h2>
                    <a href="/contact" className="text-xs font-medium tracking-widest uppercase hover:text-[#C9A86A] transition-colors flex items-center gap-1">
                      New Message <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                  {messagesLoading ? (
                    <div className="text-center py-16">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p className="font-serif text-xl mb-2">No messages yet</p>
                      <p className="text-sm mb-8">Send us a message from the Contact page and we'll reply here.</p>
                      <a href="/contact" className="inline-block border-b border-foreground text-foreground pb-1 text-xs font-medium uppercase tracking-widest hover:text-[#C9A86A] hover:border-[#C9A86A] transition-colors">Contact Us</a>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div key={msg.id} className="border border-border">
                          <button onClick={() => setExpandedMsg(expandedMsg === msg.id ? null : msg.id)}
                            className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-muted/20 transition-colors">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${msg.adminReply ? "bg-green-500" : "bg-[#C9A86A]"}`} />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{msg.subject}</p>
                              <p className="text-xs text-muted-foreground truncate">{msg.message.substring(0, 60)}…</p>
                            </div>
                            <div className="text-right shrink-0">
                              {msg.adminReply
                                ? <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded tracking-wider uppercase">Replied</span>
                                : <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded tracking-wider uppercase">Pending</span>}
                              <p className="text-[10px] text-muted-foreground mt-1">{new Date(msg.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short" })}</p>
                            </div>
                          </button>
                          {expandedMsg === msg.id && (
                            <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
                              <div>
                                <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground mb-2">Your Message</p>
                                <div className="bg-[#F5F3EF] border border-border p-4">
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                </div>
                                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {new Date(msg.createdAt).toLocaleString("en-NP")}
                                </div>
                              </div>
                              {msg.adminReply ? (
                                <div>
                                  <p className="text-[10px] font-black tracking-widest uppercase text-[#C9A86A] mb-2 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> DIDEE Reply
                                  </p>
                                  <div className="bg-[#C9A86A]/5 border border-[#C9A86A]/30 p-4">
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.adminReply}</p>
                                  </div>
                                  {msg.repliedAt && (
                                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                      <Clock className="w-3 h-3" />
                                      {new Date(msg.repliedAt).toLocaleString("en-NP")}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-yellow-50 border border-yellow-200 px-4 py-3">
                                  <Clock className="w-4 h-4 text-yellow-500 shrink-0" />
                                  <span>Awaiting reply from DIDEE. We typically respond within 24 hours.</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Profile */}
              {tab === "profile" && (
                <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <h2 className="text-xs font-medium tracking-[0.25em] uppercase text-muted-foreground mb-6 pb-3 border-b border-border">Profile Details</h2>
                  <form onSubmit={saveProfile} className="space-y-6 max-w-md">
                    <div>
                      <label className="block text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">Full Name</label>
                      <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Your full name" className="w-full border border-border bg-background px-3 py-3 text-sm focus:outline-none focus:border-foreground transition-colors" required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">Email Address</label>
                      <input type="email" value={user?.email ?? ""} disabled className="w-full border border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground cursor-not-allowed" />
                      <p className="text-xs text-muted-foreground mt-1.5">Email cannot be changed.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">Phone Number</label>
                      <input type="tel" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} placeholder="+977-98XXXXXXXX" className="w-full border border-border bg-background px-3 py-3 text-sm focus:outline-none focus:border-foreground transition-colors" />
                    </div>
                    {profileError && <p className="text-sm text-destructive bg-red-50 border border-red-200 px-4 py-3">{profileError}</p>}
                    <button type="submit" disabled={profileSaving} className="flex items-center gap-2 bg-foreground text-background px-8 py-3 text-xs font-medium tracking-widest uppercase hover:bg-[#C9A86A] transition-colors disabled:opacity-60">
                      {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : profileSaved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Changes"}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* Addresses */}
              {tab === "addresses" && (
                <motion.div key="addresses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
                    <h2 className="text-xs font-medium tracking-[0.25em] uppercase text-muted-foreground">Saved Addresses</h2>
                    {!addingAddress && (
                      <button onClick={() => setAddingAddress(true)} className="flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase hover:text-[#C9A86A] transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Add New
                      </button>
                    )}
                  </div>
                  {addresses.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {addresses.map((addr) => (
                        <div key={addr.id} className={`border p-5 relative ${addr.isDefault ? "border-foreground" : "border-border"}`}>
                          {addr.isDefault && <span className="absolute top-3 right-3 text-[10px] bg-foreground text-background px-2 py-0.5 uppercase tracking-widest font-medium">Default</span>}
                          <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">{addr.label}</p>
                          <p className="font-medium text-sm">{addr.fullName}</p>
                          <p className="text-sm text-muted-foreground">{addr.street}</p>
                          <p className="text-sm text-muted-foreground">{addr.city}{addr.district ? `, ${addr.district}` : ""}</p>
                          <p className="text-sm text-muted-foreground">{addr.phone}</p>
                          <div className="flex gap-4 mt-4">
                            {!addr.isDefault && <button onClick={() => setDefault(addr.id)} className="text-xs font-medium underline text-muted-foreground hover:text-foreground transition-colors">Set as Default</button>}
                            <button onClick={() => deleteAddress(addr.id)} className="text-xs font-medium text-destructive hover:opacity-70 flex items-center gap-1 transition-opacity"><Trash2 className="w-3 h-3" /> Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {addingAddress && (
                    <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={addAddress} className="border border-border p-6 space-y-4 max-w-md">
                      <h3 className="text-xs font-medium tracking-widest uppercase mb-4">New Address</h3>
                      {[
                        { label: "Label (e.g. Home, Office)", key: "label", placeholder: "Home" },
                        { label: "Full Name", key: "fullName", placeholder: "Your full name" },
                        { label: "Phone", key: "phone", placeholder: "+977-98XXXXXXXX" },
                        { label: "Street / Area", key: "street", placeholder: "Street address or area" },
                        { label: "City / Municipality", key: "city", placeholder: "Kathmandu" },
                        { label: "District", key: "district", placeholder: "Kathmandu" },
                      ].map(({ label, key, placeholder }) => (
                        <div key={key}>
                          <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">{label}</label>
                          <input value={(newAddress as any)[key]} onChange={(e) => setNewAddress((a) => ({ ...a, [key]: e.target.value }))} placeholder={placeholder} className="w-full border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-foreground" required={key !== "phone"} />
                        </div>
                      ))}
                      <div className="flex gap-3 pt-2">
                        <button type="submit" className="bg-foreground text-background px-6 py-2.5 text-xs font-medium tracking-widest uppercase hover:bg-[#C9A86A] transition-colors">Save Address</button>
                        <button type="button" onClick={() => setAddingAddress(false)} className="border border-border px-6 py-2.5 text-xs font-medium tracking-widest uppercase hover:border-foreground transition-colors">Cancel</button>
                      </div>
                    </motion.form>
                  )}
                  {addresses.length === 0 && !addingAddress && (
                    <div className="text-center py-16 text-muted-foreground">
                      <MapPin className="w-10 h-10 mx-auto mb-4 opacity-30" />
                      <p className="font-serif text-xl mb-2">No saved addresses</p>
                      <p className="text-sm mb-6">Add your delivery address for faster checkout.</p>
                      <button onClick={() => setAddingAddress(true)} className="inline-flex items-center gap-2 border-b border-foreground text-foreground pb-1 text-xs font-medium uppercase tracking-widest hover:text-[#C9A86A] hover:border-[#C9A86A] transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Add Address
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
