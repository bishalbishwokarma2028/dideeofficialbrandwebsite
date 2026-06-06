import { Router } from "express";
import { db } from "@workspace/db";
import { contactMessagesTable, insertContactMessageSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { isAdminRequest, getUserIdFromRequest } from "../lib/jwt.js";

const router = Router();

// POST /api/contact — submit a contact message (public)
router.post("/", async (req, res) => {
  const parsed = insertContactMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
    return;
  }
  const [msg] = await db.insert(contactMessagesTable).values(parsed.data).returning();
  res.status(201).json(msg);
});

// GET /api/contact — admin: list all messages
router.get("/", async (req, res) => {
  if (!isAdminRequest(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const messages = await db
    .select()
    .from(contactMessagesTable)
    .orderBy(contactMessagesTable.createdAt);
  res.json(messages.reverse());
});

// GET /api/contact/my — user: get own messages by email
router.get("/my", async (req, res) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { usersTable } = await import("@workspace/db");
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const messages = await db
    .select()
    .from(contactMessagesTable)
    .where(eq(contactMessagesTable.email, user.email))
    .orderBy(contactMessagesTable.createdAt);
  res.json(messages.reverse());
});

// PATCH /api/contact/:id/reply — admin: reply to a message
router.patch("/:id/reply", async (req, res) => {
  if (!isAdminRequest(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const { reply } = req.body;
  if (!reply || typeof reply !== "string") {
    res.status(400).json({ error: "Reply text required" });
    return;
  }
  const [updated] = await db
    .update(contactMessagesTable)
    .set({ adminReply: reply, repliedAt: new Date(), status: "replied" })
    .where(eq(contactMessagesTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  res.json(updated);
});

// PATCH /api/contact/:id/status — admin: mark as read/unread
router.patch("/:id/status", async (req, res) => {
  if (!isAdminRequest(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const { status } = req.body;
  const [updated] = await db
    .update(contactMessagesTable)
    .set({ status })
    .where(eq(contactMessagesTable.id, id))
    .returning();
  res.json(updated);
});

export default router;
