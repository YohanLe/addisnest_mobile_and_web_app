const express = require('express');
const { conversationController } = require('../controllers');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All conversation routes require authentication
router.use(protect);

router.route('/')
  .get(conversationController.getUserConversations)
  .post(conversationController.createOrGetConversation);

router.route('/:id')
  .get(conversationController.getConversation)
  .delete(conversationController.deleteConversation);

router.put('/:id/archive', conversationController.archiveConversation);

module.exports = router;
