import React, { useState, useEffect } from "react";
import "./mobile-chat-interface.css";
import { format } from 'date-fns';

const MobileChatInterface = () => {
  // State for tracking window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // State for conversations and messages
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for selected conversation
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  // State to track if the conversation has been accepted
  const [conversationAccepted, setConversationAccepted] = useState(true);
  
  // State for the new message being composed
  const [newMessage, setNewMessage] = useState("");
  
  // State for conversation messages
  const [conversationMessages, setConversationMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch conversations from the API
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/conversations', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }
        
        const data = await response.json();
        
        // Transform the data to match our component's expected format
        const formattedConversations = data.map(conv => {
          // Get the other participant (not the current user)
          const otherParticipant = conv.participants[0] || {};
          
          return {
            id: conv._id,
            type: otherParticipant.role ? otherParticipant.role.toUpperCase() : "USER",
            name: otherParticipant.firstName ? 
              `${otherParticipant.firstName} ${otherParticipant.lastName || ''}` : 
              "Unknown User",
            lastMessage: conv.lastMessage?.content || "No messages yet",
            online: true, // We could implement real online status later
            unread: conv.unreadCount || 0,
            timestamp: conv.updatedAt ? new Date(conv.updatedAt) : new Date(),
            messageIcon: conv.property ? "🏠" : "💬",
            property: conv.property,
            participants: conv.participants,
            messages: [] // Will be loaded when conversation is selected
          };
        });
        
        setConversations(formattedConversations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setError('Failed to load conversations. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, []);
  
  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          setLoadingMessages(true);
          const response = await fetch(`/api/messages/conversation/${selectedConversation}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch messages');
          }
          
          const data = await response.json();
          
          // Format messages for display
          const formattedMessages = data.data.map(msg => {
            const messageDate = new Date(msg.createdAt);
            return {
              id: msg._id,
              text: msg.content,
              time: format(messageDate, 'h:mm a'),
              date: format(messageDate, 'M/d/yyyy'),
              sender: msg.sender._id === localStorage.getItem('userId') ? 'me' : 'them',
              senderName: `${msg.sender.firstName} ${msg.sender.lastName || ''}`,
              isRead: msg.isRead
            };
          });
          
          setConversationMessages(formattedMessages);
          setLoadingMessages(false);
          
          // Mark conversation as accepted since we're loading messages
          setConversationAccepted(true);
        } catch (error) {
          console.error('Error fetching messages:', error);
          setLoadingMessages(false);
        }
      };
      
      fetchMessages();
    }
  }, [selectedConversation]);

  // Get the selected conversation object
  const getSelectedConversationData = () => {
    return conversations.find(conv => conv.id === selectedConversation);
  };

  // Format timestamp for conversation list
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return 'Today';
    }
  };
  
  // Get role badge based on type
  const getRoleBadge = (type) => {
    switch(type) {
      case "AGENT":
        return <span className="role-badge agent">[Agent]</span>;
      case "CUSTOMER":
        return <span className="role-badge customer">[Customer]</span>;
      case "ADMIN":
        return <span className="role-badge admin">[Admin]</span>;
      default:
        return null;
    }
  };
  
  // Handle selecting a conversation
  const handleSelectConversation = (convId) => {
    setSelectedConversation(convId);
  };
  
  // Handle accepting the conversation
  const handleAccept = () => {
    setConversationAccepted(true);
  };
  
  // Handle declining the conversation
  const handleDecline = () => {
    // In a real app, this would send a decline notification
    // For now, we'll just go back to the conversation list
    setSelectedConversation(null);
  };
  
  // Handle sending a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      try {
        // Get recipient ID from the conversation
        const conversation = getSelectedConversationData();
        if (!conversation) return;
        
        // Find the recipient ID (the other participant)
        const recipientId = conversation.participants?.[0]?._id;
        if (!recipientId) {
          console.error('Could not determine recipient ID');
          return;
        }
        
        // Send the message
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            conversationId: selectedConversation,
            recipientId: recipientId,
            content: newMessage,
            propertyId: conversation.property?._id || null
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
        
        // Add the new message to the conversation
        const messageData = await response.json();
        
        // Format the new message
        const now = new Date();
        const newMessageObj = {
          id: messageData._id,
          text: newMessage,
          time: format(now, 'h:mm a'),
          date: format(now, 'M/d/yyyy'),
          sender: 'me',
          senderName: 'You',
          isRead: false
        };
        
        // Add to conversation messages
        setConversationMessages(prev => [...prev, newMessageObj]);
        
        // Update the conversation list with the new message
        setConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation 
              ? { ...conv, lastMessage: newMessage, timestamp: now } 
              : conv
          )
        );
        
        // Clear the input
        setNewMessage("");
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
      }
    }
  };
  
  // Get the selected conversation data
  const selectedConvData = getSelectedConversationData();

  // Handle going back to the conversation list
  const handleBack = () => {
    setSelectedConversation(null);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="mobile-chat-interface">
        <div className="chat-header">
          <div className="menu-icon">☰</div>
          <div className="header-title">Messages</div>
          <div className="user-avatar">U</div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="mobile-chat-interface">
        <div className="chat-header">
          <div className="menu-icon">☰</div>
          <div className="header-title">Messages</div>
          <div className="user-avatar">U</div>
        </div>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-chat-interface">
      {/* Header */}
      <div className="chat-header">
        {selectedConversation ? (
          <>
            <button className="back-button" onClick={handleBack}>←</button>
            <div className="header-info">
              <div className="header-name">{selectedConvData?.name || 'Chat'}</div>
              <div className="header-role">{selectedConvData && getRoleBadge(selectedConvData.type)}</div>
            </div>
            {conversationMessages.length > 0 && (
              <div className="header-time">
                🕒 {conversationMessages[0].date}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="menu-icon">☰</div>
            <div className="header-title">Messages</div>
            <div className="user-avatar">U</div>
          </>
        )}
      </div>
      
      {/* Main content */}
      <div className="chat-content">
        {/* Conversation list (always visible but collapsed when a conversation is selected) */}
        <div className={`conversation-list ${selectedConversation ? 'collapsed' : ''}`}>
          {/* Search bar */}
          <div className="search-container">
            <input type="text" placeholder="🔍 Search conversations..." className="search-input" />
          </div>
          
          {/* Conversations */}
          <div className="conversations">
            {conversations.length === 0 ? (
              <div className="no-conversations">
                <p>No conversations yet</p>
                <p>Messages from property inquiries will appear here</p>
              </div>
            ) : (
              conversations.map(conv => (
                <div 
                  key={conv.id} 
                  className={`conversation-item ${selectedConversation === conv.id ? 'active' : ''}`}
                  onClick={() => handleSelectConversation(conv.id)}
                >
                  <div className="conversation-avatar">
                    {conv.online && <div className="online-indicator"></div>}
                    {conv.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="conversation-details">
                    <div className="conversation-header">
                      <span className="conversation-name">{conv.name}</span>
                      {getRoleBadge(conv.type)}
                      <span className="conversation-time">🕒 {formatTimestamp(conv.timestamp)}</span>
                    </div>
                    <div className="conversation-preview">
                      <span className="preview-icon">{conv.messageIcon}</span>
                      <span className="preview-text">{conv.lastMessage}</span>
                      {conv.unread > 0 && (
                        <span className="unread-badge">{conv.unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Message view (visible when a conversation is selected) */}
        {selectedConversation && (
          <div className="message-view">
            {loadingMessages ? (
              <div className="loading-messages">
                <div className="loading-spinner"></div>
                <p>Loading messages...</p>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="messages">
                  {conversationMessages.length === 0 ? (
                    <div className="no-messages">
                      <p>No messages yet</p>
                      <p>Start the conversation by sending a message</p>
                    </div>
                  ) : (
                    <>
                      {/* Group messages by date */}
                      {(() => {
                        const messagesByDate = {};
                        conversationMessages.forEach(message => {
                          if (!messagesByDate[message.date]) {
                            messagesByDate[message.date] = [];
                          }
                          messagesByDate[message.date].push(message);
                        });
                        
                        return Object.entries(messagesByDate).map(([date, messages]) => (
                          <React.Fragment key={date}>
                            {/* Date divider */}
                            <div className="date-divider">
                              <span>{date}</span>
                            </div>
                            
                            {/* Message bubbles for this date */}
                            {messages.map(message => (
                              <div 
                                key={message.id} 
                                className={`message-bubble ${message.sender === 'me' ? 'sent' : 'received'}`}
                              >
                                <div className="message-text">{message.text}</div>
                                <div className="message-time">{message.time}</div>
                              </div>
                            ))}
                          </React.Fragment>
                        ));
                      })()}
                      
                      {/* Action buttons for actionable messages */}
                      {conversationMessages.some(m => m.actionable) && !conversationAccepted && (
                        <div className="action-buttons">
                          <button className="decline-button" onClick={handleDecline}>Decline</button>
                          <button className="accept-button" onClick={handleAccept}>Accept</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {/* Message input (only shown if conversation is accepted) */}
                {conversationAccepted && (
                  <div className="message-input-container">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="message-input"
                    />
                    <button 
                      className="send-button"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      Send
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Add some additional styles for loading and error states */}
      <style>{`
        .loading-container, .error-container, .loading-messages, .no-conversations, .no-messages {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: calc(100% - 60px);
          padding: 20px;
          text-align: center;
          color: #666;
        }
        
        .loading-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #8cc63f;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-message {
          color: #e74c3c;
          margin-bottom: 15px;
        }
        
        .retry-button {
          background-color: #8cc63f;
          color: white;
          border: none;
          border-radius: 20px;
          padding: 8px 20px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .no-conversations p, .no-messages p {
          margin: 5px 0;
          font-size: 14px;
        }
        
        .no-conversations p:first-child, .no-messages p:first-child {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 10px;
        }
      `}</style>
    </div>
  );
};

export default MobileChatInterface;
