import { Router } from "express";
import { db } from "@workspace/db";
import { lookbookItemsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { CreateLookbookItemBody } from "@workspace/api-zod";
import { dbError } from "../lib/db-error.js";

const router = Router();

// GET /api/lookbook
router.get("/", async (req, res) => {
  try {
    const season = req.query.season as string | undefined;
    const limit = parseInt(String(req.query.limit ?? "20"));

    let query = db.select().from(lookbookItemsTable).$dynamic();
    if (season) query = query.where(eq(lookbookItemsTable.season, season));
    query = query.orderBy(asc(lookbookItemsTable.sortOrder)).limit(limit);

    const items = await query;
    res.json(items.map(i => ({ ...i, createdAt: i.createdAt.toISOString() })));
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

// POST /api/lookbook
router.post("/", async (req, res) => {
  try {
    const body = CreateLookbookItemBody.parse(req.body);
    const [item] = await db.insert(lookbookItemsTable).values({
      title: body.title,
      description: body.description ?? null,
      image: body.image,
      season: body.season ?? null,
      tags: body.tags ?? [],
      productIds: body.productIds ?? [],
      sortOrder: body.sortOrder ?? 0,
    }).returning();
    res.status(201).json({ ...item, createdAt: item.createdAt.toISOString() });
  } catch (e: any) {
    res.status(400).json({ error: dbError(e) });
  }
});

// PATCH /api/lookbook/:id
router.patch("/:id", async (req, res) => {
  try {
    const [updated] = await db.update(lookbookItemsTable).set(req.body).where(eq(lookbookItemsTable.id, parseInt(req.params.id))).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
  } catch (e: any) {
    res.status(400).json({ error: dbError(e) });
  }
});

// DELETE /api/lookbook/:id
router.delete("/:id", async (req, res) => {
  try {
    await db.delete(lookbookItemsTable).where(eq(lookbookItemsTable.id, parseInt(req.params.id)));
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

export default router;
