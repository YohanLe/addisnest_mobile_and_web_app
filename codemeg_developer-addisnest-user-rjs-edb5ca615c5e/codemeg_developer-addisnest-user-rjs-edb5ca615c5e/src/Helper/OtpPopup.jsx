import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SvgBackIcon } from "../assets/svg-files/SvgFiles";
import NewPasswordPopup from "./NewPasswordPopup";
import OTPInput from "react-otp-input";
import Api from "../Apis/Api";
import { toast } from "react-toastify";
import { AuthUserDetails } from "../Redux-store/Slices/AuthSlice";
import { useDispatch } from "react-redux";
const OtpPopup = ({ handlePopup, SendData }) => {
    
    const dispatch = useDispatch();
    const inputRefs = useRef([]);
    const [Loading, setLoading] = useState(false);
    const [ItemData, setItemData] = useState('');
    const [otp, setOtp] = useState('');
    const [Showotp, setShowotp] = useState(SendData?.otp);
    const [showNewPasswordPopup, setNewPasswordPopup] = useState(false);
    const handleNewPasswordPopupToggle = (data) => {
        setItemData(data)
        setNewPasswordPopup((prev) => !prev);
    };

    const OtpVerifyfun = async () => {
        if (SendData?.pagetype === 'register page') {
            Otpverfiyfun();
        } else {
            OtpForgetverfiyfun();
        }
    }

    const Otpverfiyfun = async () => {
        if (otp == '') {
            toast.error('Please enter a valid OTP');
        } else {
            let body = {
                email: SendData?.email,
                otp: otp,
                name: SendData?.name,
                password: SendData?.password,
                confirm_password: SendData?.confirm_password,
                role: SendData?.role,
            }
            try {
                setLoading(true)
                const response = await Api.post("auth/verify-otp", body)
                setLoading(false)
                const { data, message ,token} = response;
                localStorage.setItem('access_token',token);
                localStorage.setItem('isLogin', '1')
                localStorage.setItem("userId", data?.id);
                handlePopup();
                window.location.reload();
                dispatch(AuthUserDetails());
                if (data?.role=='AGENT') {
                    navigate('/')
                } else {
                    navigate('/')
                }
                toast.success(message);
            } catch (error) {
                console.log(error)
                toast.error(error.response.data.message);
                setLoading(false)
            }
        }
    };
    const OtpForgetverfiyfun = async () => {
        if (otp.length != 6) {
            toast.error('Please enter otp');
        } else {
            try {
                let body = {
                    otp: otp,
                    email: SendData?.email,
                }
                setLoading(true);
                const response = await Api.post("auth/verify-otp", body);
                const { user, message, data, token } = response;
                setLoading(false);
                toast.success(message);
                let sendData = {
                    email: SendData?.email,
                    otp: otp,
                }
                handleNewPasswordPopupToggle(sendData);
            } catch (error) {
                setLoading(false);
                toast.error(error?.response?.data?.message);
            }
        }
    }

    const ResendOtpFun = async () => {
        if (SendData?.pagetype === 'register page') {
            ResndRegisOtpFun();
        } else {
            ResendForgot();
        }
    }

    const ResendForgot = async () => {

        let body = {
            email: SendData?.email,
        }
        try {
            setLoading(true)
            const response = await Api.post("auth/forgot-password", body);
            const { data, status, message } = response;
            setShowotp(data?.otp)
            toast.success(message);

        } catch (error) {
            setLoading(false)
            toast.error(error.message);
        }
    };


    const ResndRegisOtpFun = async () => {
        try {
            let body = {
                email: SendData?.email,
                name: SendData?.name,
                password: SendData?.password,
                confirm_password: SendData?.confirm_password,
                role: SendData?.role,
            }
            let formData = new FormData();
            for (let key in body) {
                formData.append(key, body[key]);
            }
            setLoading(true);
            const response = await Api.post("auth/register", body);
            const { data } = response;
            setShowotp(data?.otp)

        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
            setLoading(false);
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
                                    <Link to="#" onClick={handlePopup}>
                                        <SvgBackIcon />
                                    </Link>
                                </div>
                                <div className="popup-title">
                                    <h3>Enter OTP</h3>
                                </div>
                                <div className="close-icon"></div>
                            </div>
                            <div className="popup-body">
                                <div className="auth-main">
                                    <div className="auth-heading">
                                        <p>
                                            Enter <span>SIX</span>digit code we have sent to your
                                            email address to <span>{SendData?.email}: {Showotp}</span> verify your new <span>Addisnest</span>
                                            Account
                                        </p>
                                    </div>
                                    <div className="otp-input">
                                        <OTPInput
                                            value={otp}
                                            onChange={setOtp}
                                            numInputs={6}
                                            renderSeparator={""}
                                            skipDefaultStyles={true}
                                            renderInput={(props) => (
                                                <input
                                                    {...props}
                                                    placeholder="-"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    onKeyPress={(e) => {
                                                        if (!/[0-9]/.test(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                    {/* </div> */}
                                    <div className="auth-btn">
                                        <button
                                            className="btn btn-primary"
                                            // onClick={handleNewPasswordPopupToggle}
                                            onClick={OtpVerifyfun}
                                        >
                                            Verify & Continue
                                        </button>
                                        <div className="dnthve-account">
                                            <p>
                                                Didn’t Recieve Code ?<a onClick={() => ResendOtpFun()} >Resend Otp</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="popup-overlay" onClick={handlePopup}></div>
            </div>
            {showNewPasswordPopup && (
                <NewPasswordPopup handlePopup={handleNewPasswordPopupToggle} ItemData={ItemData} />
            )}
        </>
    );
};

export default OtpPopup;
