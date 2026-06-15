const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimiter');
const { validateContact } = require('../middleware/validate');
const auth = require('../middleware/auth');

// POST /api/v1/contact - Public contact submission
router.post('/', contactLimiter, validateContact, contactController.createSubmission);

// GET /api/v1/contact - Admin list all submissions
router.get('/', auth, contactController.getSubmissions);

// PUT /api/v1/contact/:id/read - Admin mark submission as read
router.put('/:id/read', auth, contactController.markAsRead);

module.exports = router;
