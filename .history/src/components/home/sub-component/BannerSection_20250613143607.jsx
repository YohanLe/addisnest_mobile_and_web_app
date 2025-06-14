import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { EthisnestBg } from '../../../assets/images';
import { SvgSearchIcon } from '../../../assets/svg-files/SvgFiles.jsx';
import { useNavigate } from 'react-router-dom';
import { GetHomeData } from '../../../Redux-store/Slices/HomeSlice';

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
        backgroundColor: 'red', // TEMP: make background visible for debug
        border: '5px solid lime', // TEMP: add visible border for debug
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '80px 0', // Increased padding for more height
        color: '#fff',
        position: 'relative',
        boxShadow: 'none'
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <div className="banner-content">
              <h1 style={{ 
                fontSize: '2.5rem', 
                marginBottom: '1.5rem',
                fontWeight: '700',
                textAlign: 'left',
                color: '#fff',
                lineHeight: '1.2'
              }}>
                Find the right home<br />at the right price
              </h1>

              <div 
                className="search-tabs-container"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  maxWidth: '650px',
                  overflow: 'hidden'
                }}
              >
                <div className="search-tabs" style={{ backgroundColor: '#f7f7f7', padding: '0' }}>
                  <ul 
                    className="nav"
                    style={{ 
                      display: 'flex', 
                      margin: 0,
                      padding: 0,
                      listStyle: 'none'
                    }}
                  >
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${searchType === 'buy' ? 'active' : ''}`}
                        onClick={() => setSearchType('buy')}
                        style={{
                          background: searchType === 'buy' ? 'white' : 'transparent',
                          color: searchType === 'buy' ? '#000' : '#666',
                          border: 'none',
                          padding: '12px 20px',
                          fontWeight: '500',
                          fontSize: '14px',
                          cursor: 'pointer',
                          position: 'relative',
                          borderRadius: '0',
                          borderBottom: searchType === 'buy' ? '3px solid #d9534f' : 'none'
                        }}
                      >
                        Buy
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${searchType === 'rent' ? 'active' : ''}`}
                        onClick={() => setSearchType('rent')}
                        style={{
                          background: searchType === 'rent' ? 'white' : 'transparent',
                          color: searchType === 'rent' ? '#000' : '#666',
                          border: 'none',
                          padding: '12px 20px',
                          fontWeight: '500',
                          fontSize: '14px',
                          cursor: 'pointer',
                          position: 'relative',
                          borderRadius: '0',
                          borderBottom: searchType === 'rent' ? '3px solid #d9534f' : 'none'
                        }}
                      >
                        Rent
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${searchType === 'for-sale' ? 'active' : ''}`}
                        onClick={() => handleTabClick('for-sale')}
                        style={{
                          background: searchType === 'for-sale' ? 'white' : 'transparent',
                          color: searchType === 'for-sale' ? '#000' : '#666',
                          border: 'none',
                          padding: '12px 20px',
                          fontWeight: '500',
                          fontSize: '14px',
                          cursor: 'pointer',
                          position: 'relative',
                          borderRadius: '0',
                          borderBottom: searchType === 'for-sale' ? '3px solid #d9534f' : 'none'
                        }}
                      >
                        For Sale
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${searchType === 'for-rent' ? 'active' : ''}`}
                        onClick={() => handleTabClick('for-rent')}
                        style={{
                          background: searchType === 'for-rent' ? 'white' : 'transparent',
                          color: searchType === 'for-rent' ? '#000' : '#666',
                          border: 'none',
                          padding: '12px 20px',
                          fontWeight: '500',
                          fontSize: '14px',
                          cursor: 'pointer',
                          position: 'relative',
                          borderRadius: '0',
                          borderBottom: searchType === 'for-rent' ? '3px solid #d9534f' : 'none'
                        }}
                      >
                        For Rent
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${searchType === 'sell' ? 'active' : ''}`}
                        onClick={() => setSearchType('sell')}
                        style={{
                          background: searchType === 'sell' ? 'white' : 'transparent',
                          color: searchType === 'sell' ? '#000' : '#666',
                          border: 'none',
                          padding: '12px 20px',
                          fontWeight: '500',
                          fontSize: '14px',
                          cursor: 'pointer',
                          position: 'relative',
                          borderRadius: '0',
                          borderBottom: searchType === 'sell' ? '3px solid #d9534f' : 'none'
                        }}
                      >
                        Sell
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${searchType === 'mortgage' ? 'active' : ''}`}
                        onClick={() => setSearchType('mortgage')}
                        style={{
                          background: searchType === 'mortgage' ? 'white' : 'transparent',
                          color: searchType === 'mortgage' ? '#000' : '#666',
                          border: 'none',
                          padding: '12px 20px',
                          fontWeight: '500',
                          fontSize: '14px',
                          cursor: 'pointer',
                          position: 'relative',
                          borderRadius: '0',
                          borderBottom: searchType === 'mortgage' ? '3px solid #d9534f' : 'none'
                        }}
                      >
                        Mortgage
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${searchType === 'homevalue' ? 'active' : ''}`}
                        onClick={() => setSearchType('homevalue')}
                        style={{
                          background: searchType === 'homevalue' ? 'white' : 'transparent',
                          color: searchType === 'homevalue' ? '#000' : '#666',
                          border: 'none',
                          padding: '12px 20px',
                          fontWeight: '500',
                          fontSize: '14px',
                          cursor: 'pointer',
                          position: 'relative',
                          borderRadius: '0',
                          borderBottom: searchType === 'homevalue' ? '3px solid #d9534f' : 'none'
                        }}
                      >
                        My Home Value
                      </button>
                    </li>
                  </ul>
                </div>

                <form onSubmit={handleSearch} style={{ padding: '20px', display: 'flex' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="City, Address, School, Agent, ZIP"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      height: '48px',
                      fontSize: '16px',
                      borderRight: 'none',
                      border: '1px solid #ddd',
                      borderRadius: '4px 0 0 4px',
                      padding: '12px 15px',
                      flex: '1',
                      boxShadow: 'none'
                    }}
                  />
                  <button 
                    className="btn" 
                    type="submit"
                    style={{
                      backgroundColor: '#d9534f',
                      color: 'white',
                      border: 'none',
                      padding: '0 20px',
                      borderRadius: '0 4px 4px 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '48px'
                    }}
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
