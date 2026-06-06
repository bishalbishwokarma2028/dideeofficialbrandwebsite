import { Router } from "express";
import { db } from "@workspace/db";
import { newsletterSubscribersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// POST /api/newsletter/subscribe
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Valid email required" });
    return;
  }
  const existing = await db
    .select()
    .from(newsletterSubscribersTable)
    .where(eq(newsletterSubscribersTable.email, email.toLowerCase().trim()));

  if (existing.length > 0) {
    if (existing[0].active) {
      res.json({ message: "Already subscribed", alreadySubscribed: true });
    } else {
      await db
        .update(newsletterSubscribersTable)
        .set({ active: true })
        .where(eq(newsletterSubscribersTable.email, email.toLowerCase().trim()));
      res.json({ message: "Resubscribed successfully" });
    }
    return;
  }
  await db.insert(newsletterSubscribersTable).values({ email: email.toLowerCase().trim() });
  res.status(201).json({ message: "Subscribed successfully" });
});

// GET /api/newsletter/subscribers — admin only
router.get("/subscribers", async (req, res) => {
  if (!(req.session as any).adminAuthenticated) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const subscribers = await db
    .select()
    .from(newsletterSubscribersTable)
    .orderBy(newsletterSubscribersTable.createdAt);
  res.json(subscribers.reverse());
});

export default router;
