import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  customerName: text("customer_name").notNull(),
  rating: integer("rating").notNull(),
  title: text("title"),
  body: text("body"),
  approved: boolean("approved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const journalPostsTable = pgTable("journal_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  coverImage: text("cover_image"),
  author: text("author").notNull(),
  category: text("category"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(false),
  publishedAt: timestamp("published_at"),
  readMinutes: integer("read_minutes").notNull().default(5),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const lookbookItemsTable = pgTable("lookbook_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  image: text("image").notNull(),
  season: text("season"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  productIds: jsonb("product_ids").$type<number[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const cartItemsTable = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: integer("product_id").notNull(),
  variantId: integer("variant_id"),
  quantity: integer("quantity").notNull().default(1),
  price: text("price").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const contactMessagesTable = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("unread"),
  adminReply: text("admin_reply"),
  repliedAt: timestamp("replied_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const newsletterSubscribersTable = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviewsTable).omit({ id: true, createdAt: true });
export const insertJournalPostSchema = createInsertSchema(journalPostsTable).omit({ id: true, createdAt: true });
export const insertLookbookItemSchema = createInsertSchema(lookbookItemsTable).omit({ id: true, createdAt: true });
export const insertCartItemSchema = createInsertSchema(cartItemsTable).omit({ id: true, createdAt: true });
export const insertContactMessageSchema = createInsertSchema(contactMessagesTable).omit({ id: true, createdAt: true, adminReply: true, repliedAt: true, status: true });
export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribersTable).omit({ id: true, createdAt: true });

export type Review = typeof reviewsTable.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type JournalPost = typeof journalPostsTable.$inferSelect;
export type InsertJournalPost = z.infer<typeof insertJournalPostSchema>;
export type LookbookItem = typeof lookbookItemsTable.$inferSelect;
export type InsertLookbookItem = z.infer<typeof insertLookbookItemSchema>;
export type CartItem = typeof cartItemsTable.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type ContactMessage = typeof contactMessagesTable.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribersTable.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
