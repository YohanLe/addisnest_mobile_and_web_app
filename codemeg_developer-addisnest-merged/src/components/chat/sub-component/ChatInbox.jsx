import React, { useState } from "react";
import { ProfileImg } from "../../../assets/images";

const ChatInbox = ({ activeUser }) => {
  const [actionTaken, setActionTaken] = useState(false);

  return (
    <>
      <div className="chat-right">
        <div className="chat-detail">
          <div className="chat-header">
            <div className="chathead-userdtl">
              <div className="chathead-usrbg">
                <span
                  style={{
                    backgroundImage: `url(${
                      activeUser ? activeUser.image : ProfileImg
                    })`,
                  }}
                ></span>
              </div>
              <div className="chathead-userdescrp">
                <h3>
                  {activeUser ? activeUser.name : "Select a conversation"}
                </h3>
                <p>Last message Oct 23, 2024 - 9:56 PM</p>
              </div>
            </div>
          </div>
          <div className="msginbox-sec">
            <ul>
              <div className="msginbox-tp-heading">
                <h5>12 Oct 2024</h5>
              </div>
              <li className="msg-reciver">
                {/* <div className="msgdlvrer-name">
                  <p>Seductive seeker</p>
                </div> */}
                <div className="card">
                  <div className="msg-descrp msg-format">
                    <p>
                      Hello! Yes, the property is still available. Would you
                      like to schedule a tour?
                    </p>
                  </div>
                </div>
                <div className="card">
                  <div className="msg-descrp msg-format">
                    <p>
                      Certainly! We have openings at 10:00 AM and 2:00 PM. Which
                      would work best for you?
                    </p>
                  </div>
                </div>
                <div className="card">
                  <div className="msg-descrp msg-format">
                    <p>
                      Got it! I’ll book you for a tour at 10:00 AM this
                      Saturday. You’ll receive a confirmation shortly. Let me
                      know if you have any questions in the meantime!
                    </p>
                  </div>
                </div>
                <div className="msgdate">
                  <p>10:55 AM</p>
                </div>
              </li>
              <li className="msg-sender">
                <div className="card">
                  <div className="msg-descrp">
                    <p>Yes, that would be great. Are there any time slots open for this Saturday?</p>
                  </div>
                </div>
                <div className="msgdate">
                  <p>10:59 AM</p>
                </div>
              </li>
            </ul>

            <div className="chat-footer">
              {!actionTaken ? (
                <div className="chat-footer-action">
                  <button
                    className="btn btn-plain"
                    onClick={() => setActionTaken(false)}
                  >
                    Decline
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setActionTaken(true)}
                  >
                    Accept
                  </button>
                </div>
              ) : (
                <div className="chatftr-main">
                  <div className="chat-typinput">
                    <input type="text" placeholder="Write a message..." />
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
                    <button className="btn btn-primary btnwth-icon">
                      Send
                      <span>{/* <SvgChatSendIcon /> */}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInbox;
