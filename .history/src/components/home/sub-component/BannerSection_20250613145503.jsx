import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { EthisnestBg } from '../../../assets/images';
import { SvgSearchIcon } from '../../../assets/svg-files/SvgFiles.jsx';
import { useNavigate } from 'react-router-dom';
import { GetHomeData } from '../../../Redux-store/Slices/HomeSlice';
import './BannerSection.css';

const BannerSection = () => {
  const [searchType, setSearchType] = useState('buy');
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e, type) => {
    if (e) e.preventDefault();
    const currentSearchType = type || searchType;
    if (currentSearchType === 'rent') {
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

  const handleTabClick = (type) => {
    setSearchType(type);
    handleSearch(null, type);
  };

  return (
    <section
      className="banner-section"
      style={{
        backgroundImage: `url(${EthisnestBg})`,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <div className="banner-content">
              <h1>
                Find the right home<br />at the right price
              </h1>

              <div className="search-tabs-container">
                <div className="search-tabs">
                  <ul className="nav">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${searchType === 'buy' ? 'active' : ''}`}
                        onClick={() => setSearchType('buy')}
                      >
                        Buy
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${searchType === 'rent' ? 'active' : ''}`}
                        onClick={() => setSearchType('rent')}
                      >
                        Rent
                      </button>
                    </li>
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
                    <li className="nav-item">
                      <button
                        className={`nav-link ${searchType === 'homevalue' ? 'active' : ''}`}
                        onClick={() => setSearchType('homevalue')}
                      >
                        My Home Value
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
