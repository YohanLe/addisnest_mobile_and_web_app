const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Property = require('../models/Property');
const mongoose = require('mongoose');
const { errorHandler } = require('../utils/errorHandler');

/**
 * @desc    Create a new message
 * @route   POST /api/messages
 * @access  Private
 */
exports.createMessage = async (req, res) => {
  try {
    const { conversationId, recipientId, content, propertyId } = req.body;
    const senderId = req.user.id;

    // Validate required fields
    if (!conversationId || !recipientId || !content) {
      return res.status(400).json({
        success: false,
        error: 'Please provide conversation ID, recipient ID, and message content'
      });
    }

    // Verify conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    // Get sender and recipient details
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      return res.status(404).json({
        success: false,
        error: 'Sender or recipient not found'
      });
    }

    // Get property details if provided
    let property = null;
    let propertyTitle = null;
    
    if (propertyId) {
      property = await Property.findById(propertyId);
      if (property) {
        propertyTitle = property.title || 'Property Inquiry';
      }
    }

    // Create the message
    const message = await Message.create({
      sender: senderId,
      senderName: `${sender.firstName} ${sender.lastName || ''}`.trim(),
      recipient: recipientId,
      recipientName: `${recipient.firstName} ${recipient.lastName || ''}`.trim(),
      property: propertyId || null,
      propertyTitle: propertyTitle,
      content,
      conversation: conversationId,
      isRead: false
    });

    // Update conversation with last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      updatedAt: Date.now()
    });

    // Return the created message
    return res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * @desc    Get all messages for a conversation
 * @route   GET /api/messages/conversation/:conversationId
 * @access  Private
 */
exports.getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify conversation exists and user is a participant
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    // Check if user is a participant in the conversation
    const isParticipant = conversation.participants.some(
      participant => participant.toString() === userId
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to view these messages'
      });
    }

    // Get messages for the conversation
    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'firstName lastName profilePicture')
      .populate('recipient', 'firstName lastName profilePicture')
      .populate('property', 'title address price media');

    // Mark messages as read if user is the recipient
    const unreadMessages = messages.filter(
      message => !message.isRead && message.recipient._id.toString() === userId
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        {
          _id: { $in: unreadMessages.map(message => message._id) }
        },
        {
          isRead: true,
          readAt: Date.now()
        }
      );
    }

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * @desc    Mark a message as read
 * @route   PUT /api/messages/:id/read
 * @access  Private
 */
exports.markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the message
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Check if user is the recipient
    if (message.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to mark this message as read'
      });
    }

    // Mark as read if not already
    if (!message.isRead) {
      message.isRead = true;
      message.readAt = Date.now();
      await message.save();
    }

    return res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * @desc    Get unread message count for a user
 * @route   GET /api/messages/unread/count
 * @access  Private
 */
exports.getUnreadMessageCount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Count unread messages where user is the recipient
    const count = await Message.countDocuments({
      recipient: userId,
      isRead: false
    });

    return res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * @desc    Delete a message (soft delete by setting content to null)
 * @route   DELETE /api/messages/:id
 * @access  Private
 */
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the message
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Check if user is the sender or recipient
    if (message.sender.toString() !== userId && message.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to delete this message'
      });
    }

    // Soft delete by setting content to null
    message.content = '[Message deleted]';
    await message.save();

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
};
