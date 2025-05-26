import React, { useState } from "react";
import { ChatInbox, ChatList } from "./sub-component";
// import TitleWithBackButton from "../../Helper/TitleWithBackButton";

const Index = () => {
  const [activeUser, setActiveUser] = useState(null);

  return (
    <>
      <div className="main-wrapper">
        <section className="chat-section">
          <div className="container">
            <div className="ticket-head">
              {/* <TitleWithBackButton title={"Message"} /> */}
            </div>
            <div className="chat-main">
              <ChatList activeUser={activeUser} setActiveUser={setActiveUser} />
              <ChatInbox activeUser={activeUser} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
