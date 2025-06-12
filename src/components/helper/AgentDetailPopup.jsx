import React from "react";
import { Link } from "react-router-dom";
import { SvgCloseIcon, SvgLocationIcon, SvgPhoneIcon } from "../assets/svg-files/SvgFiles";

const AgentDetailPopup = ({ handlePopup, ItemData }) => {
  if (!ItemData) {
    return null;
  }

  return (
    <div className="agent-detail-popup-main">
      <div className="agent-detail-popup">
        <div className="agent-detail-popup-inner">
          <button
            onClick={() => handlePopup()}
            type="button"
            className="close-button"
          >
            <SvgCloseIcon />
          </button>

          <div className="agent-details-content">
            <div className="agent-details-top">
              <div className="agent-profile-img">
                <span
                  style={{
                    backgroundImage: ItemData?.profile_img
                      ? `url(${ItemData.profile_img})`
                      : "none",
                  }}
                ></span>
              </div>

              <div className="agent-profile-info">
                <h3>{ItemData?.name || "Agent Name"}</h3>
                <p>
                  <span>
                    <SvgPhoneIcon />
                  </span>
                  {ItemData?.phone || "Phone not available"}
                </p>
                <p>
                  <span>
                    <SvgLocationIcon />
                  </span>
                  {ItemData?.address || "Address not available"}
                </p>
                <div className="agent-rating">
                  <span>
                    <svg
                      width="16"
                      height="14"
                      viewBox="0 0 16 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.99994 11.5996L11.4583 13.6913C12.0916 14.0746 12.8666 13.508 12.6999 12.7913L11.7833 8.85797L14.8416 6.20798C15.3999 5.72464 15.0999 4.80798 14.3666 4.74964L10.3416 4.40798L8.76661 0.691309C8.48327 0.0163086 7.51661 0.0163086 7.23327 0.691309L5.65827 4.39964L1.63327 4.74131C0.899939 4.79964 0.599938 5.71631 1.15827 6.19964L4.21661 8.84964L3.29994 12.783C3.13327 13.4996 3.90827 14.0663 4.5416 13.683L7.99994 11.5996Z"
                        fill="#FFCC00"
                      />
                    </svg>
                  </span>
                  {ItemData?.average_rating || "0.0"}
                </div>
              </div>
            </div>

            <div className="agent-details-info">
              <div className="agent-info-row">
                <div className="agent-info-item">
                  <h5>Experience</h5>
                  <p>{ItemData?.experience || "0"} years</p>
                </div>
                <div className="agent-info-item">
                  <h5>Deals Completed</h5>
                  <p>{ItemData?.deals || "0"}</p>
                </div>
                <div className="agent-info-item">
                  <h5>Languages</h5>
                  <p>{ItemData?.languages || "English"}</p>
                </div>
              </div>

              <div className="agent-bio-section">
                <h4>About Me</h4>
                <p>
                  {ItemData?.bio || 
                    "No biography available for this agent. Please contact them directly for more information."}
                </p>
              </div>

              <div className="agent-specializations">
                <h4>Specializations</h4>
                <div className="specialization-tags">
                  {ItemData?.specializations ? 
                    ItemData.specializations.map((spec, index) => (
                      <span key={index} className="specialization-tag">
                        {spec}
                      </span>
                    )) : 
                    <span className="specialization-tag">General Real Estate</span>
                  }
                </div>
              </div>

              <div className="agent-contact-actions">
                <Link to={`/chat?agent=${ItemData?.id || ''}`} className="btn btn-primary">
                  Message Agent
                </Link>
                <a href={`tel:${ItemData?.phone || ''}`} className="btn btn-outline-primary">
                  Call Agent
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="agent-detail-backdrop" onClick={() => handlePopup()}></div>
    </div>
  );
};

export default AgentDetailPopup;
