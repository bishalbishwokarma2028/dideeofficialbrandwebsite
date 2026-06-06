import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, User, Menu, X, LogOut, ChevronDown, ArrowRight, Heart, LayoutDashboard } from "lucide-react";
import { useCartContext } from "@/context/CartContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { apiUrl } from "@/lib/api";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useCallback } from "react";
import logoSrc from "/logo.jpg";

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ products: any[]; posts: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults(null); return; }
    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/search?q=${encodeURIComponent(q)}`));
      const data = await res.json();
      setResults(data);
    } catch { setResults(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 350);
    return () => clearTimeout(t);
  }, [query, search]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const hasResults = results && (results.products.length > 0 || results.posts.length > 0);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: "rgba(10,10,10,0.97)" }}>
      <div className="flex items-center px-6 md:px-16 h-20 border-b border-white/10">
        <Search className="w-5 h-5 text-white/40 mr-4 shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, journal, collections…"
          className="flex-1 bg-transparent text-white text-lg placeholder:text-white/30 focus:outline-none"
        />
        <button onClick={onClose} className="ml-4 text-white/50 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 md:px-16 py-8">
        {loading && <p className="text-white/40 text-sm">Searching…</p>}
        {!loading && query && !hasResults && (
          <p className="text-white/40 text-sm">No results for "<span className="text-white">{query}</span>"</p>
        )}
        {!loading && hasResults && (
          <div className="max-w-2xl space-y-10">
            {results!.products.length > 0 && (
              <div>
                <p className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 mb-5">Products</p>
                <div className="space-y-4">
                  {results!.products.slice(0, 5).map((p: any) => (
                    <Link key={p.id} href={`/products/${p.slug}`} onClick={onClose} className="flex items-center gap-4 group">
                      <div className="w-14 h-14 bg-white/5 shrink-0 overflow-hidden">
                        {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium group-hover:text-[#C9A86A] transition-colors truncate">{p.name}</p>
                        <p className="text-white/40 text-xs">NPR {Number(p.price).toLocaleString()}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#C9A86A] transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {results!.posts.length > 0 && (
              <div>
                <p className="text-[10px] font-black tracking-[0.4em] uppercase text-white/40 mb-5">Journal</p>
                <div className="space-y-3">
                  {results!.posts.slice(0, 3).map((post: any) => (
                    <Link key={post.id} href={`/journal/${post.slug}`} onClick={onClose} className="flex items-center gap-3 group">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium group-hover:text-[#C9A86A] transition-colors truncate">{post.title}</p>
                        {post.excerpt && <p className="text-white/40 text-xs truncate mt-0.5">{post.excerpt}</p>}
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#C9A86A] transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {!query && (
          <div className="text-white/30 text-sm max-w-md">
            <p className="mb-4">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {["Plaid Skirt", "Wide Leg", "Streetwear", "Dark Aesthetic", "Graphic Tee"].map(t => (
                <button key={t} onClick={() => setQuery(t)} className="px-3 py-1.5 border border-white/10 text-xs text-white/50 hover:border-white/30 hover:text-white transition-colors">
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const shopLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/journal", label: "Journal" },
];

const brandLinks = [
  { href: "/about", label: "About DIDEE" },
  { href: "/our-story", label: "Our Story" },
  { href: "/who-we-are", label: "Who We Are" },
  { href: "/our-services", label: "Our Services" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const { itemCount } = useCartContext();
  const { authenticated, user, logout } = useCustomerAuth();
  const { authenticated: isAdmin } = useAdminAuth();
  const { itemCount: wishCount } = useWishlist();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMobileOpen(false); }, [location]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      <header className="sticky top-0 z-50 w-full bg-background/98 backdrop-blur-md border-b border-border">

        {/* ── Top utility bar (brand links) ── */}
        <div className="hidden lg:flex items-center justify-center border-b border-border/60 bg-[#0A0A0A] px-6">
          <div className="flex items-center gap-0">
            {brandLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-5 py-2 text-[9px] font-black tracking-[0.22em] uppercase transition-colors whitespace-nowrap
                  ${location === link.href
                    ? "text-[#C9A86A]"
                    : "text-white/45 hover:text-white/90"
                  }
                  ${i > 0 ? "border-l border-white/10" : ""}
                `}
              >
                {location === link.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-0.5 bg-[#C9A86A]" />
                )}
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Main nav bar ── */}
        <div className="mx-auto px-4 md:px-8 h-16 flex items-center max-w-[1600px]">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center mr-8">
            <img src={logoSrc} alt="DIDEE" className="h-9 w-auto" style={{ filter: "invert(1)", mixBlendMode: "multiply" }} />
          </Link>

          {/* Desktop shop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {shopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-1.5 text-[11px] font-black tracking-[0.2em] uppercase transition-colors whitespace-nowrap rounded-sm
                  ${location === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {link.label}
                {location === link.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#C9A86A] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden lg:flex items-center gap-0.5 ml-auto">
            {/* Dashboard shortcut — shown when admin or customer is logged in */}
            {isAdmin && (
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="rounded-none flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-[#C9A86A] hover:text-[#C9A86A] hover:bg-[#C9A86A]/10 px-3 h-9 border border-[#C9A86A]/30 hover:border-[#C9A86A]/60 mr-2">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Button>
              </Link>
            )}
            {!isAdmin && authenticated && (
              <Link href="/account">
                <Button variant="ghost" size="sm" className="rounded-none flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase text-[#C9A86A] hover:text-[#C9A86A] hover:bg-[#C9A86A]/10 px-3 h-9 border border-[#C9A86A]/30 hover:border-[#C9A86A]/60 mr-2">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Search" className="rounded-none">
              <Search className="h-4.5 w-4.5" />
            </Button>

            <Link href="/wishlist" aria-label="Wishlist">
              <Button variant="ghost" size="icon" className="relative rounded-none">
                <Heart className="h-4.5 w-4.5" />
                {wishCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C9A86A] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{wishCount}</span>
                )}
              </Button>
            </Link>

            {authenticated ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors hover:bg-neutral-50"
                >
                  <div className="w-7 h-7 rounded-full bg-[#C9A86A] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[11px] font-bold tracking-wide max-w-[72px] truncate">{user?.name?.split(" ")[0]}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-background border border-border shadow-xl z-50 py-1">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-xs font-bold text-foreground truncate">{user?.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate mt-0.5">{user?.email}</p>
                    </div>
                    <Link href="/account" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-xs font-black tracking-wide hover:bg-neutral-50 transition-colors">My Account</Link>
                    <Link href="/wishlist" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-xs font-black tracking-wide hover:bg-neutral-50 transition-colors">
                      <Heart className="w-3.5 h-3.5 text-[#C9A86A]" />
                      Wishlist {wishCount > 0 && `(${wishCount})`}
                    </Link>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-black tracking-wide text-destructive hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" aria-label="Sign in" className="rounded-none">
                  <User className="h-4.5 w-4.5" />
                </Button>
              </Link>
            )}

            <Link href="/cart" aria-label="Cart">
              <Button variant="ghost" size="icon" className="relative rounded-none">
                <ShoppingBag className="h-4.5 w-4.5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C9A86A] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile right */}
          <div className="flex items-center lg:hidden ml-auto gap-0.5">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/wishlist" aria-label="Wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C9A86A] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{wishCount}</span>
                )}
              </Button>
            </Link>
            <Link href="/cart" aria-label="Cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C9A86A] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{itemCount}</span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[300px] bg-background flex flex-col shadow-2xl">
            <div className="h-16 flex items-center justify-between px-5 border-b border-border">
              <img src={logoSrc} alt="DIDEE" className="h-8 w-auto" style={{ filter: "invert(1)", mixBlendMode: "multiply" }} />
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 py-5 px-5 overflow-y-auto">
              {authenticated ? (
                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-[#C9A86A] text-white flex items-center justify-center font-bold shrink-0">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
              ) : (
                <div className="mb-6 pb-5 border-b border-border">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 bg-[#0A0A0A] text-white w-full py-3 text-[11px] font-black tracking-[0.2em] uppercase hover:bg-[#C9A86A] transition-colors">
                    <User className="w-4 h-4" /> Sign In / Register
                  </Link>
                </div>
              )}

              <div className="space-y-0.5 mb-5">
                <p className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground/50 font-black mb-3">Shop</p>
                {shopLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between py-2.5 px-3 text-sm font-bold tracking-wide transition-colors rounded
                      ${location === link.href ? "text-foreground bg-neutral-100" : "text-muted-foreground hover:text-foreground hover:bg-neutral-50"}`}
                  >
                    {link.label}
                    {location === link.href && <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A]" />}
                  </Link>
                ))}
              </div>

              <div className="space-y-0.5 mb-5">
                <p className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground/50 font-black mb-3">Brand</p>
                {brandLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between py-2.5 px-3 text-sm font-bold tracking-wide transition-colors rounded
                      ${location === link.href ? "text-foreground bg-neutral-100" : "text-muted-foreground hover:text-foreground hover:bg-neutral-50"}`}
                  >
                    {link.label}
                    {location === link.href && <span className="w-1.5 h-1.5 rounded-full bg-[#C9A86A]" />}
                  </Link>
                ))}
              </div>

              <Link
                href="/wishlist"
                className={`flex items-center gap-2.5 py-2.5 px-3 text-sm font-bold tracking-wide transition-colors rounded
                  ${location === "/wishlist" ? "text-foreground bg-neutral-100" : "text-muted-foreground hover:text-foreground hover:bg-neutral-50"}`}
              >
                <Heart className="w-4 h-4 text-[#C9A86A]" />
                Wishlist {wishCount > 0 && <span className="text-[#C9A86A]">({wishCount})</span>}
              </Link>

              {authenticated && (
                <div className="mt-6 pt-6 border-t border-border">
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="flex items-center gap-2 py-2.5 px-3 text-sm font-bold text-destructive hover:bg-red-50 transition-colors rounded w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
