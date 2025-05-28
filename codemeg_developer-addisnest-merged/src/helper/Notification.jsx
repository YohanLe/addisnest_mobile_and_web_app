import React from "react";
// import { SvgBellIcon, SvgCloseIcon } from "../assets/svg/Svg";

const Notification = () => {
  const openNotifyPopup = () => {
    document.body.classList.toggle("show-notification-modal");
  };
  return (
    <>
      <div className="notification-modal">
        <div className="notification-head">
          <div className="notification-head-title">
            <h3>Notification</h3>
          </div>
          <div className="notification-close">
            <span onClick={openNotifyPopup}>
              {/* <SvgCloseIcon /> */}
            </span>
          </div>
        </div>
        <ul>
          {Array(10)
            .fill(1)
            .map((item, idx) => {
              return (
                <li key={idx}>
                  <div className="noticard-dtl">
                    <div className="notiprfl-descrp">
                      <h3>New Property Add</h3>
                      <div className="advrtise-date">
                        <p>Last Wednesday at 9:42 AM</p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
        <div className="notification-overlay" onClick={openNotifyPopup}></div>
      </div>
    </>
  );
};

export default Notification;
