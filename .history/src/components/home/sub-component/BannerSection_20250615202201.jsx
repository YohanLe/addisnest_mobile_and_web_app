import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { PropertyImage3, EthisnestBg } from '../../../assets/images';
import { SvgSearchIcon } from '../../../assets/svg-files/SvgFiles.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { GetHomeData, GetAllPropertyListings } from '../../../Redux-store/Slices/HomeSlice';
import { isAuthenticated } from '../../../utils/tokenHandler';
import './BannerSection.css';

const BannerSection = () => {
  const [searchType, setSearchType] = useState('buy');
  const [buyRentToggle, setBuyRentToggle] = useState('buy'); // New state for Buy/Rent toggle
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Filter state variables
  const [priceRange, setPriceRange] = useState('any');
  const [propertyType, setPropertyType] = useState('all');
  const [bedrooms, setBedrooms] = useState('any');
  const [bathrooms, setBathrooms] = useState('any');
  const [regionalState, setRegionalState] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [filtersVisible, setFiltersVisible] = useState(false);

  const handleSearch = (e, type) => {
    if (e) e.preventDefault();
    const currentSearchType = type || searchType;
    
    // Build query parameters including all filter options
    const queryParams = new URLSearchParams();
    
    // Set search query
    if (searchQuery) queryParams.set('search', searchQuery);
    
    // Set property type (buy/rent)
    if (currentSearchType === 'buy-rent') {
      // For the combined Buy/Rent button, use the toggle state to determine which type to fetch
      if (buyRentToggle === 'buy') {
        queryParams.set('for', 'sale');
      } else {
        queryParams.set('for', 'rent');
      }
    } else if (currentSearchType === 'rent' || currentSearchType === 'for-rent') {
      queryParams.set('for', 'rent');
    } else if (currentSearchType === 'buy' || currentSearchType === 'for-sale') {
      queryParams.set('for', 'sale');
    }
    
    // Add filter parameters
    if (priceRange && priceRange !== 'any') queryParams.set('priceRange', priceRange);
    if (propertyType && propertyType !== 'all') queryParams.set('propertyType', propertyType);
    if (bedrooms && bedrooms !== 'any') queryParams.set('bedrooms', bedrooms);
    if (bathrooms && bathrooms !== 'any') queryParams.set('bathrooms', bathrooms);
    if (regionalState && regionalState !== 'all') queryParams.set('regionalState', regionalState);
    if (sortBy !== 'newest') queryParams.set('sortBy', sortBy);
    
    navigate(`/property-list?${queryParams.toString()}`);
  };

  // Function to toggle between Buy and Rent
  const toggleBuyRent = () => {
    const newToggle = buyRentToggle === 'buy' ? 'rent' : 'buy';
    setBuyRentToggle(newToggle);
    setSearchType('buy-rent');
    
    // Immediately search for properties with the new toggle selection
    handleSearch(null, 'buy-rent');
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  const handleTabClick = (type) => {
    setSearchType(type);
    handleSearch(null, type);
  };

  // Apply filters function
  const applyFilters = () => {
    handleSearch(null, searchType);
  };

  return (
    <section
      className="banner-section"
      style={{
        backgroundImage: `url(${EthisnestBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: filtersVisible ? 'auto' : '360px',
        minHeight: '360px',
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
                
                {/* Filter toggle button */}
                <div className="filters-toggle mb-3" style={{ marginTop: '15px' }}>
                  <button 
                    className="btn" 
                    onClick={toggleFilters}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: filtersVisible ? '#e8f7c4' : 'white',
                      border: '1px solid #e8e8e8',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#444',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
                      <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                    {filtersVisible ? 'Hide Filters' : 'Show Filters'}
                  </button>
                </div>
              </div>
              
              {/* Collapsible filters section */}
              <div 
                className="filters-section mb-4" 
                style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)', 
                  padding: filtersVisible ? '20px' : '0',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  maxHeight: filtersVisible ? '1000px' : '0',
                  opacity: filtersVisible ? 1 : 0,
                  marginBottom: filtersVisible ? '24px' : '0',
                  marginTop: '15px'
                }}
              >
                <div className="filter-grid" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  {/* Price Range Filter */}
                  <div className="filter-item">
                    <label className="form-label" style={{ 
                      fontSize: '15px', 
                      fontWeight: '600', 
                      marginBottom: '8px', 
                      color: '#444'
                    }}>Price Range</label>
                    <select 
                      className="form-select" 
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      style={{ 
                        border: '1px solid #e8e8e8',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        width: '100%',
                        boxShadow: 'none',
                        cursor: 'pointer',
                        fontWeight: '500',
                        color: '#444',
                        background: 'white',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23444' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center'
                      }}
                    >
                      <option value="any">Any Price</option>
                      <option value="0-20000">ETB 0 - 20,000</option>
                      <option value="20000-1000000">ETB 20,000 - 1,000,000</option>
                      <option value="1000000-5000000">ETB 1,000,000 - 5,000,000</option>
                      <option value="5000000-10000000">ETB 5,000,000 - 10,000,000</option>
                      <option value="10000000-20000000">ETB 10,000,000 - 20,000,000</option>
                      <option value="20000000+">ETB 20,000,000+</option>
                    </select>
                  </div>
                  
                  {/* Regional State Filter */}
                  <div className="filter-item">
                    <label className="form-label" style={{ 
                      fontSize: '15px', 
                      fontWeight: '600', 
                      marginBottom: '8px', 
                      color: '#444'
                    }}>Regional State</label>
                    <select 
                      className="form-select"
                      value={regionalState}
                      onChange={(e) => setRegionalState(e.target.value)}
                      style={{ 
                        border: '1px solid #e8e8e8',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        width: '100%',
                        boxShadow: 'none',
                        cursor: 'pointer',
                        fontWeight: '500',
                        color: '#444',
                        background: 'white',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23444' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center'
                      }}
                    >
                      <option value="all">All Regions</option>
                      <option value="Addis Ababa City Administration">Addis Ababa City Administration</option>
                      <option value="Afar Region">Afar Region</option>
                      <option value="Amhara Region">Amhara Region</option>
                      <option value="Benishangul-Gumuz Region">Benishangul-Gumuz Region</option>
                      <option value="Dire Dawa City Administration">Dire Dawa City Administration</option>
                      <option value="Gambela Region">Gambela Region</option>
                      <option value="Harari Region">Harari Region</option>
                      <option value="Oromia Region">Oromia Region</option>
                      <option value="Sidama Region">Sidama Region</option>
                      <option value="Somali Region">Somali Region</option>
                      <option value="South Ethiopia Region">South Ethiopia Region</option>
                      <option value="South West Ethiopia Peoples' Region">South West Ethiopia Peoples' Region</option>
                      <option value="Tigray Region">Tigray Region</option>
                      <option value="Central Ethiopia Region">Central Ethiopia Region</option>
                    </select>
                  </div>
                  
                  {/* Property Type Filter */}
                  <div className="filter-item">
                    <label className="form-label" style={{ 
                      fontSize: '15px', 
                      fontWeight: '600', 
                      marginBottom: '8px', 
                      color: '#444'
                    }}>Property Type</label>
                    <select 
                      className="form-select"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      style={{ 
                        border: '1px solid #e8e8e8',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        width: '100%',
                        boxShadow: 'none',
                        cursor: 'pointer',
                        fontWeight: '500',
                        color: '#444',
                        background: 'white',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23444' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center'
                      }}
                    >
                      <option value="all">All Types</option>
                      <option value="Apartment">Apartment</option>
                      <option value="House">House</option>
                      <option value="Villa">Villa</option>
                      <option value="Studio">Studio</option>
                      <option value="Land">Land</option>
                    </select>
                  </div>
                  
                  {/* Bedrooms Filter */}
                  <div className="filter-item">
                    <label className="form-label" style={{ 
                      fontSize: '15px', 
                      fontWeight: '600', 
                      marginBottom: '8px', 
                      color: '#444'
                    }}>Bedrooms</label>
                    <select 
                      className="form-select"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      style={{ 
                        border: '1px solid #e8e8e8',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        width: '100%',
                        boxShadow: 'none',
                        cursor: 'pointer',
                        fontWeight: '500',
                        color: '#444',
                        background: 'white',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23444' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center'
                      }}
                    >
                      <option value="any">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                  
                  {/* Bathrooms Filter */}
                  <div className="filter-item">
                    <label className="form-label" style={{ 
                      fontSize: '15px', 
                      fontWeight: '600', 
                      marginBottom: '8px', 
                      color: '#444'
                    }}>Bathrooms</label>
                    <select 
                      className="form-select"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      style={{ 
                        border: '1px solid #e8e8e8',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        width: '100%',
                        boxShadow: 'none',
                        cursor: 'pointer',
                        fontWeight: '500',
                        color: '#444',
                        background: 'white',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23444' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center'
                      }}
                    >
                      <option value="any">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                  
                  {/* Sort By Filter */}
                  <div className="filter-item">
                    <label className="form-label" style={{ 
                      fontSize: '15px', 
                      fontWeight: '600', 
                      marginBottom: '8px', 
                      color: '#444'
                    }}>Sort By</label>
                    <select 
                      className="form-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{ 
                        border: '1px solid #e8e8e8',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        width: '100%',
                        boxShadow: 'none',
                        cursor: 'pointer',
                        fontWeight: '500',
                        color: '#444',
                        background: 'white',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23444' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center'
                      }}
                    >
                      <option value="newest">Newest</option>
                      <option value="price-asc">Price (Low to High)</option>
                      <option value="price-desc">Price (High to Low)</option>
                    </select>
                  </div>
                  
                  {/* Apply Filters button */}
                  <div className="filter-item">
                    <label className="form-label" style={{ 
                      fontSize: '15px', 
                      fontWeight: '600', 
                      marginBottom: '8px', 
                      color: '#444'
                    }}>Apply</label>
                    <button
                      className="btn btn-primary"
                      onClick={applyFilters}
                      style={{
                        backgroundColor: '#a4ff2a',
                        color: '#222',
                        border: 'none',
                        fontWeight: '700',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        fontSize: '14px',
                        width: '100%',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.07)',
                        height: '47px', // Match height of other filter inputs
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        style={{ marginRight: '8px' }}
                      >
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                      </svg>
                      Apply Filters
                    </button>
                  </div>
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
