import { Link } from "wouter";
import { Instagram, Facebook, Mail, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { apiUrl } from "@/lib/api";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subState, setSubState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubState("loading");
    try {
      const res = await fetch(apiUrl("/api/newsletter/subscribe"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setSubState("done");
      setEmail("");
    } catch {
      setSubState("error");
    }
  }

  return (
    <footer className="bg-[#0A0A0A] text-white">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        {/* Brand */}
        <div className="lg:col-span-2">
          <h2 className="font-serif text-3xl font-semibold tracking-widest mb-3">DIDEE</h2>
          <p className="text-xs tracking-[0.2em] text-white/40 uppercase mb-6">Built in Nepal. Made for Everyone.</p>
          <p className="text-sm text-white/50 leading-relaxed max-w-xs mb-8">
            A modern Nepalese fashion brand dedicated to comfort, quality, and self-expression. Fashion that empowers.
          </p>
          <div className="flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-[#C9A86A] hover:text-[#C9A86A] transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-[#C9A86A] hover:text-[#C9A86A] transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="mailto:hello@didee.com.np" className="w-9 h-9 border border-white/10 flex items-center justify-center hover:border-[#C9A86A] hover:text-[#C9A86A] transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="text-[10px] font-semibold mb-5 tracking-[0.2em] uppercase text-white/40">Shop</h3>
          <ul className="space-y-3 text-sm text-white/60">
            <li><Link href="/shop" className="hover:text-[#C9A86A] transition-colors">All Products</Link></li>
            <li><Link href="/shop?sort=newest" className="hover:text-[#C9A86A] transition-colors">New Arrivals</Link></li>
            <li><Link href="/shop?category=dresses" className="hover:text-[#C9A86A] transition-colors">Dresses</Link></li>
            <li><Link href="/shop?category=casual" className="hover:text-[#C9A86A] transition-colors">Casual Essentials</Link></li>
            <li><Link href="/shop?category=streetwear" className="hover:text-[#C9A86A] transition-colors">Streetwear</Link></li>
            <li><Link href="/lookbook" className="hover:text-[#C9A86A] transition-colors">Lookbook</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-[10px] font-semibold mb-5 tracking-[0.2em] uppercase text-white/40">Company</h3>
          <ul className="space-y-3 text-sm text-white/60">
            <li><Link href="/about" className="hover:text-[#C9A86A] transition-colors">Who We Are</Link></li>
            <li><Link href="/our-story" className="hover:text-[#C9A86A] transition-colors">Our Story</Link></li>
            <li><Link href="/journal" className="hover:text-[#C9A86A] transition-colors">Journal</Link></li>
            <li><Link href="/contact" className="hover:text-[#C9A86A] transition-colors">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:text-[#C9A86A] transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-[10px] font-semibold mb-5 tracking-[0.2em] uppercase text-white/40">Newsletter</h3>
          <p className="text-sm text-white/50 mb-5 leading-relaxed">
            Be the first to know about new arrivals, exclusive offers, and DIDEE news.
          </p>
          {subState === "done" ? (
            <div className="flex items-center gap-2 text-[#C9A86A] text-sm">
              <Check className="w-4 h-4" />
              <span>You're subscribed!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="bg-white/5 border border-white/10 py-3 px-4 w-full focus:outline-none focus:border-[#C9A86A] text-sm text-white placeholder:text-white/30 transition-colors"
              />
              <button
                type="submit"
                disabled={subState === "loading"}
                className="bg-[#C9A86A] text-black py-3 px-4 text-xs font-medium tracking-[0.15em] uppercase hover:bg-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {subState === "loading" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Subscribe"}
              </button>
              {subState === "error" && <p className="text-red-400 text-xs">Something went wrong. Please try again.</p>}
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <p>© {new Date().getFullYear()} DIDEE®. All rights reserved. Built in Nepal.</p>
          <div className="flex gap-6">
            <Link href="/faq" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/faq" className="hover:text-white/60 transition-colors">Terms of Service</Link>
            <Link href="/faq" className="hover:text-white/60 transition-colors">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
