import React, { useState } from "react";
import ProfileTab from "./tab/ProfileTab";
import ChangePassword from "./tab/ChangePassword";
// import {
//   SvgAddressIcon,
//   SvgContactIcon,
//   SvgEmailIcon,
//   SvgLockIcon,
//   SvgPersonInfoIcon,
// } from "../../../assets/svg/Svg";
import { ProfileImg as DefaultProfileImg } from "../../../assets/images"; // Default profile image

const ProfileForm = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [profileImage, setProfileImage] = useState(DefaultProfileImg); // Set default image

  const tabs = [
    {
      title: "Personal Info",
      // profileIcon: <SvgPersonInfoIcon />,
      content: <ProfileTab />,
    },
    {
      title: "Change Password",
      // profileIcon: <SvgLockIcon />,
      content: <ChangePassword />,
    },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="profile-main">
      <div className="main-flex">
        <div className="inner-flex-30">
          <div className="card">
            <div className="card-body">
              <div className="imgupl-reslt">
                {/* Image Upload Section */}
                <label htmlFor="imageInput" className="camera-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="#fff"
                    className="bi bi-camera-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"></path>
                    <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0"></path>
                  </svg>
                </label>
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                {/* Profile Image Preview */}
                <div id="imagePreview">
                  <div className="uplinr-pic">
                    <span
                      style={{ backgroundImage: `url(${profileImage})` }}
                    ></span>
                  </div>
                </div>
              </div>

              <div className="profile-user-name">
                <h3>Eden Rapke</h3>
              </div>

              <div className="profile-content-list">
                <ul>
                  <li>
                    <div className="profile-auth-detail">
                      <div className="pfle-auth-lft">
                        <span>
                          {/* <SvgEmailIcon /> */}
                        </span>
                        <h4>Email</h4>
                      </div>
                      <div className="pfle-auth-rght">
                        <h4>ellasmith@gmail.com</h4>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="profile-auth-detail">
                      <div className="pfle-auth-lft">
                        <span>
                          {/* <SvgContactIcon /> */}
                        </span>
                        <h4>Phone Number</h4>
                      </div>
                      <div className="pfle-auth-rght">
                        <h4>626 626 6262</h4>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="profile-auth-detail">
                      <div className="pfle-auth-lft">
                        <span>
                          {/* <SvgAddressIcon /> */}
                        </span>
                        <h4>Address</h4>
                      </div>
                      <div className="pfle-auth-rght">
                        <h4>SUMMER HILL, New South</h4>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="inner-flex-70">
          <div className="profile-form">
            <div className="card">
              <div className="profile-main-form profile-tab-inner">
                <ul>
                  {tabs.map((tab, index) => (
                    <li key={index} onClick={() => setActiveTab(index)}>
                      <div
                        className={`prfl-title ${
                          index === activeTab ? "active" : ""
                        }`}
                      >
                        <em>{tab.profileIcon}</em>
                        <span className="tab-title">{tab.title}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="user-table-detail">
                <div className="tab-content">{tabs[activeTab].content}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
