import { motion } from "framer-motion";
import { Link } from "wouter";

const TEAM = [
  { name: "Niraj Onta", role: "Founder & Creative Director", initial: "N" },
  { name: "The DIDEE Team", role: "Designers & Makers", initial: "D" },
  { name: "Nepal", role: "Where It All Begins", initial: "N" },
];

const VALUES = [
  {
    number: "01",
    title: "Made in Nepal",
    description: "Every stitch, every seam — crafted in Nepal by skilled artisans who pour generations of tradition into modern silhouettes.",
  },
  {
    number: "02",
    title: "Built for Everyone",
    description: "Fashion without gates. DIDEE makes world-class clothing accessible to everyone in Nepal and beyond — regardless of background or budget.",
  },
  {
    number: "03",
    title: "Street-First Design",
    description: "We design from the streets of Kathmandu outward. Real people, real style, real expression — not trend-chasing, not runway-copying.",
  },
  {
    number: "04",
    title: "Quality Without Compromise",
    description: "Premium materials, precise construction, honest prices. No shortcuts. No greenwashing. Just great clothes that last.",
  },
];

const TIMELINE = [
  { year: "2022", event: "DIDEE Founded in Kathmandu, Nepal" },
  { year: "2023", event: "First collection 'Street Edge' released — sold out in 3 days" },
  { year: "2024", event: "Expanded to all 7 provinces; launched online flagship" },
  { year: "2025", event: "SS25 campaign — biggest drop yet" },
];

export default function WhoWeAre() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero — split layout: text left (40%), full image right (60%) */}
      <section className="min-h-[80vh] grid grid-cols-1 md:grid-cols-[2fr_3fr]">
        {/* Left — text panel */}
        <div className="bg-[#0A0A0A] flex flex-col justify-center px-10 md:px-16 py-24 order-2 md:order-1">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[11px] tracking-[0.5em] uppercase text-[#C9A86A] font-black mb-6"
          >
            DIDEE — Built in Nepal
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-6xl md:text-7xl text-white font-medium leading-none mb-8"
          >
            Who We Are
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white/65 text-lg leading-relaxed max-w-lg mb-10"
          >
            DIDEE is a Nepalese fashion brand built on the belief that world-class design shouldn't require a world-class price tag — and that the most powerful style comes from the streets, not the runway.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex items-center gap-5"
          >
            <div className="h-px w-16 bg-[#C9A86A]" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A86A] font-black">Est. 2025 · Kathmandu, Nepal</span>
          </motion.div>
        </div>
        {/* Right — full image */}
        <div className="relative overflow-hidden min-h-[50vh] md:min-h-[80vh] order-1 md:order-2">
          <motion.img
            src="/images/lookbook-outfit2.png"
            alt="DIDEE Who We Are"
            className="w-full h-full object-cover object-center"
            style={{ minHeight: "400px" }}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/20" />
          <div className="absolute bottom-6 right-6">
            <span className="bg-[#C9A86A] text-black text-[10px] font-black tracking-[0.3em] uppercase px-4 py-2">SS25 Collection</span>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6 md:px-16 border-b border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground font-black mb-6">Our Mission</p>
            <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">Fashion with a Himalayan Heart</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We started DIDEE because we were tired of seeing Nepalese youth wearing watered-down copies of foreign brands. Nepal has incredible craft traditions, incredible talent, and an incredibly unique street culture — and none of that was being represented in fashion.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-10">
              So we built it ourselves. DIDEE is for the kids in Thamel and Patan who dress differently. For the people who want to look good without apologizing for where they're from.
            </p>
            <Link href="/our-story" className="inline-flex items-center gap-2 text-[11px] font-black tracking-[0.3em] uppercase border-b border-foreground pb-1 hover:text-[#C9A86A] hover:border-[#C9A86A] transition-colors">
              Read the Full Story →
            </Link>
          </div>
          <div className="relative">
            <img src="/products/product3.jpg" alt="DIDEE craftsmanship" className="w-full object-cover aspect-[3/4]" />
            <div className="absolute -bottom-4 -left-4 bg-[#C9A86A] px-6 py-4 text-white">
              <p className="text-2xl font-bold">2022</p>
              <p className="text-xs tracking-widest uppercase font-black">Founded</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 md:px-16 bg-[#F5F3EF] border-b border-border">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground font-black mb-4 text-center">What Drives Us</p>
          <h2 className="font-serif text-4xl md:text-5xl text-center mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {VALUES.map((val, i) => (
              <motion.div
                key={val.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-10 border border-border bg-background hover:shadow-md transition-shadow"
              >
                <p className="text-5xl font-serif text-[#C9A86A] font-medium mb-4">{val.number}</p>
                <h3 className="font-bold text-lg tracking-wide mb-4">{val.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{val.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 md:px-16 bg-[#0A0A0A] text-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[11px] tracking-[0.4em] uppercase text-white/40 font-black mb-4">The People</p>
          <h2 className="font-serif text-4xl md:text-5xl mb-16">Behind DIDEE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border border-white/10 p-8 hover:border-[#C9A86A] transition-colors"
              >
                <div className="w-20 h-20 rounded-full bg-[#C9A86A] text-white text-3xl font-bold flex items-center justify-center mx-auto mb-6">
                  {member.initial}
                </div>
                <h3 className="font-bold text-lg mb-2">{member.name}</h3>
                <p className="text-white/40 text-sm tracking-wide">{member.role}</p>
              </motion.div>
            ))}
          </div>
          <Link
            href="/shop"
            className="inline-block border border-white px-16 py-5 text-[11px] tracking-[0.4em] uppercase font-black hover:bg-white hover:text-black transition-all duration-300"
          >
            Shop the Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
