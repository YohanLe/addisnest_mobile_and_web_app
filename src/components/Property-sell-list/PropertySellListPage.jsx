import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginPopup from '../../helper/LoginPopup';

const PropertySellListPage = () => {
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  
  const handleListPropertyClick = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLogin') === '1';
    
    if (isLoggedIn) {
      // If logged in, navigate to property listing form
      navigate('/property-list-form');
    } else {
      // If not logged in, show login popup
      setShowLoginPopup(true);
    }
  };
  
  const handleCloseLoginPopup = () => {
    setShowLoginPopup(false);
  };
  return (
    <>
      <div className="property-sell-list-page">
        <div className="container">
        <div className="page-header">
          <h1>Sell Your Property</h1>
          <p>List your property on Addisnest and reach thousands of potential buyers</p>
        </div>
        
        <div className="sell-info-section">
          <div className="sell-benefits">
            <h2>Why Choose AddisNest to Sell Your Home?</h2>
            <div className="benefits-list" style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '20px',
              justifyContent: 'space-between',
              marginTop: '25px',
              marginBottom: '25px'
            }}>
              <div className="benefit-item" style={{ 
                flex: '1 1 200px',
                textAlign: 'center',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div className="benefit-icon" style={{ 
                  fontSize: '28px',
                  marginBottom: '10px'
                }}>🧭</div>
                <h3 style={{ 
                  fontSize: '16px',
                  marginBottom: '8px',
                  color: '#2e3d40'
                }}>More Exposure</h3>
                <p style={{ 
                  fontSize: '14px',
                  color: '#666',
                  margin: '0'
                }}>Reach thousands of serious home seekers across Ethiopia.</p>
              </div>
              
              <div className="benefit-item" style={{ 
                flex: '1 1 200px',
                textAlign: 'center',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div className="benefit-icon" style={{ 
                  fontSize: '28px',
                  marginBottom: '10px'
                }}>💰</div>
                <h3 style={{ 
                  fontSize: '16px',
                  marginBottom: '8px',
                  color: '#2e3d40'
                }}>Better Pricing</h3>
                <p style={{ 
                  fontSize: '14px',
                  color: '#666',
                  margin: '0'
                }}>Get fair pricing support with our market-smart platform.</p>
              </div>
              
              <div className="benefit-item" style={{ 
                flex: '1 1 200px',
                textAlign: 'center',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div className="benefit-icon" style={{ 
                  fontSize: '28px',
                  marginBottom: '10px'
                }}>⚡</div>
                <h3 style={{ 
                  fontSize: '16px',
                  marginBottom: '8px',
                  color: '#2e3d40'
                }}>Faster Selling</h3>
                <p style={{ 
                  fontSize: '14px',
                  color: '#666',
                  margin: '0'
                }}>Homes listed on AddisNest sell up to 2x faster than average.</p>
              </div>
              
              <div className="benefit-item" style={{ 
                flex: '1 1 200px',
                textAlign: 'center',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div className="benefit-icon" style={{ 
                  fontSize: '28px',
                  marginBottom: '10px'
                }}>🤝</div>
                <h3 style={{ 
                  fontSize: '16px',
                  marginBottom: '8px',
                  color: '#2e3d40'
                }}>Expert Help</h3>
                <p style={{ 
                  fontSize: '14px',
                  color: '#666',
                  margin: '0'
                }}>Our team is here to assist you every step of the way.</p>
              </div>
            </div>
          </div>
          
          <div className="cta-section" style={{ 
            marginTop: '30px', 
            marginBottom: '40px',
            textAlign: 'center'
          }}>
            <button 
              onClick={handleListPropertyClick}
              className="primary-btn" 
              style={{
                backgroundColor: '#b9f73e',
                color: '#2e3d40',
                padding: '14px 28px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                minWidth: '220px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#a8e82d';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#b9f73e';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}>
                List Your Property Now
              </button>
          </div>
          
          <div className="how-it-works">
            <h2>How It Works</h2>
            <div className="steps-list" style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '20px',
              justifyContent: 'space-between',
              marginTop: '20px'
            }}>
              <div className="step" style={{ 
                flex: '1 1 200px',
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                marginBottom: '15px'
              }}>
                <div className="step-number" style={{
                  backgroundColor: '#b9f73e',
                  color: '#2e3d40',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  marginBottom: '15px'
                }}>1</div>
                <h3>Create a Listing</h3>
                <p>Fill in your property details and upload beautiful photos.</p>
              </div>
              <div className="step" style={{ 
                flex: '1 1 200px',
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                marginBottom: '15px'
              }}>
                <div className="step-number" style={{
                  backgroundColor: '#b9f73e',
                  color: '#2e3d40',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  marginBottom: '15px'
                }}>2</div>
                <h3>Get Seen</h3>
                <p>Your property becomes visible to thousands of buyers instantly.</p>
              </div>
              <div className="step" style={{ 
                flex: '1 1 200px',
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                marginBottom: '15px'
              }}>
                <div className="step-number" style={{
                  backgroundColor: '#b9f73e',
                  color: '#2e3d40',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  marginBottom: '15px'
                }}>3</div>
                <h3>Connect with Buyers</h3>
                <p>Chat with interested buyers through AddisNest.</p>
              </div>
              <div className="step" style={{ 
                flex: '1 1 200px',
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                marginBottom: '15px'
              }}>
                <div className="step-number" style={{
                  backgroundColor: '#b9f73e',
                  color: '#2e3d40',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  marginBottom: '15px'
                }}>4</div>
                <h3>Close the Sale</h3>
                <p>Finalize the deal directly with your chosen buyer.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="cta-section" style={{ 
          textAlign: 'center',
          marginTop: '40px',
          marginBottom: '60px',
          padding: '30px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px'
        }}>
          <h2>Ready to Sell Your Property?</h2>
          <p className="subtext" style={{ marginBottom: '20px' }}>It only takes a few minutes to create a listing</p>
          <button 
            onClick={handleListPropertyClick}
            className="primary-btn" 
            style={{
              backgroundColor: '#b9f73e',
              color: '#2e3d40',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              display: 'inline-block',
              minWidth: '250px'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#a8e82d';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#b9f73e';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }}>
              List Your Property Now
            </button>
          </div>
        </div>
      </div>
      
      {/* Login Popup */}
      {showLoginPopup && (
        <LoginPopup 
          handlePopup={handleCloseLoginPopup} 
          redirectAfterLogin="/property-list-form"
        />
      )}
    </>
  );
};

export default PropertySellListPage;
