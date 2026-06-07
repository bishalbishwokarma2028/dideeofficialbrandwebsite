import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable, productsTable, productVariantsTable, customersTable } from "@workspace/db";
import { eq, desc, gte, sql } from "drizzle-orm";
import { dbError } from "../lib/db-error.js";

const router = Router();

// GET /api/dashboard/summary
router.get("/summary", async (req, res) => {
  try {
    const [orderStats] = await db.select({
      total: sql<number>`count(*)`,
      revenue: sql<number>`coalesce(sum(total::numeric), 0)`,
      pending: sql<number>`count(*) filter (where status = 'pending')`,
    }).from(ordersTable);

    const [customerStats] = await db.select({ total: sql<number>`count(*)` }).from(customersTable);
    const [productStats] = await db.select({ total: sql<number>`count(*)` }).from(productsTable).where(eq(productsTable.status, "active"));
    const [lowStockStats] = await db.select({ count: sql<number>`count(*)` }).from(productVariantsTable).where(sql`${productVariantsTable.stock} < 5`);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [monthStats] = await db.select({
      revenue: sql<number>`coalesce(sum(total::numeric), 0)`,
      orders: sql<number>`count(*)`,
    }).from(ordersTable).where(gte(ordersTable.createdAt, monthStart));

    res.json({
      totalRevenue: Number(orderStats.revenue),
      totalOrders: Number(orderStats.total),
      totalCustomers: Number(customerStats.total),
      totalProducts: Number(productStats.total),
      pendingOrders: Number(orderStats.pending),
      lowStockCount: Number(lowStockStats.count),
      revenueThisMonth: Number(monthStats.revenue),
      ordersThisMonth: Number(monthStats.orders),
    });
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

// GET /api/dashboard/recent-orders
router.get("/recent-orders", async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit ?? "10"));
    const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).limit(limit);
    res.json(orders.map(o => ({
      ...o,
      subtotal: parseFloat(o.subtotal),
      shippingCost: parseFloat(o.shippingCost),
      discount: parseFloat(o.discount),
      total: parseFloat(o.total),
      createdAt: o.createdAt.toISOString(),
      items: [],
    })));
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

// GET /api/dashboard/top-products
router.get("/top-products", async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit ?? "5"));
    const topItems = await db.select({
      productId: orderItemsTable.productId,
      totalSold: sql<number>`sum(${orderItemsTable.quantity})`,
      revenue: sql<number>`sum(${orderItemsTable.quantity} * ${orderItemsTable.price}::numeric)`,
    }).from(orderItemsTable).groupBy(orderItemsTable.productId).orderBy(desc(sql`sum(${orderItemsTable.quantity})`)).limit(limit);

    const result = await Promise.all(topItems.map(async (item) => {
      const [product] = await db.select().from(productsTable).where(eq(productsTable.id, item.productId));
      if (!product) return null;
      return {
        product: {
          ...product,
          price: parseFloat(product.price),
          comparePrice: product.comparePrice ? parseFloat(product.comparePrice) : null,
          totalStock: 0,
          avgRating: null,
          reviewCount: 0,
          createdAt: product.createdAt.toISOString(),
        },
        totalSold: Number(item.totalSold),
        revenue: Number(item.revenue),
      };
    }));

    res.json(result.filter(Boolean));
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

export default router;
