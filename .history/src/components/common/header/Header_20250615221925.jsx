import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoginPopup from '../../../helper/LoginPopup';
import CustomerRegisterPopup from '../../../helper/CustomerRegisterPopup';
import MortgageCalculatorPopup from '../../../components/helper/MortgageCalculatorPopup';
import { isAuthenticated } from '../../../utils/tokenHandler';
import { useSelector } from 'react-redux';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMortgageCalculator, setShowMortgageCalculator] = useState(false);
  const [buyRentMode, setBuyRentMode] = useState('buy'); // Track the Buy/Rent toggle state
  const navigate = useNavigate();
  const user = useSelector((state) => state.Auth.Details.data);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-main">
          <div className="logo-area">
            <Link to="/" className="logo">
              <div className="logo-icon">a</div>
              <div className="logo-text">Addisnest</div>
            </Link>
          </div>

          <div className="nav-main">
            <ul className="navigation">
              <li>
                <div 
                  className={`${isActive('/property-list')} nav-link buy-rent-toggle`}
                  onClick={(e) => {
                    e.preventDefault();
                    // Toggle between buy and rent
                    const newMode = buyRentMode === 'buy' ? 'rent' : 'buy';
                    setBuyRentMode(newMode);
                    
                    // Navigate to the appropriate page based on the new mode
                    console.log(`Buy/Rent button clicked, toggling to ${newMode} mode`);
                    if (newMode === 'buy') {
                      navigate('/property-list?for=sale');
                    } else {
                      navigate('/property-list?for=rent');
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>Buy/Rent</span>
                  <span className={`toggle-indicator ${buyRentMode}`}>
                    {buyRentMode === 'buy' ? 'Buy' : 'Rent'}
                  </span>
                </div>
              </li>
              <li>
                <Link
                  to="/sell"
                  className={`${isActive('/sell')} nav-link`}
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
                <div
                  className={`${isActive('/mortgage-calculator')} nav-link`}
                  onClick={() => setShowMortgageCalculator(true)}
                  style={{ cursor: 'pointer' }}
                >
                  Mortgage Calculator
                </div>
              </li>
              <li>
                <Link
                  to="/find-agent"
                  className={`${isActive('/find-agent')} nav-link`}
                >
                  Find Agent
                </Link>
              </li>
            </ul>
          </div>

          <div className="right-section">
            <div className="eng-button">
              Eng
            </div>
            
            {isAuthenticated() ? (
              <div className="user-menu-container">
                <div
                  className="user-menu-trigger"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="logged-in-indicator">
                    Logged In
                  </div>
                  <div className="profile-picture-container">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="profile-picture"
                      />
                    ) : (
                      <span className="profile-initial">
                        {user?.firstName?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                </div>
                
                {showUserMenu && (
                  <div className="user-menu">
                    <div className="user-info">
                      <p className="user-name">
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>
                    <Link
                      to="/account-management"
                      className="user-menu-link"
                    >
                      Account Management
                    </Link>
                    <Link
                      to="/my-profile"
                      className="user-menu-link"
                    >
                      My Profile
                    </Link>
                    <div
                      className="logout-button"
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
              <div className="auth-buttons">
                <button
                  className="login-btn"
                  onClick={() => setShowLoginPopup(true)}
                >
                  Login
                </button>
                <button
                  onClick={() => setShowRegisterPopup(true)}
                  className="register-btn"
                >
                  Register
                </button>
              </div>
            )}

            <button
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
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
      {showMortgageCalculator && <MortgageCalculatorPopup handlePopup={() => setShowMortgageCalculator(false)} />}
    </header>
  );
};

export default Header;
