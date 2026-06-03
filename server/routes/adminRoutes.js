const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');
const { validateLogin, validateMenuItem } = require('../middleware/validate');

// POST /api/v1/admin/auth/login (rate-limited, validated)
router.post('/auth/login', loginLimiter, validateLogin, adminController.login);

// GET /api/v1/admin/menu (JWT protected)
router.get('/menu', auth, adminController.getAdminMenu);

// POST /api/v1/admin/menu (JWT protected, validated)
router.post('/menu', auth, validateMenuItem, adminController.createItem);

// PUT /api/v1/admin/menu/:id (JWT protected, validated)
router.put('/menu/:id', auth, validateMenuItem, adminController.updateItem);

// DELETE /api/v1/admin/menu/:id (JWT protected, soft delete)
router.delete('/menu/:id', auth, adminController.deleteItem);

// PUT /api/v1/admin/categories (JWT protected)
router.put('/categories', auth, adminController.updateCategories);

module.exports = router;
