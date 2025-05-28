import React from "react";

const EditSubscriptionPopup = ({ handlePopup }) => {
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
                <div className="subscription-form">
                  <div className="form-flex">
                    <div className="form-flex-inner-100">
                      <div className="single-input">
                        <label for="" className="form-label">
                          Plan Name
                        </label>
                        <input placeholder="Enter Plan Name" value={'VIP Plan'} />
                      </div>
                    </div>
                    <div className="form-flex-inner-100">
                      <div className="single-input">
                        <label for="" className="form-label">
                          Days
                        </label>
                        <input placeholder="Enter Days" value={'8 days'}/>
                      </div>
                    </div>
                    <div className="form-flex-inner-100">
                      <div className="single-input">
                        <label for="" className="form-label">
                          Amount
                        </label>
                        <input placeholder="Enter Amount"  value={'200'}/>
                      </div>
                    </div>
                  </div>
                  <div className="addsubscription-btn">
                    <button className="btn btn-primary">Update</button>
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

export default EditSubscriptionPopup;
