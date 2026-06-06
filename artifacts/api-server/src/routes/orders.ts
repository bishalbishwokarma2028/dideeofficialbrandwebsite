import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable, productsTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import { CreateOrderBody, UpdateOrderBody } from "@workspace/api-zod";
import { getUserIdFromRequest } from "../lib/jwt.js";

const router = Router();

async function enrichOrder(order: typeof ordersTable.$inferSelect) {
  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
  return {
    ...order,
    subtotal: parseFloat(order.subtotal),
    shippingCost: parseFloat(order.shippingCost),
    discount: parseFloat(order.discount),
    total: parseFloat(order.total),
    createdAt: order.createdAt.toISOString(),
    items: items.map(i => ({ ...i, price: parseFloat(i.price) })),
  };
}

// GET /api/orders  (admin)
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit ?? "20"));
    const offset = parseInt(String(req.query.offset ?? "0"));
    const status = req.query.status as string | undefined;

    let query = db.select().from(ordersTable).$dynamic();
    if (status) query = query.where(eq(ordersTable.status, status));
    query = query.orderBy(desc(ordersTable.createdAt));

    const all = await query;
    const total = all.length;
    const paged = all.slice(offset, offset + limit);
    const orders = await Promise.all(paged.map(enrichOrder));
    res.json({ orders, total });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/orders  (place order — user token optional)
router.post("/", async (req, res) => {
  try {
    const body = CreateOrderBody.parse(req.body);
    const userId = getUserIdFromRequest(req);
    const subtotal = body.items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shippingCost = subtotal >= 3000 ? 0 : 100;
    const total = subtotal + shippingCost;

    const [order] = await db.insert(ordersTable).values({
      userId,
      customerId: body.customerId ?? null,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone ?? null,
      status: "pending",
      subtotal: String(subtotal),
      shippingCost: String(shippingCost),
      discount: "0",
      total: String(total),
      shippingAddress: body.shippingAddress,
      district: (body as any).district ?? null,
      city: body.city,
      landmark: (body as any).landmark ?? null,
      paymentMethod: body.paymentMethod,
      paymentStatus: "pending",
      notes: body.notes ?? null,
    }).returning();

    const itemValues = await Promise.all(body.items.map(async (item) => {
      const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId));
      return {
        orderId: order.id,
        productId: item.productId,
        variantId: item.variantId ?? null,
        productName: product?.name ?? "Unknown",
        quantity: item.quantity,
        price: String(item.price),
        size: null as string | null,
        color: null as string | null,
      };
    }));

    await db.insert(orderItemsTable).values(itemValues);
    res.status(201).json(await enrichOrder(order));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  try {
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, parseInt(req.params.id)));
    if (!order) return res.status(404).json({ error: "Not found" });
    res.json(await enrichOrder(order));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/orders/:id  (admin)
router.patch("/:id", async (req, res) => {
  try {
    const body = UpdateOrderBody.parse(req.body);
    const updates: any = { ...body, updatedAt: new Date() };
    const [updated] = await db.update(ordersTable).set(updates).where(eq(ordersTable.id, parseInt(req.params.id))).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(await enrichOrder(updated));
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE /api/orders/:id  (customer can cancel pending orders)
router.delete("/:id", async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const userId = getUserIdFromRequest(req);

    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
    if (!order) return res.status(404).json({ error: "Order not found" });

    const completedStatuses = ["delivered", "shipped", "processing", "confirmed"];
    if (completedStatuses.includes(order.status)) {
      return res.status(403).json({ error: "Cannot cancel an order that is already being processed or completed." });
    }

    if (userId && order.userId && order.userId !== userId) {
      return res.status(403).json({ error: "Not authorised to cancel this order." });
    }

    await db.update(ordersTable)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(ordersTable.id, orderId));

    res.json({ success: true, message: "Order cancelled successfully." });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
