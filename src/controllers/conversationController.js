const { BaseController, ErrorResponse } = require('./baseController');
const { Conversation, Message, User } = require('../models');

class ConversationController extends BaseController {
  constructor() {
    super();
  }

  // @desc    Get all conversations for a user
  // @route   GET /api/conversations
  // @access  Private
  getUserConversations = this.asyncHandler(async (req, res) => {
    const conversations = await Conversation.find({
      participants: { $in: [req.user.id] }
    })
      .sort('-updatedAt')
      .populate({
        path: 'participants',
        select: 'firstName lastName email profileImage'
      })
      .populate({
        path: 'lastMessage'
      })
      .populate({
        path: 'property',
        select: 'title images price address'
      });

    // Filter out the current user from each conversation's participants
    const filteredConversations = conversations.map(conversation => {
      const otherParticipants = conversation.participants.filter(
        participant => participant._id.toString() !== req.user.id
      );

      return {
        ...conversation.toObject(),
        participants: otherParticipants
      };
    });

    this.sendResponse(res, filteredConversations);
  });

  // @desc    Get or create a conversation between users
  // @route   POST /api/conversations
  // @access  Private
  createOrGetConversation = this.asyncHandler(async (req, res) => {
    const { participantId, propertyId } = req.body;

    // Validate participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return this.sendError(res, new ErrorResponse(`User not found with id of ${participantId}`, 404));
    }

    // Check if a conversation already exists between these users
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, participantId] },
      ...(propertyId && { property: propertyId })
    })
      .populate({
        path: 'participants',
        select: 'firstName lastName email profileImage'
      })
      .populate({
        path: 'property',
        select: 'title images price address'
      });

    // If no conversation exists, create one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user.id, participantId],
        property: propertyId || null
      });

      // Populate the newly created conversation
      conversation = await Conversation.findById(conversation._id)
        .populate({
          path: 'participants',
          select: 'firstName lastName email profileImage'
        })
        .populate({
          path: 'property',
          select: 'title images price address'
        });
    }

    this.sendResponse(res, conversation);
  });

  // @desc    Get a single conversation
  // @route   GET /api/conversations/:id
  // @access  Private
  getConversation = this.asyncHandler(async (req, res) => {
    const conversation = await Conversation.findById(req.params.id)
      .populate({
        path: 'participants',
        select: 'firstName lastName email profileImage'
      })
      .populate({
        path: 'property',
        select: 'title images price address'
      });

    if (!conversation) {
      return this.sendError(res, new ErrorResponse(`Conversation not found with id of ${req.params.id}`, 404));
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      participant => participant._id.toString() === req.user.id
    );

    if (!isParticipant && req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse(`Not authorized to access this conversation`, 401));
    }

    // Get messages for this conversation
    const messages = await Message.find({ conversation: conversation._id })
      .sort('createdAt')
      .populate({
        path: 'sender',
        select: 'firstName lastName profileImage'
      });

    // Mark unread messages as read
    if (messages.length > 0) {
      await Message.updateMany(
        {
          conversation: conversation._id,
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
    }

    this.sendResponse(res, {
      conversation,
      messages
    });
  });

  // @desc    Mark conversation as archived
  // @route   PUT /api/conversations/:id/archive
  // @access  Private
  archiveConversation = this.asyncHandler(async (req, res) => {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return this.sendError(res, new ErrorResponse(`Conversation not found with id of ${req.params.id}`, 404));
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      participant => participant.toString() === req.user.id
    );

    if (!isParticipant && req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse(`Not authorized to archive this conversation`, 401));
    }

    conversation.isArchived = true;
    conversation.status = 'archived';
    await conversation.save();

    this.sendResponse(res, conversation);
  });

  // @desc    Delete a conversation
  // @route   DELETE /api/conversations/:id
  // @access  Private
  deleteConversation = this.asyncHandler(async (req, res) => {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return this.sendError(res, new ErrorResponse(`Conversation not found with id of ${req.params.id}`, 404));
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      participant => participant.toString() === req.user.id
    );

    if (!isParticipant && req.user.role !== 'admin') {
      return this.sendError(res, new ErrorResponse(`Not authorized to delete this conversation`, 401));
    }

    // Delete all messages in the conversation
    await Message.deleteMany({ conversation: conversation._id });

    // Delete the conversation
    await conversation.remove();

    this.sendResponse(res, { success: true });
  });
}

module.exports = new ConversationController();
