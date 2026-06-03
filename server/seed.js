const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const config = require('./config/config');

console.log('[Seed] Starting database seeding process...');

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: config.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const seed = async () => {
  const client = await pool.connect();

  try {
    // Read menu.json
    const menuPath = path.join(__dirname, '../menu.json');
    if (!fs.existsSync(menuPath)) {
      throw new Error(`menu.json file not found at: ${menuPath}`);
    }
    const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
    console.log('[Seed] Read menu.json successfully');

    await client.query('BEGIN');

    // Create extensions
    console.log('[Seed] Enabling pg_trgm extension...');
    await client.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');

    // Drop tables if they exist to start fresh
    console.log('[Seed] Cleaning old schema...');
    await client.query('DROP TABLE IF EXISTS menu_items CASCADE;');
    await client.query('DROP TABLE IF EXISTS categories CASCADE;');
    await client.query('DROP TABLE IF EXISTS admins CASCADE;');

    // Create categories table
    console.log('[Seed] Creating table: categories...');
    await client.query(`
      CREATE TABLE categories (
        id            SERIAL PRIMARY KEY,
        name          VARCHAR(100) NOT NULL,
        slug          VARCHAR(100) NOT NULL UNIQUE,
        display_order INTEGER NOT NULL DEFAULT 0,
        page_group    VARCHAR(50),
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Create menu_items table
    console.log('[Seed] Creating table: menu_items...');
    await client.query(`
      CREATE TABLE menu_items (
        id             SERIAL PRIMARY KEY,
        category_id    INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
        name           VARCHAR(200) NOT NULL,
        price          NUMERIC(8, 2) NOT NULL,
        price_alt      NUMERIC(8, 2),
        price_label    VARCHAR(40),
        is_veg         BOOLEAN NOT NULL DEFAULT TRUE,
        is_available   BOOLEAN NOT NULL DEFAULT TRUE,
        is_popular     BOOLEAN NOT NULL DEFAULT FALSE,
        note           TEXT,
        search_vector  TSVECTOR GENERATED ALWAYS AS (
                         to_tsvector('english', name)
                       ) STORED,
        created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Create admins table
    console.log('[Seed] Creating table: admins...');
    await client.query(`
      CREATE TABLE admins (
        id            SERIAL PRIMARY KEY,
        email         VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    console.log('[Seed] Seeding default admin user...');
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('password123', 12);
    await client.query(
      `INSERT INTO admins (email, password_hash) VALUES ($1, $2);`,
      ['admin@silvertip.com', hashedPassword]
    );

    // Create indexes
    console.log('[Seed] Creating performance indexes...');
    await client.query('CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);');
    await client.query('CREATE INDEX idx_menu_items_search ON menu_items USING GIN(search_vector);');
    await client.query('CREATE INDEX idx_menu_items_name_trgm ON menu_items USING GIN(name gin_trgm_ops);');
    await client.query('CREATE INDEX idx_menu_items_available ON menu_items(is_available) WHERE is_available = TRUE;');

    // Insert categories and items
    let insertedCategories = 0;
    let insertedItems = 0;

    for (const cat of menuData.categories) {
      const catRes = await client.query(
        `INSERT INTO categories (name, slug, display_order, page_group)
         VALUES ($1, $2, $3, $4)
         RETURNING id;`,
        [cat.name, cat.slug, cat.display_order, cat.page_group]
      );
      
      const categoryId = catRes.rows[0].id;
      insertedCategories++;

      for (const item of cat.items) {
        await client.query(
          `INSERT INTO menu_items (category_id, name, price, price_alt, price_label, is_veg, is_available, is_popular, note)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
          [
            categoryId,
            item.name,
            item.price,
            item.price_alt,
            item.price_label,
            item.is_veg,
            item.is_available,
            item.is_popular,
            item.note
          ]
        );
        insertedItems++;
      }
    }

    await client.query('COMMIT');
    console.log(`\x1b[32m[Seed] Success! Seeded ${insertedCategories} categories and ${insertedItems} menu items.\x1b[0m`);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('\x1b[31m[Seed] Seeding failed, rolled back transactions.\x1b[0m');
    console.error(err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

seed();
