const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { chatLimiter } = require('../middleware/rateLimiter');
const { validateChat } = require('../middleware/validate');

// POST /api/v1/chat - Chatbot endpoint
router.post('/', chatLimiter, validateChat, chatController.handleChat);

module.exports = router;
