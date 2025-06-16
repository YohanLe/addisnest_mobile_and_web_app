import React from "react";
import { Link } from "react-router-dom";
import { SvgCloseIcon, SvgLocationIcon, SvgPhoneIcon } from "../assets/svg-files/SvgFiles";

const AgentDetailPopup = ({ handlePopup, ItemData }) => {
  if (!ItemData) {
    return null;
  }
  
  // Format agent name
  const agentName = ItemData.firstName && ItemData.lastName 
    ? `${ItemData.firstName} ${ItemData.lastName}` 
    : ItemData.name || "Agent Name";
  
  // Format agent address
  const formatAddress = () => {
    if (ItemData.address) {
      const { street, city, state } = ItemData.address;
      const parts = [street, city, state].filter(Boolean);
      return parts.length ? parts.join(", ") : "Address not available";
    }
    return ItemData.region || "Address not available";
  };
  
  // Get agent profile image
  const getProfileImage = () => {
    return ItemData.profileImage || ItemData.profile_img || null;
  };
  
  // Get agent rating
  const getRating = () => {
    return ItemData.averageRating?.toFixed(1) || ItemData.average_rating || "0.0";
  };
  
  // Get languages spoken
  const getLanguages = () => {
    if (ItemData.languagesSpoken && ItemData.languagesSpoken.length) {
      return ItemData.languagesSpoken.join(", ");
    }
    return ItemData.languages || "Amharic";
  };
  
  // Get specialties
  const getSpecialties = () => {
    if (ItemData.specialties && ItemData.specialties.length) {
      return ItemData.specialties;
    }
    return ItemData.specializations || ["General Real Estate"];
  };
  
  // Format reviews if available
  const formatReviews = () => {
    if (ItemData.ratings && ItemData.ratings.length) {
      return ItemData.ratings.slice(0, 3); // Show max 3 most recent reviews
    }
    return [];
  };
  
  const reviews = formatReviews();

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
                    backgroundImage: getProfileImage()
                      ? `url(${getProfileImage()})`
                      : "none",
                  }}
                ></span>
                {ItemData.licenseVerified && (
                  <div className="verified-badge-profile" title="Verified Agent">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.3 12C21.3 17.2833 17.2833 21.3 12 21.3C6.71667 21.3 2.7 17.2833 2.7 12C2.7 6.71667 6.71667 2.7 12 2.7C17.2833 2.7 21.3 6.71667 21.3 12Z" stroke="white" strokeWidth="1.5"/>
                      <path d="M15 9L10.5 14L9 12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>

              <div className="agent-profile-info">
                <h3>{agentName}</h3>
                <p className="agent-region">{ItemData.region || ""}</p>
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
                  {formatAddress()}
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
                  {getRating()}
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
                  <h5>Region</h5>
                  <p>{ItemData?.region || "Not specified"}</p>
                </div>
                <div className="agent-info-item">
                  <h5>Languages</h5>
                  <p>{getLanguages()}</p>
                </div>
              </div>

              {ItemData.licenseVerified && (
                <div className="agent-verification-info">
                  <div className="verification-badge">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.3 12C21.3 17.2833 17.2833 21.3 12 21.3C6.71667 21.3 2.7 17.2833 2.7 12C2.7 6.71667 6.71667 2.7 12 2.7C17.2833 2.7 21.3 6.71667 21.3 12Z" stroke="#28a745" strokeWidth="1.5"/>
                      <path d="M15 9L10.5 14L9 12.5" stroke="#28a745" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Verified Agent</span>
                  </div>
                  {ItemData.licenseNumber && (
                    <p className="license-number">License: {ItemData.licenseNumber}</p>
                  )}
                </div>
              )}

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
                  {getSpecialties().map((spec, index) => (
                    <span key={index} className="specialization-tag">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {reviews.length > 0 && (
                <div className="agent-reviews-section">
                  <h4>Client Reviews</h4>
                  <div className="agent-reviews">
                    {reviews.map((review, index) => (
                      <div key={index} className="review-item">
                        <div className="review-rating">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="review-text">{review.review || "Great agent!"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="agent-contact-actions">
                <Link to={`/chat?agent=${ItemData?._id || ItemData?.id || ''}`} className="btn btn-primary">
                  Message Agent
                </Link>
                <a href={`tel:${ItemData?.phone || ''}`} className="btn btn-outline-primary">
                  Call Agent
                </a>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => window.open(`mailto:${ItemData?.email || ''}`, '_blank')}
                >
                  Email
                </button>
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
