/**
 * Chat Routes
 * AI assistant conversation endpoints
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  sendMessage,
  getChatHistory,
  getSessions
} = require('../controllers/chatController');

router.post('/message', protect, sendMessage);
router.get('/history', protect, getChatHistory);
router.get('/sessions', protect, getSessions);

module.exports = router;
