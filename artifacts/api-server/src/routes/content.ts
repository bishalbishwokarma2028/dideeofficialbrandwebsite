import { Router } from "express";
import { db } from "@workspace/db";
import { siteContentTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { isAdminRequest } from "../lib/jwt.js";

const DEFAULT_CONTENT: Record<string, Record<string, unknown>> = {
  home: {
    heroSlides: [
      { title: "FRESH DROP", subtitle: "FIVE LOOKS. ONE STATEMENT. BUILT IN NEPAL.", cta1: "SHOP COLLECTION", cta2: "VIEW LOOKBOOK", image: "/images/hero-1.jpg" },
    ],
    featuredTitle: "THE COLLECTIONS",
    featuredSubtitle: "Each piece is a distinct expression of Nepalese street culture.",
    newArrivalsTitle: "NEW ARRIVALS",
    newArrivalsSubtitle: "Fresh from the studio to your wardrobe.",
    standardTitle: "THE DIDEE STANDARD",
    standardSubtitle: "Six principles that define every thread, every seam, and every decision at DIDEE.",
  },
  shop: {
    title: "THE SHOP",
    subtitle: "Discover every drop, every piece, every story.",
    heroImage: "",
  },
  collections: {
    title: "The DIDEE World",
    subtitle: "Each DIDEE collection is a distinct expression of Nepalese street culture.",
    heroImage: "/images/collections-hero.jpg",
  },
  lookbook: {
    title: "LOOKBOOK",
    subtitle: "Each season, DIDEE curates a visual story that goes beyond fashion.",
    images: [],
  },
  journal: {
    title: "THE JOURNAL",
    subtitle: "Stories from the streets of Kathmandu.",
    heroImage: "",
  },
  about: {
    title: "About DIDEE",
    intro: "DIDEE is a Nepalese fashion brand built on the belief that world-class design shouldn't require a world-class price tag.",
    body: "We are built in Nepal, made for everyone.",
    images: [],
    stats: [
      { label: "Founded", value: "2025" },
      { label: "Based in", value: "Kathmandu" },
      { label: "Made in", value: "Nepal" },
    ],
  },
  "our-story": {
    title: "Our Story",
    chapters: [
      { heading: "The Beginning", body: "DIDEE was born from the streets of Kathmandu." },
      { heading: "The Vision", body: "We believe fashion should be accessible, bold, and deeply rooted in identity." },
      { heading: "The Future", body: "DIDEE is growing. New collections, new collaborations." },
    ],
    heroImage: "",
  },
  "who-we-are": {
    title: "Who We Are",
    intro: "DIDEE is a Nepalese fashion brand.",
    founderName: "Niraj Onta",
    founderTitle: "Founder & Creative Director",
    founderBio: "Raised in the streets of Kathmandu, Niraj founded DIDEE with one mission.",
    founderImage: "",
    teamImages: [],
  },
  "our-services": {
    title: "Our Services",
    subtitle: "From design to delivery, DIDEE offers a complete fashion ecosystem.",
    services: [
      { title: "Custom Orders", description: "Work directly with our team to create a piece that's uniquely yours." },
      { title: "Bulk & Wholesale", description: "Partner with us for bulk orders, retail partnerships, and collaborative drops." },
      { title: "Styling Consultation", description: "Book a session with a DIDEE stylist to curate your perfect look." },
      { title: "Brand Collaboration", description: "Let's build something together." },
    ],
  },
  contact: {
    title: "Contact Us",
    subtitle: "We'd love to hear from you.",
    address: "Kathmandu, Nepal",
    email: "hello@didee.com.np",
    phone: "+977 98XXXXXXXX",
    instagram: "@didee.np",
    facebook: "DIDEE Nepal",
    tiktok: "@didee.np",
    mapEmbed: "",
  },
};

async function getSection(section: string): Promise<Record<string, unknown>> {
  try {
    const [row] = await db.select().from(siteContentTable).where(eq(siteContentTable.section, section)).limit(1);
    if (row) return row.data;
  } catch {}
  return DEFAULT_CONTENT[section] ?? {};
}

async function getAllContent(): Promise<Record<string, Record<string, unknown>>> {
  try {
    const rows = await db.select().from(siteContentTable);
    const result: Record<string, Record<string, unknown>> = { ...DEFAULT_CONTENT };
    for (const row of rows) {
      result[row.section] = row.data;
    }
    return result;
  } catch {
    return DEFAULT_CONTENT;
  }
}

async function saveSection(section: string, data: Record<string, unknown>): Promise<void> {
  await db
    .insert(siteContentTable)
    .values({ section, data, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteContentTable.section, set: { data, updatedAt: new Date() } });
}

const router = Router();

router.get("/", async (_req, res) => {
  res.json(await getAllContent());
});

router.get("/:section", async (req, res) => {
  res.json(await getSection(req.params.section));
});

router.put("/:section", async (req, res) => {
  if (!isAdminRequest(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const existing = await getSection(req.params.section);
    const merged = { ...existing, ...req.body };
    await saveSection(req.params.section, merged);
    res.json({ ok: true, section: req.params.section, data: merged });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
