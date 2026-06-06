import { motion } from "framer-motion";
import { Link } from "wouter";

import brandHotpot from "/images/brand-hotpot.png";
import brandStreetDay from "/images/brand-street-day.png";
import brandNight from "/images/brand-night.png";
import brandStairs from "/images/brand-stairs.png";
import brandGoldPalace from "/images/brand-goldpalace.png";
import brandGuys from "/images/brand-guys.png";

const imgStyle: React.CSSProperties = {
  imageRendering: "auto",
  WebkitBackfaceVisibility: "hidden",
  backfaceVisibility: "hidden",
  transform: "translateZ(0)",
  filter: "contrast(1.08) saturate(1.12) brightness(0.90)",
};

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function OurStory() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero — hotpot dark editorial, full screen ── */}
      <div className="relative h-screen overflow-hidden bg-black">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={brandHotpot}
            alt="Our Story — DIDEE"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ ...imgStyle, objectPosition: "center 25%", filter: "contrast(1.1) saturate(1.12) brightness(0.78)" }}
            loading="eager"
          />
        </motion.div>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.30) 55%, rgba(0,0,0,0.08) 100%)"
        }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 48%)"
        }} />
        <div className="absolute inset-0 flex flex-col justify-end pb-24 px-8 md:px-20">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[11px] tracking-[0.5em] uppercase text-[#C9A86A] font-black mb-5">
            DIDEE — Est. 2025
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-7xl md:text-9xl font-medium text-white leading-none mb-6 drop-shadow-2xl">
            Our Story
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base tracking-[0.2em] uppercase text-white/75 font-medium">
            Built in Nepal. Made for Everyone.
          </motion.p>
        </div>
      </div>

      {/* ── Opening Story ── */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="space-y-10 text-muted-foreground text-lg leading-[1.9]">
            <FadeUp>
              <p className="text-foreground font-medium text-xl leading-relaxed">DIDEE was born from a simple belief: fashion should be more than just clothing. It should be a reflection of individuality, confidence, comfort, and self-expression.</p>
            </FadeUp>
            <FadeUp delay={0.05}>
              <p>Founded in <strong className="text-foreground">2025</strong> by <strong className="text-foreground">Niraj Onta</strong> in Kathmandu, Nepal, DIDEE was built on the conviction that Nepal deserves a world-class streetwear brand — one that speaks the language of today's youth while remaining rooted in the energy and spirit of the Nepalese streets.</p>
            </FadeUp>
            <FadeUp delay={0.05}>
              <p>In a world where trends change rapidly and personal style continues to evolve, Niraj saw an opportunity to create a brand that brings together modern fashion and everyday comfort without compromise. He wanted to build a brand that people could genuinely connect with — one that understands the needs of today's generation while remaining accessible to everyone.</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Full-bleed cinematic — street day ── */}
      <div className="relative overflow-hidden" style={{ height: "68vh" }}>
        <motion.div
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={brandStreetDay}
            alt="DIDEE Street — Kathmandu"
            className="w-full h-full object-cover"
            style={{ ...imgStyle, objectPosition: "center 25%", filter: "contrast(1.12) saturate(1.15) brightness(0.86)" }}
            loading="lazy"
          />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.38)" }} />
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <FadeUp>
            <p className="font-serif text-4xl md:text-5xl text-white text-center max-w-2xl leading-tight drop-shadow-xl">
              "Fashion that fits your life, not the other way around."
            </p>
          </FadeUp>
        </div>
      </div>

      {/* ── More story + Founder spotlight ── */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="space-y-10 text-muted-foreground text-lg leading-[1.9]">
            <FadeUp>
              <p>Built in Nepal and inspired by the creativity, ambition, and energy of modern lifestyles, DIDEE is dedicated to creating clothing that helps people feel confident in every moment of their lives. Whether it's a casual day out, a busy work schedule, a college campus, a social gathering, or a special occasion, our collections are designed to fit seamlessly into everyday experiences.</p>
            </FadeUp>
            <FadeUp delay={0.05}>
              <p>At DIDEE, we believe that great fashion should not force people to choose between style and comfort. Every collection is thoughtfully designed to offer a balance of contemporary aesthetics, quality craftsmanship, and practical wearability.</p>
            </FadeUp>
            <FadeUp delay={0.05}>
              <p>Our collections bring together streetwear, casual essentials, and modern dresses that celebrate individuality and modern style. From timeless everyday pieces to trend-inspired designs, every product is created with attention to detail, quality materials, and a deep understanding of how people live, move, and express themselves.</p>
            </FadeUp>

            <FadeUp>
              <div className="py-10 border-y border-border">
                <p className="font-serif text-2xl text-foreground text-center leading-relaxed italic">
                  "But DIDEE is more than a fashion label."
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.05}>
              <p>It is a community of dreamers, creators, students, professionals, entrepreneurs, artists, and individuals who are shaping their own paths. It is a brand for people who embrace their uniqueness and believe that confidence starts with being comfortable in who they are.</p>
            </FadeUp>
            <FadeUp delay={0.05}>
              <p>As a proudly Nepalese brand, we are committed to contributing to the growth of modern fashion culture while representing Nepal's creativity, talent, and potential on a global stage.</p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Founder card — Gold Palace full bleed ── */}
      <div className="relative overflow-hidden" style={{ height: "72vh" }}>
        <motion.div
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={brandGoldPalace}
            alt="DIDEE — Kathmandu"
            className="w-full h-full object-cover"
            style={{ ...imgStyle, objectPosition: "center 20%", filter: "contrast(1.12) saturate(1.15) brightness(0.82)" }}
            loading="lazy"
          />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.25) 60%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%)" }} />
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-20">
          <FadeUp>
            <p className="text-[11px] tracking-[0.5em] uppercase text-[#C9A86A] font-black mb-5">The Founder</p>
            <h2 className="font-serif text-5xl md:text-7xl text-white mb-5 leading-none drop-shadow-2xl">Niraj Onta</h2>
            <p className="text-white/70 text-base max-w-md leading-relaxed mb-8">
              Entrepreneur, visionary, and the force behind DIDEE. Founded in Kathmandu in 2025, with one mission: to build Nepal's most iconic streetwear brand.
            </p>
            <div className="flex gap-10">
              <div>
                <p className="font-serif text-4xl text-[#C9A86A]">2025</p>
                <p className="text-xs text-white/50 tracking-widest uppercase mt-1">Founded</p>
              </div>
              <div>
                <p className="font-serif text-4xl text-[#C9A86A]">KTM</p>
                <p className="text-xs text-white/50 tracking-widest uppercase mt-1">Kathmandu</p>
              </div>
              <div>
                <p className="font-serif text-4xl text-[#C9A86A]">NPL</p>
                <p className="text-xs text-white/50 tracking-widest uppercase mt-1">Built in Nepal</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* ── Guys graphic — editorial strip ── */}
      <div className="relative overflow-hidden" style={{ height: "60vh" }}>
        <motion.div
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={brandGuys}
            alt="DIDEE Graphic Soul"
            className="w-full h-full object-cover"
            style={{ ...imgStyle, objectPosition: "center 20%", filter: "contrast(1.1) saturate(1.12) brightness(0.84)" }}
            loading="lazy"
          />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.32)" }} />
      </div>

      {/* ── Closing text ── */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-2xl">
          <FadeUp delay={0.1} className="text-center">
            <div className="space-y-3 text-muted-foreground font-medium text-lg">
              <p>This is our story.</p>
              <p>A story built on confidence, creativity, and self-expression.</p>
              <p className="text-foreground">A story built in Nepal.</p>
              <p className="text-[#C9A86A] font-semibold text-xl">A story made for everyone.</p>
            </div>
            <div className="mt-12">
              <p className="font-serif text-4xl text-foreground">Welcome to DIDEE.</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Brand accent strip — stairs dark ── */}
      <div className="relative overflow-hidden" style={{ height: "55vh" }}>
        <motion.div
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={brandStairs}
            alt="DIDEE"
            className="w-full h-full object-cover"
            style={{ ...imgStyle, objectPosition: "center 15%", filter: "contrast(1.1) saturate(1.12) brightness(0.80)" }}
            loading="lazy"
          />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.30)" }} />
      </div>

      {/* ── Final CTA — night shot ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "60vh" }}>
        <motion.div
          initial={{ scale: 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={brandNight}
            alt="DIDEE"
            className="w-full h-full object-cover"
            style={{ ...imgStyle, objectPosition: "center 20%", filter: "contrast(1.1) saturate(1.12) brightness(0.72)" }}
            loading="lazy"
          />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.60)" }} />
        <div className="relative z-10 flex flex-col items-center justify-center text-white text-center px-4 min-h-[60vh]">
          <FadeUp>
            <h2 className="font-serif text-4xl md:text-5xl mb-6 drop-shadow-xl">Experience the DIDEE difference.</h2>
            <p className="text-white/60 mb-10 text-sm tracking-wide max-w-sm">Explore our collections and find your style.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop" className="bg-[#C9A86A] text-black px-12 py-4 text-xs font-black tracking-widest uppercase hover:bg-white transition-colors shadow-xl">
                Shop Collection
              </Link>
              <Link href="/about" className="border border-white/45 text-white px-12 py-4 text-xs font-black tracking-widest uppercase hover:border-white hover:bg-white/10 transition-colors backdrop-blur-sm">
                Who We Are
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
