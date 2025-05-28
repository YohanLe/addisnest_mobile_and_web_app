import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { SvgBackIcon } from "../assets/svg-files/SvgFiles";
import { ValidateResetpassword } from "../utils/Validation";
import Api from "../Apis/Api";
import { toast } from "react-toastify";
const NewPasswordPopup = ({ handlePopup, ItemData }) => {
    const navigate = useNavigate();
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState({ isValid: false });
    const [loading,setLoading] =  useState(false);
  

    const [inps, setInps] = useState({
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

    const Resetpasswordfun = async () => {
        var errorMessage = ValidateResetpassword(inps);

        console.log('errorMessage________________',errorMessage)
        if (errorMessage.isValid == false) {
            setError(errorMessage);
        } else {
            try {
                let body = {
                    email: ItemData.email,
                    password:inps?.password,
                    confirm_password:inps?.confirm_password,
                }
                setLoading(true);
                const response = await Api.post("auth/reset-password", body);
                const { data } = response;
                setLoading(false);
                handlePopup();
                window.location.reload();
            } catch (error) {
                console.log(error)
                setLoading(false);
                toast.error(error?.response?.data?.message);
            }
        }

    }

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!isConfirmPasswordVisible);
    };
    return (
        <>
            <div className="main-popup action-modal auth-sign-modal">
                <div className="lm-outer">
                    <div className="lm-inner">
                        <div className="popup-inner">
                            <div className="popup-header">
                                <div className="back-icon">
                                    <Link to="#" onClick={handlePopup}>
                                        <SvgBackIcon />
                                    </Link>
                                </div>
                                <div className="popup-title">
                                    <h3>Set New Password</h3>
                                </div>
                                <div className="close-icon"></div>
                            </div>
                            <div className="popup-body">
                                <div className="auth-main">
                                    <div className="form-flex">
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
                                                        value={inps.password}
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
                                                        name='confirm_password'
                                                        onChange={onInpChanged}
                                                        value={inps.confirm_password}
                                                        
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
                                        <button onClick={Resetpasswordfun} className="btn btn-primary">Continue</button>
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

export default NewPasswordPopup;
