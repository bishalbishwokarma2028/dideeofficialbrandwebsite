import { Router } from "express";
import { db } from "@workspace/db";
import { customersTable, ordersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { CreateCustomerBody } from "@workspace/api-zod";
import { dbError } from "../lib/db-error.js";

const router = Router();

async function enrichCustomer(c: typeof customersTable.$inferSelect) {
  const orders = await db.select().from(ordersTable).where(eq(ordersTable.customerId, c.id));
  const totalSpent = orders.reduce((s, o) => s + parseFloat(o.total), 0);
  return { ...c, orderCount: orders.length, totalSpent, createdAt: c.createdAt.toISOString() };
}

// GET /api/customers
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit ?? "20"));
    const offset = parseInt(String(req.query.offset ?? "0"));
    const all = await db.select().from(customersTable).orderBy(desc(customersTable.createdAt));
    const paged = all.slice(offset, offset + limit);
    res.json({ customers: await Promise.all(paged.map(enrichCustomer)), total: all.length });
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

// POST /api/customers
router.post("/", async (req, res) => {
  try {
    const body = CreateCustomerBody.parse(req.body);
    const [customer] = await db.insert(customersTable).values({
      email: body.email,
      name: body.name,
      phone: body.phone ?? null,
      address: body.address ?? null,
      city: body.city ?? null,
    }).returning();
    res.status(201).json(await enrichCustomer(customer));
  } catch (e: any) {
    res.status(400).json({ error: dbError(e) });
  }
});

// GET /api/customers/:id
router.get("/:id", async (req, res) => {
  try {
    const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, parseInt(req.params.id)));
    if (!customer) return res.status(404).json({ error: "Not found" });
    res.json(await enrichCustomer(customer));
  } catch (e: any) {
    res.status(500).json({ error: dbError(e) });
  }
});

export default router;
