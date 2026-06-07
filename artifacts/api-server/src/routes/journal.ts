import { Router } from "express";
import { db } from "@workspace/db";
import { journalPostsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { CreateJournalPostBody } from "@workspace/api-zod";
import { dbError } from "../lib/db-error.js";

const router = Router();

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function serializePost(p: typeof journalPostsTable.$inferSelect) {
  return {
    ...p,
    createdAt: p.createdAt.toISOString(),
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
  };
}

// GET /api/journal
router.get("/", async (req, res) => {
  try {
    const featured = req.query.featured === "true" ? true : undefined;
    const category = req.query.category as string | undefined;
    const limit = parseInt(String(req.query.limit ?? "12"));
    const offset = parseInt(String(req.query.offset ?? "0"));

    let query = db.select().from(journalPostsTable).$dynamic();
    const conds: any[] = [eq(journalPostsTable.published, true)];
    if (featured !== undefined) conds.push(eq(journalPostsTable.featured, featured));
    if (category) conds.push(eq(journalPostsTable.category, category));
    query = query.where(and(...conds)).orderBy(desc(journalPostsTable.publishedAt)).limit(limit).offset(offset);

    const posts = await query;
    res.json(posts.map(serializePost));
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

// GET /api/journal/all — admin: all posts including unpublished
router.get("/all", async (req, res) => {
  try {
    const posts = await db.select().from(journalPostsTable).orderBy(desc(journalPostsTable.createdAt));
    res.json(posts.map(serializePost));
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

// POST /api/journal
router.post("/", async (req, res) => {
  try {
    const body = CreateJournalPostBody.parse(req.body);
    const slug = slugify(body.title);
    const [post] = await db.insert(journalPostsTable).values({
      title: body.title,
      slug,
      excerpt: body.excerpt ?? null,
      content: body.content ?? null,
      coverImage: body.coverImage ?? null,
      author: body.author,
      category: body.category ?? null,
      tags: body.tags ?? [],
      featured: body.featured ?? false,
      published: body.published ?? false,
      publishedAt: body.published ? new Date() : null,
      readMinutes: Math.ceil((body.content?.split(" ").length ?? 100) / 200),
    }).returning();
    res.status(201).json(serializePost(post));
  } catch (e: any) {
    res.status(400).json({ error: dbError(e) });
  }
});

// GET /api/journal/:slug
router.get("/:slug", async (req, res) => {
  try {
    const [post] = await db.select().from(journalPostsTable).where(eq(journalPostsTable.slug, req.params.slug));
    if (!post) return res.status(404).json({ error: "Not found" });
    res.json(serializePost(post));
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

// PATCH /api/journal/:slug
router.patch("/:slug", async (req, res) => {
  try {
    const updates: any = { ...req.body };
    if (updates.published && !updates.publishedAt) updates.publishedAt = new Date();
    const [updated] = await db.update(journalPostsTable).set(updates).where(eq(journalPostsTable.slug, req.params.slug)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(serializePost(updated));
  } catch (e: any) {
    res.status(400).json({ error: dbError(e) });
  }
});

// DELETE /api/journal/:slug
router.delete("/:slug", async (req, res) => {
  try {
    await db.delete(journalPostsTable).where(eq(journalPostsTable.slug, req.params.slug));
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

export default router;
