import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Api from "../../../Apis/Api";
import { toast } from "react-toastify";
import { ValidateResetpassword } from "../../../utils/Validation";
import { AuthImage } from "../../../assets/images";
const index = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState({ isValid: false });
    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!isConfirmPasswordVisible);
    };

    const [inps, setInps] = useState({
        password: "",
        confirm_password: ""
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
        if (errorMessage.isValid == false) {
            setError(errorMessage);
        } else {
            try {
                let body = {
                    email: state.email,
                    password: inps?.password,
                    confirm_password: inps?.confirm_password,
                }
                setLoading(true);
                const response = await Api.post("auth/reset-password", body);
                const { data } = response;
                setLoading(false);
                navigate('/')
            } catch (error) {
                console.log(error)
                setLoading(false);
                toast.error(error?.response?.data?.message);
            }
        }

    }
    return (
        <>
            <div className="auth-wrapper">
                <div className="auth-wrapper-inner">
                    <div className="auth-flex">
                        <div className="auth-flex-50">
                            <div className="auth-main">
                                <div className="auth-card">
                                    <div className="auth-card-body">
                                        <div className="auth-card-body-inner">
                                            <div className="login-innerheading">
                                                <h3>New Password</h3>
                                                <p>Please enter and confirm your new password.</p>
                                            </div>
                                            <div className="form-flex">
                                                <div className="form-flex-inner-100">
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
                                                <div className="form-flex-inner-100">
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
                                                <button onClick={Resetpasswordfun} className="btn btn-primary">
                                                    Continue
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="auth-flex-50">
                            <div className="auth-discrption">
                                <div className="auth-discrption-inner">
                                    <div className="auth-discrption-main">
                                        <div className="auth-heading-content">
                                        <h3>
                                                Welcome to Addisnest
                                            </h3>
                                            {/* <p>
                                                Unlock powerful insights with customer feedback
                                                analytics and campaign management.
                                            </p> */}
                                        </div>
                                        <div className="auth-description-image">
                                            <img src={AuthImage} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default index;
