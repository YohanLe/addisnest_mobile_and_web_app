import React from "react";
import { SvgDeleteIcon } from "../assets/svg-files/SvgFiles";

const DeletePopup = ({ handlePopup }) => {
  return (
    <div className="main-popup logout-popup">
      <div className="lm-outer">
        <div className="lm-inner">
          <div className="popup-inner">
            <div className="card-body">
              <div className="logout-icon">
                <SvgDeleteIcon />
              </div>
              <div className="logout-title">
                <h3>Delete</h3>
                <p>Are you sure you want to Delete?</p>
              </div>
              <div className="logoutpopup-btn">
                <button className="btn btn-secondary" onClick={handlePopup}>
                  Not Now
                </button>
                <button className="btn btn-primary" onClick={handlePopup}>
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="popup-overlay" onClick={handlePopup}></div>
    </div>
  );
};

export default DeletePopup;
