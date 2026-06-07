import { Router } from "express";
import { db } from "@workspace/db";
import { collectionsTable, productsTable } from "@workspace/db";
import { eq, asc, sql } from "drizzle-orm";
import { CreateCollectionBody, UpdateCollectionBody } from "@workspace/api-zod";
import { dbError } from "../lib/db-error.js";

const router = Router();

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function enrichCollection(c: typeof collectionsTable.$inferSelect) {
  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(productsTable).where(eq(productsTable.collectionSlug, c.slug));
  return { ...c, productCount: Number(count ?? 0) };
}

// GET /api/collections
router.get("/", async (req, res) => {
  try {
    const collections = await db.select().from(collectionsTable).orderBy(asc(collectionsTable.sortOrder), asc(collectionsTable.name));
    res.json(await Promise.all(collections.map(enrichCollection)));
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

// GET /api/collections/featured
router.get("/featured", async (req, res) => {
  try {
    const collections = await db.select().from(collectionsTable).where(eq(collectionsTable.featured, true)).orderBy(asc(collectionsTable.sortOrder)).limit(6);
    res.json(await Promise.all(collections.map(enrichCollection)));
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

// POST /api/collections
router.post("/", async (req, res) => {
  try {
    const body = CreateCollectionBody.parse(req.body);
    const slug = slugify(body.name);
    const [collection] = await db.insert(collectionsTable).values({
      name: body.name,
      slug,
      description: body.description,
      image: body.image,
      bannerImage: body.bannerImage,
      featured: body.featured ?? false,
      season: body.season,
      sortOrder: body.sortOrder ?? 0,
    }).returning();
    res.status(201).json(await enrichCollection(collection));
  } catch (e: any) {
    res.status(400).json({ error: dbError(e) });
  }
});

// GET /api/collections/:slug
router.get("/:slug", async (req, res) => {
  try {
    const [collection] = await db.select().from(collectionsTable).where(eq(collectionsTable.slug, req.params.slug));
    if (!collection) return res.status(404).json({ error: "Not found" });
    res.json(await enrichCollection(collection));
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

// PATCH /api/collections/:slug
router.patch("/:slug", async (req, res) => {
  try {
    const body = UpdateCollectionBody.parse(req.body);
    const [updated] = await db.update(collectionsTable).set(body).where(eq(collectionsTable.slug, req.params.slug)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(await enrichCollection(updated));
  } catch (e: any) {
    res.status(400).json({ error: dbError(e) });
  }
});

// DELETE /api/collections/:slug
router.delete("/:slug", async (req, res) => {
  try {
    await db.delete(collectionsTable).where(eq(collectionsTable.slug, req.params.slug));
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

export default router;
