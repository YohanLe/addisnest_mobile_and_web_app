import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSubscription, clearUpdateStatus } from "../Redux-store/Slices/SubscriptionSlice";

const EditSubscriptionPopup = ({ subscription, handlePopup, refreshList }) => {
  const dispatch = useDispatch();
  const { updateLoading, updateError, updateSuccess } = useSelector((state) => state.Subscription);

  const [planName, setPlanName] = useState("");
  const [days, setDays] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (subscription) {
      setPlanName(subscription.planName || "");
      setDays(subscription.days || "");
      setAmount(subscription.amount || "");
    }
  }, [subscription]);

  useEffect(() => {
    if (updateSuccess) {
      refreshList();
      handlePopup();
      dispatch(clearUpdateStatus());
    }
  }, [updateSuccess, refreshList, handlePopup, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!planName || !days || !amount) {
      alert("Please fill all fields");
      return;
    }
    dispatch(updateSubscription({
      id: subscription.id,
      data: { planName, days, amount }
    }));
  };

  return (
    <>
      <div className="main-popup action-modal subscription-modal">
        <div className="lm-outer">
          <div className="lm-inner">
            <div className="popup-inner">
              <div className="popup-heading">
                <h3>Edit Subscription</h3>
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
                          placeholder="Enter Days"
                          value={days}
                          onChange={(e) => setDays(e.target.value)}
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
                          placeholder="Enter Amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="addsubscription-btn">
                    <button type="submit" className="btn btn-primary" disabled={updateLoading}>
                      {updateLoading ? "Updating..." : "Update"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handlePopup}>
                      Cancel
                    </button>
                  </div>
                  {updateError && <p className="text-danger mt-2">{updateError}</p>}
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

export default EditSubscriptionPopup;
