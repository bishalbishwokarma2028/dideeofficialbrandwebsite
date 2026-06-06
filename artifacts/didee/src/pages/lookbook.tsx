import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const LOOKS = [
  {
    id: 1,
    season: "DIDEE",
    title: "STREET EDGE",
    subtitle: "Bold Silhouettes. Fearless Expression.",
    description: "Dark plaid mini skirts, layered chains, and crop tops redefine the Kathmandu street scene. This look is built for those who refuse to blend in.",
    tag: "DROP 01",
    image: "/products/product1.jpg",
    align: "left",
  },
  {
    id: 2,
    season: "DIDEE",
    title: "URBAN SOUL",
    subtitle: "Wide. Free. Effortless.",
    description: "Relaxed wide-leg denim paired with oversized belts and silver accessories — a uniform for the city that never sleeps. Made in Nepal, worn everywhere.",
    tag: "DROP 02",
    image: "/products/product2.jpg",
    align: "right",
  },
  {
    id: 3,
    season: "DIDEE",
    title: "DARK CULTURE",
    subtitle: "Where Heritage Meets the Underground.",
    description: "Goth-inspired accessories fused with Nepalese craft traditions. Black-on-black layering with handcrafted silver pieces that tell a story beyond borders.",
    tag: "DROP 03",
    image: "/products/product3.jpg",
    align: "left",
  },
];

const EDITORIAL_STATS = [
  { label: "Looks", value: "12+" },
  { label: "Season", value: "DIDEE" },
  { label: "Made In", value: "Nepal" },
  { label: "Collection", value: "Curated" },
];

const GALLERY_ITEMS = [
  { src: "/images/brand-freshjuice.png", caption: "Fresh Drop", tag: "SS25", size: "tall" },
  { src: "/images/brand-street-day.png", caption: "Street Soul", tag: "SS25", size: "wide" },
  { src: "/images/brand-goldpalace.png", caption: "Bold Moves", tag: "SS25", size: "normal" },
  { src: "/images/brand-stairs.png", caption: "Dark Edge", tag: "SS25", size: "tall" },
  { src: "/images/brand-night.png", caption: "Night Route", tag: "SS25", size: "normal" },
  { src: "/images/brand-hotpot.png", caption: "Raw Energy", tag: "SS25", size: "wide" },
  { src: "/images/brand-guys.png", caption: "Graphic Soul", tag: "SS25", size: "normal" },
  { src: "/images/lookbook-outfit1.png", caption: "Goth Culture", tag: "DROP 01", size: "tall" },
  { src: "/images/lookbook-outfit2.png", caption: "Plaid Rebel", tag: "DROP 02", size: "normal" },
  { src: "/images/lookbook-outfit3.png", caption: "Wide Leg", tag: "DROP 03", size: "wide" },
];

function GalleryItem({ item, index }: { item: typeof GALLERY_ITEMS[0]; index: number }) {
  const isDouble = item.size === "tall" || item.size === "wide";
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={`relative group overflow-hidden bg-[#111] ${
        item.size === "tall" ? "row-span-2" : item.size === "wide" ? "col-span-2" : ""
      }`}
    >
      <motion.img
        src={item.src}
        alt={item.caption}
        className="w-full h-full object-cover"
        style={{ minHeight: item.size === "tall" ? "520px" : "260px" }}
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
        <p className="text-white font-serif text-xl leading-tight mb-1">{item.caption}</p>
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-[#C9A86A] text-[10px] tracking-[0.3em] uppercase font-black hover:gap-3 transition-all duration-300">
          Shop Look <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      {isDouble && (
        <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-colors duration-500 pointer-events-none" />
      )}
    </motion.div>
  );
}

export default function Lookbook() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Header */}
      <div className="relative min-h-[55vh] flex flex-col items-center justify-center text-center px-6 border-b border-white/10 py-20">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[11px] tracking-[0.5em] uppercase text-[#C9A86A] font-black mb-6"
        >
          DIDEE — Digital Flagship
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-7xl md:text-9xl font-medium tracking-tight leading-none mb-6"
        >
          LOOKBOOK
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-white/55 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-4 font-light"
        >
          Each season, DIDEE curates a visual story that goes beyond fashion. Our lookbook is a window into the streets of Kathmandu — raw, unapologetic, and deeply human. Explore styled outfits, get inspired by silhouettes, and discover how each piece is meant to be worn, layered, and owned.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-white/30 text-sm max-w-xl mx-auto leading-relaxed"
        >
          Rooted in Nepalese identity. Designed for self-expression. Made for every body, every mood, every moment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-0 left-0 right-0 border-t border-white/10 grid grid-cols-4 divide-x divide-white/10"
        >
          {EDITORIAL_STATS.map((s) => (
            <div key={s.label} className="py-5 text-center">
              <p className="text-lg font-bold font-serif">{s.value}</p>
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/40">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Full Masonry Gallery */}
      <div className="py-20 px-4 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="text-[11px] tracking-[0.5em] uppercase text-white/30 mb-3">The Full Gallery</p>
          <h2 className="font-serif text-4xl md:text-5xl">All Looks</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[260px]">
          {GALLERY_ITEMS.map((item, i) => (
            <GalleryItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* Editorial Looks */}
      <div className="py-12 px-4 md:px-12 space-y-0 border-t border-white/10">
        <div className="text-center py-16">
          <p className="text-[11px] tracking-[0.5em] uppercase text-white/30 mb-3">Editorial</p>
          <h2 className="font-serif text-4xl md:text-5xl">Styled Drops</h2>
        </div>
        {LOOKS.map((look, index) => (
          <motion.section
            key={look.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1 }}
            className={`flex flex-col ${look.align === "right" ? "md:flex-row-reverse" : "md:flex-row"} items-stretch min-h-[90vh] border-b border-white/10`}
          >
            <div className="w-full md:w-3/5 relative overflow-hidden">
              <motion.img
                src={look.image}
                alt={look.title}
                className="w-full h-full object-cover min-h-[70vw] md:min-h-[90vh]"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 1.2 }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
            </div>

            <div className="w-full md:w-2/5 flex flex-col justify-center px-8 md:px-16 py-16">
              <p className="text-[10px] tracking-[0.5em] uppercase text-white/40 mb-6">{look.season}</p>
              <h2 className="font-serif text-5xl md:text-6xl font-medium mb-4 leading-none">{look.title}</h2>
              <p className="text-sm tracking-[0.2em] uppercase text-[#C9A86A] font-black mb-8">{look.subtitle}</p>
              <p className="text-white/60 leading-relaxed text-base mb-12 max-w-sm">{look.description}</p>
              <div className="flex gap-4">
                <Link
                  href="/shop"
                  className="border border-white px-8 py-3.5 text-[11px] tracking-[0.3em] uppercase font-black hover:bg-white hover:text-black transition-all duration-300"
                >
                  Shop The Look
                </Link>
                <Link
                  href="/collections"
                  className="border border-white/20 px-8 py-3.5 text-[11px] tracking-[0.3em] uppercase font-black text-white/60 hover:border-white hover:text-white transition-all duration-300"
                >
                  View Collection
                </Link>
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="py-32 text-center px-6"
      >
        <p className="text-[11px] tracking-[0.5em] uppercase text-white/30 mb-6">Built in Nepal. Made for everyone.</p>
        <h2 className="font-serif text-5xl md:text-7xl mb-10 font-medium">The Full Drop</h2>
        <Link
          href="/shop"
          className="inline-block border border-white px-16 py-5 text-[11px] tracking-[0.4em] uppercase font-black hover:bg-white hover:text-black transition-all duration-300"
        >
          Shop All Pieces
        </Link>
      </motion.div>
    </div>
  );
}
