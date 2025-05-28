import React from "react";

const ProfileTab = () => {
  return (
    <>
      <div className="profile-detail">
        <div className="card-body">
          <div className="form-main">
            <div className="form-flex">
              <div className="form-flex-inner-50">
                <div className="single-input">
                  <label for="" className="form-label">
                    Name <i>*</i>
                  </label>
                  <input type="email" placeholder="Enter Your " />
                </div>
              </div>
              <div className="form-flex-inner-50">
                <div className="single-input">
                  <label for="" className="form-label">
                    Address <i>*</i>
                  </label>
                  <input type="email" placeholder="Enter Your" />
                </div>
              </div>
              <div className="form-flex-inner-50">
                <div className="single-input">
                  <label for="" className="form-label">
                    Phone Number <i>*</i>
                  </label>
                  <input type="email" placeholder="Enter Your" />
                </div>
              </div>
              <div className="form-flex-inner-50">
                <div className="single-input">
                  <label for="" className="form-label">
                    Address Email<i>*</i>
                  </label>
                  <input type="email" placeholder="Enter Your" />
                </div>
              </div>
            </div>
            <div className="form-btn">
              {/* <button type="button" className="btn secondary-btn">
                Cancel
              </button> */}
              <button type="button" className="btn btn-primary">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileTab;
