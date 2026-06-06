import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Clock, Instagram, Facebook, Send, Check, ChevronDown, MessageCircle, Star, Eye, Award, Heart } from "lucide-react";
import { apiUrl } from "@/lib/api";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const FAQ_ITEMS = [
  { q: "How long does delivery take?", a: "Within Kathmandu Valley: 1–2 business days. Outside the Valley: 3–5 business days. Pan-Nepal delivery is available for all orders." },
  { q: "What is your return policy?", a: "We accept returns within 7 days of delivery for unworn, unwashed items with original tags. Contact us first and we'll arrange pickup or drop-off." },
  { q: "How do I find my size?", a: "Each product page has a size guide. If you're between sizes, we generally recommend sizing up for an oversized fit or down for a more fitted look. You can also WhatsApp us for personal styling advice." },
  { q: "What payment methods do you accept?", a: "We accept eSewa, Khalti, cash on delivery (COD), and bank transfer. All online payments are processed securely." },
  { q: "Do you ship outside Nepal?", a: "Currently we ship across all 7 provinces of Nepal. International shipping is in development — follow us on Instagram for updates." },
  { q: "Can I track my order?", a: "Yes! Once your order is dispatched, you'll receive a tracking number via SMS/email. You can also check your order status in your account dashboard." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-b-0">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between py-5 text-left gap-4 hover:text-[#C9A86A] transition-colors">
        <span className="font-bold text-sm">{q}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <p className="pb-5 text-muted-foreground text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CONTACT_CHANNELS = [
  { icon: MessageCircle, label: "WhatsApp", value: "+977 98XXXXXXXX", hint: "Fastest response — usually within 1 hour", action: "https://wa.me/9779800000000", actionLabel: "Chat Now", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  { icon: Mail, label: "Email", value: "hello@didee.com.np", hint: "For detailed enquiries — reply within 24h", action: "mailto:hello@didee.com.np", actionLabel: "Send Email", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { icon: Instagram, label: "Instagram DM", value: "@didee.np", hint: "Styling advice, lookbook, new drops", action: "https://instagram.com/didee.np", actionLabel: "Follow & DM", color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200" },
];

const SUPPORT_TYPES = [
  { icon: Star, label: "About DIDEE", desc: "Luxury Nepalese streetwear, Est. 2025" },
  { icon: Eye, label: "Brand Vision", desc: "Fashion as identity — built for everyone" },
  { icon: Award, label: "Quality Standards", desc: "Premium fabrics & ethical production" },
  { icon: Heart, label: "Customer Commitment", desc: "Your satisfaction, always our priority" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send");
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setError("Something went wrong. Please try WhatsApp or email us directly.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[#0A0A0A] text-white py-24 px-6 md:px-16">
        <div className="max-w-5xl mx-auto">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-[11px] tracking-[0.5em] uppercase text-white/40 mb-6 font-black">
            DIDEE — We're Here for You
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="font-serif text-6xl md:text-7xl font-medium leading-none mb-6">
            Contact Us
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.3 }} className="text-white/60 text-lg max-w-xl leading-relaxed">
            Have a question, a styling query, or just want to say hello? We respond within 24 hours — usually much faster.
          </motion.p>
        </div>
      </section>

      {/* Support Types */}
      <section className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 md:px-16 py-12 grid grid-cols-2 md:grid-cols-4 gap-0">
          {SUPPORT_TYPES.map((s, i) => (
            <div key={s.label} className={`p-6 ${i < 3 ? "border-r border-border" : ""} text-center hover:bg-[#F5F3EF] transition-colors`}>
              <s.icon className="w-6 h-6 text-[#C9A86A] mx-auto mb-3" />
              <p className="font-black text-sm mb-1">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 md:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Left */}
          <div className="lg:col-span-2 space-y-10">
            <FadeIn>
              <h2 className="font-serif text-2xl mb-6">Reach Us Directly</h2>
              <div className="space-y-3">
                {CONTACT_CHANNELS.map((c) => (
                  <div key={c.label} className={`border ${c.border} p-4 flex items-center gap-4`}>
                    <div className={`w-10 h-10 ${c.bg} flex items-center justify-center shrink-0`}>
                      <c.icon className={`w-5 h-5 ${c.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-0.5">{c.label}</p>
                      <p className="font-bold text-sm truncate">{c.value}</p>
                      <p className="text-xs text-muted-foreground">{c.hint}</p>
                    </div>
                    <a href={c.action} target="_blank" rel="noopener noreferrer" className={`text-[10px] font-black tracking-widest uppercase border-b pb-0.5 ${c.color} border-current shrink-0 hover:opacity-70 transition-opacity`}>
                      {c.actionLabel}
                    </a>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C9A86A] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-0.5">Location</p>
                  <p className="text-sm font-medium">Kathmandu, Nepal</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C9A86A] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-0.5">Support Hours</p>
                  <p className="text-sm font-medium">Sunday – Friday, 10AM – 6PM NST</p>
                  <p className="text-xs text-muted-foreground mt-0.5">WhatsApp available 7 days a week</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-border flex items-center justify-center hover:border-[#C9A86A] hover:text-[#C9A86A] transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-border flex items-center justify-center hover:border-[#C9A86A] hover:text-[#C9A86A] transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.15} className="pt-4 border-t border-border">
              <h3 className="font-bold text-sm tracking-widest uppercase mb-6">Frequently Asked Questions</h3>
              {FAQ_ITEMS.map((item) => (<FAQItem key={item.q} q={item.q} a={item.a} />))}
            </FadeIn>
          </div>

          {/* Right: Contact Form */}
          <FadeIn delay={0.1} className="lg:col-span-3">
            <h2 className="font-serif text-2xl mb-8">Send a Message</h2>
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="border border-border p-16 text-center bg-[#F5F3EF] flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#C9A86A]/10 border-2 border-[#C9A86A]/30 flex items-center justify-center mb-6">
                  <Check className="w-8 h-8 text-[#C9A86A]" />
                </div>
                <h3 className="font-serif text-3xl mb-3">Message Sent!</h3>
                <p className="text-muted-foreground text-sm mb-2 max-w-xs">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <p className="text-muted-foreground text-xs mb-8 max-w-xs">You can also view admin replies in your account dashboard under "Messages".</p>
                <button onClick={() => setSent(false)} className="text-[11px] font-black tracking-[0.3em] uppercase border-b border-foreground pb-1 hover:text-[#C9A86A] hover:border-[#C9A86A] transition-colors">
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black tracking-widest uppercase text-muted-foreground mb-2">Full Name *</label>
                    <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" required className="w-full border border-border bg-background px-4 py-3.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black tracking-widest uppercase text-muted-foreground mb-2">Email Address *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" required className="w-full border border-border bg-background px-4 py-3.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black tracking-widest uppercase text-muted-foreground mb-2">Phone / WhatsApp</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+977 98XXXXXXXX" className="w-full border border-border bg-background px-4 py-3.5 text-sm focus:outline-none focus:border-foreground transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black tracking-widest uppercase text-muted-foreground mb-2">Topic *</label>
                    <select value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} required className="w-full border border-border bg-background px-4 py-3.5 text-sm focus:outline-none focus:border-foreground transition-colors h-[50px]">
                      <option value="">Select a topic…</option>
                      <option>Order Enquiry</option>
                      <option>Product Question</option>
                      <option>Shipping & Delivery</option>
                      <option>Returns & Exchanges</option>
                      <option>Styling Advice</option>
                      <option>Wholesale / Collaboration</option>
                      <option>General Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black tracking-widest uppercase text-muted-foreground mb-2">Message *</label>
                  <textarea value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us how we can help…" required rows={7} className="w-full border border-border bg-background px-4 py-3.5 text-sm focus:outline-none focus:border-foreground transition-colors resize-none" />
                </div>
                {error && <p className="text-sm text-destructive bg-red-50 border border-red-200 px-4 py-3">{error}</p>}
                <div className="flex items-center gap-4">
                  <button type="submit" disabled={sending} className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-4 text-[11px] font-black tracking-[0.2em] uppercase hover:bg-[#C9A86A] transition-colors disabled:opacity-60">
                    {sending ? "Sending…" : <><Send className="w-4 h-4" /> Send Message</>}
                  </button>
                  <a href="https://wa.me/9779800000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border-2 border-green-500 text-green-600 px-6 py-4 text-[11px] font-black tracking-wide uppercase hover:bg-green-50 transition-colors whitespace-nowrap">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
                <p className="text-xs text-muted-foreground text-center pt-2">
                  We typically respond within 24 hours. Logged-in users can view replies in their account dashboard.
                </p>
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
