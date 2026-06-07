import { pool } from "@workspace/db";

export async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log("[migrate] Running database migrations...");

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
        collection_slug TEXT REFERENCES collections(slug) ON DELETE SET NULL,
        category_slug TEXT REFERENCES categories(slug) ON DELETE SET NULL,
        status TEXT NOT NULL DEFAULT 'active',
        featured BOOLEAN NOT NULL DEFAULT false,
        is_new BOOLEAN NOT NULL DEFAULT false,
        is_best_seller BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        updated_at TIMESTAMP NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS product_variants (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        size TEXT,
        color TEXT,
        sku TEXT NOT NULL UNIQUE,
        stock INTEGER NOT NULL DEFAULT 0,
        price NUMERIC(10,2) NOT NULL,
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
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
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
        order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
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

    // Add missing columns to existing tables (safe to run even if columns exist)
    const alterStatements = [
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS tags JSONB NOT NULL DEFAULT '[]'`,
      `ALTER TABLE collections ADD COLUMN IF NOT EXISTS banner_image TEXT`,
      `ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS price NUMERIC(10,2) NOT NULL DEFAULT 0`,
    ];

    for (const sql of alterStatements) {
      try {
        await client.query(sql);
      } catch {
        // Column may already exist with correct type — safe to ignore
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
