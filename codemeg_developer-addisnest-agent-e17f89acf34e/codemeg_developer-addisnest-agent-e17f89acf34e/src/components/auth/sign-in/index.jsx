import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../../Apis/Api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AuthUserDetails } from "../../../Redux-store/Slices/AuthSlice";
import { validateLogin } from "../../../utils/Validation";
import { AuthImage } from "../../../assets/images";
const index = () => {
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
                let formData = new FormData();
                for (let key in body) {
                    formData.append(key, body[key]);
                }

                setLoading(true);
                const response = await Api.post("auth/login", body);
                const { data, message } = response;
                localStorage.setItem('access_token', data?.token);
                localStorage.setItem('isLogin', '1')
                localStorage.setItem("userId", data?.userId,);
                dispatch(AuthUserDetails());
                navigate('/')
                toast.success(message);

            } catch (error) {
                const { response } = error;
                const { data, status, message } = response;
                toast.error(data.message);
                setLoading(false);
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
                                                        <label for="">
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
                                                    Login
                                                </button>
                                            </div>
                                            {/* <div className="auth-btm">
                                                <p>
                                                    Don’t have an Account?
                                                    <Link to='/sign-up'>
                                                        Register
                                                    </Link>
                                                </p>
                                            </div> */}
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
