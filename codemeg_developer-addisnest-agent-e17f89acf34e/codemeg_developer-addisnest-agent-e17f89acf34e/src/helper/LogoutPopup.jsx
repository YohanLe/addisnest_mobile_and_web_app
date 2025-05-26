import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../Redux-store/Slices/AuthSlice";
import { useDispatch } from "react-redux";
// import { SvgLogoutIcon } from "../assets/svg/Svg";

const LogoutPopup = ({ handlePopup }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const LogOutBotton = () => {
        dispatch(logout());
        localStorage.clear();
        navigate('/login')
        window.location.reload();
        handlePopup();
    };
    return (
        <>
            <div className="main-popup action-modal logout-modal">
                <div className="lm-outer">
                    <div className="lm-inner">
                        <div className="popup-inner">
                            <div className="popup-body">
                                <div className="modal-common">
                                    <div className="modal-common-dtls">
                                        <div className="square-modal-icon">
                                            <span>
                                                {/* <SvgLogoutIcon /> */}
                                            </span>
                                        </div>
                                        <h3>Sure you want to Logout?</h3>
                                        <p>Are you sure you want to logout your account</p>
                                    </div>
                                    <div className="modal-btn">
                                        <button
                                            type="button"
                                            className="btn btn-plain"
                                            onClick={handlePopup}
                                        >
                                            No, Stay here
                                        </button>
                                        <button onClick={LogOutBotton}  type="button" className="btn btn-primary">
                                            Yes, logout ddd
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="popup-overlay" onClick={handlePopup}></div>
            </div>
        </>
    );
};

export default LogoutPopup;
