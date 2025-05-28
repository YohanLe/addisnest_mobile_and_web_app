import React, { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import OTPInput from "react-otp-input";
import { toast } from "react-toastify";
import Api from "../../../Apis/Api";
import { AuthImage } from "../../../assets/images";

const index = () => {
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const IsfromLogin = location?.state?.fromLogin
    const [otp, setOtp] = useState('');
    const [ShowOpt, setShowOpt] = useState(state?.otp);
    const [Loading, setLoading] = useState(false);
    const [Holedata, setHoledata] = useState(state);

    const ForgotVerifyotpfun = async () => {
        if (otp == '') {
            toast.error('Please enter a valid OTP');
        } else {
            let body = {
                email: Holedata?.email,
                otp: otp
            }
            try {
                setLoading(true)
                const response = await Api.post("auth/verify-otp", body);
                const { data, status, message } = response;
                setLoading(false)
                navigate('/new-password', { state: { email: Holedata.email, otp: otp, fromLogin: true } })

                toast.success(message);

            } catch (error) {
                toast.error(error.response.data.message);
                setLoading(false)
            }
        }
    };
    const Resend = async () => {

        let body = {
            email: Holedata?.email,
        }
        try {
            setLoading(true)
            const response = await Api.post("auth/forgot-password", body);
            const { data, status, message } = response;
            setLoading(false)
            setShowOpt(data.otp)
            toast.success(message);
        } catch (error) {
            setLoading(false)
            toast.error(error.response.data.message);
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
                                                <h3>Verification Code:{ShowOpt}</h3>
                                                <p>Enter the code that was sent to your email.{Holedata?.email}</p>
                                            </div>
                                            {/* <div className="input-otp-flx">
                                                {Array(4)
                                                    .fill()
                                                    .map((_, index) => (
                                                        <div className="single-input" key={index}>
                                                            <input
                                                                type="text"
                                                                inputMode="numeric"
                                                                maxLength="1"
                                                                placeholder="-"
                                                                ref={(el) => (inputRefs.current[index] = el)}
                                                                onInput={(e) => handleInput(e, index)}
                                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                            />
                                                        </div>
                                                    ))}
                                            </div> */}
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
                                            <div className="auth-btn">
                                                <button onClick={() => { ForgotVerifyotpfun() }} to="/new-password" className="btn btn-primary">
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
