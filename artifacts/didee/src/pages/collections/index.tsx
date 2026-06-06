import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Tag, Layers, Star } from "lucide-react";
import { useListCollections, useGetFeaturedCollections } from "@workspace/api-client-react";
import { CollectionCard } from "@/components/CollectionCard";

const EDITORIAL_DROPS = [
  {
    tag: "SS25 — FEATURED",
    title: "Fresh Drop",
    subtitle: "Plaid · Goth · Street",
    desc: "Five looks shot on the streets of Kathmandu. Plaid pleats, chain belts, black crop tops, and bold accessories that define the DIDEE aesthetic. Built for those who refuse to blend in.",
    image: "/images/brand-freshjuice.png",
    cta: "/shop",
    align: "right",
    badge: "NEW SEASON",
    stat: "5 Looks",
  },
  {
    tag: "SS25 — NIGHTLIFE",
    title: "Night Route",
    subtitle: "Dark · Moody · Edge",
    desc: "After sunset, the city belongs to those who dare. Night Route blends dark streetwear silhouettes with precision-cut details and an attitude that speaks louder than words.",
    image: "/images/brand-night.png",
    cta: "/shop",
    align: "left",
    badge: "BESTSELLER",
    stat: "8 Pieces",
  },
  {
    tag: "SS25 — GRAPHIC",
    title: "Graphic Soul",
    subtitle: "Anime · Graphic · Street",
    desc: "Where art meets fashion — bold graphic prints, oversized silhouettes, and anime-inspired motifs crafted for the new generation of Nepalese streetwear culture.",
    image: "/images/brand-guys.png",
    cta: "/shop",
    align: "right",
    badge: "FEATURED",
    stat: "6 Pieces",
  },
];

const STATS = [
  { label: "Collections", value: "6+", icon: Layers },
  { label: "Pieces Per Drop", value: "5–12", icon: Tag },
  { label: "New Drops / Year", value: "4", icon: Sparkles },
  { label: "Made In", value: "Nepal", icon: Star },
];

const CATEGORY_TILES = [
  { label: "New Arrivals", slug: "new-arrivals", image: "/images/brand-freshjuice.png", count: "Latest" },
  { label: "Streetwear", slug: "streetwear", image: "/images/brand-street-day.png", count: "Bold" },
  { label: "Dark Aesthetic", slug: "dark-aesthetic", image: "/images/brand-night.png", count: "Moody" },
  { label: "Graphic Tees", slug: "graphic-tees", image: "/images/brand-guys.png", count: "Artistic" },
  { label: "Accessories", slug: "accessories", image: "/images/brand-hotpot.png", count: "Details" },
  { label: "Limited Edition", slug: "limited-edition", image: "/images/brand-goldpalace.png", count: "Exclusive" },
];

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Collections() {
  const { data: collections } = useListCollections();
  const { data: featured } = useGetFeaturedCollections();

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ── Hero ── */}
      <section className="relative min-h-[65vh] flex flex-col justify-end pb-20 px-6 md:px-20 overflow-hidden">
        <motion.div
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src="/images/brand-goldpalace.png"
            alt="DIDEE Collections"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 20%", filter: "contrast(1.1) brightness(0.65) saturate(1.1)" }}
          />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.35) 55%, rgba(10,10,10,0.10) 100%)" }} />
        <div className="relative z-10 max-w-4xl">
          <FadeUp>
            <p className="text-[11px] tracking-[0.6em] uppercase text-[#C9A86A] font-black mb-5">DIDEE — The Collections</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="font-serif text-6xl md:text-8xl text-white font-medium leading-none mb-6">
              The DIDEE<br />World
            </h1>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
              Each DIDEE collection is a distinct expression of Nepalese street culture — fearless drops that blend global aesthetics with Kathmandu's raw, unapologetic energy.
            </p>
          </FadeUp>
          <FadeUp delay={0.3}>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-[#C9A86A] text-black px-12 py-4 text-[11px] font-black tracking-[0.3em] uppercase hover:bg-white transition-colors"
            >
              Shop All Pieces <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ── Category Quick-Shop Tiles ── */}
      <section className="py-24 px-4 md:px-10">
        <FadeUp className="text-center mb-16">
          <p className="text-[11px] tracking-[0.5em] uppercase text-[#C9A86A] font-black mb-4">Shop by Style</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white">Find Your Aesthetic</h2>
        </FadeUp>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-5xl mx-auto">
          {CATEGORY_TILES.map((tile, i) => (
            <FadeUp key={tile.slug} delay={i * 0.07}>
              <Link href={`/shop?category=${tile.slug}`}>
                <motion.div
                  className="relative overflow-hidden group cursor-pointer aspect-[4/3]"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={tile.image}
                    alt={tile.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    style={{ filter: "brightness(0.7) contrast(1.05)" }}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 60%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[9px] tracking-[0.35em] uppercase text-[#C9A86A] font-black mb-1">{tile.count}</p>
                    <h3 className="font-serif text-xl text-white leading-tight">{tile.label}</h3>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-white/0 group-hover:bg-[#C9A86A] flex items-center justify-center transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-transparent group-hover:text-black transition-colors duration-300" />
                  </div>
                </motion.div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Editorial Drops ── */}
      <section className="border-t border-white/10">
        <div className="text-center py-20 px-4">
          <FadeUp>
            <p className="text-[11px] tracking-[0.5em] uppercase text-[#C9A86A] font-black mb-4">Editorial</p>
            <h2 className="font-serif text-4xl md:text-6xl text-white">Signature Drops</h2>
            <p className="text-white/45 mt-4 text-base max-w-xl mx-auto">Each drop tells a story. Every piece is designed with the streets of Kathmandu in mind.</p>
          </FadeUp>
        </div>

        {EDITORIAL_DROPS.map((drop, idx) => (
          <motion.div
            key={drop.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9 }}
            className={`flex flex-col ${drop.align === "left" ? "md:flex-row" : "md:flex-row-reverse"} min-h-[80vh] border-t border-white/8`}
          >
            {/* Image */}
            <div className="w-full md:w-3/5 relative overflow-hidden">
              <motion.img
                src={drop.image}
                alt={drop.title}
                className="w-full h-full object-cover"
                style={{ minHeight: "50vh", filter: "contrast(1.08) saturate(1.1)" }}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 1.2 }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.5) 0%, transparent 40%)" }} />
              <span className="absolute top-6 left-6 text-[10px] tracking-[0.35em] font-black uppercase bg-[#C9A86A] text-black px-3 py-1.5">{drop.badge}</span>
              <div className="absolute bottom-6 right-6">
                <p className="font-sans text-sm font-black text-white/60">{drop.stat}</p>
              </div>
            </div>
            {/* Text */}
            <div className="w-full md:w-2/5 flex flex-col justify-center px-10 md:px-16 py-20 bg-[#0A0A0A]">
              <p className="text-[10px] tracking-[0.5em] uppercase text-white/35 mb-5 font-black">{drop.tag}</p>
              <h2 className="font-serif text-5xl md:text-6xl text-white font-medium leading-none mb-4">{drop.title}</h2>
              <p className="text-[11px] tracking-[0.3em] uppercase text-[#C9A86A] font-black mb-8">{drop.subtitle}</p>
              <p className="text-white/55 leading-relaxed text-base mb-12 max-w-sm">{drop.desc}</p>
              <Link
                href={drop.cta}
                className="inline-flex items-center gap-3 border border-white text-white px-10 py-4 text-[11px] font-black tracking-[0.28em] uppercase hover:bg-white hover:text-black transition-all duration-300 w-fit"
              >
                Shop The Drop <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ── API Collections Grid ── */}
      {collections && collections.length > 0 && (
        <section className="py-24 px-4 md:px-10 bg-[#111] border-t border-white/10">
          <FadeUp className="text-center mb-16">
            <p className="text-[11px] tracking-[0.5em] uppercase text-[#C9A86A] font-black mb-4">All Collections</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white">Browse Everything</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {collections.map((collection, index) => (
              <CollectionCard key={collection.id} collection={collection} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden py-40 text-center px-6">
        <motion.div
          initial={{ scale: 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6 }}
          className="absolute inset-0"
        >
          <img src="/images/brand-stairs.png" alt="DIDEE" className="w-full h-full object-cover" style={{ filter: "brightness(0.4) contrast(1.1)" }} />
        </motion.div>
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-[11px] tracking-[0.6em] uppercase text-[#C9A86A] font-black mb-5">Built in Nepal. Made for Everyone.</p>
            <h2 className="font-serif text-5xl md:text-7xl text-white mb-8 font-medium">Wear Your Story.</h2>
            <p className="text-white/50 max-w-md mx-auto mb-12 leading-relaxed">Every piece DIDEE makes carries the soul of Kathmandu — raw, real, and unapologetically yours.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="inline-flex items-center gap-3 bg-[#C9A86A] text-black px-14 py-4 text-[11px] font-black tracking-[0.28em] uppercase hover:bg-white transition-colors">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/lookbook" className="inline-flex items-center gap-3 border border-white/40 text-white px-14 py-4 text-[11px] font-black tracking-[0.28em] uppercase hover:border-white hover:bg-white/10 transition-all backdrop-blur-sm">
                View Lookbook
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
