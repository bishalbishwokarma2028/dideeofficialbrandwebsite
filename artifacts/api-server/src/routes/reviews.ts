import { Router } from "express";
import { db } from "@workspace/db";
import { reviewsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { CreateReviewBody, UpdateReviewBody } from "@workspace/api-zod";

const router = Router();

// GET /api/reviews
router.get("/", async (req, res) => {
  try {
    const productSlug = req.query.productSlug as string | undefined;
    const approved = req.query.approved === "true" ? true : req.query.approved === "false" ? false : undefined;

    let query = db.select().from(reviewsTable).$dynamic();
    const conds: any[] = [];

    if (productSlug) {
      const { productsTable } = await import("@workspace/db");
      const [p] = await db.select().from(productsTable).where(eq(productsTable.slug, productSlug));
      if (p) conds.push(eq(reviewsTable.productId, p.id));
    }
    if (approved !== undefined) conds.push(eq(reviewsTable.approved, approved));
    if (conds.length) query = query.where(and(...conds));
    query = query.orderBy(desc(reviewsTable.createdAt));

    const reviews = await query;
    res.json(reviews.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/reviews
router.post("/", async (req, res) => {
  try {
    const body = CreateReviewBody.parse(req.body);
    const [review] = await db.insert(reviewsTable).values({
      productId: body.productId,
      customerName: body.customerName,
      rating: body.rating,
      title: body.title ?? null,
      body: body.body ?? null,
      approved: false,
    }).returning();
    res.status(201).json({ ...review, createdAt: review.createdAt.toISOString() });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// PATCH /api/reviews/:id
router.patch("/:id", async (req, res) => {
  try {
    const body = UpdateReviewBody.parse(req.body);
    const [updated] = await db.update(reviewsTable).set(body).where(eq(reviewsTable.id, parseInt(req.params.id))).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
