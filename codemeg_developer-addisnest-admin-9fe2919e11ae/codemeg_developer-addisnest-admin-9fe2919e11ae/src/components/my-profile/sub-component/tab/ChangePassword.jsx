import React, { useState } from "react";
import Api from "../../../../Apis/Api";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);

  // New state variables for input values
  const [current_password, setCurrentPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!isConfirmPasswordVisible);
  };
  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!isNewPasswordVisible);
  };

  const handleChangePassword = async () => {
    if (!current_password || !new_password || !confirm_password) {
      toast.error("Please fill all the fields");
      return;
    }
    if (new_password !== confirm_password) {
      toast.error("New password and confirm password do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await Api.postWithtoken("auth/changePassword", {
        current_password,
        new_password,
        confirm_password,
      });
      toast.success("Password changed successfully");
      // Optionally clear inputs after success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to change password");
      }
    } finally {
      setLoading(false);
    }
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
                    value={current_password}
                    onChange={(e) => setCurrentPassword(e.target.value)}
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
                    value={new_password}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    value={confirm_password}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                onClick={handleChangePassword}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
