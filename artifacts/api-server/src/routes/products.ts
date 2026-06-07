import { Router } from "express";
import { db } from "@workspace/db";
import {
  productsTable,
  productVariantsTable,
  collectionsTable,
  categoriesTable,
  reviewsTable,
} from "@workspace/db";
import { eq, and, gte, lte, desc, asc, ilike, or, sql } from "drizzle-orm";
import {
  ListProductsQueryParams,
  CreateProductBody,
  UpdateProductBody,
  CreateProductVariantBody,
} from "@workspace/api-zod";
import { dbError } from "../lib/db-error.js";

const router = Router();

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function enrichProduct(p: typeof productsTable.$inferSelect) {
  const variants = await db.select().from(productVariantsTable).where(eq(productVariantsTable.productId, p.id));
  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
  const reviews = await db.select().from(reviewsTable).where(and(eq(reviewsTable.productId, p.id), eq(reviewsTable.approved, true)));
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;
  return {
    ...p,
    price: parseFloat(p.price),
    comparePrice: p.comparePrice ? parseFloat(p.comparePrice) : null,
    totalStock,
    avgRating,
    reviewCount: reviews.length,
    createdAt: p.createdAt.toISOString(),
  };
}

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const params = ListProductsQueryParams.parse(req.query);
    let query = db.select().from(productsTable).$dynamic();

    const conditions: Parameters<typeof and>[] = [];
    if (params.collectionSlug) conditions.push(eq(productsTable.collectionSlug, params.collectionSlug));
    if (params.categorySlug) conditions.push(eq(productsTable.categorySlug, params.categorySlug));
    if (params.featured !== undefined) conditions.push(eq(productsTable.featured, params.featured));
    if (params.isNew !== undefined) conditions.push(eq(productsTable.isNew, params.isNew));
    if (params.isBestSeller !== undefined) conditions.push(eq(productsTable.isBestSeller, params.isBestSeller));
    if (params.minPrice !== undefined) conditions.push(gte(productsTable.price, String(params.minPrice)));
    if (params.maxPrice !== undefined) conditions.push(lte(productsTable.price, String(params.maxPrice)));
    conditions.push(eq(productsTable.status, "active"));

    if (conditions.length) query = query.where(and(...(conditions as any)));

    if (params.sortBy === "price_asc") query = query.orderBy(asc(productsTable.price));
    else if (params.sortBy === "price_desc") query = query.orderBy(desc(productsTable.price));
    else if (params.sortBy === "name") query = query.orderBy(asc(productsTable.name));
    else query = query.orderBy(desc(productsTable.createdAt));

    const all = await query;
    const total = all.length;
    const offset = params.offset ?? 0;
    const limit = params.limit ?? 20;
    const paged = all.slice(offset, offset + limit);
    const products = await Promise.all(paged.map(enrichProduct));
    res.json({ products, total });
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const body = CreateProductBody.parse(req.body);
    const slug = slugify(body.name);
    const [product] = await db.insert(productsTable).values({
      name: body.name,
      slug,
      description: body.description,
      shortDescription: body.shortDescription,
      price: String(body.price),
      comparePrice: body.comparePrice != null ? String(body.comparePrice) : null,
      images: body.images ?? [],
      tags: body.tags ?? [],
      collectionSlug: body.collectionSlug,
      categorySlug: body.categorySlug,
      status: body.status ?? "active",
      featured: body.featured ?? false,
      isNew: body.isNew ?? true,
      isBestSeller: body.isBestSeller ?? false,
    }).returning();
    res.status(201).json(await enrichProduct(product));
  } catch (e: any) {
    res.status(400).json({ error: dbError(e) });
  }
});

// GET /api/products/featured
router.get("/featured", async (req, res) => {
  try {
    const products = await db.select().from(productsTable).where(and(eq(productsTable.featured, true), eq(productsTable.status, "active"))).orderBy(desc(productsTable.createdAt)).limit(8);
    res.json(await Promise.all(products.map(enrichProduct)));
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

// GET /api/products/new-arrivals
router.get("/new-arrivals", async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit ?? "8"));
    const products = await db.select().from(productsTable).where(and(eq(productsTable.isNew, true), eq(productsTable.status, "active"))).orderBy(desc(productsTable.createdAt)).limit(limit);
    res.json(await Promise.all(products.map(enrichProduct)));
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

// GET /api/products/best-sellers
router.get("/best-sellers", async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit ?? "8"));
    const products = await db.select().from(productsTable).where(and(eq(productsTable.isBestSeller, true), eq(productsTable.status, "active"))).orderBy(desc(productsTable.createdAt)).limit(limit);
    res.json(await Promise.all(products.map(enrichProduct)));
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

// GET /api/products/:slug
router.get("/:slug", async (req, res) => {
  try {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.slug, req.params.slug));
    if (!product) return res.status(404).json({ error: "Not found" });
    const variants = await db.select().from(productVariantsTable).where(eq(productVariantsTable.productId, product.id));
    const reviews = await db.select().from(reviewsTable).where(and(eq(reviewsTable.productId, product.id), eq(reviewsTable.approved, true)));
    const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;
    let collection = null;
    if (product.collectionSlug) {
      const [col] = await db.select().from(collectionsTable).where(eq(collectionsTable.slug, product.collectionSlug));
      if (col) {
        const count = await db.select({ count: sql<number>`count(*)` }).from(productsTable).where(eq(productsTable.collectionSlug, col.slug));
        collection = { ...col, productCount: Number(count[0]?.count ?? 0), sortOrder: col.sortOrder ?? 0 };
      }
    }
    res.json({
      ...product,
      price: parseFloat(product.price),
      comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : null,
      totalStock: variants.reduce((s, v) => s + v.stock, 0),
      avgRating,
      reviewCount: reviews.length,
      createdAt: product.createdAt.toISOString(),
      variants: variants.map(v => ({ ...v, price: parseFloat(v.price) })),
      reviews: reviews.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })),
      collection,
    });
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

// PATCH /api/products/:slug
router.patch("/:slug", async (req, res) => {
  try {
    const body = UpdateProductBody.parse(req.body);
    const updates: any = { ...body, updatedAt: new Date() };
    if (body.price !== undefined) updates.price = String(body.price);
    if (body.comparePrice !== undefined) updates.comparePrice = body.comparePrice != null ? String(body.comparePrice) : null;
    const [updated] = await db.update(productsTable).set(updates).where(eq(productsTable.slug, req.params.slug)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(await enrichProduct(updated));
  } catch (e: any) {
    res.status(400).json({ error: dbError(e) });
  }
});

// DELETE /api/products/:slug
router.delete("/:slug", async (req, res) => {
  try {
    await db.delete(productsTable).where(eq(productsTable.slug, req.params.slug));
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

// GET /api/products/:slug/variants
router.get("/:slug/variants", async (req, res) => {
  try {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.slug, req.params.slug));
    if (!product) return res.status(404).json({ error: "Not found" });
    const variants = await db.select().from(productVariantsTable).where(eq(productVariantsTable.productId, product.id));
    res.json(variants.map(v => ({ ...v, price: parseFloat(v.price) })));
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

// POST /api/products/:slug/variants
router.post("/:slug/variants", async (req, res) => {
  try {
    const body = CreateProductVariantBody.parse(req.body);
    const [product] = await db.select().from(productsTable).where(eq(productsTable.slug, req.params.slug));
    if (!product) return res.status(404).json({ error: "Not found" });
    const [variant] = await db.insert(productVariantsTable).values({
      productId: product.id,
      size: body.size,
      color: body.color,
      sku: body.sku,
      stock: body.stock,
      price: String(body.price),
    }).returning();
    res.status(201).json({ ...variant, price: parseFloat(variant.price) });
  } catch (e: any) {
    res.status(400).json({ error: dbError(e) });
  }
});

// GET /api/products/:slug/related
router.get("/:slug/related", async (req, res) => {
  try {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.slug, req.params.slug));
    if (!product) return res.status(404).json({ error: "Not found" });
    const related = await db.select().from(productsTable).where(
      and(
        eq(productsTable.status, "active"),
        product.collectionSlug ? eq(productsTable.collectionSlug, product.collectionSlug) : sql`1=1`,
        sql`${productsTable.id} != ${product.id}`
      )
    ).limit(4);
    res.json(await Promise.all(related.map(enrichProduct)));
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

export default router;
