const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { searchLimiter } = require('../middleware/rateLimiter');
const { validateSearch } = require('../middleware/validate');

// GET /api/v1/categories
router.get('/categories', menuController.getAllCategories);

// GET /api/v1/menu
router.get('/menu', menuController.getAllMenu);

// GET /api/v1/menu/:categorySlug
router.get('/menu/:categorySlug', menuController.getByCategory);

// GET /api/v1/search (debounced, rate-limited, validated)
router.get('/search', searchLimiter, validateSearch, menuController.searchMenu);

module.exports = router;
