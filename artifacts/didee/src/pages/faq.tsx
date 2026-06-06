import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Link } from "wouter";

const faqs = [
  {
    category: "Orders & Shopping",
    items: [
      { q: "How do I place an order?", a: "Browse our shop, select the product you love, choose your size, and click 'Add to Cart'. When you're ready, proceed to checkout and fill in your delivery details. We accept eSewa, Khalti, Cash on Delivery (COD), and card payments." },
      { q: "Can I modify or cancel my order after placing it?", a: "Orders can be modified or cancelled within 12 hours of placement. Please contact us immediately at hello@didee.com.np or via WhatsApp with your order number, and our team will assist you." },
      { q: "How do I know my order was successfully placed?", a: "You will receive a confirmation notification once your order is placed. You can also check your order status in the Order History section of your account." },
    ],
  },
  {
    category: "Shipping & Delivery",
    items: [
      { q: "Do you offer free shipping?", a: "Yes! We offer free shipping on all orders above NPR 2,000 within Kathmandu Valley. For orders outside the Valley, a flat shipping fee applies based on your location." },
      { q: "How long does delivery take?", a: "Delivery within Kathmandu Valley typically takes 1–2 business days. For other parts of Nepal, delivery takes 3–5 business days depending on your location." },
      { q: "Do you ship outside Nepal?", a: "Currently, we ship within Nepal only. We are working on expanding our international shipping capabilities — stay tuned!" },
    ],
  },
  {
    category: "Returns & Exchanges",
    items: [
      { q: "What is your return policy?", a: "We accept returns within 7 days of delivery, provided the item is unused, unwashed, and in its original packaging with tags attached. Sale items and intimates are non-returnable." },
      { q: "How do I initiate a return or exchange?", a: "Contact our team at hello@didee.com.np with your order number and reason for return. We'll guide you through the process and arrange collection at no additional cost for eligible returns." },
      { q: "How long does a refund take?", a: "Once we receive and inspect your returned item, refunds are processed within 3–5 business days. The amount will be returned to your original payment method." },
    ],
  },
  {
    category: "Products & Sizing",
    items: [
      { q: "How do I find the right size?", a: "Each product page includes a detailed size guide with measurements in both centimetres and inches. If you're between sizes, we generally recommend sizing up for a more comfortable fit." },
      { q: "What materials do you use?", a: "We are committed to quality craftsmanship. Our garments use premium cotton, cotton blends, and carefully selected fabrics for each collection. Full material details are listed on each product page." },
      { q: "How should I care for my DIDEE pieces?", a: "Each garment includes care instructions on the label. In general, we recommend cold machine wash or hand wash for most pieces, and line-dry to maintain shape and longevity." },
    ],
  },
  {
    category: "Payments",
    items: [
      { q: "What payment methods do you accept?", a: "We accept eSewa, Khalti, Cash on Delivery (COD), and major credit/debit cards. All digital payments are fully secured." },
      { q: "Is Cash on Delivery (COD) available?", a: "Yes! COD is available for all locations within Nepal. Please have the exact amount ready upon delivery." },
      { q: "Is it safe to use my card on DIDEE?", a: "Absolutely. Our payment gateway uses industry-standard encryption and security protocols. We never store your card details on our servers." },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className={`text-sm font-medium transition-colors ${open ? "text-[#C9A86A]" : "text-foreground group-hover:text-[#C9A86A]"}`}>{q}</span>
        <span className="shrink-0 w-6 h-6 flex items-center justify-center border border-border text-muted-foreground group-hover:border-[#C9A86A] group-hover:text-[#C9A86A] transition-colors">
          {open ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-[#C9A86A] font-medium mb-4">Help Centre</p>
          <h1 className="font-serif text-5xl md:text-6xl font-medium mb-6">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Everything you need to know about shopping at DIDEE.</p>
        </motion.div>

        <div className="space-y-12">
          {faqs.map((section, si) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: si * 0.05 }}
            >
              <h2 className="text-xs font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-4 pb-3 border-b border-border">
                {section.category}
              </h2>
              <div>
                {section.items.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center bg-[#F5F3EF] p-12 border border-border"
        >
          <h3 className="font-serif text-2xl mb-3">Still have questions?</h3>
          <p className="text-muted-foreground text-sm mb-6">Our team is happy to help with any query, big or small.</p>
          <Link href="/contact" className="inline-block bg-foreground text-background px-8 py-3.5 text-xs font-medium tracking-widest uppercase hover:bg-[#C9A86A] transition-colors">
            Contact Us
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
