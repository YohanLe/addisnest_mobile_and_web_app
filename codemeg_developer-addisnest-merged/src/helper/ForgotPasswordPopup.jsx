import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SvgBackIcon } from "../assets/svg-files/SvgFiles";
import RegisterPopup from "./RegisterPopup";
import OtpPopup from "./OtpPopup";
import Api from "../Apis/Api";
import { toast } from "react-toastify";

const ForgotPasswordPopup = ({ handlePopup }) => {
    const [showOtpPopup, setOtpPopup] = useState(false);

    const [SendData, setSendData] = useState('');
    const navigate = useNavigate();
    const [Loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [InputData, setInputData] = useState({
        email: "",
    });
    const handleInputChange = (event) => {
        setInputData((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
        setIsValid(validateEmail(event.target.value));
    };

    const validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const forgotpassword = async () => {
        if (InputData.email == '') {
            setIsValid(false)
        } else if (isValid) {
            let body = {
                email: InputData.email,
            }
            try {
                setLoading(true)
                const response = await Api.post("auth/forgot-password", body);
                const { data, status, message } = response;
                console.log(response)
                setLoading(false)
                let sendData={
                    email: InputData?.email,
                    otp:data?.otp,
                    pagetype:'forgot page'
                }
                handleOtpPopupToggle(sendData)
                toast.success(message);
            } catch (error) {
                setLoading(false)
                toast.error(error.response.data.message);
            }
        }
    };

    const handleOtpPopupToggle = (data) => {
        setSendData(data)
        setOtpPopup((prev) => !prev);
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
                                    <h3>Forgot Password</h3>
                                </div>
                                <div className="close-icon"></div>
                            </div>
                            <div className="popup-body">
                                <div className="auth-main">
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
                                                    value={InputData?.email ? InputData?.email : ""}
                                                    onChange={handleInputChange}
                                                    className={`form-control ${!isValid == true ? "alert-input" : ""}`}
                                                />
                                                 {!isValid && <p style={{ color: 'red' }}>Please enter your valid email ID.</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="auth-btn">
                                        <button
                                            className="btn btn-primary"
                                            // onClick={handleOtpPopupToggle}
                                            onClick={forgotpassword}
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="popup-overlay" onClick={handlePopup}></div>
            </div>
            {showOtpPopup && <OtpPopup handlePopup={handleOtpPopupToggle} SendData={SendData}/>}
        </>
    );
};

export default ForgotPasswordPopup;
