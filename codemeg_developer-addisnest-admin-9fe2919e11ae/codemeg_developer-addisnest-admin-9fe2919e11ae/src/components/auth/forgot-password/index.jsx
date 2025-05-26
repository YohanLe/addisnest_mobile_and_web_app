import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Api from "../../../Apis/Api";
import { toast } from "react-toastify";
import { AuthImage } from "../../../assets/images";

const index = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [Loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [InputData, setInputData] = useState({
        email: "",
    });

    const handleInputChange = (event) => {
        setInputData((prevInputs) => ({
            ...prevInputs,
            [event.target.name]: event.target.value
        }));
        setIsValid(validateEmail(event.target.value));
    };

    const validateEmail = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const forgotpassword = async () => {
        if (InputData.email === '') {
            setIsValid(false);
        } else if (isValid) {
            let body = {
                email: InputData.email,
            };
            try {
                setLoading(true);
                const response = await Api.post("auth/forgot-password", body);
                const { data, status, message } = response;
                console.log(response.data)
                setLoading(false);
                navigate('/otp', {
                    state: {
                        email: InputData.email,
                        otp: data?.otp,
                        fromLogin: true,
                    }
                });
                toast.success(message);
            } catch (error) {
                setLoading(false);
                toast.error(error?.response?.data?.message || "Something went wrong");
            }
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
                                                <h3>Forgot Password</h3>
                                                <p>Enter your email for verification code.</p>
                                            </div>
                                            <div className="form-flex">
                                                <div className="form-flex-inner-100">
                                                    <div className="single-input">
                                                        <label htmlFor="">
                                                            Email<i>*</i>
                                                        </label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            placeholder="Enter Your Email ID"
                                                            value={InputData.email}
                                                            onChange={handleInputChange}
                                                            className={`form-control ${!isValid ? "alert-input" : ""}`}
                                                        />
                                                        {!isValid && (
                                                            <p style={{ color: 'red' }}>
                                                                Please enter your valid email ID.
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="auth-btn">
                                                <button
                                                    onClick={forgotpassword}
                                                    className="btn btn-primary"
                                                    disabled={Loading}
                                                >
                                                    {Loading ? "Sending..." : "Get Code"}
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
