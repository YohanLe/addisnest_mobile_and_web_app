import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSubscription, clearCreateStatus } from "../Redux-store/Slices/SubscriptionSlice";

const AddSubscriptionPopup = ({ handlePopup }) => {
  const dispatch = useDispatch();
  const { createLoading, createError, createSuccess } = useSelector((state) => state.Subscription);

  const [planName, setPlanName] = useState("");
  const [days, setDays] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (createSuccess) {
      // Close popup on successful creation
      setTimeout(() => {
        dispatch(clearCreateStatus());
        handlePopup();
      }, 1500);
    }
  }, [createSuccess, dispatch, handlePopup]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!planName || !days || !amount) {
      alert("Please fill all fields");
      return;
    }
    dispatch(createSubscription({ planName, days: Number(days), amount: Number(amount) }));
  };

  return (
    <>
      <div className="main-popup action-modal subscription-modal">
        <div className="lm-outer">
          <div className="lm-inner">
            <div className="popup-inner">
              <div className="popup-heading">
                <h3>Add Subscription</h3>
              </div>
              <div className="popup-body">
                <form className="subscription-form" onSubmit={handleSubmit}>
                  <div className="form-flex">
                    <div className="form-flex-inner-100">
                      <div className="single-input">
                        <label htmlFor="planName" className="form-label">
                          Plan Name
                        </label>
                        <input
                          id="planName"
                          placeholder="Enter Plan Name"
                          value={planName}
                          onChange={(e) => setPlanName(e.target.value)}
                          disabled={createLoading}
                        />
                      </div>
                    </div>
                    <div className="form-flex-inner-100">
                      <div className="single-input">
                        <label htmlFor="days" className="form-label">
                          Days
                        </label>
                        <input
                          id="days"
                          type="number"
                          placeholder="Enter Days"
                          value={days}
                          onChange={(e) => setDays(e.target.value)}
                          disabled={createLoading}
                        />
                      </div>
                    </div>
                    <div className="form-flex-inner-100">
                      <div className="single-input">
                        <label htmlFor="amount" className="form-label">
                          Amount
                        </label>
                        <input
                          id="amount"
                          type="number"
                          placeholder="Enter Amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          disabled={createLoading}
                        />
                      </div>
                    </div>
                  </div>
                  {createError && <div className="error-message" style={{ color: "red", marginTop: "10px" }}>{createError}</div>}
                  {createSuccess && <div className="success-message" style={{ color: "green", marginTop: "10px" }}>{createSuccess}</div>}
                  <div className="addsubscription-btn">
                    <button className="btn btn-primary" type="submit" disabled={createLoading}>
                      {createLoading ? "Adding..." : "Add"}
                    </button>
                    <button className="btn btn-secondary" type="button" onClick={handlePopup} disabled={createLoading}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="popup-overlay" onClick={handlePopup}></div>
      </div>
    </>
  );
};

export default AddSubscriptionPopup;
