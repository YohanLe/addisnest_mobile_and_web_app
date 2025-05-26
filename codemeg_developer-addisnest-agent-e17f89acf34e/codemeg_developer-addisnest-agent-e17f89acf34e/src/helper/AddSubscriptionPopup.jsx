import React from "react";

const AddSubscriptionPopup = ({ handlePopup }) => {
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
                <div className="subscription-form">
                  <div className="form-flex">
                    <div className="form-flex-inner-100">
                      <div className="single-input">
                        <label for="" className="form-label">
                          Plan Name
                        </label>
                        <input placeholder="Enter Plan Name" />
                      </div>
                    </div>
                    <div className="form-flex-inner-100">
                      <div className="single-input">
                        <label for="" className="form-label">
                          Days
                        </label>
                        <input placeholder="Enter Days" />
                      </div>
                    </div>
                    <div className="form-flex-inner-100">
                      <div className="single-input">
                        <label for="" className="form-label">
                          Amount
                        </label>
                        <input placeholder="Enter Amount" />
                      </div>
                    </div>
                  </div>
                  <div className="addsubscription-btn">
                    <button className="btn btn-primary">Add</button>
                    <button className="btn btn-secondary" onClick={handlePopup}>Cancel</button>
                  </div>
                </div>
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
