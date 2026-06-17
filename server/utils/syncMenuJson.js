const fs = require('fs');
const path = require('path');
const db = require('../config/db');

/**
 * Synchronises the database contents back to menu.json at the project root.
 * Uses atomic temporary file swaps to prevent corruption.
 */
const syncMenuJson = async () => {
  try {
    const queryStr = `
      SELECT 
        c.id AS category_id,
        c.name AS category_name,
        c.slug AS category_slug,
        c.display_order AS category_display_order,
        c.page_group AS category_page_group,
        m.id AS item_id,
        m.name AS item_name,
        m.price,
        m.price_alt,
        m.price_label,
        m.is_veg,
        m.is_available,
        m.is_popular,
        m.featured,
        m.note
      FROM categories c
      LEFT JOIN menu_items m ON c.id = m.category_id
      ORDER BY c.display_order ASC, m.id ASC
    `;

    const result = await db.query(queryStr);
    
    // Static restaurant metadata matching original structure
    const restaurant = {
      name: 'Silvertip Cafe',
      tagline: 'Select',
      currency: 'INR',
      currency_symbol: '₹',
      gst_note: 'All prices exclusive of GST'
    };

    const categoriesMap = {};
    for (const row of result.rows) {
      if (!categoriesMap[row.category_slug]) {
        categoriesMap[row.category_slug] = {
          name: row.category_name,
          slug: row.category_slug,
          page_group: row.category_page_group,
          display_order: row.category_display_order,
          items: []
        };
      }
      if (row.item_id) {
        categoriesMap[row.category_slug].items.push({
          name: row.item_name,
          price: parseFloat(row.price),
          price_alt: row.price_alt ? parseFloat(row.price_alt) : null,
          price_label: row.price_label,
          is_veg: row.is_veg,
          is_available: row.is_available,
          is_popular: row.is_popular,
          featured: row.featured,
          note: row.note
        });
      }
    }

    const menuJsonContent = {
      restaurant,
      categories: Object.values(categoriesMap)
    };

    const rootDir = path.join(__dirname, '../..');
    const finalPath = path.join(rootDir, 'menu.json');
    const tmpPath = path.join(rootDir, 'menu.json.tmp');

    // Atomic write: Write to temporary file first, then rename
    fs.writeFileSync(tmpPath, JSON.stringify(menuJsonContent, null, 2), 'utf8');
    fs.renameSync(tmpPath, finalPath);
    console.log('[Sync] menu.json updated successfully via atomic write');
    return true;
  } catch (error) {
    console.warn('[Sync] Warning: Could not synchronise menu.json:', error.message);
    if (error.code === 'EROFS' || error.code === 'EACCES' || error.code === 'EPERM') {
      console.warn('[Sync] Continuing without file-sync as filesystem is read-only or restricted.');
      return false;
    }
    throw error;
  }
};

module.exports = syncMenuJson;
