import { useGetDashboardSummary, useListOrders, useListProducts, useListCategories } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Users, ShoppingBag, Package, DollarSign, ArrowRight, Tag, TrendingUp,
  AlertTriangle, BookOpen, Image, FolderTree, ChevronRight, Activity,
  Box, Star, Zap, Clock, CheckCircle2, XCircle, Truck, RefreshCw
} from "lucide-react";

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return { count, ref };
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  pending:    { color: "#F59E0B", bg: "rgba(245,158,11,0.15)", icon: Clock },
  confirmed:  { color: "#3B82F6", bg: "rgba(59,130,246,0.15)", icon: CheckCircle2 },
  processing: { color: "#8B5CF6", bg: "rgba(139,92,246,0.15)", icon: RefreshCw },
  shipped:    { color: "#06B6D4", bg: "rgba(6,182,212,0.15)",  icon: Truck },
  delivered:  { color: "#10B981", bg: "rgba(16,185,129,0.15)", icon: CheckCircle2 },
  cancelled:  { color: "#EF4444", bg: "rgba(239,68,68,0.15)",  icon: XCircle },
};

function SparkBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.round((value / Math.max(max, 1)) * 100)}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

function KPICard({ label, value, sub, subOk, icon: Icon, accent, delay }: {
  label: string; value: string; sub: string; subOk?: boolean;
  icon: React.ElementType; accent: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-xl p-6"
      style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #141414 100%)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20"
        style={{ background: accent }}
      />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${accent}20`, border: `1px solid ${accent}30` }}
        >
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        <p className="text-[10px] font-black tracking-[0.25em] uppercase text-white/30">{label}</p>
      </div>
      <p className="text-3xl font-black text-white mb-1 relative z-10">{value}</p>
      <p className={`text-xs font-medium relative z-10 ${subOk === true ? "text-emerald-400" : subOk === false ? "text-red-400" : "text-white/35"}`}>
        {sub}
      </p>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary();
  const { data: ordersData } = useListOrders({ limit: 6 });
  const { data: productsData } = useListProducts({ limit: 5 });
  const { data: categories } = useListCategories();

  const rev = useCountUp(summary?.totalRevenue ?? 0);
  const orders = useCountUp(summary?.totalOrders ?? 0);
  const customers = useCountUp(summary?.totalCustomers ?? 0);
  const products = useCountUp(summary?.totalProducts ?? 0);

  const recentOrders = ordersData?.orders?.slice(0, 6) ?? [];
  const topProducts = productsData?.products?.slice(0, 5) ?? [];

  if (isLoading) return (
    <div className="p-8 min-h-screen" style={{ background: "#0a0a0a" }}>
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-white/5 w-56 rounded-xl" />
        <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-xl" />)}</div>
      </div>
    </div>
  );

  if (!summary) return <div className="p-8 text-white/40">Error loading dashboard</div>;

  const avgOrder = summary.totalOrders > 0 ? Math.round(summary.totalRevenue / summary.totalOrders) : 0;

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Hero banner */}
      <div
        className="relative px-8 pt-10 pb-8 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #111 0%, #0d0d0d 40%, #1a1200 100%)", borderBottom: "1px solid rgba(201,168,106,0.12)" }}
      >
        <div className="absolute top-0 right-0 w-[400px] h-[200px] blur-3xl opacity-20"
          style={{ background: "radial-gradient(ellipse at top right, #C9A86A 0%, transparent 70%)" }} />
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-[10px] font-black tracking-[0.35em] uppercase text-[#C9A86A] mb-2">DIDEE ADMIN</p>
            <h1 className="text-3xl font-serif text-white mb-1">Dashboard</h1>
            <p className="text-white/35 text-sm">
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </motion.div>
        </div>
        <Link href="/" className="absolute top-8 right-8 flex items-center gap-1.5 text-[11px] font-black tracking-widest uppercase text-white/30 hover:text-[#C9A86A] transition-colors">
          <Activity className="w-3.5 h-3.5" />
          View Store
        </Link>
      </div>

      <div className="p-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard label="Total Revenue" value={`NPR ${rev.count.toLocaleString()}`} sub="Lifetime revenue" icon={DollarSign} accent="#C9A86A" delay={0} />
          <KPICard label="Orders" value={orders.count.toString()} sub={`${summary.pendingOrders} pending`} subOk={summary.pendingOrders === 0} icon={ShoppingBag} accent="#60A5FA" delay={0.1} />
          <KPICard label="Customers" value={customers.count.toString()} sub="Registered accounts" icon={Users} accent="#34D399" delay={0.2} />
          <KPICard label="Products" value={products.count.toString()} sub={summary.lowStockCount > 0 ? `${summary.lowStockCount} low stock` : "Inventory healthy"} subOk={summary.lowStockCount === 0} icon={Package} accent="#A78BFA" delay={0.3} />
        </div>

        {/* Secondary metrics */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { label: "Avg. Order Value", value: `NPR ${avgOrder.toLocaleString()}`, sub: "Per completed order", icon: TrendingUp, color: "#F59E0B" },
            { label: "Categories", value: (categories?.length ?? 0).toString(), sub: "Product categories", icon: Tag, color: "#EC4899" },
            { label: "Action Items", value: (summary.pendingOrders + summary.lowStockCount).toString(), sub: `${summary.pendingOrders} orders · ${summary.lowStockCount} stock`, icon: AlertTriangle, color: summary.pendingOrders + summary.lowStockCount > 0 ? "#F87171" : "#34D399" },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-xl p-5 flex items-center gap-4"
              style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}18`, border: `1px solid ${color}25` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black tracking-[0.22em] uppercase text-white/30 mb-0.5">{label}</p>
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-[11px] text-white/30 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }}
            className="lg:col-span-2 rounded-xl overflow-hidden"
            style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex justify-between items-center px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#C9A86A]" />
                <h3 className="font-black text-sm tracking-wide text-white">Recent Orders</h3>
              </div>
              <Link href="/admin/orders" className="text-[10px] font-black tracking-widest uppercase text-white/25 hover:text-[#C9A86A] transition-colors flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="p-10 text-center text-white/20 text-sm">No orders yet</div>
            ) : (
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {recentOrders.map((order: any) => {
                  const cfg = STATUS_CONFIG[order.status] ?? { color: "#9CA3AF", bg: "rgba(156,163,175,0.15)", icon: Clock };
                  const StatusIcon = cfg.icon;
                  return (
                    <div key={order.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: cfg.bg }}>
                          <StatusIcon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">#{order.id}</p>
                          <p className="text-[11px] text-white/35">{order.customerName || order.customerEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide" style={{ background: cfg.bg, color: cfg.color }}>
                          {order.status}
                        </span>
                        <span className="text-sm font-bold text-white">NPR {Number(order.total ?? 0).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
            className="space-y-3"
          >
            <div className="rounded-xl p-5" style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-[#C9A86A]" />
                <h3 className="font-black text-sm tracking-wide text-white">Quick Actions</h3>
              </div>
              <div className="space-y-2">
                {[
                  { href: "/admin/products",    label: "Add Product",       icon: Package,   color: "#A78BFA" },
                  { href: "/admin/orders",      label: "Process Orders",    icon: ShoppingBag, color: "#60A5FA" },
                  { href: "/admin/collections", label: "Edit Collections",  icon: FolderTree, color: "#34D399" },
                  { href: "/admin/journal",     label: "Write Post",        icon: BookOpen,  color: "#F59E0B" },
                  { href: "/admin/lookbook",    label: "Update Lookbook",   icon: Image,     color: "#EC4899" },
                  { href: "/admin/content",     label: "Edit Site Content", icon: Box,       color: "#C9A86A" },
                ].map(({ href, label, icon: Icon, color }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                        <Icon className="w-3.5 h-3.5" style={{ color }} />
                      </div>
                      <span className="text-[12px] font-bold text-white/60 group-hover:text-white transition-colors">{label}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Products Inventory */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5 }}
          className="rounded-xl overflow-hidden"
          style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex justify-between items-center px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#C9A86A]" />
              <h3 className="font-black text-sm tracking-wide text-white">Products Inventory</h3>
            </div>
            <Link href="/admin/products" className="text-[10px] font-black tracking-widest uppercase text-white/25 hover:text-[#C9A86A] transition-colors flex items-center gap-1">
              Manage All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {topProducts.length === 0 ? (
            <div className="p-10 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.2)" }}>
                <Package className="w-6 h-6" style={{ color: "#A78BFA" }} />
              </div>
              <div>
                <p className="text-white/60 text-sm font-bold mb-1">No products yet</p>
                <p className="text-white/25 text-xs">Add your first product to start selling</p>
              </div>
              <Link
                href="/admin/products"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black tracking-widest uppercase transition-colors"
                style={{ background: "rgba(201,168,106,0.12)", color: "#C9A86A", border: "1px solid rgba(201,168,106,0.2)" }}
              >
                <Package className="w-3.5 h-3.5" /> Add First Product
              </Link>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              {topProducts.map((p: any) => {
                const stock = p.stock ?? 0;
                const maxStock = 100;
                const stockColor = stock <= 5 ? "#F87171" : stock <= 20 ? "#F59E0B" : "#34D399";
                return (
                  <div key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#1f1f1f" }}>
                          <Package className="w-4 h-4 text-white/20" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-white">{p.name}</p>
                        <p className="text-[11px] text-white/30">{p.categorySlug ?? "No category"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right min-w-[80px]">
                        <p className="text-[10px] text-white/25 font-black uppercase tracking-wide mb-0.5">Stock</p>
                        <SparkBar value={stock} max={maxStock} color={stockColor} />
                        <p className="text-[10px] text-white/40 mt-0.5">{stock} units</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-white/25 font-black uppercase tracking-wide mb-1">Price</p>
                        <p className="text-sm font-bold text-white">NPR {Number(p.price).toLocaleString()}</p>
                      </div>
                      <span
                        className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide"
                        style={{
                          background: p.status === "active" ? "rgba(52,211,153,0.15)" : "rgba(156,163,175,0.12)",
                          color: p.status === "active" ? "#34D399" : "#9CA3AF",
                        }}
                      >
                        {p.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Getting Started — shown only when store is empty */}
        {summary.totalProducts === 0 && summary.totalOrders === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
            className="rounded-xl p-6"
            style={{ background: "linear-gradient(135deg, #1a1200 0%, #141414 100%)", border: "1px solid rgba(201,168,106,0.15)" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-4 h-4 text-[#C9A86A]" />
              <h3 className="font-black text-sm tracking-wide text-white">Getting Started</h3>
              <span className="ml-2 text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ background: "rgba(201,168,106,0.15)", color: "#C9A86A" }}>Setup Guide</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  step: "01",
                  title: "Add Collections",
                  desc: "Create collections like Streetwear, Casual, Dresses to organise your products.",
                  href: "/admin/collections",
                  color: "#34D399",
                  icon: FolderTree,
                },
                {
                  step: "02",
                  title: "Add Products",
                  desc: "Upload your first products with images, prices, and descriptions.",
                  href: "/admin/products",
                  color: "#A78BFA",
                  icon: Package,
                },
                {
                  step: "03",
                  title: "Customise Content",
                  desc: "Update homepage banners, lookbook, and journal to match your brand.",
                  href: "/admin/content",
                  color: "#C9A86A",
                  icon: Box,
                },
              ].map(({ step, title, desc, href, color, icon: Icon }) => (
                <Link key={href} href={href} className="group block p-5 rounded-xl transition-colors hover:bg-white/[0.03]" style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}25` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black tracking-[0.2em] uppercase mb-1" style={{ color }}>{step}</p>
                      <p className="text-sm font-bold text-white mb-1 group-hover:text-white transition-colors">{title}</p>
                      <p className="text-[11px] text-white/30 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-[10px] font-black tracking-widest uppercase transition-colors" style={{ color }}>
                    Get Started <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
