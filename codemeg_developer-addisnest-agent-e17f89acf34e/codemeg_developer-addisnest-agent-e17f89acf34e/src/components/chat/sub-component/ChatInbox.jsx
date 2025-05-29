import React, { useState, useEffect } from "react";
import { ProfileImg } from "../../../assets/images";

const ChatInbox = ({ activeUser }) => {
  const [actionTaken, setActionTaken] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // When activeUser changes, load their conversation
  useEffect(() => {
    if (activeUser) {
      // Here you would typically load the conversation history
      // For now, we'll show placeholder data if the user has messages
      setMessages(activeUser.messages || []);
      setActionTaken(activeUser.isAccepted || false);
    }
  }, [activeUser]);

  const handleSendMessage = () => {
    if (newMessage.trim() && activeUser) {
      // Create new message object
      const newMessageObj = {
        id: Date.now(),
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isFromUser: true, // This message is from the current user (agent)
        sender: 'agent'
      };
      
      // Add message to local state to display immediately
      setMessages(prevMessages => [...prevMessages, newMessageObj]);
      
      // Clear input
      setNewMessage("");
      
      // Here you would typically send the message via API
      console.log("Sending message:", newMessageObj);
      
      // TODO: Add API call to send message to backend
      // Api.postWithtoken(`chat/send`, {
      //   recipientId: activeUser.id,
      //   message: newMessage.trim()
      // });
    }
  };

  const handleAcceptConversation = () => {
    setActionTaken(true);
    // Here you would typically accept the conversation via API
    console.log("Accepting conversation with:", activeUser?.name);
  };

  const handleDeclineConversation = () => {
    // Here you would typically decline the conversation via API
    console.log("Declining conversation with:", activeUser?.name);
  };

  return (
    <>
      <div className="chat-right">
        <div className="chat-detail">
          {activeUser ? (
            <>
              <div className="chat-header">
                <div className="chathead-userdtl">
                  <div className="chathead-usrbg">
                    <span
                      style={{
                        backgroundImage: `url(${
                          activeUser.profileImage || activeUser.image || ProfileImg
                        })`,
                      }}
                    ></span>
                  </div>
                  <div className="chathead-userdescrp">
                    <h3>
                      {activeUser.name || activeUser.firstName + ' ' + activeUser.lastName || 'Unknown User'}
                    </h3>
                    <p>
                      {activeUser.lastMessageTime 
                        ? `Last message ${new Date(activeUser.lastMessageTime).toLocaleDateString()}`
                        : 'No recent messages'
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="msginbox-sec">
                {messages.length > 0 ? (
                  <ul>
                    <div className="msginbox-tp-heading">
                      <h5>{new Date().toLocaleDateString()}</h5>
                    </div>
                    {messages.map((message, index) => (
                      <li key={index} className={message.isFromUser ? "msg-sender" : "msg-reciver"}>
                        <div className="card">
                          <div className="msg-descrp msg-format">
                            <p>{message.content}</p>
                          </div>
                        </div>
                        <div className="msgdate">
                          <p>{new Date(message.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-messages">
                    <p>This conversation will appear here once you start chatting.</p>
                  </div>
                )}

                <div className="chat-footer">
                  {!actionTaken ? (
                    <div className="chat-footer-action">
                      <button
                        className="btn btn-plain"
                        onClick={handleDeclineConversation}
                      >
                        Decline
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleAcceptConversation}
                      >
                        Accept
                      </button>
                    </div>
                  ) : (
                    <div className="chatftr-main">
                      <div className="chat-typinput">
                        <input 
                          type="text" 
                          placeholder="Write a message..." 
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <div className="attachment-icon">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14.9997 13.3337H5.41634C3.57467 13.3337 2.08301 11.842 2.08301 10.0003C2.08301 8.15866 3.57467 6.66699 5.41634 6.66699H15.833C16.983 6.66699 17.9163 7.60033 17.9163 8.75033C17.9163 9.90033 16.983 10.8337 15.833 10.8337H7.08301C6.62467 10.8337 6.24967 10.4587 6.24967 10.0003C6.24967 9.54199 6.62467 9.16699 7.08301 9.16699H14.9997V7.91699H7.08301C5.93301 7.91699 4.99967 8.85033 4.99967 10.0003C4.99967 11.1503 5.93301 12.0837 7.08301 12.0837H15.833C17.6747 12.0837 19.1663 10.592 19.1663 8.75033C19.1663 6.90866 17.6747 5.41699 15.833 5.41699H5.41634C2.88301 5.41699 0.833008 7.46699 0.833008 10.0003C0.833008 12.5337 2.88301 14.5837 5.41634 14.5837H14.9997V13.3337Z"
                              fill="#404040"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="moremenu-chtbtn">
                        <button 
                          className="btn btn-primary btnwth-icon"
                          onClick={handleSendMessage}
                        >
                          Send
                          <span>{/* <SvgChatSendIcon /> */}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="no-conversation-selected">
              <div className="empty-state">
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the left to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatInbox;
