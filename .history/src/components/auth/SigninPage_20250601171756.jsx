import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../Apis/Api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AuthUserDetails } from "../../Redux-store/Slices/AuthSlice";
import { validateLogin } from "../../utils/Validation";
import { AuthImage } from "../../assets/images";

const SigninPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [error, setError] = useState({ isValid: false });
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
    const Loginfun = async () => {
        const errorMessage = validateLogin(inps);
        if (errorMessage.isValid == false) {
            setError(errorMessage);
        } else {
            try {
                let body = {
                    email: inps.email,
                    password: inps.password,
                }

                console.log('🔐 Starting login process...');
                console.log('📧 Email:', inps.email);
                console.log('🌐 API Base URL:', import.meta.env.VITE_BASEURL);
                console.log('🔗 Full Login URL:', import.meta.env.VITE_BASEURL + 'auth/login');
                console.log('📱 Online Status:', navigator.onLine);

                setLoading(true);
                
                // Test network connectivity first
                if (!navigator.onLine) {
                    throw new Error('No internet connection detected. Please check your network settings.');
                }

                const response = await Api.post("auth/login", body);
                console.log('✅ Login successful:', response);
                
                const { data, message } = response;
                localStorage.setItem('access_token', data?.token);
                localStorage.setItem('isLogin', '1')
                localStorage.setItem("userId", data?.userId,);
                dispatch(AuthUserDetails());
                setLoading(false);
                navigate('/')
                toast.success(message);

            } catch (error) {
                console.error('❌ Login Error Details:', {
                    status: error?.response?.status,
                    statusText: error?.response?.statusText,
                    message: error?.message,
                    data: error?.response?.data,
                    code: error?.code,
                    name: error?.name
                });

                setLoading(false);
                
                const { response } = error;
                let errorMessage = 'Login failed. Please try again.';
                
                if (response) {
                    // Server responded with error
                    const { status, data } = response;
                    
                    if (status === 401) {
                        errorMessage = 'Invalid email or password. Please check your credentials.';
                    } else if (status === 403) {
                        errorMessage = 'Access denied. Please contact administrator.';
                    } else if (status === 404) {
                        errorMessage = 'Login service not found. Please contact support.';
                    } else if (status === 429) {
                        errorMessage = 'Too many login attempts. Please try again later.';
                    } else if (status >= 500) {
                        errorMessage = 'Server error. Please try again in a few moments.';
                    } else {
                        errorMessage = data?.message || `Server error (${status}). Please try again.`;
                    }
                } else if (error?.code === 'NETWORK_ERROR' || error?.message === 'Network Error') {
                    errorMessage = 'Network connection failed. Please check your internet connection and try again.';
                } else if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
                    errorMessage = 'Connection timed out. Please check your internet connection and try again.';
                } else if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
                    errorMessage = 'Unable to connect to server. Please check if the server is running and try again.';
                } else if (!navigator.onLine) {
                    errorMessage = 'You appear to be offline. Please check your internet connection.';
                } else {
                    // Generic error handling
                    errorMessage = error?.message || 'Network error. Please check your connection and try again.';
                }
                
                toast.error(errorMessage, {
                    autoClose: 5000,
                    hideProgressBar: false,
                });
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
            <div className="auth-wrapper">
                <div className="auth-wrapper-inner">
                    <div className="auth-flex">
                        <div className="auth-flex-50">
                            <div className="auth-main">
                                <div className="auth-card">
                                    <div className="auth-card-body">
                                        <div className="auth-card-body-inner">
                                            <div className="login-innerheading">
                                                <h3>Login</h3>
                                                <p>Welcome to Addisnest </p>
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
                                                            onChange={onInpChanged}
                                                            value={inps?.email}
                                                            className={`${error.errors?.email ? "alert-input" : ""}`}
                                                        />
                                                        {error.errors?.email && <p className="error-input-msg">{error.errors?.email}</p>}
                                                    </div>
                                                </div>
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
                                                        </div>
                                                        {error.errors?.password && <p className="error-input-msg">{error.errors?.password}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="frgot-btn">
                                                <Link to="/forgot-password">Forgot Password?</Link>
                                            </div>
                                            <div className="auth-btn">
                                                <button onClick={Loginfun} className="btn btn-primary">
                                                    {Loading ? "Processing..." : "Login"}
                                                </button>
                                            </div>
                                            <div className="auth-btm">
                                                <p>
                                                    Don't have an Account?
                                                    <Link to='/sign-up'>
                                                        Register
                                                    </Link>
                                                </p>
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

export default SigninPage;
