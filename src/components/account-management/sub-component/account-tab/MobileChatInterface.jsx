import React, { useState, useEffect } from "react";
import "./mobile-chat-interface.css";

const MobileChatInterface = () => {
  // State for tracking window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // State for selected conversation
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  // State to track if the conversation has been accepted
  const [conversationAccepted, setConversationAccepted] = useState(false);
  
  // State for the new message being composed
  const [newMessage, setNewMessage] = useState("");

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sample conversations data - using the same data structure as Messages component
  const conversations = [
    {
      id: 1,
      type: "AGENT",
      name: "agent",
      lastMessage: "New visit request",
      online: true,
      unread: 1,
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      messageIcon: "📅",
      messages: [
        {
          id: 1,
          text: "New visit request",
          time: "1:09 AM",
          date: "5/23/2025",
          sender: "them",
          actionable: true
        }
      ]
    },
    {
      id: 2,
      type: "CUSTOMER",
      name: "Abhilesh",
      lastMessage: "heloo",
      online: true,
      unread: 0,
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      messageIcon: "💬",
      messages: [
        {
          id: 1,
          text: "heloo",
          time: "1:09 AM",
          date: "5/23/2025",
          sender: "them"
        }
      ]
    },
    {
      id: 3,
      type: "CUSTOMER",
      name: "im a user",
      lastMessage: "hy",
      online: true,
      unread: 0,
      timestamp: new Date(), // Today
      messageIcon: "💬",
      messages: [
        {
          id: 1,
          text: "hy",
          time: "12:30 PM",
          date: "5/23/2025",
          sender: "them"
        },
        {
          id: 2,
          text: "How can I help you today?",
          time: "12:35 PM",
          date: "5/23/2025",
          sender: "me"
        }
      ]
    },
    {
      id: 4,
      type: "ADMIN",
      name: "Admin",
      lastMessage: "how are you",
      online: true,
      unread: 0,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      messageIcon: "💬",
      messages: [
        {
          id: 1,
          text: "how are you",
          time: "3:45 PM",
          date: "5/22/2025",
          sender: "them"
        },
        {
          id: 2,
          text: "I'm doing well, thank you for asking!",
          time: "3:50 PM",
          date: "5/22/2025",
          sender: "me"
        }
      ]
    }
  ];

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
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to an API
      // For now, we'll just clear the input
      setNewMessage("");
    }
  };
  
  // Handle going back to the conversation list
  const handleBack = () => {
    setSelectedConversation(null);
  };

  // Get the selected conversation data
  const selectedConvData = getSelectedConversationData();

  return (
    <div className="mobile-chat-interface">
      {/* Header */}
      <div className="chat-header">
        {selectedConversation ? (
          <>
            <button className="back-button" onClick={handleBack}>←</button>
            <div className="header-info">
              <div className="header-name">{selectedConvData.name}</div>
              <div className="header-role">{getRoleBadge(selectedConvData.type)}</div>
            </div>
            <div className="header-time">
              🕒 {selectedConvData.messages[0].date} {selectedConvData.messages[0].time}
            </div>
          </>
        ) : (
          <>
            <div className="menu-icon">☰</div>
            <div className="header-title">Account Management</div>
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
            {conversations.map(conv => (
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
            ))}
          </div>
        </div>
        
        {/* Message view (visible when a conversation is selected) */}
        {selectedConversation && (
          <div className="message-view">
            {/* Messages */}
            <div className="messages">
              {/* Date divider */}
              <div className="date-divider">
                <span>{selectedConvData.messages[0].date}</span>
              </div>
              
              {/* Message bubbles */}
              {selectedConvData.messages.map(message => (
                <div 
                  key={message.id} 
                  className={`message-bubble ${message.sender === 'me' ? 'sent' : 'received'}`}
                >
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">{message.time}</div>
                </div>
              ))}
              
              {/* Action buttons for actionable messages */}
              {selectedConvData.messages.some(m => m.actionable) && !conversationAccepted && (
                <div className="action-buttons">
                  <button className="decline-button" onClick={handleDecline}>Decline</button>
                  <button className="accept-button" onClick={handleAccept}>Accept</button>
                </div>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileChatInterface;
