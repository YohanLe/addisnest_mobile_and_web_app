import React from "react";
import { SvgLogOutIcon } from "../assets/svg-files/SvgFiles";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Redux-store/Slices/AuthSlice";

const LogOutPopup = ({ handlePopup }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const LogOutBotton = () => {
        dispatch(logout());
        localStorage.clear();
        navigate('/')
        window.location.reload();
        handlePopup();
    };
    return (
        <div className="main-popup logout-popup">
            <div className="lm-outer">
                <div className="lm-inner">
                    <div className="popup-inner">
                        <div className="card-body">
                            <div className="logout-icon">
                                <SvgLogOutIcon />
                            </div>
                            <div className="logout-title">
                                <h3>Logout</h3>
                                <p>Are you sure you want to Logout?</p>
                            </div>
                            <div className="logoutpopup-btn">
                                <button className="btn btn-secondary" onClick={handlePopup}>Not Now</button>
                                <button className="btn btn-primary"  onClick={LogOutBotton}>Yes, Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="popup-overlay" onClick={handlePopup}></div>
        </div>
    );
};

export default LogOutPopup;
