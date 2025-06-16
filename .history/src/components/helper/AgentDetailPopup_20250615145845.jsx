import React from 'react';

const AgentDetailPopup = ({ agent, onClose }) => {
  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="star filled">★</span>
        );
      } else if (i === fullStars + 1 && halfStar) {
        stars.push(
          <span key={i} className="star filled">★</span>
        );
      } else {
        stars.push(
          <span key={i} className="star">★</span>
        );
      }
    }
    
    return (
      <div className="review-rating">
        {stars} <span style={{ color: '#333', marginLeft: '5px' }}>{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Sample reviews for the agent
  const sampleReviews = [
    {
      id: 1,
      rating: 5,
      text: "An excellent agent who understood exactly what I was looking for and helped me find the perfect property. Very professional and knowledgeable about the local market."
    },
    {
      id: 2,
      rating: 4,
      text: "Very responsive and helped us navigate the buying process smoothly. Good negotiation skills that saved us money on our purchase."
    }
  ];

  return (
    <div className="agent-detail-popup-main">
      <div 
        className="agent-detail-backdrop" 
        onClick={onClose}
      ></div>
      
      <div className="agent-detail-popup">
        <div className="agent-detail-popup-inner">
          <button 
            className="close-button" 
            onClick={onClose}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#555"/>
            </svg>
          </button>
          
          <div className="agent-details-content">
            <div className="agent-details-top">
              <div className="agent-profile-img">
                <span style={{
                  backgroundImage: agent.profilePicture 
                    ? `url(${agent.profilePicture})` 
                    : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  color: '#007AFF'
                }}>
                  {!agent.profilePicture && agent.name.charAt(0)}
                </span>
                
                {agent.isVerified && (
                  <div className="verified-badge-profile">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="agent-profile-info">
                <h3>{agent.name}</h3>
                <div className="agent-region">{agent.region}</div>
                
                <p>
                  <span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" fill="#666"/>
                    </svg>
                  </span>
                  {agent.phone}
                </p>
                
                <p>
                  <span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#666"/>
                    </svg>
                  </span>
                  {agent.email}
                </p>
                
                <p>
                  <span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#666"/>
                    </svg>
                  </span>
                  {agent.region}
                </p>
                
                <div className="agent-rating">
                  {renderStars(agent.rating)}
                </div>
              </div>
            </div>
            
            <div className="agent-details-info">
              <div className="agent-info-row">
                <div className="agent-info-item">
                  <h5>Experience</h5>
                  <p>{agent.experience} years</p>
                </div>
                
                <div className="agent-info-item">
                  <h5>Current Listings</h5>
                  <p>{agent.currentListings} properties</p>
                </div>
                
                <div className="agent-info-item">
                  <h5>Transactions Closed</h5>
                  <p>{agent.transactionsClosed}</p>
                </div>
              </div>
              
              {agent.isVerified && (
                <div className="agent-verification-info">
                  <div className="verification-badge">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" fill="#28a745"/>
                    </svg>
                    <span>Verified Agent</span>
                  </div>
                  <p className="license-number">License Number: {agent.licenseNumber}</p>
                </div>
              )}
              
              <div className="agent-bio-section">
                <h4>About {agent.name}</h4>
                <p>{agent.bio}</p>
              </div>
              
              <div className="agent-specializations">
                <h4>Specializations</h4>
                <div className="specialization-tags">
                  {agent.specialties.map((specialty, index) => (
                    <span key={index} className="specialization-tag">{specialty}</span>
                  ))}
                </div>
              </div>
              
              <div className="agent-specializations">
                <h4>Languages</h4>
                <div className="specialization-tags">
                  {agent.languages.map((language, index) => (
                    <span 
                      key={index} 
                      className="specialization-tag" 
                      style={{ backgroundColor: '#f0fff7', color: '#16a34a' }}
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="agent-reviews-section">
                <h4>Reviews</h4>
                <div className="agent-reviews">
                  {sampleReviews.map(review => (
                    <div key={review.id} className="review-item">
                      {renderStars(review.rating)}
                      <p className="review-text">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="agent-contact-actions">
                <a 
                  href={`tel:${agent.phone}`} 
                  className="primary-btn"
                  style={{ backgroundColor: '#007AFF', color: 'white', textDecoration: 'none' }}
                >
                  Call Agent
                </a>
                <a 
                  href={`mailto:${agent.email}`} 
                  className="primary-btn"
                  style={{ backgroundColor: 'transparent', border: '1px solid #007AFF', color: '#007AFF', textDecoration: 'none' }}
                >
                  Email Agent
                </a>
                <button 
                  className="primary-btn"
                  style={{ backgroundColor: '#f0f0f0', border: 'none', color: '#555' }}
                >
                  Chat Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPopup;
