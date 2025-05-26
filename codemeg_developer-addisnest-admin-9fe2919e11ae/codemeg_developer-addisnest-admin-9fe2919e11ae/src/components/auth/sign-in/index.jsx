import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AuthImage } from "../../../assets/images";
import Api from "../../../Apis/Api";
import { AuthUserDetails } from "../../../Redux-store/Slices/AuthSlice";
import { validateLogin } from "../../../utils/Validation";
import { jwtDecode } from "jwt-decode";

const index = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState({ isValid: false });
  const [inps, setInps] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const onInpChanged = (event) => {
    setError((p) => {
      const obj = { ...p };
      obj?.errors && delete obj?.errors[event?.target?.name];
      return obj;
    });
    setInps((prevInputs) => ({
      ...prevInputs,
      [event.target.name]: event.target.value,
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      Loginfun();
    }
  };

  const Loginfun = async () => {
    const errorMessage = validateLogin(inps);
    if (errorMessage.isValid === false) {
      setError(errorMessage);
    } else {
      try {
        let body = {
          email: inps.email,
          password: inps.password,
        };

        setLoading(true);
        const response = await Api.post("auth/login", body);
        const { data, message } = response;

        // 👇 Decode token
        const decoded = jwtDecode(data?.token);
        console.log("Decoded Token Info:", decoded);

        // ✅ Role check
        if (decoded.role?.toLowerCase() !== "admin") {
          toast.error("Only admin can login!");
          setLoading(false);
          return;
        }


        // ✅ Proceed if role is admin
        localStorage.setItem("access_token", data?.token);
        localStorage.setItem("isLogin", "1");
        localStorage.setItem("userId", data?.userId);

        dispatch(AuthUserDetails());
        navigate("/");
        toast.success(message);
      } catch (error) {
        const { response } = error;
        toast.error(response?.data?.message || "Login failed!");
        setLoading(false);
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
                        <h3>Login</h3>
                        <p>Welcome to Addisnest Admin Dashboard</p>
                      </div>
                      <div className="form-flex">
                        <div className="form-flex-inner-100">
                          <div className="single-input">
                            <label htmlFor="email">
                              Email<i>*</i>
                            </label>
                            <input
                              type="email"
                              name="email"
                              placeholder="Enter Your Email ID"
                              value={inps.email}
                              onChange={onInpChanged}
                              className={error.errors?.email ? "alert-input" : ""}
                            />
                            {error.errors?.email && (
                              <p className="error-input-msg">{error.errors.email}</p>
                            )}
                          </div>
                        </div>
                        <div className="form-flex-inner-100">
                          <div className="single-input">
                            <label htmlFor="password">
                              Password<i>*</i>
                            </label>
                            <div className="password-inputs">
                              <input
                                type={isPasswordVisible ? "text" : "password"}
                                name="password"
                                placeholder="Enter Your Password"
                                value={inps.password}
                                onChange={onInpChanged}
                                onKeyDown={handleKeyDown}
                                className={error.errors?.password ? "alert-input" : ""}
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
                            {error.errors?.password && (
                              <p className="error-input-msg">{error.errors.password}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="frgot-btn">
                        <Link to="/forgot-password">Forgot Password?</Link>
                      </div>
                      <div className="auth-btn">
                        <button onClick={Loginfun} className="btn btn-primary" disabled={Loading}>
                          {Loading ? "Logging in..." : "Login"}
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
