const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createMessage,
  getMessagesByConversation,
  markMessageAsRead,
  getUnreadMessageCount,
  deleteMessage
} = require('../controllers/messageController');

// Create a new message
router.post('/', protect, createMessage);

// Get all messages for a conversation
router.get('/conversation/:conversationId', protect, getMessagesByConversation);

// Mark a message as read
router.put('/:id/read', protect, markMessageAsRead);

// Get unread message count
router.get('/unread/count', protect, getUnreadMessageCount);

// Delete a message
router.delete('/:id', protect, deleteMessage);

module.exports = router;
