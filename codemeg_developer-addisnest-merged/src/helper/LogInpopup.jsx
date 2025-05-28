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
const LogInpopup = ({ handlePopup, onLoginSuccess }) => {
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
                
                // Demo mode - simulate successful login without API call
                setTimeout(() => {
                    // Simulate API response
                    localStorage.setItem('access_token', 'demo_token_123');
                    localStorage.setItem('isLogin','1')
                    localStorage.setItem("userId", 'demo_user_123');
                    localStorage.setItem("userType", activeTab);
                    
                    setLoading(false);
                    dispatch(AuthUserDetails());
                    
                    // Call the onLoginSuccess callback if provided
                    if (onLoginSuccess) {
                        onLoginSuccess();
                    } else {
                        // Default behavior: close popup and navigate
                        handlePopup();
                        
                        // Navigate to different routes based on user type
                        if (activeTab === "agent") {
                            // For demo, just navigate to home since agent dashboard might not be available
                            navigate('/');
                        } else {
                            navigate('/');
                        }
                        
                        toast.success("Login successful (Demo Mode)");
                    }
                }, 1000); // Simulate network delay
                
                return; // Skip the actual API call
                
                // Original API call (commented out for demo mode)
                /*
                const response = await Api.post("auth/login", body);
                const { data, message } = response;
                localStorage.setItem('access_token', data?.token);
                localStorage.setItem('isLogin','1')
                localStorage.setItem("userId", data?.userId,);
                localStorage.setItem("userType", activeTab); // Store user type for navigation
                // addAccessToken(data?.accessToken);
                handlePopup();
                dispatch(AuthUserDetails());
                
                // Navigate to different routes based on user type
                if (activeTab === "agent") {
                    // Redirect to agent dashboard
                    window.location.href = `${window.location.origin.replace(':3000', ':3001')}/`;
                } else {
                    navigate('/');
                }
                
                toast.success("Login sucessfully");
                */

            } catch (error) {
                console.error('Login error:', error);
                setLoading(false);
                
                // Handle network errors (CORS, connection issues, etc.)
                if (!error.response) {
                    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
                        toast.error('Network connection failed. Please check your internet connection and try again.');
                    } else if (error.name === 'TypeError' || error.message.includes('CORS')) {
                        toast.error('Unable to connect to the server. Please try again later or contact support.');
                    } else {
                        toast.error('An unexpected error occurred. Please try again.');
                    }
                    return;
                }
                
                // Handle HTTP response errors
                const { response } = error;
                if (response && response.data) {
                    const { data, status } = response;
                    if (data.message) {
                        toast.error(data.message);
                    } else {
                        toast.error('Login failed. Please check your credentials and try again.');
                    }
                } else {
                    toast.error('Login failed. Please try again.');
                }
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
                                            Don't have an Account?
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
