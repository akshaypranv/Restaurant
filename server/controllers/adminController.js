const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const config = require('../config/config');
const syncMenuJson = require('../utils/syncMenuJson');
const { clearMenuCache } = require('./menuController');

// Admin email + password login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const queryStr = 'SELECT * FROM admins WHERE email = $1';
    const result = await db.query(queryStr, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
        code: 'UNAUTHORIZED'
      });
    }

    const admin = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
        code: 'UNAUTHORIZED'
      });
    }

    // Sign JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      status: 'success',
      data: {
        token,
        email: admin.email
      }
    });
  } catch (err) {
    next(err);
  }
};

// Get all items including unavailable ones (for admin dashboard table)
const getAdminMenu = async (req, res, next) => {
  try {
    // Try filtering out deleted items; fall back if is_deleted column doesn't exist
    let result;
    try {
      result = await db.query(`
        SELECT m.*, c.name AS category_name
        FROM menu_items m
        JOIN categories c ON m.category_id = c.id
        WHERE m.is_deleted = false
        ORDER BY c.display_order ASC, m.id ASC
      `);
    } catch (colErr) {
      result = await db.query(`
        SELECT m.*, c.name AS category_name
        FROM menu_items m
        JOIN categories c ON m.category_id = c.id
        ORDER BY c.display_order ASC, m.id ASC
      `);
    }
    
    // Parse prices as floats
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

// Create a new menu item
const createItem = async (req, res, next) => {
  try {
    const {
      category_id,
      name,
      price,
      price_alt,
      price_label,
      is_veg,
      is_available,
      is_popular,
      featured,
      note
    } = req.body;

    // Check if category exists
    const catCheck = await db.query('SELECT 1 FROM categories WHERE id = $1', [category_id]);
    if (catCheck.rows.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid category_id. Category does not exist.',
        code: 'BAD_REQUEST'
      });
    }

    const queryStr = `
      INSERT INTO menu_items (category_id, name, price, price_alt, price_label, is_veg, is_available, is_popular, featured, note)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const values = [
      category_id,
      name,
      price,
      price_alt || null,
      price_label || null,
      is_veg,
      is_available !== undefined ? is_available : true,
      is_popular !== undefined ? is_popular : false,
      featured !== undefined ? featured : false,
      note || null
    ];

    const result = await db.query(queryStr, values);
    
    // Sync DB contents to menu.json and invalidate cache
    await syncMenuJson();
    clearMenuCache();

    return res.status(201).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// Update an existing menu item
const updateItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      category_id,
      name,
      price,
      price_alt,
      price_label,
      is_veg,
      is_available,
      is_popular,
      featured,
      note
    } = req.body;

    // Check if item exists
    const itemCheck = await db.query('SELECT 1 FROM menu_items WHERE id = $1', [id]);
    if (itemCheck.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Menu item not found',
        code: 'NOT_FOUND'
      });
    }

    // Check if category exists if provided
    if (category_id) {
      const catCheck = await db.query('SELECT 1 FROM categories WHERE id = $1', [category_id]);
      if (catCheck.rows.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid category_id. Category does not exist.',
          code: 'BAD_REQUEST'
        });
      }
    }

    const queryStr = `
      UPDATE menu_items
      SET 
        category_id = COALESCE($1, category_id),
        name = COALESCE($2, name),
        price = COALESCE($3, price),
        price_alt = $4,
        price_label = $5,
        is_veg = COALESCE($6, is_veg),
        is_available = COALESCE($7, is_available),
        is_popular = COALESCE($8, is_popular),
        featured = COALESCE($9, featured),
        note = $10,
        updated_at = NOW()
      WHERE id = $11
      RETURNING *;
    `;
    const values = [
      category_id || null,
      name || null,
      price || null,
      price_alt || null,
      price_label || null,
      is_veg !== undefined ? is_veg : null,
      is_available !== undefined ? is_available : null,
      is_popular !== undefined ? is_popular : null,
      featured !== undefined ? featured : null,
      note || null,
      id
    ];

    const result = await db.query(queryStr, values);
    
    // Sync DB contents to menu.json and invalidate cache
    await syncMenuJson();
    clearMenuCache();

    return res.status(200).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// Soft delete — marks item as deleted and unavailable. Never hard deletes!
const deleteItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Check if item exists
    const itemCheck = await db.query('SELECT 1 FROM menu_items WHERE id = $1', [id]);
    if (itemCheck.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Menu item not found',
        code: 'NOT_FOUND'
      });
    }

    // Perform soft delete — try with is_deleted column, fall back if it doesn't exist
    let result;
    try {
      result = await db.query(
        `UPDATE menu_items SET is_available = false, is_deleted = true, updated_at = NOW() WHERE id = $1 RETURNING *;`,
        [id]
      );
    } catch (colErr) {
      // is_deleted column may not exist yet — fall back to just setting is_available
      result = await db.query(
        `UPDATE menu_items SET is_available = false, updated_at = NOW() WHERE id = $1 RETURNING *;`,
        [id]
      );
    }

    // Sync DB contents to menu.json and invalidate cache
    await syncMenuJson();
    clearMenuCache();

    return res.status(200).json({
      status: 'success',
      message: 'Menu item soft-deleted successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// Bulk reorder or rename categories
const updateCategories = async (req, res, next) => {
  try {
    const categories = req.body.categories; // Expects an array: [{ id, name, display_order }]

    if (!Array.isArray(categories)) {
      return res.status(400).json({
        status: 'error',
        message: 'Categories payload must be an array',
        code: 'BAD_REQUEST'
      });
    }

    await db.query('BEGIN');

    for (const cat of categories) {
      const { id, name, display_order } = cat;
      const updateStr = `
        UPDATE categories
        SET 
          name = COALESCE($1, name),
          display_order = COALESCE($2, display_order)
        WHERE id = $3
      `;
      await db.query(updateStr, [name || null, display_order !== undefined ? display_order : null, id]);
    }

    await db.query('COMMIT');

    // Sync DB contents to menu.json and invalidate cache
    await syncMenuJson();
    clearMenuCache();

    return res.status(200).json({
      status: 'success',
      message: 'Categories updated successfully'
    });
  } catch (err) {
    await db.query('ROLLBACK');
    next(err);
  }
};

module.exports = {
  login,
  getAdminMenu,
  createItem,
  updateItem,
  deleteItem,
  updateCategories
};
