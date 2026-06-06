import { useGetFeaturedProducts, useGetNewArrivals, useGetFeaturedCollections } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { CollectionCard } from "@/components/CollectionCard";
import { useEffect, useState, useCallback } from "react";
import {
  ChevronLeft, ChevronRight, Star, Gem, Layers,
  Scissors, MapPin, Heart, Leaf, Plus, Minus, ArrowRight,
} from "lucide-react";

import brandFreshJuice from "/images/brand-freshjuice.png";
import brandStreetDay from "/images/brand-street-day.png";
import brandGoldPalace from "/images/brand-goldpalace.png";
import brandStairs from "/images/brand-stairs.png";
import brandNight from "/images/brand-night.png";
import brandHotpot from "/images/brand-hotpot.png";
import brandGuys from "/images/brand-guys.png";
import lookbookOutfit1 from "/images/lookbook-outfit1.png";
import lookbookOutfit2 from "/images/lookbook-outfit2.png";
import lookbookOutfit3 from "/images/lookbook-outfit3.png";

const sharp: React.CSSProperties = {
  transform: "translateZ(0)",
  WebkitBackfaceVisibility: "hidden",
  backfaceVisibility: "hidden",
};

type SlideAnim = { initial: object; animate: object; exit: object };

const slideAnims: SlideAnim[] = [
  { initial: { opacity: 0, scale: 1.08 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.02 } },
  { initial: { opacity: 0, x: 80 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -60 } },
  { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  { initial: { opacity: 0, x: -80 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 60 } },
  { initial: { opacity: 0, scale: 0.93 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.04 } },
  { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 30 } },
  { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 } },
  { initial: { opacity: 0, scale: 1.1, rotate: 1.5 }, animate: { opacity: 1, scale: 1, rotate: 0 }, exit: { opacity: 0, scale: 0.97 } },
  { initial: { opacity: 0, x: 60, y: -30 }, animate: { opacity: 1, x: 0, y: 0 }, exit: { opacity: 0, x: -40, y: 20 } },
  { initial: { opacity: 0, scale: 1.06, x: -30 }, animate: { opacity: 1, scale: 1, x: 0 }, exit: { opacity: 0, x: 20 } },
];

const heroSlides = [
  {
    image: brandFreshJuice,
    headline: "FRESH\nDROP",
    sub: "Five looks. One statement. Built in Nepal.",
    cta: "Shop Collection",
    ctaHref: "/shop",
    ctaAlt: "View Lookbook",
    ctaAltHref: "/lookbook",
    pos: "center 30%",
  },
  {
    image: brandStreetDay,
    headline: "STREET\nSOUL",
    sub: "Urban attitude. DIDEE energy. Kathmandu-born.",
    cta: "Explore Now",
    ctaHref: "/shop",
    ctaAlt: "Our Story",
    ctaAltHref: "/our-story",
    pos: "center 25%",
  },
  {
    image: brandGoldPalace,
    headline: "BOLD\nMOVES",
    sub: "Own every street. Wear your identity.",
    cta: "Shop Now",
    ctaHref: "/shop",
    ctaAlt: "Collections",
    ctaAltHref: "/collections",
    pos: "center 20%",
  },
  {
    image: brandStairs,
    headline: "DARK\nEDGE",
    sub: "After hours. Full power. The DIDEE way.",
    cta: "Discover Looks",
    ctaHref: "/shop",
    ctaAlt: "Lookbook",
    ctaAltHref: "/lookbook",
    pos: "center 15%",
  },
  {
    image: brandNight,
    headline: "NIGHT\nROUTE",
    sub: "Kathmandu nights. Unapologetically DIDEE.",
    cta: "Shop Collection",
    ctaHref: "/shop",
    ctaAlt: "Our Story",
    ctaAltHref: "/our-story",
    pos: "center 20%",
  },
  {
    image: brandHotpot,
    headline: "RAW\nENERGY",
    sub: "Born from the streets. Made for everyone.",
    cta: "Shop Now",
    ctaHref: "/shop",
    ctaAlt: "About Us",
    ctaAltHref: "/about",
    pos: "center 25%",
  },
  {
    image: brandGuys,
    headline: "GRAPHIC\nSOUL",
    sub: "Anime art meets Nepalese streetwear.",
    cta: "Explore Drops",
    ctaHref: "/shop",
    ctaAlt: "View All",
    ctaAltHref: "/collections",
    pos: "center 20%",
  },
  {
    image: lookbookOutfit1,
    headline: "GOTH\nCULTURE",
    sub: "Dark edge. Defiant spirit. Worn in Nepal.",
    cta: "Shop The Look",
    ctaHref: "/shop",
    ctaAlt: "View Lookbook",
    ctaAltHref: "/lookbook",
    pos: "center 20%",
  },
  {
    image: lookbookOutfit2,
    headline: "PLAID\nREBEL",
    sub: "Tartan checks. Chain details. DIDEE attitude.",
    cta: "Discover Now",
    ctaHref: "/shop",
    ctaAlt: "Collections",
    ctaAltHref: "/collections",
    pos: "center 20%",
  },
  {
    image: lookbookOutfit3,
    headline: "WIDE\nLEG",
    sub: "Oversized. Unfiltered. Built different.",
    cta: "Shop Now",
    ctaHref: "/shop",
    ctaAlt: "Our Story",
    ctaAltHref: "/our-story",
    pos: "center 20%",
  },
];

const brandPillars = [
  {
    icon: Scissors,
    title: "Craftsmanship & Quality",
    desc: "Every DIDEE piece is meticulously constructed with precision stitching, reinforced seams, and attention to every detail — from the first cut to the final finish.",
  },
  {
    icon: Gem,
    title: "Premium Materials",
    desc: "We source only the finest fabrics — heavyweight cottons, technical textiles, and luxurious blends — chosen to feel exceptional against the skin and endure beyond seasons.",
  },
  {
    icon: Leaf,
    title: "Responsible Production",
    desc: "DIDEE is committed to ethical manufacturing practices. Every garment is produced under fair conditions, with full respect for the people behind each piece.",
  },
  {
    icon: Layers,
    title: "Exclusive Collections",
    desc: "Our drops are intentionally limited — each collection is carefully curated rather than mass-produced, ensuring every piece feels rare, distinctive, and worth owning.",
  },
  {
    icon: MapPin,
    title: "Rooted in Nepal",
    desc: "Born and built in Kathmandu. DIDEE is a love letter to Nepalese creativity — we proudly represent the energy, talent, and ambition of this generation.",
  },
  {
    icon: Heart,
    title: "Customer Commitment",
    desc: "From your first browse to your last unboxing, we obsess over your experience. Real support, honest communication, and fashion that earns your loyalty.",
  },
];

const testimonials = [
  { name: "Priya S.", location: "Kathmandu", rating: 5, text: "The quality is incredible — heavyweight cotton that gets better with every wash. DIDEE is doing something special for Nepalese fashion.", product: "DIDEE Classic Logo Tee" },
  { name: "Aisha R.", location: "Lalitpur", rating: 5, text: "Got so many compliments the first time I wore the Drape Midi Dress. The fabric is perfect and the fit is absolutely stunning.", product: "Drape Midi Dress" },
  { name: "Manisha G.", location: "Bhaktapur", rating: 5, text: "The plaid skirt is art you can wear. I feel so proud wearing something that looks this good and is made right here in Nepal.", product: "Plaid Pleated Skirt" },
  { name: "Sunita K.", location: "Pokhara", rating: 5, text: "Finally a Nepalese brand that understands what modern women want — comfortable, stylish, and authentically us.", product: "Wide Leg Cargo Denim" },
  { name: "Dipika M.", location: "Kathmandu", rating: 5, text: "The leather jacket is worth every rupee. Statement piece, beautiful construction — a masterpiece.", product: "Moto Leather Jacket" },
  { name: "Sita T.", location: "Kathmandu", rating: 5, text: "I ordered three pieces and every single one exceeded my expectations. Attention to detail is on another level.", product: "Studded Belt" },
];

const whyDidee = [
  { num: "01", title: "Built in Nepal", desc: "Proudly rooted in Kathmandu, celebrating Nepalese creativity and craftsmanship at every step." },
  { num: "02", title: "Made for Everyone", desc: "Every design is thoughtfully created for the bold, the fearless, and the free — versatile and stylish." },
  { num: "03", title: "Quality First", desc: "We use premium fabrics and meticulous construction to create pieces that last beyond seasons." },
  { num: "04", title: "Express Yourself", desc: "Fashion is personal. Our collections celebrate individuality and empower you to dress authentically." },
];

const homeFaqs = [
  { q: "What sizes does DIDEE carry?", a: "We carry sizes XS through XL across most of our collections. Each product page includes a detailed size guide to help you find your perfect fit." },
  { q: "How long does delivery take?", a: "Orders within Kathmandu Valley are delivered in 1–2 business days. Other areas in Nepal take 3–5 business days." },
  { q: "What payment methods do you accept?", a: "We accept eSewa, Khalti, Cash on Delivery (COD), and major credit/debit cards. All transactions are fully secured." },
  { q: "Can I return or exchange a product?", a: "Yes — we accept returns within 7 days of delivery on unworn, unwashed items in original packaging." },
  { q: "Are DIDEE clothes ethically made?", a: "Absolutely. We are committed to responsible production, fair practices, and quality materials." },
];

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ScaleIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between py-5 text-left gap-4 group">
        <span className={`text-sm font-medium transition-colors ${open ? "text-[#C9A86A]" : "text-white group-hover:text-[#C9A86A]"}`}>{q}</span>
        <span className="shrink-0 w-6 h-6 flex items-center justify-center border border-white/20 text-white/50 group-hover:border-[#C9A86A] transition-colors">
          {open ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <p className="pb-5 text-sm text-white/50 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const { data: featuredProducts } = useGetFeaturedProducts();
  const { data: newArrivals } = useGetNewArrivals({ limit: 4 });
  const { data: featuredCollections } = useGetFeaturedCollections();

  const [current, setCurrent] = useState(0);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent(c => (c + 1) % heroSlides.length);
  }, []);
  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent(c => (c - 1 + heroSlides.length) % heroSlides.length);
  }, []);
  const goTo = useCallback((i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  }, [current]);

  useEffect(() => { const t = setInterval(next, 3000); return () => clearInterval(t); }, [next]);

  const slide = heroSlides[current];
  const visibleReviews = [0, 1, 2].map(i => testimonials[(reviewIdx + i) % testimonials.length]);

  return (
    <div className="flex flex-col min-h-screen">

      {/* ═══════════════════════════════════════════
          HERO — cinematic full-screen slider
      ════════════════════════════════════════════ */}
      <section
        className="relative bg-black overflow-hidden"
        style={{ width: "100vw", height: "100svh", minHeight: "100vh" }}
      >
        {/* Background image crossfade — unique animation per slide */}
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={current}
            initial={slideAnims[current % slideAnims.length].initial}
            animate={slideAnims[current % slideAnims.length].animate}
            exit={slideAnims[current % slideAnims.length].exit}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt={slide.headline}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                ...sharp,
                objectPosition: slide.pos,
                filter: "contrast(1.08) saturate(1.12) brightness(0.85)",
              }}
              loading={current === 0 ? "eager" : "lazy"}
              decoding="async"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.40) 50%, rgba(0,0,0,0.06) 100%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.60) 0%, transparent 40%)",
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Animated text */}
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-20 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`txt-${current}`}
              initial={{ opacity: 0, x: direction > 0 ? -48 : 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? 32 : -32 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.p
                className="text-[11px] tracking-[0.55em] uppercase text-[#C9A86A] font-black mb-5 drop-shadow-lg"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                DIDEE® — BUILT IN NEPAL
              </motion.p>
              <motion.h1
                className="font-serif font-medium text-white leading-none mb-6 drop-shadow-2xl whitespace-pre-line"
                style={{ fontSize: "clamp(4rem, 10vw, 9rem)", letterSpacing: "0.05em" }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                {slide.headline}
              </motion.h1>
              <motion.p
                className="text-sm md:text-base tracking-[0.22em] font-medium mb-12 uppercase text-white/80 max-w-md drop-shadow-lg"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.6 }}
              >
                {slide.sub}
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row items-start gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Link
                  href={slide.ctaHref}
                  className="bg-white text-black px-10 py-4 text-[11px] font-black tracking-[0.28em] uppercase shadow-xl hover:bg-[#C9A86A] hover:text-white transition-all duration-300"
                >
                  {slide.cta}
                </Link>
                <Link
                  href={slide.ctaAltHref}
                  className="border border-white/70 text-white px-10 py-4 text-[11px] font-black tracking-[0.28em] uppercase hover:bg-white/15 hover:border-white transition-all duration-300 backdrop-blur-sm"
                >
                  {slide.ctaAlt}
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide indicator bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 flex">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="h-0.5 flex-1 relative overflow-hidden focus:outline-none"
              style={{ background: "rgba(255,255,255,0.18)" }}
            >
              {i === current && (
                <motion.div
                  className="absolute inset-y-0 left-0"
                  style={{ background: "#C9A86A" }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                />
              )}
              {i !== current && (
                <div className="absolute inset-0" style={{ background: i < current ? "rgba(201,168,106,0.5)" : "rgba(255,255,255,0.18)" }} />
              )}
            </button>
          ))}
        </div>


        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-4 md:left-8 bottom-12 z-20 w-12 h-12 flex items-center justify-center border border-white/40 text-white hover:border-[#C9A86A] hover:text-[#C9A86A] hover:bg-white/10 transition-all backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute left-20 md:left-24 bottom-12 z-20 w-12 h-12 flex items-center justify-center border border-white/40 text-white hover:border-[#C9A86A] hover:text-[#C9A86A] hover:bg-white/10 transition-all backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide counter */}
        <div className="absolute bottom-14 right-8 z-20 hidden md:block select-none pointer-events-none">
          <span className="text-white font-serif text-6xl opacity-12">
            {String(current + 1).padStart(2, "0")}<span className="text-2xl opacity-40"> / {String(heroSlides.length).padStart(2, "0")}</span>
          </span>
        </div>

        {/* Mobile dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 md:hidden">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{ width: i === current ? 24 : 6, height: 6, background: i === current ? "#C9A86A" : "rgba(255,255,255,0.4)" }}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          OUR PHILOSOPHY — light, clean, modern
      ════════════════════════════════════════════ */}
      <section className="relative py-32 md:py-44 bg-[#F5F3EF] overflow-hidden px-4">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,168,106,0.10) 0%, transparent 65%)"
        }} />

        <div className="container mx-auto max-w-5xl relative z-10">
          <FadeUp>
            <p className="text-center text-[11px] tracking-[0.6em] uppercase text-[#C9A86A] font-black mb-8">
              Our Philosophy
            </p>
          </FadeUp>

          <FadeUp delay={0.06}>
            <h2 className="text-center font-serif text-4xl md:text-6xl lg:text-7xl text-[#0A0A0A] leading-[1.08] mb-8 tracking-tight">
              Fashion is identity.<br />
              <span className="text-[#C9A86A]">Identity is everything.</span>
            </h2>
          </FadeUp>

          <FadeUp delay={0.12}>
            <p className="text-center text-[#0A0A0A]/60 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-20 font-light">
              At DIDEE, we believe clothing is a form of self-authorship. Every seam, every silhouette, every drop is designed with one purpose — to help you express who you truly are, with confidence, comfort, and unapologetic authenticity.
            </p>
          </FadeUp>

          {/* Three philosophy pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {[
              {
                num: "I",
                title: "Self-Expression",
                body: "We don't dictate what to wear. We design freedom — giving you versatile, bold, expressive pieces that speak your language, not ours.",
              },
              {
                num: "II",
                title: "Uncompromised Quality",
                body: "Every fabric is chosen for feel, durability, and movement. Every stitch is placed with intention. DIDEE is built to outlast trends.",
              },
              {
                num: "III",
                title: "Nepalese Pride",
                body: "We are not inspired by Nepal — we are Nepal. Born in Kathmandu, shaped by its streets, fuelled by its ambition. This is local excellence with global standards.",
              },
            ].map((p, i) => (
              <FadeUp key={p.num} delay={0.08 + i * 0.1}>
                <div className="bg-white border border-[#C9A86A]/15 p-10 md:p-12 text-center group hover:border-[#C9A86A]/50 hover:shadow-lg transition-all duration-500 h-full">
                  <p className="font-serif text-5xl text-[#C9A86A] mb-6 opacity-60 group-hover:opacity-100 transition-opacity duration-500">{p.num}</p>
                  <div className="w-8 h-px bg-[#C9A86A]/30 mx-auto mb-5" />
                  <h3 className="font-serif text-xl text-[#0A0A0A] mb-5 tracking-wide">{p.title}</h3>
                  <p className="text-[#0A0A0A]/55 text-sm leading-relaxed">{p.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Brand quote */}
          <FadeUp delay={0.14}>
            <div className="text-center mb-20">
              <p className="font-serif text-2xl md:text-3xl text-[#0A0A0A]/65 italic leading-relaxed max-w-2xl mx-auto">
                "Built in Nepal. Made for Everyone."
              </p>
              <div className="w-16 h-px bg-[#C9A86A] mx-auto mt-6" />
            </div>
          </FadeUp>

          {/* Stats row — Inter font for clear numerals */}
          <FadeUp delay={0.18}>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20">
              {[
                ["2025", "Established"],
                ["500+", "Happy Customers"],
                ["100%", "Made in Nepal"],
                ["3+", "Signature Collections"],
              ].map(([num, label]) => (
                <motion.div
                  key={label}
                  className="text-center group"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-sans text-4xl md:text-5xl text-[#C9A86A] font-bold mb-2 group-hover:scale-110 transition-transform duration-300 tabular-nums">{num}</p>
                  <p className="text-[10px] text-[#0A0A0A]/45 tracking-[0.4em] uppercase font-medium">{label}</p>
                </motion.div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SIGNATURE COLLECTIONS — 3-column cinematic grid
      ════════════════════════════════════════════ */}
      <section className="bg-[#0A0A0A]">
        <div className="text-center pt-20 pb-12 px-4">
          <FadeUp><p className="text-xs tracking-[0.5em] uppercase text-[#C9A86A] font-medium mb-4">Signature Collections</p></FadeUp>
          <FadeUp delay={0.07}><h2 className="font-serif text-4xl md:text-5xl text-white">The DIDEE World</h2></FadeUp>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
          {/* Big left panel */}
          <ScaleIn delay={0} className="md:col-span-2 group relative overflow-hidden cursor-pointer">
            <div style={{ minHeight: "72vh", position: "relative" }}>
              <img
                src={brandFreshJuice}
                alt="DIDEE — Fresh Drop Collection"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-105"
                style={{ ...sharp, objectPosition: "center 30%", filter: "contrast(1.1) saturate(1.12) brightness(0.86)" }}
                loading="lazy"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.12) 52%, rgba(0,0,0,0.02) 100%)" }} />
              <span className="absolute top-6 left-6 text-[10px] tracking-[0.4em] font-black uppercase text-[#C9A86A] bg-black/55 px-3 py-1.5 backdrop-blur-sm border border-[#C9A86A]/40">NEW SEASON</span>
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <p className="text-[10px] tracking-[0.4em] uppercase text-white/55 mb-2 font-medium">Plaid · Goth · Street</p>
                <h3 className="font-serif text-5xl md:text-6xl text-white mb-4 leading-none drop-shadow-lg">Fresh<br />Drop</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-7 max-w-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  Five looks shot on the streets of Kathmandu. Plaid pleats, chain belts, black crop tops, and bold accessories that define the DIDEE aesthetic.
                </p>
                <Link href="/shop" className="inline-flex items-center gap-3 text-[11px] font-black tracking-[0.3em] uppercase text-white border-b border-[#C9A86A] pb-1 hover:text-[#C9A86A] transition-colors">
                  Shop Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </ScaleIn>

          {/* Right stacked panels */}
          <div className="flex flex-col gap-px">
            <ScaleIn delay={0.1} className="group relative overflow-hidden cursor-pointer flex-1">
              <div style={{ minHeight: "36vh", position: "relative" }}>
                <img
                  src={brandNight}
                  alt="Night Collection"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-105"
                  style={{ ...sharp, objectPosition: "center 20%", filter: "contrast(1.08) saturate(1.1) brightness(0.88)" }}
                  loading="lazy"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.08) 60%)" }} />
                <span className="absolute top-4 left-4 text-[10px] tracking-[0.3em] font-black uppercase text-white/80 bg-black/45 px-2.5 py-1 backdrop-blur-sm">BESTSELLER</span>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-1 font-medium">Night · Dark · Edge</p>
                  <h3 className="font-serif text-3xl text-white mb-3 leading-none drop-shadow-md">Night Route</h3>
                  <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-[#C9A86A] opacity-0 group-hover:opacity-100 transition-all duration-400">
                    Explore <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </ScaleIn>
            <ScaleIn delay={0.18} className="group relative overflow-hidden cursor-pointer flex-1">
              <div style={{ minHeight: "36vh", position: "relative" }}>
                <img
                  src={brandGuys}
                  alt="Graphic Tee Collection"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-105"
                  style={{ ...sharp, objectPosition: "center 20%", filter: "contrast(1.08) saturate(1.1) brightness(0.88)" }}
                  loading="lazy"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.08) 60%)" }} />
                <span className="absolute top-4 left-4 text-[10px] tracking-[0.3em] font-black uppercase text-white/80 bg-black/45 px-2.5 py-1 backdrop-blur-sm">FEATURED</span>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-1 font-medium">Graphic · Anime · Street</p>
                  <h3 className="font-serif text-3xl text-white mb-3 leading-none drop-shadow-md">Graphic Soul</h3>
                  <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-[#C9A86A] opacity-0 group-hover:opacity-100 transition-all duration-400">
                    Explore <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </ScaleIn>
          </div>
        </div>

        {/* Second row — 3 equal panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 mt-px">
          {[
            { img: brandStreetDay, label: "Street · Plaid · Day", title: "Street Soul", badge: "NEW DROP", pos: "center 25%" },
            { img: brandGoldPalace, label: "Urban · City · Bold", title: "Bold Moves", badge: "TRENDING", pos: "center 20%" },
            { img: brandStairs, label: "Dark · Dramatic · Power", title: "Dark Edge", badge: "EDITORIAL", pos: "center 15%" },
          ].map((item, i) => (
            <ScaleIn key={item.title} delay={i * 0.08} className="group relative overflow-hidden cursor-pointer">
              <div style={{ minHeight: "52vh", position: "relative" }}>
                <img
                  src={item.img}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-105"
                  style={{ ...sharp, objectPosition: item.pos, filter: "contrast(1.1) saturate(1.12) brightness(0.84)" }}
                  loading="lazy"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.10) 55%)" }} />
                <span className="absolute top-4 left-4 text-[10px] tracking-[0.3em] font-black uppercase text-[#C9A86A] bg-black/55 px-2.5 py-1 backdrop-blur-sm border border-[#C9A86A]/30">{item.badge}</span>
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-white/50 mb-1 font-medium">{item.label}</p>
                  <h3 className="font-serif text-3xl md:text-4xl text-white mb-4 leading-none">{item.title}</h3>
                  <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-white border-b border-[#C9A86A]/60 pb-0.5 opacity-0 group-hover:opacity-100 group-hover:text-[#C9A86A] group-hover:border-[#C9A86A] transition-all duration-500">
                    Shop Now <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </ScaleIn>
          ))}
        </div>

        <div className="text-center py-14 px-4">
          <FadeUp>
            <Link href="/shop" className="inline-flex items-center gap-3 border border-white/25 text-white px-14 py-4 text-[11px] font-black tracking-[0.28em] uppercase hover:bg-white hover:text-black transition-all duration-300">
              Browse All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED COLLECTIONS (API)
      ════════════════════════════════════════════ */}
      {featuredCollections && featuredCollections.length > 0 && (
        <section className="py-20 px-4 bg-[#F5F3EF]">
          <div className="container mx-auto">
            <FadeUp className="flex items-center justify-between mb-10">
              <h2 className="font-serif text-3xl font-medium">Collections</h2>
              <Link href="/collections" className="text-xs font-black tracking-widest uppercase hover:text-[#C9A86A] transition-colors border-b border-current pb-1">View All</Link>
            </FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {featuredCollections.filter(c => c.slug !== "men").slice(0, 3).map((collection, index) => (
                <ScaleIn key={collection.id} delay={index * 0.1}>
                  <CollectionCard collection={collection} index={index} />
                </ScaleIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          NEW ARRIVALS
      ════════════════════════════════════════════ */}
      {newArrivals && newArrivals.length > 0 && (
        <section className="py-24 bg-background px-4">
          <div className="container mx-auto">
            <FadeUp className="flex items-center justify-between mb-10">
              <div>
                <p className="text-xs tracking-[0.4em] uppercase text-[#C9A86A] font-medium mb-2">Just In</p>
                <h2 className="font-serif text-3xl md:text-4xl">New Arrivals</h2>
              </div>
              <Link href="/shop?sort=newest" className="text-xs font-black tracking-widest uppercase hover:text-[#C9A86A] transition-colors border-b border-current pb-1">View All</Link>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.map((product, index) => (
                <ScaleIn key={product.id} delay={index * 0.08}>
                  <ProductCard product={product} />
                </ScaleIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          FEATURED PRODUCTS
      ════════════════════════════════════════════ */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-24 bg-[#F5F3EF] px-4">
          <div className="container mx-auto">
            <FadeUp className="flex items-center justify-between mb-10">
              <div>
                <p className="text-xs tracking-[0.4em] uppercase text-[#C9A86A] font-medium mb-2">Editor's Pick</p>
                <h2 className="font-serif text-3xl md:text-4xl">Featured Pieces</h2>
              </div>
              <Link href="/shop?featured=true" className="text-xs font-black tracking-widest uppercase hover:text-[#C9A86A] transition-colors border-b border-current pb-1">Shop All</Link>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.slice(0, 4).map((product, index) => (
                <ScaleIn key={product.id} delay={index * 0.08}>
                  <ProductCard product={product} />
                </ScaleIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          WHY DIDEE — light theme
      ════════════════════════════════════════════ */}
      <section className="py-28 bg-white px-4 border-t border-border">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-20">
            <FadeUp><p className="text-xs tracking-[0.5em] uppercase text-[#C9A86A] font-medium mb-4">Why DIDEE</p></FadeUp>
            <FadeUp delay={0.07}><h2 className="font-serif text-4xl md:text-5xl text-[#0A0A0A]">Fashion with purpose.</h2></FadeUp>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-14">
            {whyDidee.map((item, i) => (
              <FadeUp key={item.num} delay={i * 0.1}>
                <div className="flex gap-6 group p-6 hover:bg-[#F5F3EF] transition-colors duration-300 border border-transparent hover:border-[#C9A86A]/20">
                  <span className="font-sans text-4xl font-bold text-[#C9A86A] leading-none select-none opacity-40 group-hover:opacity-80 transition-opacity tabular-nums shrink-0">{item.num}</span>
                  <div>
                    <h3 className="text-[#0A0A0A] font-semibold text-lg mb-2 tracking-wide">{item.title}</h3>
                    <p className="text-[#0A0A0A]/55 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FULL-BLEED EDITORIAL STRIP — hotpot
      ════════════════════════════════════════════ */}
      <div className="relative overflow-hidden" style={{ height: "65vh" }}>
        <motion.div
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={brandHotpot}
            alt="DIDEE Editorial"
            className="w-full h-full object-cover"
            style={{ ...sharp, objectPosition: "center 25%", filter: "contrast(1.1) saturate(1.1) brightness(0.82)" }}
            loading="lazy"
          />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.20) 60%, rgba(0,0,0,0.04) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%)" }} />
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-20">
          <FadeUp className="max-w-xl">
            <p className="text-xs tracking-[0.5em] uppercase text-[#C9A86A] font-medium mb-5">DIDEE Editorial</p>
            <p className="font-serif text-4xl md:text-5xl text-white leading-tight mb-7 drop-shadow-xl">
              "Raw energy. Real streets.<br />Built in Nepal."
            </p>
            <Link href="/lookbook" className="inline-flex items-center gap-3 border border-white/50 text-white px-10 py-3.5 text-[11px] font-black tracking-[0.28em] uppercase hover:bg-white/15 hover:border-white transition-all duration-300 backdrop-blur-sm">
              View Lookbook <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </FadeUp>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          BRAND PILLARS
      ════════════════════════════════════════════ */}
      <section className="py-32 bg-[#0A0A0A] px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(201,168,106,0.06) 0%, transparent 60%)" }} />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-8">
            <div>
              <FadeUp>
                <p className="text-[11px] tracking-[0.6em] uppercase text-[#C9A86A] font-black mb-5">The DIDEE Standard</p>
              </FadeUp>
              <FadeUp delay={0.06}>
                <h2 className="font-serif text-5xl md:text-7xl text-white font-medium leading-[0.92]">What sets<br />us apart.</h2>
              </FadeUp>
            </div>
            <FadeUp delay={0.12}>
              <p className="text-white/40 text-sm max-w-xs leading-relaxed md:text-right md:pb-2">Six principles that define every thread, every seam, and every decision at DIDEE.</p>
            </FadeUp>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8">
            {brandPillars.map((p, i) => (
              <FadeUp key={p.title} delay={i * 0.07}>
                <motion.div
                  className="group p-10 bg-[#0A0A0A] hover:bg-[#111111] transition-all duration-500 cursor-default h-full relative overflow-hidden"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="absolute top-5 right-7 font-serif text-8xl text-white/[0.04] font-bold select-none leading-none group-hover:text-[#C9A86A]/8 transition-colors duration-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-14 h-14 flex items-center justify-center bg-[#C9A86A]/10 border border-[#C9A86A]/20 group-hover:bg-[#C9A86A]/20 group-hover:border-[#C9A86A]/50 transition-all duration-400 mb-8">
                    <p.icon className="w-6 h-6 text-[#C9A86A]" />
                  </div>
                  <div className="w-8 h-px bg-[#C9A86A]/30 group-hover:w-16 group-hover:bg-[#C9A86A] transition-all duration-500 mb-5" />
                  <h3 className="font-serif text-xl text-white mb-3 leading-tight">{p.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed group-hover:text-white/65 transition-colors duration-300">{p.desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          REVIEWS
      ════════════════════════════════════════════ */}
      <section className="py-24 bg-background px-4">
        <div className="container mx-auto max-w-5xl">
          <FadeUp className="text-center mb-14">
            <p className="text-xs tracking-[0.4em] uppercase text-[#C9A86A] font-medium mb-3">Customer Love</p>
            <h2 className="font-serif text-4xl">What people are saying.</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleReviews.map((r, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="bg-[#F5F3EF] p-8 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-[#C9A86A] text-[#C9A86A]" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80 flex-1 mb-6 italic">"{r.text}"</p>
                  <div>
                    <p className="font-medium text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.location} · {r.product}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
          <div className="flex justify-center gap-3 mt-8">
            <button onClick={() => setReviewIdx(i => (i - 1 + testimonials.length) % testimonials.length)} className="w-10 h-10 border border-border flex items-center justify-center hover:border-[#C9A86A] transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setReviewIdx(i => (i + 1) % testimonials.length)} className="w-10 h-10 border border-border flex items-center justify-center hover:border-[#C9A86A] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ
      ════════════════════════════════════════════ */}
      <section className="py-24 bg-[#0A0A0A] px-4">
        <div className="container mx-auto max-w-2xl">
          <FadeUp className="text-center mb-14">
            <p className="text-xs tracking-[0.4em] uppercase text-[#C9A86A] font-medium mb-3">FAQ</p>
            <h2 className="font-serif text-4xl text-white">Common questions.</h2>
          </FadeUp>
          <div>
            {homeFaqs.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FINAL CTA — full bleed Gold Palace
      ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: "60vh" }}>
        <motion.div
          initial={{ scale: 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={brandGoldPalace}
            alt="DIDEE"
            className="w-full h-full object-cover"
            style={{ ...sharp, objectPosition: "center 20%", filter: "contrast(1.1) saturate(1.12) brightness(0.78)" }}
            loading="lazy"
          />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.62)" }} />
        <div className="relative z-10 flex flex-col items-center justify-center text-white text-center px-4 min-h-[60vh]">
          <FadeUp>
            <p className="text-xs tracking-[0.5em] uppercase text-[#C9A86A] font-medium mb-5">Join the Movement</p>
            <h2 className="font-serif text-5xl md:text-6xl mb-6 drop-shadow-xl">Wear your story.</h2>
            <p className="text-white/60 mb-10 text-sm tracking-wide max-w-sm leading-relaxed">Built in Nepal. Made for everyone. This is DIDEE.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="bg-[#C9A86A] text-black px-14 py-4 text-[11px] font-black tracking-[0.28em] uppercase hover:bg-white transition-colors shadow-xl">
                Shop Now
              </Link>
              <Link href="/our-story" className="border border-white/45 text-white px-14 py-4 text-[11px] font-black tracking-[0.28em] uppercase hover:border-white hover:bg-white/10 transition-colors backdrop-blur-sm">
                Our Story
              </Link>
              <Link href="/contact" className="border border-[#C9A86A]/60 text-[#C9A86A] px-14 py-4 text-[11px] font-black tracking-[0.28em] uppercase hover:border-[#C9A86A] hover:bg-[#C9A86A]/10 transition-colors backdrop-blur-sm">
                Contact Us
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
