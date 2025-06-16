import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { PropertyImage4 } from '../../../assets/images';
import { SvgSearchIcon } from '../../../assets/svg-files/SvgFiles.jsx';
import { useNavigate } from 'react-router-dom';
import { GetHomeData } from '../../../Redux-store/Slices/HomeSlice';
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
        backgroundImage: `url(${PropertyImage4})`,
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
                        onClick={() => setSearchType('sell')}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
