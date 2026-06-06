-- ============================================================
-- DIDEE — Supabase SQL Editor Schema
-- Run this in your Supabase project: SQL Editor → New Query
-- Paste all of this, then click RUN
-- ============================================================

-- Enable UUID extension (optional, not used here but good practice)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- 1. USERS  (customer accounts)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id               SERIAL PRIMARY KEY,
  email            TEXT NOT NULL UNIQUE,
  password_hash    TEXT NOT NULL,
  name             TEXT NOT NULL,
  phone            TEXT,
  email_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 2. CUSTOMERS  (guest/legacy customer records)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id          SERIAL PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  phone       TEXT,
  address     TEXT,
  city        TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 3. COLLECTIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS collections (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  description  TEXT,
  image        TEXT,
  banner_image TEXT,
  featured     BOOLEAN NOT NULL DEFAULT FALSE,
  season       TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 4. CATEGORIES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  parent_slug TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 5. PRODUCTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                  SERIAL PRIMARY KEY,
  name                TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  description         TEXT,
  short_description   TEXT,
  price               NUMERIC(10, 2) NOT NULL,
  compare_price       NUMERIC(10, 2),
  images              JSONB NOT NULL DEFAULT '[]',
  tags                JSONB NOT NULL DEFAULT '[]',
  collection_slug     TEXT REFERENCES collections(slug),
  category_slug       TEXT REFERENCES categories(slug),
  status              TEXT NOT NULL DEFAULT 'active',
  featured            BOOLEAN NOT NULL DEFAULT FALSE,
  is_new              BOOLEAN NOT NULL DEFAULT FALSE,
  is_best_seller      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 6. PRODUCT VARIANTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_variants (
  id          SERIAL PRIMARY KEY,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size        TEXT,
  color       TEXT,
  sku         TEXT NOT NULL UNIQUE,
  stock       INTEGER NOT NULL DEFAULT 0,
  price       NUMERIC(10, 2) NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 7. ORDERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER REFERENCES users(id),
  customer_id      INTEGER REFERENCES customers(id),
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  customer_phone   TEXT,
  status           TEXT NOT NULL DEFAULT 'pending',
  subtotal         NUMERIC(10, 2) NOT NULL DEFAULT 0,
  shipping_cost    NUMERIC(10, 2) NOT NULL DEFAULT 0,
  discount         NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total            NUMERIC(10, 2) NOT NULL,
  shipping_address TEXT,
  district         TEXT,
  city             TEXT,
  landmark         TEXT,
  payment_method   TEXT,
  payment_status   TEXT NOT NULL DEFAULT 'pending',
  notes            TEXT,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 8. ORDER ITEMS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id           SERIAL PRIMARY KEY,
  order_id     INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   INTEGER NOT NULL,
  variant_id   INTEGER,
  product_name TEXT NOT NULL,
  quantity     INTEGER NOT NULL,
  price        NUMERIC(10, 2) NOT NULL,
  size         TEXT,
  color        TEXT
);

-- ─────────────────────────────────────────────
-- 9. REVIEWS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id             SERIAL PRIMARY KEY,
  product_id     INTEGER NOT NULL,
  customer_name  TEXT NOT NULL,
  rating         INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title          TEXT,
  body           TEXT,
  approved       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 10. JOURNAL POSTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS journal_posts (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  excerpt      TEXT,
  content      TEXT,
  cover_image  TEXT,
  author       TEXT NOT NULL,
  category     TEXT,
  tags         JSONB NOT NULL DEFAULT '[]',
  featured     BOOLEAN NOT NULL DEFAULT FALSE,
  published    BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMP,
  read_minutes INTEGER NOT NULL DEFAULT 5,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 11. LOOKBOOK ITEMS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lookbook_items (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  image       TEXT NOT NULL,
  season      TEXT,
  tags        JSONB NOT NULL DEFAULT '[]',
  product_ids JSONB NOT NULL DEFAULT '[]',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 12. CART ITEMS  (session-based shopping cart)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id          SERIAL PRIMARY KEY,
  session_id  TEXT NOT NULL,
  product_id  INTEGER NOT NULL,
  variant_id  INTEGER,
  quantity    INTEGER NOT NULL DEFAULT 1,
  price       TEXT NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 13. CONTACT MESSAGES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'unread',
  admin_reply TEXT,
  replied_at  TIMESTAMP,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 14. NEWSLETTER SUBSCRIBERS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id         SERIAL PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- INDEXES  (for performance on common queries)
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_collection_slug  ON products(collection_slug);
CREATE INDEX IF NOT EXISTS idx_products_category_slug    ON products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_status           ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured         ON products(featured);
CREATE INDEX IF NOT EXISTS idx_product_variants_product  ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id            ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status             ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at         ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id      ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id     ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_journal_posts_slug        ON journal_posts(slug);
CREATE INDEX IF NOT EXISTS idx_journal_posts_published   ON journal_posts(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id        ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status   ON contact_messages(status);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY  (recommended for Supabase)
-- Uncomment and configure if you use Supabase Auth
-- ─────────────────────────────────────────────
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- DONE — All 14 tables created successfully
-- ─────────────────────────────────────────────
