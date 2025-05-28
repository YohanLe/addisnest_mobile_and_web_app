import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    SvgAppleIcon,
    SvgCloseIcon,
    SvgGoogleIcon,
} from "../assets/svg-files/SvgFiles";
import LogInpopup from "./LogInpopup";
import { ValidateSignup } from "../utils/Validation";
import Api from "../Apis/Api";
import { toast } from "react-toastify";
import OtpPopup from "./OtpPopup";
const RegisterPopup = ({ handlePopup }) => {
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("customer");
    const [showLogInpopup, setLogInpopup] = useState(false);
    const [showOtpPopup, setOtpPopup] = useState(false);
    const [SendData, setSendData] = useState('');
    const [Loading, setLoading] = useState(false);
    const [error, setError] = useState({ isValid: false });
    
    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!isConfirmPasswordVisible);
    };
   
    const handleLogInpopupToggle = () => {
        setLogInpopup((prev) => !prev);
    };
  
    const handleOtpPopupToggle = (data) => {
        setSendData(data)
        setOtpPopup((prev) => !prev);
    };
    

    const [inps, setInps] = useState({
        name:"",
        email: '',
        password: "",
        confirm_password:""
    })

    const onInpChanged = (event) => {
        setError(p => {
            const obj = { ...p }
            obj?.errors && delete obj?.errors[event?.target?.name]
            return obj
        })
        setInps((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
    };

    const RegistrationFun = async () => {
        const errorMessage = ValidateSignup(inps);
        if (errorMessage.isValid == false) {
            setError(errorMessage);
        } else {
           
            try {
                let usertype = activeTab === "agent" ? "AGENT" : "CUSTOMER";
                let body = {
                    name:inps.name,
                    email:inps.email,
                    password:inps.password,
                    confirm_password:inps.confirm_password,
                    role:usertype
                }
                let formData = new FormData();
                for (let key in body) {
                    formData.append(key, body[key]);
                }
                setLoading(true);
                const response = await Api.post("auth/register", body);
                const { data, otp,currency_name, userId, message, token, role } = response;
                // handlePopup();
                let sendData={
                    email:inps.email,
                    otp:data?.otp,
                    role:usertype,
                    name:inps.name,
                    password:inps.password,
                    confirm_password:inps.confirm_password,
                    pagetype:'register page'
                }
                handleOtpPopupToggle(sendData)
            } catch (error) {
                console.log(error)
                toast.error(error.response.data.message);
                setLoading(false);
            }
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
                                    <h3>Register</h3>
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
                                                    Full Name<i>*</i>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="Enter Your Full Name"
                                                    onChange={onInpChanged}
                                                    value={inps?.name}
                                                    className={`${error.errors?.email ? "alert-input" : ""}`}
                                                />
                                                 {error.errors?.name && <p className="error-input-msg">{error.errors?.name}</p>}
                                            </div>
                                        </div>
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
                                                        name="password"
                                                        placeholder="Enter Your Password"
                                                        onChange={onInpChanged}
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
                                                </div>
                                                {error.errors?.password && <p className="error-input-msg">{error.errors?.password}</p>}
                                            </div>
                                        </div>
                                        <div className="form-inner-flx-100">
                                            <div className="single-input">
                                                <label>
                                                    Confirm Password<i>*</i>
                                                </label>
                                                <div className="password-inputs">
                                                    <input
                                                        type={isConfirmPasswordVisible ? "text" : "password"}
                                                        placeholder="Enter Your Password"
                                                        name="confirm_password"
                                                        onChange={onInpChanged}
                                                        value={inps?.confirm_password}
                                                        className={`${error.errors?.confirm_password ? "alert-input" : ""}`}
                                                    />
                                                    <div
                                                        className="pwd-icon"
                                                        onClick={toggleConfirmPasswordVisibility}
                                                        style={{ cursor: "pointer" }}
                                                    >
                                                        {isConfirmPasswordVisible ? (
                                                            <span>
                                                                <i className="fa-regular fa-eye-slash"></i>
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                <i className="fa-regular fa-eye"></i>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {error.errors?.confirm_password && <p className="error-input-msg">{error.errors?.confirm_password}</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="auth-btn">
                                        <button onClick={RegistrationFun} className="btn btn-primary">Continue</button>
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
                                            Already have an Account?
                                            <Link to="#" onClick={handleLogInpopupToggle}>
                                                Login
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
            {showLogInpopup && <LogInpopup handlePopup={handleLogInpopupToggle} />}
            {showOtpPopup && <OtpPopup handlePopup={handleOtpPopupToggle} SendData={SendData}/>}
        </>
    );
};

export default RegisterPopup;
