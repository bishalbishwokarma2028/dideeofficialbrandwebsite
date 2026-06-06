import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable, journalPostsTable } from "@workspace/db";
import { eq, ilike, and, or, desc } from "drizzle-orm";

const router = Router();

// GET /api/search
router.get("/", async (req, res) => {
  try {
    const q = String(req.query.q ?? "").trim();
    const type = String(req.query.type ?? "all");
    if (!q) return res.json({ query: q, products: [], posts: [] });

    const pattern = `%${q}%`;
    let products: any[] = [];
    let posts: any[] = [];

    if (type === "products" || type === "all") {
      const found = await db.select().from(productsTable).where(
        and(
          eq(productsTable.status, "active"),
          or(ilike(productsTable.name, pattern), ilike(productsTable.description, pattern))
        )
      ).orderBy(desc(productsTable.createdAt)).limit(10);
      products = found.map(p => ({
        ...p,
        price: parseFloat(p.price),
        comparePrice: p.comparePrice ? parseFloat(p.comparePrice) : null,
        totalStock: 0,
        avgRating: null,
        reviewCount: 0,
        createdAt: p.createdAt.toISOString(),
      }));
    }

    if (type === "journal" || type === "all") {
      const found = await db.select().from(journalPostsTable).where(
        and(
          eq(journalPostsTable.published, true),
          or(ilike(journalPostsTable.title, pattern), ilike(journalPostsTable.excerpt, pattern))
        )
      ).orderBy(desc(journalPostsTable.publishedAt)).limit(6);
      posts = found.map(p => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
      }));
    }

    res.json({ query: q, products, posts });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
