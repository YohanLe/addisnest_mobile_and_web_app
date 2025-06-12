import React, { useState } from "react";

const Messages = () => {
  // Sample conversations data
  const conversations = [
    {
      id: 1,
      type: "AGENT",
      name: "agent",
      lastMessage: "New Property Visit Request Received",
      online: true,
      unread: 1
    },
    {
      id: 2,
      type: "CUSTOMER",
      name: "Abhilesh",
      lastMessage: "heloo",
      online: true,
      unread: 0,
      messages: [
        {
          text: "heloo",
          time: "1:09:52 AM",
          date: "5/23/2025"
        }
      ]
    },
    {
      id: 3,
      type: "CUSTOMER",
      name: "im a user",
      lastMessage: "hy",
      online: true,
      unread: 0
    },
    {
      id: 4,
      type: "ADMIN",
      name: "ADMI",
      lastMessage: "how are you",
      online: true,
      unread: 0
    }
  ];

  // State for selected conversation
  const [selectedConversation, setSelectedConversation] = useState(2);  // Default to Abhilesh conversation
  
  // State to track if the conversation has been accepted
  const [conversationAccepted, setConversationAccepted] = useState(false);
  
  // State for the new message being composed
  const [newMessage, setNewMessage] = useState("");

  // Get the selected conversation object
  const getSelectedConversationData = () => {
    return conversations.find(conv => conv.id === selectedConversation);
  };

  const selectedConvData = getSelectedConversationData();
  
  // Handle accepting the conversation
  const handleAccept = () => {
    setConversationAccepted(true);
  };
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to an API
      // For now, we'll just clear the input
      setNewMessage("");
      // You would also update the conversation with the new message
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-panel">
        {/* Left panel - Conversations list */}
        <div className="conversations-panel">
          <div className="conversations-header">
            <h3>Active Conversations <span className="conversation-count">4</span></h3>
          </div>
          
          <div className="conversations-search">
            <input type="text" placeholder="Search.." />
            <button className="search-btn">
              <i className="search-icon">🔍</i>
            </button>
          </div>
          
          <div className="conversations-list">
            {conversations.map(conv => (
              <div 
                key={conv.id} 
                className={`conversation-item ${selectedConversation === conv.id ? 'active' : ''}`}
                onClick={() => setSelectedConversation(conv.id)}
              >
                <div className="avatar">
                  {conv.name.charAt(0).toUpperCase()}
                  {conv.online && <span className="online-indicator"></span>}
                </div>
                <div className="conversation-info">
                  <div className="conversation-header">
                    <span className="conversation-type">{conv.type}</span>
                    <span className="conversation-name">{conv.name}</span>
                  </div>
                  <div className="conversation-message">{conv.lastMessage}</div>
                </div>
                {conv.unread > 0 && (
                  <div className="unread-count">{conv.unread}</div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Right panel - Chat view */}
        <div className="chat-view">
          {selectedConvData ? (
            <div className="chat-messages">
              {/* Header with user info */}
              <div className="chat-header">
                <div className="user-profile">
                  <img src="https://via.placeholder.com/50" alt="Profile" className="user-avatar" />
                  <div className="user-info">
                    <h3>{selectedConvData.name}</h3>
                    <p>{selectedConvData.type === "CUSTOMER" ? 
                      `${selectedConvData.messages?.[0]?.date || "5/23/2025"}, ${selectedConvData.messages?.[0]?.time || "1:09:52 AM"}` : 
                      "Online"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Message history */}
              <div className="message-history">
                <div className="date-divider">
                  <span>{selectedConvData.messages?.[0]?.date || "5/23/2025"}</span>
                </div>
                
                {/* Message bubbles */}
                <div className="message-bubble sender">
                  <div className="message-content">
                    <p>{selectedConvData.lastMessage}</p>
                    <span className="message-time">{selectedConvData.messages?.[0]?.time || "1:09:52 AM"}</span>
                  </div>
                </div>
              </div>
              
              {/* Message input or action buttons based on conversation status */}
              {conversationAccepted ? (
                <div className="message-input-container">
                  <div className="message-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Write a message..." 
                      className="message-input"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button className="attach-btn">
                      <i className="attachment-icon">📎</i>
                    </button>
                  </div>
                  <button 
                    className="send-btn"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </button>
                </div>
              ) : (
                <div className="message-actions">
                  <button className="decline-btn">Decline</button>
                  <button className="accept-btn" onClick={handleAccept}>Accept</button>
                </div>
              )}
            </div>
          ) : (
            <div className="no-conversation">
              <div className="no-conversation-avatar">
                <img src="https://via.placeholder.com/100" alt="Profile" />
              </div>
              <h3>Select a conversation</h3>
              <p>No messages yet</p>
              <div className="no-messages-info">
                <p>No messages yet.</p>
                <p>Select a conversation to start chatting.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .chat-container {
          display: flex;
          height: 100%;
          background-color: #f9f9f9;
        }
        
        .chat-panel {
          display: flex;
          width: 100%;
          height: 100%;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .conversations-panel {
          width: 340px;
          border-right: 1px solid #eee;
          display: flex;
          flex-direction: column;
        }
        
        .conversations-header {
          padding: 15px;
          border-bottom: 1px solid #eee;
        }
        
        .conversations-header h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
          display: flex;
          align-items: center;
        }
        
        .conversation-count {
          margin-left: 10px;
          background-color: #8cc63f;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        
        .conversations-search {
          padding: 10px 15px;
          display: flex;
          border-bottom: 1px solid #eee;
        }
        
        .conversations-search input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .search-btn {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          margin-left: 5px;
        }
        
        .conversations-list {
          flex: 1;
          overflow-y: auto;
        }
        
        .conversation-item {
          display: flex;
          padding: 15px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          position: relative;
        }
        
        .conversation-item:hover {
          background-color: #f9f9f9;
        }
        
        .conversation-item.active {
          background-color: #f0f7ff;
          border-left: 3px solid #8cc63f;
        }
        
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #eee;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #666;
          margin-right: 12px;
          position: relative;
        }
        
        .online-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          background-color: #4caf50;
          border-radius: 50%;
          border: 2px solid white;
        }
        
        .conversation-info {
          flex: 1;
          overflow: hidden;
        }
        
        .conversation-header {
          margin-bottom: 5px;
        }
        
        .conversation-type {
          font-size: 12px;
          font-weight: bold;
          color: #888;
          margin-right: 5px;
        }
        
        .conversation-name {
          font-weight: 500;
        }
        
        .conversation-message {
          font-size: 13px;
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .unread-count {
          min-width: 20px;
          height: 20px;
          background-color: #8cc63f;
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          padding: 0 6px;
        }
        
        .chat-view {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .chat-messages {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .chat-header {
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
        }
        
        .user-profile {
          display: flex;
          align-items: center;
        }
        
        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 15px;
        }
        
        .user-info h3 {
          margin: 0 0 5px;
          font-size: 18px;
        }
        
        .user-info p {
          margin: 0;
          color: #777;
          font-size: 14px;
        }
        
        .message-history {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }
        
        .date-divider {
          text-align: center;
          margin: 20px 0;
          position: relative;
        }
        
        .date-divider:before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          width: 100%;
          height: 1px;
          background: #eee;
          z-index: 1;
        }
        
        .date-divider span {
          background: #fff;
          padding: 0 15px;
          position: relative;
          z-index: 2;
          color: #999;
          font-size: 14px;
        }
        
        .message-bubble {
          max-width: 70%;
          margin-bottom: 15px;
          display: flex;
        }
        
        .message-bubble.sender {
          background-color: #f2f7ff;
          border-radius: 18px;
          padding: 12px 18px;
          align-self: flex-start;
        }
        
        .message-bubble.receiver {
          background-color: #e6f7e6;
          border-radius: 18px;
          padding: 12px 18px;
          align-self: flex-end;
        }
        
        .message-content p {
          margin: 0 0 5px;
          font-size: 15px;
          line-height: 1.4;
        }
        
        .message-time {
          font-size: 12px;
          color: #999;
          display: block;
          text-align: right;
        }
        
        .message-actions {
          display: flex;
          justify-content: flex-end;
          padding: 15px 20px;
          border-top: 1px solid #eee;
          gap: 10px;
        }
        
        .decline-btn, .accept-btn {
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          font-size: 14px;
        }
        
        .decline-btn {
          background-color: #f5f5f5;
          color: #555;
        }
        
        .accept-btn {
          background-color: #8cc63f;
          color: white;
        }
        
        .no-conversation {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
          color: #666;
          text-align: center;
        }
        
        .no-conversation-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 15px;
        }
        
        .no-conversation-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .no-conversation h3 {
          margin: 0 0 5px;
          color: #333;
        }
        
        .no-conversation p {
          margin: 0 0 20px;
          color: #888;
        }
        
        .no-messages-info p {
          margin: 5px 0;
          font-size: 14px;
        }
        
        /* Message input styles */
        .message-input-container {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          border-top: 1px solid #eee;
        }
        
        .message-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 24px;
          padding: 0 15px;
          margin-right: 10px;
          background: #fff;
        }
        
        .message-input {
          flex: 1;
          border: none;
          padding: 12px 0;
          font-size: 14px;
          outline: none;
          background: transparent;
        }
        
        .attach-btn {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 5px;
        }
        
        .send-btn {
          background-color: #8cc63f;
          color: white;
          border: none;
          border-radius: 24px;
          padding: 10px 20px;
          font-weight: 500;
          cursor: pointer;
          font-size: 14px;
        }
        
        .send-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Messages;
