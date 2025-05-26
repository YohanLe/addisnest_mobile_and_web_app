import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LogoutPopup from "../helper/LogoutPopup";
import { useNavigate } from "react-router-dom";
import { ProfileImg } from "../assets/images";
import { fetchProfile } from "../Redux-store/Slices/AdminProfileSlice";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const selectRef = useRef();
  const [showLogoutPopup, setLogoutPopup] = useState(false);
  const dispatch = useDispatch();

  const { profile } = useSelector((state) => state.adminProfile);

  const [profileData, setProfileData] = useState({
    name: "",
    profile_img: "",
    role: "",
  });

  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile()); // ✅ this must be defined in your redux
    } else {
      setProfileData({
        name: profile.name || "",
        role: profile.role || "",
        profile_img: profile.profile_img || "",
      });
    }
  }, [profile, dispatch]);

  const { name, role, profile_img } = profileData;

  const goToNext = (path) => {
    navigate(path);
    setShowProfile(false);
  };

  const handleLogoutPopup = () => {
    setLogoutPopup((p) => !p);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="profile-dropdown" ref={selectRef}>
        <div
          className="profile-dropdown-title"
          onClick={() => setShowProfile((p) => !p)}
        >
          <div className="profile-dropdown-bg">
            <span
             style={{ backgroundImage: `url("${profile_img || ProfileImg}")` }}

            ></span>
          </div>
          <div className="profile-username">
            <h5>{name}</h5>
            <p>{role}</p>
          </div>
        </div>
        {showProfile && (
          <div className="profile-dropdown-box">
            <ul>
              <li>
                <a onClick={() => goToNext("/my-profile")}>My Profile</a>
              </li>
              <li>
                <a onClick={handleLogoutPopup}>Log Out</a>
              </li>
            </ul>
          </div>
        )}
      </div>

      {showLogoutPopup && <LogoutPopup handlePopup={handleLogoutPopup} />}
    </>
  );
};

export default ProfileDropdown;
