const db = require('../config/db');
const NodeCache = require('node-cache');

// Cache instance: stdTTL is 5 minutes (300 seconds)
const menuCache = new NodeCache({ stdTTL: 300 });

// Helper to clear the entire menu cache when changes are made
const clearMenuCache = () => {
  menuCache.flushAll();
  console.log('[Cache] Menu cache cleared successfully.');
};

// Get all categories with item count
const getAllCategories = async (req, res, next) => {
  try {
    const queryStr = `
      SELECT c.id, c.name, c.slug, c.display_order, c.page_group, COUNT(m.id)::int AS item_count
      FROM categories c
      LEFT JOIN menu_items m ON c.id = m.category_id AND m.is_available = true
      GROUP BY c.id
      ORDER BY c.display_order ASC
    `;
    const result = await db.query(queryStr);
    return res.status(200).json({
      status: 'success',
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
};

// Get full categorised menu (cached for 5 minutes)
const getAllMenu = async (req, res, next) => {
  try {
    const vegOnly = req.query.veg === 'true';
    const featuredOnly = req.query.featured === 'true';
    const cacheKey = `menu_veg_${vegOnly}_featured_${featuredOnly}`;
    
    // Check if response exists in cache
    const cachedResponse = menuCache.get(cacheKey);
    if (cachedResponse) {
      console.log(`[Cache] Serving ${cacheKey} from cache`);
      return res.status(200).json(cachedResponse);
    }
    
    let queryStr = `
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
      LEFT JOIN menu_items m ON c.id = m.category_id AND m.is_available = true
    `;

    const queryParams = [];

    if (vegOnly) {
      queryStr += ` AND m.is_veg = true`;
    }

    if (featuredOnly) {
      queryStr += ` AND m.featured = true`;
    }

    queryStr += ` ORDER BY c.display_order ASC, m.is_popular DESC, m.name ASC`;

    const result = await db.query(queryStr, queryParams);

    const categoriesMap = {};
    for (const row of result.rows) {
      if (!categoriesMap[row.category_slug]) {
        categoriesMap[row.category_slug] = {
          id: row.category_id,
          name: row.category_name,
          slug: row.category_slug,
          display_order: row.category_display_order,
          page_group: row.category_page_group,
          items: []
        };
      }
      if (row.item_id) {
        categoriesMap[row.category_slug].items.push({
          id: row.item_id,
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

    const responseData = {
      status: 'success',
      data: Object.values(categoriesMap).filter(cat => cat.items.length > 0)
    };

    // Store in cache
    menuCache.set(cacheKey, responseData);

    return res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
};

// Get items in a single category
const getByCategory = async (req, res, next) => {
  try {
    const { categorySlug } = req.params;
    
    // Find category
    const catQuery = 'SELECT * FROM categories WHERE slug = $1';
    const catResult = await db.query(catQuery, [categorySlug]);
    
    if (catResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found',
        code: 'NOT_FOUND'
      });
    }

    const category = catResult.rows[0];
    
    // Get items in this category
    const itemsQuery = `
      SELECT id, name, price, price_alt, price_label, is_veg, is_available, is_popular, note
      FROM menu_items
      WHERE category_id = $1 AND is_available = true
      ORDER BY is_popular DESC, name ASC
    `;
    const itemsResult = await db.query(itemsQuery, [category.id]);
    
    const items = itemsResult.rows.map(item => ({
      ...item,
      price: parseFloat(item.price),
      price_alt: item.price_alt ? parseFloat(item.price_alt) : null
    }));

    return res.status(200).json({
      status: 'success',
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        display_order: category.display_order,
        page_group: category.page_group,
        items
      }
    });
  } catch (err) {
    next(err);
  }
};

// Fuzzy search menu items
const searchMenu = async (req, res, next) => {
  try {
    const q = req.query.q;
    
    const queryStr = `
      SELECT m.id, m.name, m.price, m.price_alt, m.price_label, m.is_veg, m.is_available, m.is_popular, m.note, c.name AS category_name
      FROM menu_items m
      JOIN categories c ON m.category_id = c.id
      WHERE m.is_available = true
        AND (
          m.name ILIKE $1
          OR similarity(m.name, $2) > 0.2
        )
      ORDER BY similarity(m.name, $2) DESC, m.is_popular DESC, m.name ASC
      LIMIT 50;
    `;
    
    const result = await db.query(queryStr, [`%${q}%`, q]);
    
    const items = result.rows.map(item => ({
      ...item,
      price: parseFloat(item.price),
      price_alt: item.price_alt ? parseFloat(item.price_alt) : null
    }));

    return res.status(200).json({
      status: 'success',
      data: items
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCategories,
  getAllMenu,
  getByCategory,
  searchMenu,
  clearMenuCache
};
