import React, { useState } from "react";

const ChangePassword = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!isConfirmPasswordVisible);
  };
  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!isNewPasswordVisible);
  };
  return (
    <>
      <div className="change-password-main">
        <div className="card-body">
          <div className="form-flex">
            <div className="form-flex-inner-100">
              <div className="single-input">
                <label className="form-label">
                  Old Password<i>*</i>
                </label>
                <div className="password-inputs">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Enter Your Password"
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
              </div>
            </div>
            <div className="form-flex-inner-50">
              <div className="single-input">
                <label className="form-label">
                  New Password<i>*</i>
                </label>
                <div className="password-inputs">
                  <input
                    type={isNewPasswordVisible ? "text" : "password"}
                    placeholder="Enter Your Password"
                  />
                  <div
                    className="pwd-icon"
                    onClick={toggleNewPasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    {isNewPasswordVisible ? (
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
              </div>
            </div>
            <div className="form-flex-inner-50">
              <div className="single-input">
                <label className="form-label">
                  Confirm Password<i>*</i>
                </label>
                <div className="password-inputs">
                  <input
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    placeholder="Enter Your Password"
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
              </div>
            </div>
          </div>
          <div className="frm-btn-main">
            <div className="changepassword-link">
              <button
                type="button"
                className="btn btn-primary"
                // onClick={handleButtonClick}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
