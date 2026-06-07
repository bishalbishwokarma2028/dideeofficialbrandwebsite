import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { CreateCategoryBody } from "@workspace/api-zod";
import { dbError } from "../lib/db-error.js";

const router = Router();

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// GET /api/categories
router.get("/", async (req, res) => {
  try {
    const categories = await db.select().from(categoriesTable).orderBy(asc(categoriesTable.name));
    res.json(categories);
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

// POST /api/categories
router.post("/", async (req, res) => {
  try {
    const body = CreateCategoryBody.parse(req.body);
    const slug = slugify(body.name);
    const [category] = await db.insert(categoriesTable).values({
      name: body.name,
      slug,
      parentSlug: body.parentSlug,
    }).returning();
    res.status(201).json(category);
  } catch (e: any) {
    res.status(400).json({ error: dbError(e) });
  }
});

// DELETE /api/categories/:slug
router.delete("/:slug", async (req, res) => {
  try {
    await db.delete(categoriesTable).where(eq(categoriesTable.slug, req.params.slug));
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

export default router;
