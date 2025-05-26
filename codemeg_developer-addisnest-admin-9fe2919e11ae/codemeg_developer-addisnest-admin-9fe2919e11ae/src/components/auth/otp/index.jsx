import React, { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Api from "../../../Apis/Api";
import { AuthImage } from "../../../assets/images";

const index = () => {
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const IsfromLogin = location?.state?.fromLogin;
    const [ShowOpt, setShowOpt] = useState(state?.otp);
    const [Loading, setLoading] = useState(false);
    const [Holedata, setHoledata] = useState(state);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    const handleInput = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        if (value) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            const newOtp = [...otp];
            if (otp[index] === "") {
                if (index > 0) {
                    inputRefs.current[index - 1].focus();
                }
            }
            newOtp[index] = "";
            setOtp(newOtp);
        }
    };

    const ForgotVerifyotpfun = async () => {
        const finalOtp = otp.join("");
        if (finalOtp.length < 6) {
            toast.error("Please enter a valid 6-digit OTP");
        } else {
            let body = {
                email: Holedata?.email,
                otp: finalOtp,
            };
            try {
                setLoading(true);
                const response = await Api.post("auth/verify-otp", body);
                const { data, status, message } = response;
                setLoading(false);
                toast.success(message);
                navigate("/new-password", {
                    state: {
                        email: Holedata.email,
                        otp: finalOtp,
                        fromLogin: true,
                    },
                });
            } catch (error) {
                toast.error(error?.response?.data?.message || "Invalid OTP");
                setLoading(false);
            }
        }
    };

    const Resend = async () => {
        let body = {
            email: Holedata?.email,
        };
        try {
            setLoading(true);
            const response = await Api.post("auth/forgot-password", body);
            const { data, status, message } = response;
            setLoading(false);
            setShowOpt(data.otp);
            toast.success(message);
        } catch (error) {
            setLoading(false);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };

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
                                                <h3>Verification Code: {ShowOpt}</h3>
                                                <p>Enter the code that was sent to your email. {Holedata?.email}</p>
                                            </div>
                                            <div className="input-otp-flx">
                                                {Array(6).fill().map((_, index) => (
                                                    <div className="single-input" key={index}>
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            maxLength="1"
                                                            placeholder="-"
                                                            value={otp[index]}
                                                            ref={(el) => (inputRefs.current[index] = el)}
                                                            onInput={(e) => handleInput(e, index)}
                                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="auth-btn">
                                                <button
                                                    onClick={ForgotVerifyotpfun}
                                                    className="btn btn-primary"
                                                >
                                                    Verify
                                                </button>
                                            </div>
                                            <div className="frgot-btn resend-code">
                                                <a onClick={Resend}>Resend code</a>
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
                                            <h3>Welcome to Addisnest</h3>
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
