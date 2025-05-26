import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileImg } from "../assets/images";
import LogoutPopup from "./LogoutPopup";
import { useSelector } from "react-redux";
// import { FeeImage } from "../assets/images";
const ProfileDropdown = () => {
    const navigate = useNavigate();
    const ProfileDetail = useSelector((state) => state.Auth.Details);
    const profiledata = ProfileDetail?.data;

    const [showProfile, setShowProfile] = useState(false);
    const selectRef = useRef();

    const goToNext = (path) => {
        navigate(path);
        setShowProfile(false);
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
    }, [selectRef]);

    const [showLogoutPopup, setLogoutPopup] = useState(false);
    const handleLogoutPopup = () => {
        setLogoutPopup((p) => !p);
    };

    return (
        <>
            <div className="profile-dropdown" ref={selectRef}>
                <div
                    className="profile-dropdown-title"
                    onClick={() => setShowProfile((p) => !p)}
                >
                    <div className="profile-dropdown-bg">
                        <span
                            style={{
                                backgroundImage: `url(${profiledata?.profile_img})`,
                            }}
                        ></span>
                    </div>

                </div>
                {showProfile && (
                    <div className="profile-dropdown-box">
                        <ul>
                            <li>
                                <a onClick={() => goToNext("/account-management")}>Account Management</a>
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
