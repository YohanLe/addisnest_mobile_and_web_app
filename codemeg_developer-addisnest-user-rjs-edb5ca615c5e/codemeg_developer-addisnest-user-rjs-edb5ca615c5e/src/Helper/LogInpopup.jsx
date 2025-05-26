import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    SvgAppleIcon,
    SvgCloseIcon,
    SvgGoogleIcon,
} from "../assets/svg-files/SvgFiles";
import RegisterPopup from "./RegisterPopup";
import ForgotPasswordPopup from "./ForgotPasswordPopup";
import { validateLogin } from "../utils/Validation";
import Api from "../Apis/Api";
import { toast } from "react-toastify";
import { AuthUserDetails } from "../Redux-store/Slices/AuthSlice";
import { useDispatch } from "react-redux";
const LogInpopup = ({ handlePopup }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("customer");
    const [showRegisterPopup, setRegisterPopup] = useState(false);
    
    const [Loading, setLoading] = useState(false);
    const [error, setError] = useState({ isValid: false });
    const [passtype, setpasstype] = useState(false);
    const [showForgotPasswordPopup, setForgotPasswordPopup] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };
    const [inps, setInps] = useState({
        email: '',
        password: "",
    })

    const onInpChanged = (event) => {
        setError(p => {
            const obj = { ...p }
            obj?.errors && delete obj?.errors[event?.target?.name]
            return obj
        })
        setInps((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!isConfirmPasswordVisible);
    };
   
    const handleRegisterPopupToggle = () => {
        setRegisterPopup((prev) => !prev);
    };
  
    const handleForgotPasswordPopupToggle = () => {
        setForgotPasswordPopup((prev) => !prev);
    };
    
    const Loginfun = async () => {
        const errorMessage = validateLogin(inps);
        if (errorMessage.isValid == false) {
            setError(errorMessage);
        } else {
            try {
                let body = {
                    email:inps.email,
                    password:inps.password,
                }
                let formData = new FormData();
                for (let key in body) {
                    formData.append(key, body[key]);
                }

                setLoading(true);
                const response = await Api.post("auth/login", body);
                const { data, message } = response;
                localStorage.setItem('access_token', data?.token);
                localStorage.setItem('isLogin','1')
                localStorage.setItem("userId", data?.userId,);
                // addAccessToken(data?.accessToken);
                handlePopup();
                dispatch(AuthUserDetails());
                navigate('/')
                toast.success("Login sucessfully");

            } catch (error) {
                const { response } = error;
                const { data, status, message } = response;
                toast.error(data.message);
                setLoading(false);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            Loginfun();
        }
    };

    return (
        <>
            <div className="main-popup action-modal auth-sign-modal">
                <div className="lm-outer">
                    <div className="lm-inner">
                        <div className="popup-inner">
                            <div className="popup-header">
                                <div className="back-icon">
                                    <Link to="#"></Link>
                                </div>
                                <div className="popup-title">
                                    <h3>Log in</h3>
                                </div>
                                <div className="close-icon">
                                    <span onClick={handlePopup}>
                                        <SvgCloseIcon />
                                    </span>
                                </div>
                            </div>
                            <div className="auth-tabbing">
                                <span
                                    className={activeTab === "customer" ? "active" : ""}
                                    onClick={() => setActiveTab("customer")}
                                >
                                    Customer login
                                </span>
                                <span
                                    className={activeTab === "agent" ? "active" : ""}
                                    onClick={() => setActiveTab("agent")}
                                >
                                    Agent login
                                </span>
                            </div>
                            <div className="popup-body">
                                <div className="auth-main">
                                    <div className="auth-heading">
                                        <h4>Welcome to Addisnest</h4>
                                    </div>
                                    <div className="form-flex">
                                        <div className="form-inner-flx-100">
                                            <div className="single-input">
                                                <label for="">
                                                    Email<i>*</i>
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="Enter Your Email Id"
                                                    onChange={onInpChanged}
                                                    value={inps?.email}
                                                    className={`${error.errors?.email ? "alert-input" : ""}`}
                                                />
                                                {error.errors?.email && <p className="error-input-msg">{error.errors?.email}</p>}
                                            </div>
                                        </div>
                                        <div className="form-inner-flx-100">
                                            <div className="single-input">
                                                <label>
                                                    Password<i>*</i>
                                                </label>
                                                <div className="password-inputs">
                                                    <input
                                                        type={isPasswordVisible ? "text" : "password"}
                                                        placeholder="Enter Your Password"
                                                        name="password"
                                                        onChange={onInpChanged}
                                                        onKeyDown={handleKeyDown}
                                                        value={inps?.password}
                                                        className={`${error.errors?.password ? "alert-input" : ""}`}
                                                    />
                                                    <div
                                                        className="pwd-icon"
                                                        onClick={togglePasswordVisibility}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {isPasswordVisible ? (
                                                            <span>
                                                                <i className="fa-regular fa-eye-slash"></i>
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                <i className="fa-regular fa-eye"></i>
                                                            </span>
                                                        )}
                                                    </div>
                                                    {error.errors?.password && <p className="error-input-msg">{error.errors?.password}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="fogot-link">
                                        <Link to="#" onClick={handleForgotPasswordPopupToggle}>
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <div className="auth-btn">
                                        <button onClick={Loginfun} className="btn btn-primary">
                                            Continue
                                        </button>
                                    </div>
                                    <div className="auth-orline">
                                        <p>OR</p>
                                    </div>
                                    <div className="auth-social-btn">
                                        <Link to="#" className="auth-google">
                                            <span>
                                                <SvgGoogleIcon />
                                            </span>
                                            Log in with Google
                                        </Link>
                                        <Link to="#" className="auth-google">
                                            <span>
                                                <SvgAppleIcon />
                                            </span>
                                            Log in with Apple
                                        </Link>
                                    </div>
                                    <div className="auth-btm">
                                        <p>
                                            Don’t have an Account?
                                            <Link onClick={handleRegisterPopupToggle}>
                                                Register
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="popup-overlay" onClick={handlePopup}></div>
            </div>
            {showRegisterPopup && (
                <RegisterPopup handlePopup={handleRegisterPopupToggle} />
            )}
            {showForgotPasswordPopup && (
                <ForgotPasswordPopup handlePopup={handleForgotPasswordPopupToggle} />
            )}
        </>
    );
};

export default LogInpopup;
