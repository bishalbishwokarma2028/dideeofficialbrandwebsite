import { motion } from "framer-motion";
import { Link } from "wouter";
import { Heart, Star, Shield, Users, Sparkles, Globe } from "lucide-react";

import brandStairs from "/images/brand-stairs.png";
import brandStreetDay from "/images/brand-street-day.png";
import brandGoldPalace from "/images/brand-goldpalace.png";
import brandNight from "/images/brand-night.png";
import brandFreshJuice from "/images/brand-freshjuice.png";

const imgStyle: React.CSSProperties = {
  imageRendering: "auto",
  WebkitBackfaceVisibility: "hidden",
  backfaceVisibility: "hidden",
  transform: "translateZ(0)",
  filter: "contrast(1.08) saturate(1.12) brightness(0.92)",
};

const values = [
  { icon: Sparkles, title: "Individuality", desc: "We believe every person deserves the freedom to express themselves through their own unique style." },
  { icon: Heart, title: "Comfort", desc: "Fashion should never compromise comfort. We create clothing that feels as good as it looks." },
  { icon: Shield, title: "Quality", desc: "We are committed to delivering products that meet high standards of craftsmanship, durability, and design." },
  { icon: Star, title: "Confidence", desc: "We believe clothing has the power to help people feel more confident and comfortable in their everyday lives." },
  { icon: Globe, title: "Accessibility", desc: "Good fashion should be available to everyone, regardless of age, background, or lifestyle." },
  { icon: Users, title: "Community", desc: "We value the people who support our journey and strive to build meaningful relationships with our customers." },
];

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

function ScaleIn({ children, delay = 0, className = "", style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero — stairs group shot, full screen ── */}
      <div className="relative h-screen overflow-hidden bg-black">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={brandStairs}
            alt="DIDEE — Who We Are"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ ...imgStyle, objectPosition: "center 15%", filter: "contrast(1.1) saturate(1.12) brightness(0.80)" }}
            loading="eager"
          />
        </motion.div>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.30) 55%, rgba(0,0,0,0.06) 100%)"
        }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 45%)"
        }} />
        <div className="absolute inset-0 flex flex-col justify-end pb-24 px-8 md:px-20 max-w-5xl">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[11px] tracking-[0.5em] uppercase text-[#C9A86A] font-black mb-5">
            About DIDEE
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-7xl md:text-9xl font-medium tracking-wide mb-6 text-white leading-none drop-shadow-2xl">
            Who We Are
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-lg tracking-[0.12em] font-medium text-white/75 max-w-xl uppercase">
            A modern Nepalese fashion brand built on confidence, comfort, and self-expression
          </motion.p>
        </div>
      </div>

      {/* ── WHO WE ARE ── */}
      <section className="py-28 px-4">
        <div className="container mx-auto max-w-3xl">
          <FadeUp>
            <p className="text-xs tracking-[0.3em] uppercase text-[#C9A86A] font-medium mb-6">Who We Are</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">Fashion that reflects who you are.</h2>
            <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
              <p>DIDEE is a modern Nepalese fashion brand created for individuals who value confidence, comfort, quality, and self-expression. We believe clothing is more than something people wear — it is a reflection of personality, lifestyle, and identity.</p>
              <p>Founded in <strong>2025</strong> by <strong>Niraj Onta</strong> with the vision of creating fashion that feels both stylish and accessible, DIDEE brings together contemporary streetwear, casual essentials, and modern dresses designed for everyday life. Our collections are created for people who want to look good, feel comfortable, and express themselves authentically.</p>
              <p>At DIDEE, we understand that fashion is personal. Every individual has their own story, style, and way of expressing themselves. That is why our designs focus on versatility, comfort, and timeless appeal — allowing our customers to wear our products with confidence wherever life takes them.</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Full-bleed cinematic strip — street day ── */}
      <div className="relative overflow-hidden" style={{ height: "70vh" }}>
        <motion.div
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={brandStreetDay}
            alt="DIDEE Street"
            className="w-full h-full object-cover"
            style={{ ...imgStyle, objectPosition: "center 25%", filter: "contrast(1.1) saturate(1.15) brightness(0.88)" }}
            loading="lazy"
          />
        </motion.div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.10) 60%)" }} />
        <div className="relative z-10 h-full flex flex-col justify-end px-8 md:px-20 pb-16">
          <FadeUp>
            <p className="font-serif text-3xl md:text-4xl text-white max-w-lg leading-tight drop-shadow-xl">
              "Bold enough to stand out. Comfortable enough to stay."
            </p>
          </FadeUp>
        </div>
      </div>

      {/* ── MISSION & VISION split ── */}
      <section className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: "70vh" }}>
        <ScaleIn className="relative overflow-hidden order-1" style={{ minHeight: "420px" }}>
          <img
            src={brandGoldPalace}
            alt="DIDEE Community"
            className="w-full h-full object-cover absolute inset-0"
            style={{ ...imgStyle, objectPosition: "center 20%", filter: "contrast(1.1) saturate(1.12) brightness(0.85)" }}
            loading="lazy"
          />
        </ScaleIn>
        <div className="bg-[#0A0A0A] text-white flex flex-col justify-center px-12 md:px-16 py-20 order-2">
          <FadeUp>
            <p className="text-xs tracking-[0.3em] uppercase text-[#C9A86A] font-medium mb-5">Our Mission</p>
            <h3 className="font-serif text-3xl md:text-4xl mb-6 leading-tight">Empower through fashion.</h3>
            <p className="text-white/60 leading-relaxed mb-8">Our mission is to create high-quality fashion that empowers people to express their individuality while experiencing exceptional comfort and confidence — offering products that combine modern aesthetics, practical functionality, and lasting quality.</p>
            <p className="text-xs tracking-[0.3em] uppercase text-[#C9A86A] font-medium mb-5">Our Vision</p>
            <h3 className="font-serif text-2xl mb-4 leading-tight">Nepal's most admired fashion brand.</h3>
            <p className="text-white/60 leading-relaxed">Our vision is to become one of Nepal's most trusted and admired fashion brands while inspiring a new generation of modern, confident, and creative individuals.</p>
          </FadeUp>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-28 px-4 bg-[#F5F3EF]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <FadeUp><p className="text-xs tracking-[0.3em] uppercase text-[#C9A86A] font-medium mb-4">What We Stand For</p></FadeUp>
            <FadeUp delay={0.07}><h2 className="font-serif text-4xl md:text-5xl">Values that guide everything we do.</h2></FadeUp>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <FadeUp key={v.title} delay={i * 0.08}>
                <div className="bg-background p-8 border border-border hover:border-[#C9A86A] transition-colors duration-300 h-full">
                  <v.icon className="w-6 h-6 text-[#C9A86A] mb-5" />
                  <h3 className="font-serif text-xl mb-3">{v.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDER SECTION ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: "65vh" }}>
        <div className="flex flex-col justify-center px-12 md:px-20 py-20 bg-background order-2 lg:order-1">
          <FadeUp className="space-y-6 max-w-lg">
            <p className="text-xs tracking-[0.3em] uppercase text-[#C9A86A] font-medium">The Founder</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">Niraj Onta</h2>
            <p className="text-muted-foreground leading-relaxed">DIDEE was founded in <strong>2025</strong> by <strong>Niraj Onta</strong> — a Nepalese entrepreneur with a passion for modern fashion, youth culture, and the belief that Nepal deserves a world-class streetwear brand it can call its own.</p>
            <p className="text-muted-foreground leading-relaxed">Niraj built DIDEE from the ground up in Kathmandu, inspired by the energy of Nepal's streets, the creativity of its youth, and the global wave of street culture. His vision: a brand that is authentically Nepalese, fearlessly modern, and made for everyone.</p>
            <div className="flex gap-8 pt-2">
              <div>
                <p className="font-serif text-3xl text-[#C9A86A]">2025</p>
                <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">Established</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-[#C9A86A]">KTM</p>
                <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">Founded In</p>
              </div>
            </div>
            <Link href="/our-story" className="inline-block border-b border-foreground pb-1 text-sm font-medium tracking-widest uppercase hover:text-[#C9A86A] hover:border-[#C9A86A] transition-colors">
              Read Our Full Story
            </Link>
          </FadeUp>
        </div>
        <ScaleIn className="relative overflow-hidden order-1 lg:order-2" style={{ minHeight: "500px" }}>
          <img
            src={brandFreshJuice}
            alt="Built in Nepal — DIDEE"
            className="w-full h-full object-cover absolute inset-0"
            style={{ ...imgStyle, objectPosition: "center 30%", filter: "contrast(1.1) saturate(1.12) brightness(0.85)" }}
            loading="lazy"
          />
        </ScaleIn>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section className="py-24 bg-[#0A0A0A] text-white text-center px-4">
        <div className="container mx-auto max-w-3xl">
          <FadeUp>
            <p className="text-xs tracking-[0.3em] uppercase text-[#C9A86A] font-medium mb-6">The DIDEE Philosophy</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight mb-8">"Fashion should empower, not complicate."</h2>
            <p className="text-white/60 leading-relaxed text-lg">We believe great clothing should fit naturally into people's lives. It should help individuals express themselves confidently without sacrificing comfort or practicality.</p>
          </FadeUp>
        </div>
      </section>

      {/* ── PROMISE — night shot full bleed ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "65vh" }}>
        <motion.div
          initial={{ scale: 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src={brandNight}
            alt="Our Promise"
            className="w-full h-full object-cover"
            style={{ ...imgStyle, objectPosition: "center 20%", filter: "contrast(1.1) saturate(1.12) brightness(0.78)" }}
            loading="lazy"
          />
        </motion.div>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.80) 100%)"
        }} />
        <div className="relative z-10 flex flex-col justify-end px-8 md:px-20 py-20 min-h-[65vh]">
          <FadeUp className="max-w-3xl">
            <p className="text-xs tracking-[0.3em] uppercase text-[#C9A86A] font-medium mb-4">Our Promise</p>
            <h2 className="font-serif text-4xl text-white mb-10">What we commit to, every day.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
              {[
                "Create products with attention to quality and detail.",
                "Prioritise comfort without compromising style.",
                "Listen to our customers and continuously improve.",
                "Provide a seamless and enjoyable shopping experience.",
                "Remain authentic to our values and vision.",
                "Build long-term trust through transparency and reliability.",
              ].map((promise, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm border border-white/15">
                  <span className="w-5 h-5 rounded-full bg-[#C9A86A] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <p className="text-sm text-white/80 leading-relaxed">{promise}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-[#F5F3EF] text-center px-4">
        <FadeUp>
          <h2 className="font-serif text-4xl mb-4">Ready to explore DIDEE?</h2>
          <p className="text-muted-foreground mb-8">Discover our latest collections and find your style.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="bg-black text-white px-10 py-4 text-xs font-medium tracking-widest uppercase hover:bg-[#C9A86A] transition-colors">
              Shop Now
            </Link>
            <Link href="/our-story" className="border border-black text-black px-10 py-4 text-xs font-medium tracking-widest uppercase hover:border-[#C9A86A] hover:text-[#C9A86A] transition-colors">
              Our Story
            </Link>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
