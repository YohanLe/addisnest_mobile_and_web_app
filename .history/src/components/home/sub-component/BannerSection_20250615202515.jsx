import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { PropertyImage3, EthisnestBg } from '../../../assets/images';
import { SvgSearchIcon } from '../../../assets/svg-files/SvgFiles.jsx';
import { useNavigate } from 'react-router-dom';
import { GetHomeData } from '../../../Redux-store/Slices/HomeSlice';
import { isAuthenticated } from '../../../utils/tokenHandler';
import './BannerSection.css';

const BannerSection = () => {
  const [searchType, setSearchType] = useState('buy');
  const [buyRentToggle, setBuyRentToggle] = useState('buy'); // New state for Buy/Rent toggle
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e, type) => {
    if (e) e.preventDefault();
    const currentSearchType = type || searchType;
    
    if (currentSearchType === 'buy-rent') {
      // For the combined Buy/Rent button, use the toggle state to determine which type to fetch
      if (buyRentToggle === 'buy') {
        navigate(`/property-list?for=sale&search=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate(`/property-list?for=rent&search=${encodeURIComponent(searchQuery)}`);
      }
    } else if (currentSearchType === 'rent') {
      navigate(`/property-list?for=rent&search=${encodeURIComponent(searchQuery)}`);
    } else if (currentSearchType === 'buy') {
      navigate(`/property-list?search=${encodeURIComponent(searchQuery)}`);
    } else if (currentSearchType === 'for-sale') {
      navigate(`/property-list?for=sale&search=${encodeURIComponent(searchQuery)}`);
    } else if (currentSearchType === 'for-rent') {
      navigate(`/property-list?for=rent&search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/property-list?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Function to toggle between Buy and Rent
  const toggleBuyRent = () => {
    const newToggle = buyRentToggle === 'buy' ? 'rent' : 'buy';
    setBuyRentToggle(newToggle);
    setSearchType('buy-rent');
    
    // Immediately search for properties with the new toggle selection
    handleSearch(null, 'buy-rent');
  };

  const handleTabClick = (type) => {
    setSearchType(type);
    handleSearch(null, type);
  };

  return (
    <section
      className="banner-section"
      style={{
        backgroundImage: `url(${EthisnestBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '360px',
        position: 'relative',
      }}
    >
      <div className="banner-overlay" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1
      }}></div>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row">
          <div className="col-md-8">
            <div className="banner-content">
              <h1 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                marginBottom: '0.5rem'
              }}>
                Find the perfect home<br />for your family
              </h1>

              <div className="search-tabs-container">
                <div className="search-tabs">
                  <ul className="nav">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${searchType === 'for-sale' ? 'active' : ''}`}
                        onClick={() => handleTabClick('for-sale')}
                      >
                        For Sale
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${searchType === 'for-rent' ? 'active' : ''}`}
                        onClick={() => handleTabClick('for-rent')}
                      >
                        For Rent
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${searchType === 'sell' ? 'active' : ''}`}
                        onClick={(e) => {
                          setSearchType('sell');
                          if (!isAuthenticated()) {
                            // If not authenticated, show login popup with redirect target
                            window.dispatchEvent(new CustomEvent('showLoginPopup', {
                              detail: { redirectTo: '/property-list-form' }
                            }));
                          } else {
                            // If authenticated, navigate to property list form
                            navigate('/property-list-form');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                      >
                        Sell
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${searchType === 'mortgage' ? 'active' : ''}`}
                        onClick={() => setSearchType('mortgage')}
                      >
                        Mortgage
                      </button>
                    </li>

                  </ul>
                </div>

                <form onSubmit={handleSearch} className="search-form">
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="City, Address, School, Agent, ZIP"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    className="btn search-button"
                    type="submit"
                  >
                    <SvgSearchIcon style={{ width: '20px', height: '20px' }} />
                  </button>
                </form>
                
                <div style={{ marginTop: '15px', textAlign: 'center' }}>
                  <button 
                    className="btn" 
                    onClick={() => navigate('/property-list')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: 'white',
                      border: '1px solid #e8e8e8',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#444',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
                      <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                    Advanced Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
