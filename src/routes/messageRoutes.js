const express = require('express');
const { messageController } = require('../controllers');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All message routes require authentication
router.use(protect);

router.route('/')
  .post(messageController.sendMessage);

router.get('/conversation/:conversationId', messageController.getConversationMessages);
router.get('/unread', messageController.getUnreadCount);
router.put('/:id/read', messageController.markAsRead);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
