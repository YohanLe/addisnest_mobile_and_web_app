import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoginPopup from '../../../helper/LoginPopup';
import CustomerRegisterPopup from '../../../helper/CustomerRegisterPopup';
import { isAuthenticated } from '../../../utils/tokenHandler';
import { useSelector } from 'react-redux';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.Auth.Details.data);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header 
      className="header"
      style={{
        padding: '15px 0', // Reduced header padding
        backgroundColor: '#ffffff', 
        borderBottom: '1px solid #e0e0e0', 
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <div className="container">
        <div 
          className="header-main"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div className="logo-area">
            <Link 
              to="/" 
              className="logo"
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  backgroundColor: '#b9f73e', 
                  width: '30px', // Reduced logo icon size
                  height: '30px', // Reduced logo icon size
                  borderRadius: '4px', // Adjusted border radius
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px', // Reduced font size
                  fontWeight: 'bold',
                  color: '#333',
                  marginRight: '6px' // Reduced margin
                }}>
                  a
                </div>
                <div style={{
                  color: '#333333', 
                  fontSize: '20px', // Reduced logo text size
                  fontWeight: 'bold'
                }}>
                  Addisnest
                </div>
              </div>
            </Link>
          </div>

          <div 
            className="nav-main"
            style={{
              display: 'flex',
              justifyContent: 'center',
              flex: 1
            }}
          >
            <ul 
              className="navigation"
              style={{
                display: 'flex',
                listStyle: 'none',
                margin: 0,
                padding: 0,
                gap: '15px', // Further reduced gap
                justifyContent: 'center'
              }}
            >
              <li>
                <Link 
                  to="/property-list?for=buy" 
                  className={`${isActive('/property-list')} nav-link`}
                  style={{
                    padding: '5px 0', // Reduced padding
                    textDecoration: 'none',
                    color: '#555555', 
                    fontWeight: 400,   
                    fontSize: '14px'  // Further reduced font size
                  }}
                  onClick={(e) => {
                    // Ensure scroll to top and reset state
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    // Always navigate to fresh instance of the page with the for=buy parameter
                    e.preventDefault();
                    console.log("Buy button clicked, navigating to property-list with for=buy");
                    navigate('/property-list?for=buy');
                  }}
                >
                  Buy
                </Link>
              </li>
              <li>
                <Link 
                  to="/sell" 
                  className={`${isActive('/sell')} nav-link`}
                  style={{
                    padding: '5px 0', // Reduced padding
                    textDecoration: 'none',
                    color: '#555555', 
                    fontWeight: 400,   
                    fontSize: '14px'  // Further reduced font size
                  }}
                  onClick={(e) => {
                    if (!isAuthenticated()) {
                      e.preventDefault();
                      setShowLoginPopup(true);
                    } else {
                      e.preventDefault();
                      navigate('/property-list-form');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                >
                  Sell
                </Link>
              </li>
              <li>
                <Link 
                  to="/property-list?for=rent" 
                  className={`${isActive('/property-list')} nav-link`}
                  style={{
                    padding: '5px 0', // Reduced padding
                    textDecoration: 'none',
                    color: '#555555', 
                    fontWeight: 400,   
                    fontSize: '14px'  // Further reduced font size
                  }}
                  onClick={(e) => {
                    // Ensure scroll to top and reset state
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    // Always navigate to fresh instance of the page with the for=rent parameter
                    e.preventDefault();
                    navigate('/property-list?for=rent');
                  }}
                >
                  Rent
                </Link>
              </li>
              <li>
                <Link 
                  to="/mortgage-calculator" 
                  className={`${isActive('/mortgage-calculator')} nav-link`}
                  style={{
                    padding: '5px 0', // Reduced padding
                    textDecoration: 'none',
                    color: '#555555', 
                    fontWeight: 400,   
                    fontSize: '14px'  // Further reduced font size
                  }}
                >
                  Mortgage Calculator
                </Link>
              </li>
              <li>
                <Link 
                  to="/find-agent" 
                  className={`${isActive('/find-agent')} nav-link`}
                  style={{
                    padding: '5px 0', // Reduced padding
                    textDecoration: 'none',
                    color: '#555555', 
                    fontWeight: 400,   
                    fontSize: '14px'  // Further reduced font size
                  }}
                >
                  Find Agent
                </Link>
              </li>
            </ul>
          </div>

          <div className="right-section" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ // Eng button
              border: '1px solid #cccccc', 
              borderRadius: '30px',
              padding: '4px 10px', // Reduced padding
              color: '#555555',    
              fontSize: '13px', // Reduced font size
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer' 
            }}>
              Eng
            </div>
            
            {isAuthenticated() ? (
              <div style={{ position: 'relative' }}>
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div style={{ 
                    backgroundColor: '#a4ff2a', 
                    color: '#333',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    Logged In
                  </div>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '2px solid #a4ff2a',
                    overflow: 'hidden'
                  }}>
                    {user?.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt="Profile" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        {user?.firstName?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                </div>
                
                {showUserMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '45px',
                    right: '0',
                    backgroundColor: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    padding: '10px 0',
                    minWidth: '180px',
                    zIndex: 1000
                  }}>
                    <div style={{ 
                      padding: '5px 15px', 
                      borderBottom: '1px solid #eee',
                      marginBottom: '5px'
                    }}>
                      <p style={{ margin: '8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>
                    <Link 
                      to="/account-management" 
                      style={{
                        display: 'block',
                        padding: '8px 15px',
                        color: '#333',
                        textDecoration: 'none',
                        fontSize: '14px'
                      }}
                    >
                      Account Management
                    </Link>
                    <Link 
                      to="/my-profile" 
                      style={{
                        display: 'block',
                        padding: '8px 15px',
                        color: '#333',
                        textDecoration: 'none',
                        fontSize: '14px'
                      }}
                    >
                      My Profile
                    </Link>
                    <Link 
                      to="/my-properties" 
                      style={{
                        display: 'block',
                        padding: '8px 15px',
                        color: '#333',
                        textDecoration: 'none',
                        fontSize: '14px'
                      }}
                    >
                      My Properties
                    </Link>
                    <div 
                      style={{
                        padding: '8px 15px',
                        color: '#333',
                        textDecoration: 'none',
                        fontSize: '14px',
                        cursor: 'pointer',
                        borderTop: '1px solid #eee',
                        marginTop: '5px'
                      }}
                      onClick={() => {
                        localStorage.removeItem('addisnest_token');
                        localStorage.removeItem('isLogin');
                        localStorage.removeItem('userId');
                        window.location.href = '/';
                      }}
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="login-btn"
                  onClick={() => setShowLoginPopup(true)}
                  style={{
                    backgroundColor: '#333333', 
                    color: 'white',           
                    padding: '6px 15px',    // Reduced padding
                    borderRadius: '4px',    // Adjusted border radius
                    textDecoration: 'none',
                    fontWeight: 500,        
                    fontSize: '14px',       // Reduced font size
                    display: 'inline-block',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Login
                </button>
                <button 
                  onClick={() => setShowRegisterPopup(true)}
                  className="register-btn"
                  style={{
                    backgroundColor: '#a4ff2a', 
                    color: '#333',           
                    padding: '6px 15px',    // Reduced padding
                    borderRadius: '4px',    // Adjusted border radius
                    textDecoration: 'none',
                    fontWeight: 500,        
                    fontSize: '14px',       // Reduced font size
                    display: 'inline-block',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Register
                </button>
              </div>
            )}

            <button 
              className="mobile-menu-toggle" 
              onClick={toggleMobileMenu}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '10px'
              }}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
      {showLoginPopup && <LoginPopup handlePopup={() => setShowLoginPopup(false)} />}
      {showRegisterPopup && <CustomerRegisterPopup handlePopup={() => setShowRegisterPopup(false)} handleLogin={() => {
        setShowRegisterPopup(false);
        setShowLoginPopup(true);
      }} />}
    </header>
  );
};

export default Header;
