import { useState } from "react";
import { useListOrders } from "@workspace/api-client-react";
import { Search, Eye, X, MapPin, Phone, Mail, User, CreditCard, Package, StickyNote, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

type OrderItem = {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  size?: string | null;
  color?: string | null;
};

type Order = {
  id: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string | null;
  total: number;
  subtotal: number;
  shippingCost: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  shippingAddress?: string | null;
  district?: string | null;
  city?: string | null;
  landmark?: string | null;
  notes?: string | null;
  createdAt: string;
  items: OrderItem[];
};

const STATUS_COLORS: Record<string, string> = {
  pending:    "bg-amber-50 text-amber-700 border border-amber-200",
  confirmed:  "bg-blue-50 text-blue-700 border border-blue-200",
  processing: "bg-purple-50 text-purple-700 border border-purple-200",
  shipped:    "bg-teal-50 text-teal-700 border border-teal-200",
  delivered:  "bg-green-50 text-green-700 border border-green-200",
  cancelled:  "bg-red-50 text-red-700 border border-red-200",
};

const PAYMENT_LABELS: Record<string, string> = {
  cod: "Cash on Delivery",
  esewa: "eSewa",
  khalti: "Khalti",
  card: "Card",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm ${STATUS_COLORS[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-muted-foreground min-w-[110px] shrink-0 text-xs font-medium uppercase tracking-widest">{label}</span>
      <span className="text-foreground font-medium break-words">{value}</span>
    </div>
  );
}

function OrderDetailPanel({ order, onClose, onStatusChange }: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: number, status: string) => void;
}) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [localStatus, setLocalStatus] = useState(order.status);

  async function handleStatusChange(newStatus: string) {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLocalStatus(newStatus);
        onStatusChange(order.id, newStatus);
      }
    } finally {
      setUpdatingStatus(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-y-0 right-0 w-full sm:w-[480px] lg:w-[520px] bg-background border-l border-border shadow-2xl z-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between z-10">
        <div>
          <h2 className="font-serif text-xl">Order #{order.id.toString().padStart(6, "0")}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">

        {/* Status + Payment Status */}
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Order Status</p>
            <div className="relative">
              <select
                value={localStatus}
                disabled={updatingStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="appearance-none border border-border bg-background px-3 py-2 pr-8 text-sm font-medium focus:outline-none focus:border-foreground transition-colors cursor-pointer disabled:opacity-60"
              >
                {["pending","confirmed","processing","shipped","delivered","cancelled"].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Payment Status</p>
            <StatusBadge status={order.paymentStatus} />
          </div>
        </div>

        {/* Customer Info */}
        <section>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <User className="w-4 h-4 text-[#C9A86A]" />
            <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Customer Information</h3>
          </div>
          <div className="space-y-2.5">
            <DetailRow label="Name" value={order.customerName} />
            <DetailRow label="Email" value={order.customerEmail} />
            <DetailRow label="Phone" value={order.customerPhone} />
          </div>
        </section>

        {/* Delivery Address */}
        <section>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <MapPin className="w-4 h-4 text-[#C9A86A]" />
            <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Delivery Address</h3>
          </div>
          <div className="space-y-2.5">
            <DetailRow label="Address" value={order.shippingAddress} />
            <DetailRow label="District" value={order.district} />
            <DetailRow label="City" value={order.city} />
            <DetailRow label="Landmark" value={order.landmark} />
          </div>
          {/* Full formatted address */}
          {(order.shippingAddress || order.city || order.district) && (
            <div className="mt-3 bg-[#F5F3EF] border border-border px-4 py-3 text-sm text-muted-foreground">
              {[order.shippingAddress, order.city, order.district, "Nepal"].filter(Boolean).join(", ")}
            </div>
          )}
        </section>

        {/* Payment */}
        <section>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <CreditCard className="w-4 h-4 text-[#C9A86A]" />
            <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Payment</h3>
          </div>
          <div className="space-y-2.5">
            <DetailRow label="Method" value={order.paymentMethod ? (PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod) : undefined} />
            <DetailRow label="Status" value={order.paymentStatus} />
          </div>
        </section>

        {/* Order Notes */}
        {order.notes && (
          <section>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
              <StickyNote className="w-4 h-4 text-[#C9A86A]" />
              <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Customer Notes</h3>
            </div>
            <p className="text-sm text-foreground bg-amber-50 border border-amber-200 px-4 py-3 italic">
              "{order.notes}"
            </p>
          </section>
        )}

        {/* Order Items */}
        <section>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <Package className="w-4 h-4 text-[#C9A86A]" />
            <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
              Items Ordered ({order.items.length})
            </h3>
          </div>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-[#F5F3EF] border border-border px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{item.productName}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.size && (
                      <span className="text-xs bg-background border border-border px-2 py-0.5 text-muted-foreground">
                        Size: {item.size}
                      </span>
                    )}
                    {item.color && (
                      <span className="text-xs bg-background border border-border px-2 py-0.5 text-muted-foreground">
                        Color: {item.color}
                      </span>
                    )}
                    <span className="text-xs bg-background border border-border px-2 py-0.5 text-muted-foreground">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="text-sm font-semibold shrink-0">
                  NPR {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Order Totals */}
        <section className="bg-[#F5F3EF] border border-border p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>NPR {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{order.shippingCost === 0 ? "Free" : `NPR ${order.shippingCost.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-border pt-2 mt-2">
              <span>Total</span>
              <span>NPR {order.total.toLocaleString()}</span>
            </div>
          </div>
        </section>

      </div>
    </motion.div>
  );
}

export default function AdminOrders() {
  const { data: ordersData, isLoading, refetch } = useListOrders({ limit: 100 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [localOrders, setLocalOrders] = useState<Order[] | null>(null);

  const orders: Order[] = (localOrders ?? (ordersData?.orders as Order[] ?? []));

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || (
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.id.toString().includes(q) ||
      (o.customerPhone ?? "").includes(q)
    );
    return matchStatus && matchSearch;
  });

  function handleStatusChange(id: number, newStatus: string) {
    const base = localOrders ?? (ordersData?.orders as Order[] ?? []);
    setLocalOrders(base.map(o => o.id === id ? { ...o, status: newStatus } : o));
    if (selectedOrder?.id === id) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : prev);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif">Orders</h1>
        <span className="text-sm text-muted-foreground">{filtered.length} order{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border shadow-sm">
        <div className="p-3 sm:p-4 border-b border-border flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone, order ID..."
              className="pl-9 rounded-none border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-border bg-transparent px-3 py-2 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading orders...</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-neutral-bg text-muted-foreground border-b border-border text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 lg:px-6 py-4 font-medium">Order</th>
                    <th className="px-4 lg:px-6 py-4 font-medium">Date</th>
                    <th className="px-4 lg:px-6 py-4 font-medium">Customer</th>
                    <th className="px-4 lg:px-6 py-4 font-medium">Phone</th>
                    <th className="px-4 lg:px-6 py-4 font-medium">Payment</th>
                    <th className="px-4 lg:px-6 py-4 font-medium">Total</th>
                    <th className="px-4 lg:px-6 py-4 font-medium">Status</th>
                    <th className="px-4 lg:px-6 py-4 font-medium text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((order) => (
                    <tr
                      key={order.id}
                      className={`hover:bg-neutral-bg/50 transition-colors cursor-pointer ${selectedOrder?.id === order.id ? "bg-[#C9A86A]/5" : ""}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-4 lg:px-6 py-4 font-medium text-foreground">
                        #{order.id.toString().padStart(6, "0")}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-NP")}
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="font-medium text-foreground">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-muted-foreground text-xs">
                        {order.customerPhone ?? "—"}
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-muted-foreground text-xs uppercase">
                        {order.paymentMethod ? (PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod) : "—"}
                      </td>
                      <td className="px-4 lg:px-6 py-4 font-semibold whitespace-nowrap">
                        NPR {order.total.toLocaleString()}
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C9A86A] hover:underline"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-border">
              {filtered.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="w-full text-left px-4 py-4 hover:bg-neutral-bg/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium text-sm">#{order.id.toString().padStart(6, "0")}</span>
                      <span className="ml-2"><StatusBadge status={order.status} /></span>
                    </div>
                    <span className="font-semibold text-sm">NPR {order.total.toLocaleString()}</span>
                  </div>
                  <div className="text-sm font-medium text-foreground">{order.customerName}</div>
                  <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                  {order.customerPhone && (
                    <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                  )}
                  <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                    <span>{new Date(order.createdAt).toLocaleDateString("en-NP")}</span>
                    <span className="flex items-center gap-1 text-[#C9A86A] font-medium">
                      <Eye className="w-3 h-3" /> View Details
                    </span>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-4 py-8 text-center text-muted-foreground">No orders found.</div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setSelectedOrder(null)}
            />
            <OrderDetailPanel
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
              onStatusChange={handleStatusChange}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
