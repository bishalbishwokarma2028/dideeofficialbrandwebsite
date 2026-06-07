import { pool } from "@workspace/db";

export async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log("[migrate] Running database migrations...");

    // Create tables in dependency order
    await client.query(`
      CREATE TABLE IF NOT EXISTS collections (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        image TEXT,
        banner_image TEXT,
        featured BOOLEAN NOT NULL DEFAULT false,
        season TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        parent_slug TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        short_description TEXT,
        price NUMERIC(10,2) NOT NULL,
        compare_price NUMERIC(10,2),
        images JSONB NOT NULL DEFAULT '[]',
        tags JSONB NOT NULL DEFAULT '[]',
        collection_slug TEXT,
        category_slug TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        featured BOOLEAN NOT NULL DEFAULT false,
        is_new BOOLEAN NOT NULL DEFAULT false,
        is_best_seller BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS product_variants (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        size TEXT,
        color TEXT,
        sku TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        price NUMERIC(10,2) NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        email_verified BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        city TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        customer_id INTEGER,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
        shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
        discount NUMERIC(10,2) NOT NULL DEFAULT 0,
        total NUMERIC(10,2) NOT NULL,
        shipping_address TEXT,
        district TEXT,
        city TEXT,
        landmark TEXT,
        payment_method TEXT,
        payment_status TEXT NOT NULL DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        variant_id INTEGER,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        size TEXT,
        color TEXT
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        customer_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        title TEXT,
        body TEXT,
        approved BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS journal_posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT,
        content TEXT,
        cover_image TEXT,
        author TEXT NOT NULL,
        category TEXT,
        tags JSONB NOT NULL DEFAULT '[]',
        featured BOOLEAN NOT NULL DEFAULT false,
        published BOOLEAN NOT NULL DEFAULT false,
        published_at TIMESTAMP,
        read_minutes INTEGER NOT NULL DEFAULT 5,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS lookbook_items (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image TEXT NOT NULL,
        season TEXT,
        tags JSONB NOT NULL DEFAULT '[]',
        product_ids JSONB NOT NULL DEFAULT '[]',
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        session_id TEXT NOT NULL,
        product_id INTEGER NOT NULL,
        variant_id INTEGER,
        quantity INTEGER NOT NULL DEFAULT 1,
        price TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'unread',
        admin_reply TEXT,
        replied_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS site_content (
        section TEXT PRIMARY KEY,
        data JSONB NOT NULL DEFAULT '{}',
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // Patch existing tables that may have been created with wrong schema
    const patches: string[] = [
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS tags JSONB NOT NULL DEFAULT '[]'`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS short_description TEXT`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS compare_price NUMERIC(10,2)`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new BOOLEAN NOT NULL DEFAULT false`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN NOT NULL DEFAULT false`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS collection_slug TEXT`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS category_slug TEXT`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT now()`,
      `ALTER TABLE collections ADD COLUMN IF NOT EXISTS banner_image TEXT`,
      `ALTER TABLE collections ADD COLUMN IF NOT EXISTS season TEXT`,
      `ALTER TABLE collections ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0`,
      `ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) NOT NULL DEFAULT 0`,
      `ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS sku TEXT NOT NULL DEFAULT ''`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount NUMERIC(10,2) NOT NULL DEFAULT 0`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS district TEXT`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS landmark TEXT`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT false`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT now()`,
    ];

    for (const sql of patches) {
      try {
        await client.query(sql);
      } catch {
        // Safe to ignore — column may already exist or type conflict
      }
    }

    console.log("[migrate] All tables ready.");
  } catch (err) {
    console.error("[migrate] Migration failed:", err);
    throw err;
  } finally {
    client.release();
  }
}
