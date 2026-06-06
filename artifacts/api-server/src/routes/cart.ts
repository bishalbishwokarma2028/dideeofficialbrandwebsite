import { Router } from "express";
import { db } from "@workspace/db";
import { cartItemsTable, productsTable, productVariantsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { AddToCartBody, UpdateCartItemBody } from "@workspace/api-zod";

const router = Router();

async function buildCart(sessionId: string) {
  const items = await db.select().from(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));
  const enriched = await Promise.all(items.map(async (item) => {
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId));
    let variant = null;
    if (item.variantId) {
      const [v] = await db.select().from(productVariantsTable).where(eq(productVariantsTable.id, item.variantId));
      if (v) variant = { ...v, price: parseFloat(v.price) };
    }
    const price = parseFloat(item.price);
    return {
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      price,
      product: product ? {
        ...product,
        price: parseFloat(product.price),
        comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : null,
        totalStock: 0,
        avgRating: null,
        reviewCount: 0,
        createdAt: product.createdAt.toISOString(),
      } : null,
      variant,
    };
  }));
  const subtotal = enriched.reduce((s, i) => s + i.price * i.quantity, 0);
  return {
    sessionId,
    items: enriched,
    subtotal,
    itemCount: enriched.reduce((s, i) => s + i.quantity, 0),
  };
}

// GET /api/cart
router.get("/", async (req, res) => {
  try {
    const sessionId = String(req.query.sessionId ?? "");
    if (!sessionId) return res.status(400).json({ error: "sessionId required" });
    res.json(await buildCart(sessionId));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/cart/items
router.post("/items", async (req, res) => {
  try {
    const body = AddToCartBody.parse(req.body);
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, body.productId));
    if (!product) return res.status(404).json({ error: "Product not found" });

    const price = body.variantId
      ? await db.select().from(productVariantsTable).where(eq(productVariantsTable.id, body.variantId)).then(([v]) => v?.price ?? product.price)
      : product.price;

    const [existing] = await db.select().from(cartItemsTable).where(
      and(
        eq(cartItemsTable.sessionId, body.sessionId),
        eq(cartItemsTable.productId, body.productId),
        body.variantId ? eq(cartItemsTable.variantId, body.variantId) : eq(cartItemsTable.variantId, 0)
      )
    );

    if (existing) {
      await db.update(cartItemsTable).set({ quantity: existing.quantity + body.quantity }).where(eq(cartItemsTable.id, existing.id));
    } else {
      await db.insert(cartItemsTable).values({
        sessionId: body.sessionId,
        productId: body.productId,
        variantId: body.variantId ?? null,
        quantity: body.quantity,
        price: String(price),
      });
    }

    res.status(201).json(await buildCart(body.sessionId));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// PATCH /api/cart/items/:cartItemId
router.patch("/items/:cartItemId", async (req, res) => {
  try {
    const body = UpdateCartItemBody.parse(req.body);
    const id = parseInt(req.params.cartItemId);
    const [item] = await db.select().from(cartItemsTable).where(eq(cartItemsTable.id, id));
    if (!item) return res.status(404).json({ error: "Not found" });
    if (body.quantity <= 0) {
      await db.delete(cartItemsTable).where(eq(cartItemsTable.id, id));
    } else {
      await db.update(cartItemsTable).set({ quantity: body.quantity }).where(eq(cartItemsTable.id, id));
    }
    res.json(await buildCart(item.sessionId));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE /api/cart/items/:cartItemId
router.delete("/items/:cartItemId", async (req, res) => {
  try {
    const id = parseInt(req.params.cartItemId);
    const [item] = await db.select().from(cartItemsTable).where(eq(cartItemsTable.id, id));
    if (!item) return res.status(404).json({ error: "Not found" });
    await db.delete(cartItemsTable).where(eq(cartItemsTable.id, id));
    res.json(await buildCart(item.sessionId));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
