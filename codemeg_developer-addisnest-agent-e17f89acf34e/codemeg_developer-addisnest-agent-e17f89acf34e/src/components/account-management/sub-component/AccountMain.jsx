import React, { useState } from "react";
import MyProfileTab from "./account-tab/MyProfileTab";
import PasswordTab from "./account-tab/PasswordTab";
import {
  SvgAccountIcon,
  SvgLogOutIcon,
  SvgPasswordIcon,
  SvgReviewRatingIcon,
} from "../../../assets/svg/Svg";
import ReviewAndRatingTab from "./account-tab/ReviewAndRatingTab";
import LogoutPopup from "../../../helper/LogoutPopup";

const AccountMain = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    {
      title: "My profile",
      ProfileIcon: <SvgAccountIcon />,
      content: <MyProfileTab />,
    },
    {
      ProfileIcon: <SvgPasswordIcon />,
      title: "Change password",
      content: <PasswordTab />,
    },
    {
      ProfileIcon: <SvgReviewRatingIcon />,
      title: "Review & Ratings",
      content: <ReviewAndRatingTab />,
    },
  ];
  const [showLogoutPopup, setLogoutPopup] = useState(false);
  const handleLogoutPopupToggle = () => {
    setLogoutPopup((prev) => !prev);
  };
  return (
    <>
      <div className="accountmain-section">
        <div className="container">
          <div className="card">
            <div className="account-title">
              <h3>Account management</h3>
            </div>
            <div className="main-flex">
              <div className="inner-flex-30">
                <div className="account-list">
                  <ul>
                    {tabs.map((tab, index) => (
                      <li key={index} onClick={() => setActiveTab(index)}>
                        <div
                          className={`account-tab-title ${
                            index == activeTab ? "active" : ""
                          }`}
                        >
                          <em>{tab.ProfileIcon}</em>
                          <span className="tab-title">{tab.title}</span>
                        </div>
                      </li>
                    ))}
                    <li>
                      <div
                        className="profile-logout"
                        onClick={handleLogoutPopupToggle}
                      >
                        <div className="account-tab-title">
                          <em>
                            <SvgLogOutIcon />
                          </em>
                          <span className="tab-title">Logout</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="inner-flex-70">
                <div className="account-tab-detail">
                  <div className="account-tab-list">
                    {tabs[activeTab].content}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showLogoutPopup && <LogoutPopup handlePopup={handleLogoutPopupToggle} />}
    </>
  );
};

export default AccountMain;
