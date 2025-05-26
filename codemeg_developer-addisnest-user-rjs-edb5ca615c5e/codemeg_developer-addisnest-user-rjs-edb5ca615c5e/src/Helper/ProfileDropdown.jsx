import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    SvgAccountIcon,
    SvgBecomeAgentIcon,
    SvgContactUSIcon,
    SvgHelpCenterIcon,
    SvgLogOutIcon,
    SvgMassageProfileIcon,
    SvgNotificationIcon,
    SvgSavedIcon,
} from "../assets/svg-files/SvgFiles";
import LogOutPopup from "./LogOutPopup";
import { useSelector } from "react-redux";
// import { FeeImage } from "../assets/images";
const ProfileDropdown = () => {
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    const selectRef = useRef();
    const ProfileDetail = useSelector((state) => state.Auth.Details);
    const profiledata = ProfileDetail?.data;
    console.log('profile', profiledata?.role)
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

    const [showLogOutPopup, setLogOutPopup] = useState(false);
    const handleLogOutPopup = () => {
        setLogOutPopup((p) => !p);
    };

    return (
        <>
            <div className="profile-dropdown" ref={selectRef}>
                <div
                    className="profile-dropdown-title"
                    onClick={() => setShowProfile((p) => !p)}
                >
                    <span></span>
                    <div className="profle-titledrp">
                        <p>A</p>
                    </div>
                </div>
                {showProfile && (
                    <div className="profile-dropdown-box">
                        <ul>
                            <li>
                                <a onClick={() => goToNext("/chat")}>
                                    <span>
                                        <SvgMassageProfileIcon />
                                    </span>{" "}
                                    Message
                                </a>
                            </li>
                            <li>
                                <a onClick={() => goToNext("/notification")}>
                                    {" "}
                                    <span>
                                        <SvgNotificationIcon />
                                    </span>
                                    Notification
                                </a>
                            </li>
                            <li>
                                <a onClick={() => goToNext("/favorite")}>
                                    {" "}
                                    <span>
                                        <SvgSavedIcon />
                                    </span>
                                    Saved
                                </a>
                            </li>
                            <li>
                                {/* <a onClick={() => goToNextAgent()}>
                                    {" "}
                                    <span>
                                        <SvgBecomeAgentIcon />
                                    </span>
                                    Become an Agent
                                </a> */}
                                {profiledata?.role=='AGENT'&&<a href="https://addisnest-agent.codemeg.com" target="_blank" rel="noopener noreferrer">
                                    <span>
                                        <SvgBecomeAgentIcon />
                                    </span>
                                    Become an Agent
                                </a>
                                }
                                
                            </li>
                            <li>
                                <a onClick={() => goToNext("/account-management")}>
                                    {" "}
                                    <span>
                                        <SvgAccountIcon />
                                    </span>
                                    Account
                                </a>
                            </li>
                            <li>
                                <a onClick={() => goToNext("/help-support")}>
                                    {" "}
                                    <span>
                                        <SvgHelpCenterIcon />
                                    </span>
                                    Help Centre
                                </a>
                            </li>
                            <li>
                                <a onClick={() => goToNext("/contact-us")}>
                                    {" "}
                                    <span>
                                        <SvgContactUSIcon />
                                    </span>
                                    Contact us
                                </a>
                            </li>
                            <li>
                                <a onClick={handleLogOutPopup}>
                                    <span>
                                        <SvgLogOutIcon />
                                    </span>{" "}
                                    Log Out
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
                {showLogOutPopup && (
                    <LogOutPopup handlePopup={handleLogOutPopup} />
                )}
            </div>
        </>
    );
};

export default ProfileDropdown;
