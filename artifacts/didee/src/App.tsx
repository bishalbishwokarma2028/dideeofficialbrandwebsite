import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { CustomerAuthProvider } from "@/context/CustomerAuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { LogoPageTransition } from "@/components/LogoPageTransition";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function AnimatedRoutes() {
  const [location] = useLocation();
  const isAdmin = location === "/admin/login" || location.startsWith("/admin/") || location === "/admin";

  // Admin pages must not use AnimatePresence — it causes remounts on every navigation
  // which disrupts the admin layout and session state
  if (isAdmin) {
    return <Router />;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        style={{ willChange: "opacity, transform, filter" }}
      >
        <Router />
      </motion.div>
    </AnimatePresence>
  );
}

// Client Pages
import Home from "@/pages/home";
import Shop from "@/pages/shop";
import Collections from "@/pages/collections/index";
import CollectionShow from "@/pages/collections/show";
import ProductShow from "@/pages/products/show";
import Journal from "@/pages/journal/index";
import JournalShow from "@/pages/journal/show";
import Lookbook from "@/pages/lookbook";
import About from "@/pages/about";
import OurStory from "@/pages/our-story";
import WhoWeAre from "@/pages/who-we-are";
import OurServices from "@/pages/our-services";
import Contact from "@/pages/contact";
import FAQ from "@/pages/faq";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Account from "@/pages/account";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";
import Wishlist from "@/pages/wishlist";

// Admin Pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminCollections from "@/pages/admin/collections";
import AdminOrders from "@/pages/admin/orders";
import AdminCustomers from "@/pages/admin/customers";
import AdminJournal from "@/pages/admin/journal";
import AdminCategories from "@/pages/admin/categories";
import AdminMessages from "@/pages/admin/messages";
import AdminLookbook from "@/pages/admin/lookbook";
import AdminThemes from "@/pages/admin/themes";
import AdminSettings from "@/pages/admin/settings";
import AdminContent from "@/pages/admin/content";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnMount: "always",
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Admin Login — no layout guard */}
      <Route path="/admin/login">
        <AdminLogin />
      </Route>

      {/* Admin Routes — guarded */}
      <Route path="/admin">
        <AdminLayout><AdminDashboard /></AdminLayout>
      </Route>
      <Route path="/admin/products">
        <AdminLayout><AdminProducts /></AdminLayout>
      </Route>
      <Route path="/admin/collections">
        <AdminLayout><AdminCollections /></AdminLayout>
      </Route>
      <Route path="/admin/orders">
        <AdminLayout><AdminOrders /></AdminLayout>
      </Route>
      <Route path="/admin/customers">
        <AdminLayout><AdminCustomers /></AdminLayout>
      </Route>
      <Route path="/admin/journal">
        <AdminLayout><AdminJournal /></AdminLayout>
      </Route>
      <Route path="/admin/categories">
        <AdminLayout><AdminCategories /></AdminLayout>
      </Route>
      <Route path="/admin/messages">
        <AdminLayout><AdminMessages /></AdminLayout>
      </Route>
      <Route path="/admin/lookbook">
        <AdminLayout><AdminLookbook /></AdminLayout>
      </Route>
      <Route path="/admin/themes">
        <AdminLayout><AdminThemes /></AdminLayout>
      </Route>
      <Route path="/admin/settings">
        <AdminLayout><AdminSettings /></AdminLayout>
      </Route>
      <Route path="/admin/content">
        <AdminLayout><AdminContent /></AdminLayout>
      </Route>
      <Route path="/admin/:path*">
        <AdminLayout><div className="p-8 text-muted-foreground">Page under construction</div></AdminLayout>
      </Route>

      {/* Auth Routes */}
      <Route path="/login">
        <Login />
      </Route>

      {/* Client Routes */}
      <Route path="/">
        <AppLayout><Home /></AppLayout>
      </Route>
      <Route path="/shop">
        <AppLayout><Shop /></AppLayout>
      </Route>
      <Route path="/collections">
        <AppLayout><Collections /></AppLayout>
      </Route>
      <Route path="/collections/:slug">
        <AppLayout><CollectionShow /></AppLayout>
      </Route>
      <Route path="/products/:slug">
        <AppLayout><ProductShow /></AppLayout>
      </Route>
      <Route path="/journal">
        <AppLayout><Journal /></AppLayout>
      </Route>
      <Route path="/journal/:slug">
        <AppLayout><JournalShow /></AppLayout>
      </Route>
      <Route path="/lookbook">
        <AppLayout><Lookbook /></AppLayout>
      </Route>
      <Route path="/about">
        <AppLayout><About /></AppLayout>
      </Route>
      <Route path="/our-story">
        <AppLayout><OurStory /></AppLayout>
      </Route>
      <Route path="/who-we-are">
        <AppLayout><WhoWeAre /></AppLayout>
      </Route>
      <Route path="/our-services">
        <AppLayout><OurServices /></AppLayout>
      </Route>
      <Route path="/contact">
        <AppLayout><Contact /></AppLayout>
      </Route>
      <Route path="/faq">
        <AppLayout><FAQ /></AppLayout>
      </Route>
      <Route path="/cart">
        <AppLayout><Cart /></AppLayout>
      </Route>
      <Route path="/checkout">
        <AppLayout><Checkout /></AppLayout>
      </Route>
      <Route path="/account">
        <AppLayout><Account /></AppLayout>
      </Route>
      <Route path="/wishlist">
        <AppLayout><Wishlist /></AppLayout>
      </Route>
      <Route>
        <AppLayout><NotFound /></AppLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AdminAuthProvider>
            <CustomerAuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                    <ScrollToTop />
                    <LogoPageTransition />
                    <AnimatedRoutes />
                  </WouterRouter>
                </WishlistProvider>
              </CartProvider>
            </CustomerAuthProvider>
          </AdminAuthProvider>
        </ThemeProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
