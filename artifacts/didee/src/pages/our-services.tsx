import { motion } from "framer-motion";
import { Link } from "wouter";
import { Package, Shirt, ShoppingBag, Star, Sparkles, Calendar, Gem, Settings, Users, Heart } from "lucide-react";

const SERVICES = [
  {
    icon: Package,
    title: "Premium Fashion Collections",
    description: "Carefully curated fashion collections that blend modern trends, streetwear culture, and everyday comfort. Designed for individuals who want to express their personality through bold, stylish, and contemporary fashion choices.",
  },
  {
    icon: Shirt,
    title: "Streetwear Fashion",
    description: "Fresh, fashion-forward streetwear collections inspired by global trends and local creativity. Oversized fits, graphic tops, cargo pants, statement outerwear, and trend-driven pieces for people who embrace individuality.",
  },
  {
    icon: ShoppingBag,
    title: "Casual Everyday Essentials",
    description: "Designed for students, professionals, creators, and individuals who want comfortable, versatile clothing without compromising style. Relaxed fits, everyday tops, and layering essentials for daily wear.",
  },
  {
    icon: Heart,
    title: "Women's Fashion Collection",
    description: "Contemporary silhouettes, modern dresses, skirts, tops, fashion accessories, and trend-inspired pieces designed to help women express their personal style with confidence and comfort.",
  },
  {
    icon: Sparkles,
    title: "Alternative & Trend Fashion",
    description: "Unique designs, statement accessories, layered styling options, and distinctive looks for individuals who want fashion that reflects their personality. Inspired by global fashion movements and modern street aesthetics.",
  },
  {
    icon: Calendar,
    title: "Seasonal Fashion Collections",
    description: "Regularly updated seasonal collections inspired by changing trends, customer preferences, and modern fashion culture — fresh styles, limited-edition designs, and trend-focused products throughout the year.",
  },
  {
    icon: Gem,
    title: "Fashion Accessories",
    description: "Belts, bags, caps, hats, jewelry, chains, and seasonal accessories — each chosen to enhance personal style and complete fashion-forward looks from head to toe.",
  },
  {
    icon: Star,
    title: "Limited Edition Drops",
    description: "Exclusive collections, special collaborations, and trend-driven pieces available for a limited time. For customers seeking something truly unique and impossible to find elsewhere.",
  },
  {
    icon: Settings,
    title: "Personalized Shopping Experience",
    description: "Easy product discovery, detailed product information, size guidance, secure ordering, fast customer support, order tracking, and convenient payment options. Fashion shopping made simple.",
  },
  {
    icon: Users,
    title: "Community & Fashion Inspiration",
    description: "More than a clothing brand — a community of fashion enthusiasts, creators, students, professionals, and trendsetters. Lookbooks, styling ideas, and community engagement to help you discover new ways to express yourself.",
  },
];

const COMMITMENTS = [
  "Modern Style",
  "Everyday Comfort",
  "Quality Craftsmanship",
  "Trend-Driven Designs",
  "Inclusive Fashion",
  "Customer Satisfaction",
  "Confidence Through Style",
  "Built in Nepal, Made for Everyone",
];

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function OurServices() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero — split layout: image left, text right */}
      <section className="min-h-[75vh] grid grid-cols-1 md:grid-cols-2">
        {/* Left — full image */}
        <div className="relative overflow-hidden min-h-[45vh] md:min-h-[75vh]">
          <motion.img
            src="/images/lookbook-outfit3.png"
            alt="DIDEE Services"
            className="w-full h-full object-cover object-top"
            style={{ minHeight: "380px" }}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/15" />
          <div className="absolute bottom-6 left-6">
            <span className="bg-[#C9A86A] text-black text-[10px] font-black tracking-[0.3em] uppercase px-4 py-2">DIDEE Premium</span>
          </div>
        </div>
        {/* Right — text panel */}
        <div className="bg-[#0A0A0A] flex flex-col justify-center px-10 md:px-16 py-24">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-[11px] tracking-[0.5em] uppercase text-[#C9A86A] font-black mb-6"
          >
            DIDEE — What We Offer
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-6xl md:text-7xl text-white font-medium leading-none mb-8"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/65 text-lg leading-relaxed max-w-lg mb-10"
          >
            From premium collections and exclusive drops to a fully personalized shopping experience — everything DIDEE offers, in one place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex items-center gap-5"
          >
            <div className="h-px w-16 bg-[#C9A86A]" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86A] font-black">Premium · Curated · Nepalese</span>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground font-black mb-4">Everything We Do</p>
            <h2 className="font-serif text-4xl md:text-5xl">What We Offer</h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-border">
            {SERVICES.map((service, i) => (
              <FadeIn
                key={service.title}
                delay={i * 0.05}
                className="p-8 border-b border-r border-border hover:bg-[#F5F3EF] transition-colors group"
              >
                <div className="w-12 h-12 border border-[#C9A86A]/30 bg-[#C9A86A]/5 flex items-center justify-center mb-6 group-hover:bg-[#C9A86A]/10 transition-colors">
                  <service.icon className="w-5 h-5 text-[#C9A86A]" />
                </div>
                <h3 className="font-bold text-base mb-3 tracking-wide">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Accessories Detail */}
      <section className="py-20 px-6 md:px-16 bg-[#F5F3EF] border-t border-b border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground font-black mb-6">Accessories Collection</p>
            <h2 className="font-serif text-4xl mb-8 leading-tight">Complete Your Look</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Fashion is in the details. Our accessories collection is carefully selected to complement every outfit in our range — from everyday basics to statement pieces.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {["Belts", "Bags", "Caps & Hats", "Jewelry", "Chains", "Fashion Accessories", "Seasonal Accessories", "Statement Pieces"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9A86A] shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src="/products/product3.jpg" alt="Accessories" className="w-full aspect-[3/4] object-cover" />
            <div className="absolute -bottom-4 -right-4 bg-[#0A0A0A] text-white px-6 py-4">
              <p className="text-xs font-black tracking-widest uppercase text-white/60">New Drops</p>
              <p className="text-lg font-bold">Every Season</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-24 px-6 md:px-16 bg-[#0A0A0A] text-white">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-[11px] tracking-[0.4em] uppercase text-white/40 font-black mb-4">Our Promise</p>
            <h2 className="font-serif text-4xl md:text-5xl mb-6">Our Commitment</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              At DIDEE, we are committed to delivering fashion that combines quality, creativity, and accessibility — every single time.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {COMMITMENTS.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="border border-white/10 p-5 hover:border-[#C9A86A] transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#C9A86A] text-lg font-bold">✔</span>
                </div>
                <p className="text-sm font-bold text-white/90">{item}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-white/40 text-sm mb-8 leading-relaxed max-w-2xl mx-auto">
              Our mission is to create fashion that empowers individuals to express who they are while feeling comfortable, confident, and stylish every day.
            </p>
            <Link
              href="/shop"
              className="inline-block border border-white px-16 py-5 text-[11px] tracking-[0.4em] uppercase font-black hover:bg-white hover:text-black transition-all duration-300"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
