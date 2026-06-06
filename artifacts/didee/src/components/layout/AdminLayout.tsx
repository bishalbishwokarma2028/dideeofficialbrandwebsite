import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, ShoppingBag, Package, FolderTree, Users, BookOpen, LogOut, ExternalLink, Tag, Image, MessageCircle, Palette, Settings, FileText, Menu, X } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { motion, AnimatePresence } from "framer-motion";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location, navigate] = useLocation();
  const { loading, authenticated, email, logout } = useAdminAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate("/admin/login");
    }
  }, [loading, authenticated, navigate]);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-white/40 text-sm tracking-widest uppercase animate-pulse">Loading…</p>
      </div>
    );
  }

  if (!authenticated) return null;

  const navGroups = [
    {
      label: "Overview",
      items: [
        { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
      ],
    },
    {
      label: "Store",
      items: [
        { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
        { href: "/admin/products", icon: Package, label: "Products" },
        { href: "/admin/collections", icon: FolderTree, label: "Collections" },
        { href: "/admin/categories", icon: Tag, label: "Categories" },
      ],
    },
    {
      label: "Content",
      items: [
        { href: "/admin/journal", icon: BookOpen, label: "Journal" },
        { href: "/admin/lookbook", icon: Image, label: "Lookbook" },
      ],
    },
    {
      label: "People",
      items: [
        { href: "/admin/customers", icon: Users, label: "Customers" },
        { href: "/admin/messages", icon: MessageCircle, label: "Messages" },
      ],
    },
    {
      label: "System",
      items: [
        { href: "/admin/content",  icon: FileText, label: "Site Content" },
        { href: "/admin/themes",   icon: Palette,  label: "Themes" },
        { href: "/admin/settings", icon: Settings, label: "Settings" },
      ],
    },
  ];

  const allNavItems = navGroups.flatMap(g => g.items);

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  const Sidebar = () => (
    <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-5">
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground px-2 mb-1.5">{group.label}</p>
          {group.items.map((item) => {
            const isActive = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:bg-neutral-bg hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="w-60 border-r border-border bg-card shrink-0 flex-col hidden md:flex">
        <div className="h-16 flex items-center px-5 border-b border-border gap-3">
          <Link href="/" className="font-serif text-2xl font-semibold tracking-widest text-primary">
            DIDEE
          </Link>
          <span className="text-[10px] font-sans text-muted-foreground tracking-normal border border-border px-1.5 py-0.5 uppercase">
            Admin
          </span>
        </div>

        <div className="px-4 py-3 border-b border-border">
          <p className="text-[10px] text-muted-foreground tracking-wide">Signed in as</p>
          <p className="text-xs font-bold text-foreground truncate mt-0.5">{email}</p>
        </div>

        <Sidebar />

        <div className="p-3 border-t border-border space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f9fafb]">
        {/* Mobile Header */}
        <header className="h-16 md:hidden border-b border-border bg-card flex items-center justify-between px-4 sticky top-0 z-40">
          <Link href="/admin" className="font-serif text-xl font-semibold tracking-widest text-primary">
            DIDEE Admin
          </Link>
          <button
            onClick={() => setMobileNavOpen(v => !v)}
            className="w-10 h-10 flex items-center justify-center rounded-sm hover:bg-neutral-bg transition-colors"
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Slide-in Nav */}
        <AnimatePresence>
          {mobileNavOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-black/50 md:hidden"
                onClick={() => setMobileNavOpen(false)}
              />
              {/* Drawer */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 right-0 h-full w-72 bg-card border-l border-border z-50 flex flex-col md:hidden shadow-2xl"
              >
                {/* Drawer header */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-border">
                  <div>
                    <p className="font-serif text-lg font-semibold tracking-widest">DIDEE Admin</p>
                    <p className="text-[10px] text-muted-foreground truncate">{email}</p>
                  </div>
                  <button onClick={() => setMobileNavOpen(false)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-neutral-bg rounded-sm transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Nav groups */}
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
                  {navGroups.map((group) => (
                    <div key={group.label}>
                      <p className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground px-2 mb-1.5">{group.label}</p>
                      {group.items.map((item) => {
                        const isActive = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-3 rounded-sm text-sm font-medium transition-colors ${
                              isActive
                                ? "bg-primary text-primary-foreground font-bold"
                                : "text-muted-foreground hover:bg-neutral-bg hover:text-foreground"
                            }`}
                          >
                            <item.icon className="w-4 h-4 shrink-0" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-border space-y-1">
                  <Link href="/"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    View Store
                  </Link>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-y-auto pb-14 md:pb-0">
          {children}
        </div>

        {/* Mobile bottom navigation bar (quick access) */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-card border-t border-border flex items-center justify-around px-2 h-14">
          {[
            { href: "/admin", icon: LayoutDashboard, label: "Home" },
            { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
            { href: "/admin/products", icon: Package, label: "Products" },
            { href: "/admin/lookbook", icon: Image, label: "Lookbook" },
            { href: "/admin/customers", icon: Users, label: "Customers" },
          ].map((item) => {
            const isActive = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-sm transition-colors min-w-0 ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                <span className="text-[9px] font-medium tracking-wide truncate">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[9px] font-medium tracking-wide">More</span>
          </button>
        </nav>
      </main>
    </div>
  );
}
