const { BaseController, ErrorResponse } = require('./baseController');
const { Message, Conversation, User, Notification } = require('../models');

class MessageController extends BaseController {
  constructor() {
    super();
  }

  // @desc    Send a new message
  // @route   POST /api/messages
  // @access  Private
  sendMessage = this.asyncHandler(async (req, res) => {
    const { conversationId, recipientId, content, propertyId, attachments } = req.body;

    // Validate recipient
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return this.sendError(res, new ErrorResponse(`Recipient not found with id of ${recipientId}`, 404));
    }

    let conversation;

    // If conversationId is provided, use existing conversation
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      
      if (!conversation) {
        return this.sendError(res, new ErrorResponse(`Conversation not found with id of ${conversationId}`, 404));
      }

      // Check if user is a participant
      const isParticipant = conversation.participants.some(
        participant => participant.toString() === req.user.id
      );

      if (!isParticipant && req.user.role !== 'admin') {
        return this.sendError(res, new ErrorResponse(`Not authorized to send messages in this conversation`, 401));
      }
    } else {
      // Create a new conversation if conversationId is not provided
      conversation = await Conversation.findOne({
        participants: { $all: [req.user.id, recipientId] },
        ...(propertyId && { property: propertyId })
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [req.user.id, recipientId],
          property: propertyId || null
        });
      }
    }

    // Create the message
    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user.id,
      recipient: recipientId,
      content,
      property: propertyId || null,
      attachments: attachments || []
    });

    // Update the conversation with the last message and increment unread count
    conversation.lastMessage = message._id;
    conversation.unreadCount = (conversation.unreadCount || 0) + 1;
    conversation.status = 'active'; // Reactivate if it was archived
    conversation.isArchived = false; // Unarchive if it was archived
    conversation.updatedAt = Date.now();
    await conversation.save();

    // Create a notification for the recipient
    await Notification.create({
      recipient: recipientId,
      sender: req.user.id,
      type: 'message',
      title: 'New Message',
      message: `You have a new message from ${req.user.firstName} ${req.user.lastName}`,
      data: { messageId: message._id, conversationId: conversation._id },
      conversation: conversation._id,
      property: propertyId || null
    });

    // Populate the message with sender information
    const populatedMessage = await Message.findById(message._id).populate({
      path: 'sender',
      select: 'firstName lastName email profileImage'
    });

    this.sendResponse(res, populatedMessage, 201);
  });

  // @desc    Get messages for a conversation
  // @route   GET /api/messages/conversation/:conversationId
  // @access  Private
  getConversationMessages = this.asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    
    if (!conversation) {
      return this.sendError(res, new ErrorResponse(`Conversation not found with id of ${conversationId}`, 404));
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      participant => participant.toString() === req.user.id
    );

    if (!isParticipant && req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse(`Not authorized to view messages in this conversation`, 401));
    }

    // Get messages with pagination, ordered by newest first
    const messages = await Message.find({ conversation: conversationId })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'sender',
        select: 'firstName lastName email profileImage'
      });

    // Count total messages for pagination
    const total = await Message.countDocuments({ conversation: conversationId });

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: conversationId,
        recipient: req.user.id,
        isRead: false
      },
      {
        isRead: true,
        readAt: Date.now()
      }
    );

    // Reset unread count for this conversation
    conversation.unreadCount = 0;
    await conversation.save();

    // Pagination result
    const pagination = {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit
    };

    this.sendResponse(res, {
      count: messages.length,
      pagination,
      data: messages.reverse() // Reverse to show oldest first for client display
    });
  });

  // @desc    Get unread messages count
  // @route   GET /api/messages/unread
  // @access  Private
  getUnreadCount = this.asyncHandler(async (req, res) => {
    // Count total unread messages
    const unreadCount = await Message.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    // Get conversations with unread messages
    const conversations = await Conversation.find({
      participants: req.user.id,
      unreadCount: { $gt: 0 }
    })
      .select('_id unreadCount lastMessage')
      .populate({
        path: 'lastMessage'
      })
      .populate({
        path: 'participants',
        select: 'firstName lastName profileImage',
        match: { _id: { $ne: req.user.id } }
      });

    this.sendResponse(res, {
      totalUnread: unreadCount,
      conversations
    });
  });

  // @desc    Mark message as read
  // @route   PUT /api/messages/:id/read
  // @access  Private
  markAsRead = this.asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return this.sendError(res, new ErrorResponse(`Message not found with id of ${req.params.id}`, 404));
    }

    // Check if user is the recipient
    if (message.recipient.toString() !== req.user.id && req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse(`Not authorized to mark this message as read`, 401));
    }

    // Mark message as read
    message.isRead = true;
    message.readAt = Date.now();
    await message.save();

    // Recalculate unread count for the conversation
    const unreadCount = await Message.countDocuments({
      conversation: message.conversation,
      recipient: req.user.id,
      isRead: false
    });

    // Update conversation unread count
    await Conversation.findByIdAndUpdate(message.conversation, {
      unreadCount
    });

    this.sendResponse(res, message);
  });

  // @desc    Delete a message
  // @route   DELETE /api/messages/:id
  // @access  Private
  deleteMessage = this.asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return this.sendError(res, new ErrorResponse(`Message not found with id of ${req.params.id}`, 404));
    }

    // Check if user is the sender or admin
    if (message.sender.toString() !== req.user.id && req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse(`Not authorized to delete this message`, 401));
    }

    await message.remove();

    // If this was the last message in the conversation, update the lastMessage field
    const conversation = await Conversation.findById(message.conversation);
    if (conversation && conversation.lastMessage && conversation.lastMessage.toString() === req.params.id) {
      // Find the new last message
      const lastMessage = await Message.findOne({ conversation: conversation._id })
        .sort('-createdAt')
        .limit(1);

      conversation.lastMessage = lastMessage ? lastMessage._id : null;
      await conversation.save();
    }

    this.sendResponse(res, { success: true });
  });
}

module.exports = new MessageController();
