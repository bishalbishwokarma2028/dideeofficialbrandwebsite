import { Router } from "express";
import { db } from "@workspace/db";
import { lookbookItemsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { CreateLookbookItemBody } from "@workspace/api-zod";

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
    res.status(500).json({ error: e.message });
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
    res.status(400).json({ error: e.message });
  }
});

export default router;
