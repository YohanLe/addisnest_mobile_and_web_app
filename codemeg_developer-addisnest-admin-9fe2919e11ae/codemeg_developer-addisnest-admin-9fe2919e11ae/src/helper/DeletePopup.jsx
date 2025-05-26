import React from "react";
import { SvgActionTrashIcon } from "../assets/svg/Svg";

const DeletePopup = ({ handlePopup,handleDeleteConfirm  }) => {
  return (
    <>
      <div className="main-popup action-modal delete-modal">
        <div className="lm-outer">
          <div className="lm-inner">
            <div className="popup-inner">
              <div className="popup-body">
                <div className="modal-common">
                  <div className="modal-common-dtls">
                    <div className="circle-modal-icon danger-circle">
                      <span>
                        <SvgActionTrashIcon />
                      </span>
                    </div>
                    <h3>Delete</h3>
                    <p>Are you sure you want to delete ?</p>
                  </div>
                    <div className="modal-btn">
                      <button
                        className="btn btn-primary"
                        onClick={handleDeleteConfirm}
                      >
                        Yes, Delete
                      </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="popup-overlay" onClick={handleDeleteConfirm}></div>
      </div>
    </>
  );
};

export default DeletePopup;
