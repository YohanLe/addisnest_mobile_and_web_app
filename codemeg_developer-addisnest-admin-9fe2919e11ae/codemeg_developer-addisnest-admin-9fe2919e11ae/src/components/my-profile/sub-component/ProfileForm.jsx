import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProfileTab from "./tab/ProfileTab";
import ChangePassword from "./tab/ChangePassword";

import {
  SvgAddressIcon,
  SvgContactIcon,
  SvgEmailIcon,
  SvgLockIcon,
  SvgPersonInfoIcon,
} from "../../../assets/svg/Svg";
import { ProfileImg as DefaultProfileImg } from "../../../assets/images"; // Default profile image
import { fetchProfile } from "../../../Redux-store/Slices/AdminProfileSlice";
import Api from "../../../Apis/Api";
import { toast } from "react-toastify"; // Assuming you're using toast for notifications

const ProfileForm = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.adminProfile);

  const [activeTab, setActiveTab] = useState(0);
  const [profileImage, setProfileImage] = useState(DefaultProfileImg); // Set default image
  const [imageFile, setImageFile] = useState(null); // New state for image file
  const [existingProfileImage, setExistingProfileImage] = useState(null); // Store backend image URL

  console.log(existingProfileImage)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    address: "",
    phone: "",
    email: "",
    profile_img: "",
  });

  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile());
    } else {
      setFormData({
        name: profile.name || "",
        username: profile.username || "",
        address: profile.address || "",
        phone: profile.phone || "",
        email: profile.email || "",
        profile_img: profile.profile_img || "",
      });
      if (profile.profile_img) {
        setProfileImage(profile.profile_img);
        setExistingProfileImage(profile.profile_img);
      }
    }
  }, [profile, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (file) => {
    try {
      let formData = new FormData();
      formData.append("mediaFiles", file); // Appending the file to the formData

      // Make the API call to upload the image to the server
      const response = await Api.postWithtoken("media/public", formData); // Assuming Api handles authorization
      const { files, message } = response;
      if (files && typeof files === 'string') {
        setProfileImage(files); // Update profile image URL if a single string URL is returned
        setImageFile(files)
      } else if (files && Array.isArray(files) && files.length > 0) {
        setProfileImage(files[0]); // Handle the case where multiple files are returned
        setImageFile(files[0])
        // console.log(files[0])
      } else {
        throw new Error("Invalid response from server");
      }

      toast.success(message);
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Image upload failed!");
    }
  };

  const tabs = [
    {
      title: "Personal Info",
      profileIcon: <SvgPersonInfoIcon />,
              content: (
                <ProfileTab
                  formData={formData}
                  handleInputChange={handleInputChange}
                  setProfileImage={setProfileImage}
                  imageFile={imageFile}
                  existingProfileImage={existingProfileImage}
                />
              ),
    },
    {
      title: "Change Password",
      profileIcon: <SvgLockIcon />,
      content: <ChangePassword />,
    },
  ];

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
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setProfileImage(URL.createObjectURL(file));
                      handleImageUpload(file); // Upload the image
                    }
                  }}
                />
                {/* Profile Image Preview */}
                <div id="imagePreview">
                  <div className="uplinr-pic">
                    <span
                      style={{ backgroundImage: `url("${profileImage}")` }}
                    ></span>
                  </div>
                </div>
              </div>

              <div className="profile-user-name">
                <h3>{formData.name || "User"}</h3>
              </div>

              <div className="profile-content-list">
                <ul>
                  <li>
                    <div className="profile-auth-detail">
                      <div className="pfle-auth-lft">
                        <span>
                          <SvgEmailIcon />
                        </span>
                        <h4>Mail</h4>
                      </div>
                      <div className="pfle-auth-rght">
                        <h4>{formData.email || "No Email"}</h4>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="profile-auth-detail">
                      <div className="pfle-auth-lft">
                        <span>
                          <SvgContactIcon />
                        </span>
                        <h4>Phone-Number</h4>
                      </div>
                      <div className="pfle-auth-rght">
                        <h4>{formData.phone || "No Phone"}</h4>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="profile-auth-detail">
                      <div className="pfle-auth-lft">
                        <span>
                          <SvgAddressIcon />
                        </span>
                        <h4>Address</h4>
                      </div>
                      <div className="pfle-auth-rght">
                        <h4>{formData.address || "No Address"}</h4>
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
