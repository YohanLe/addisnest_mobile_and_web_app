import React from 'react';

const PropertySellListPage = () => {
  return (
    <div className="property-sell-list-page">
      <div className="container">
        <div className="page-header">
          <h1>Sell Your Property</h1>
          <p>List your property on Addisnest and reach thousands of potential buyers</p>
        </div>
        
        <div className="sell-info-section">
          <div className="sell-benefits">
            <h2>Why Sell with Addisnest?</h2>
            <ul className="benefits-list">
              <li>
                <div className="benefit-icon">📱</div>
                <div className="benefit-content">
                  <h3>Maximum Exposure</h3>
                  <p>Your property will be seen by thousands of potential buyers</p>
                </div>
              </li>
              <li>
                <div className="benefit-icon">💰</div>
                <div className="benefit-content">
                  <h3>Better Price</h3>
                  <p>Our platform helps you get the best price for your property</p>
                </div>
              </li>
              <li>
                <div className="benefit-icon">⏱️</div>
                <div className="benefit-content">
                  <h3>Faster Sales</h3>
                  <p>Properties on Addisnest sell 2x faster than the market average</p>
                </div>
              </li>
              <li>
                <div className="benefit-icon">🤝</div>
                <div className="benefit-content">
                  <h3>Support Team</h3>
                  <p>Our experienced team guides you through the entire selling process</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="how-it-works">
            <h2>How It Works</h2>
            <div className="steps-list">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Create a Listing</h3>
                <p>Fill out the property details and upload photos</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Get Visibility</h3>
                <p>Your property becomes visible to thousands of potential buyers</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Receive Inquiries</h3>
                <p>Interested buyers will contact you through our platform</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h3>Close the Deal</h3>
                <p>Finalize the sale with your chosen buyer</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="cta-section">
          <h2>Ready to Sell Your Property?</h2>
          <button className="primary-btn">List Your Property Now</button>
          <p className="subtext">It only takes a few minutes to create a listing</p>
        </div>
      </div>
    </div>
  );
};

export default PropertySellListPage;
