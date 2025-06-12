import React, { useState, useCallback } from 'react';
import { EthisnestBg } from '../../../assets/images';
import { SvgSearchIcon } from '../../../assets/svg-files/SvgFiles.jsx';
import { useNavigate, useLocation } from 'react-router-dom';

const BannerSection = () => {
  const [searchType, setSearchType] = useState('buy'); // Available options: 'buy', 'rent', 'sell', 'mortgage'
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('any');
  const [propertyType, setPropertyType] = useState('all');
  const [bedrooms, setBedrooms] = useState('any');
  const [bathrooms, setBathrooms] = useState('any');
  const [regionalState, setRegionalState] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Toggle filters visibility
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };
  
  // Apply filters and update URL
  const applyFilters = useCallback(() => {
    // Create a new URLSearchParams object for building the updated URL
    const newParams = new URLSearchParams();
    
    // Always include the 'for' parameter based on searchType
    newParams.set('for', searchType);
    
    // Add other filters only if they are not at their default values
    if (searchQuery) newParams.set('search', searchQuery);
    if (priceRange !== 'any') newParams.set('price', priceRange);
    if (propertyType !== 'all') newParams.set('type', propertyType);
    if (bedrooms !== 'any') newParams.set('bedrooms', bedrooms);
    if (bathrooms !== 'any') newParams.set('bathrooms', bathrooms);
    if (regionalState !== 'all') newParams.set('state', regionalState);
    if (sortBy !== 'newest') newParams.set('sort', sortBy);
    
    // Build query string
    const queryString = newParams.toString();
    
    // Navigate based on search type
    if (searchType === 'buy' || searchType === 'rent') {
      navigate({
        pathname: '/property-list',
        search: queryString ? `?${queryString}` : ''
      });
    } else if (searchType === 'sell' || searchType === 'mortgage') {
      navigate({
        pathname: `/${searchType}`,
        search: queryString ? `?${queryString}` : ''
      });
    }
  }, [
    navigate, searchType,
    searchQuery, priceRange, propertyType, bedrooms, 
    bathrooms, regionalState, sortBy
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  return (
    <section 
      className="banner-section" 
      style={{
        backgroundImage: `url(${EthisnestBg})`,
        backgroundColor: 'transparent',
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
                  </ul>
                </div>

                <form onSubmit={handleSearch} style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', marginBottom: '12px' }}>
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
                  </div>
                  
                  {/* Filter toggle button */}
                  <div className="filters-toggle">
                    <button 
                      type="button"
                      className="btn" 
                      onClick={toggleFilters}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: filtersVisible ? '#e8f7c4' : 'white',
                        border: '1px solid #e8e8e8',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#444',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer' // Ensure cursor shows as pointer
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
                        <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                      </svg>
                      {filtersVisible ? 'Hide Filters' : 'Show Filters'}
                    </button>
                  </div>
                  
                  {/* Collapsible filters section */}
                  <div 
                    className="filters-section" 
                    style={{ 
                      backgroundColor: 'white', 
                      borderRadius: '4px', 
                      padding: filtersVisible ? '15px' : '0',
                      marginTop: filtersVisible ? '12px' : '0',
                      border: filtersVisible ? '1px solid #f0f0f0' : 'none',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden',
                      maxHeight: filtersVisible ? '1000px' : '0',
                      opacity: filtersVisible ? 1 : 0
                    }}
                  >
                    <div className="filter-grid" style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                      gap: '12px'
                    }}>
                      {/* Price Range Filter */}
                      <div className="filter-item">
                        <label className="form-label" style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          marginBottom: '6px', 
                          color: '#444'
                        }}>Price Range</label>
                        <select 
                          className="form-select" 
                          value={priceRange}
                          onChange={(e) => setPriceRange(e.target.value)}
                          style={{ 
                            border: '1px solid #e8e8e8',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            fontSize: '14px',
                            width: '100%',
                            boxShadow: 'none',
                            fontWeight: '500',
                            color: '#444',
                            background: 'white'
                          }}
                        >
                          <option value="any">Any Price</option>
                          <option value="0-1000000">ETB 0 - 1,000,000</option>
                          <option value="1000000-5000000">ETB 1,000,000 - 5,000,000</option>
                          <option value="5000000-10000000">ETB 5,000,000 - 10,000,000</option>
                          <option value="10000000-20000000">ETB 10,000,000 - 20,000,000</option>
                          <option value="20000000+">ETB 20,000,000+</option>
                        </select>
                      </div>
                      
                      {/* Regional State Filter */}
                      <div className="filter-item">
                        <label className="form-label" style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          marginBottom: '6px', 
                          color: '#444'
                        }}>Regional State</label>
                        <select 
                          className="form-select"
                          value={regionalState}
                          onChange={(e) => setRegionalState(e.target.value)}
                          style={{ 
                            border: '1px solid #e8e8e8',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            fontSize: '14px',
                            width: '100%',
                            boxShadow: 'none',
                            fontWeight: '500',
                            color: '#444',
                            background: 'white'
                          }}
                        >
                          <option value="all">All Regions</option>
                          <option value="Addis Ababa City Administration">Addis Ababa City Administration</option>
                          <option value="Oromia Region">Oromia Region</option>
                          <option value="Amhara Region">Amhara Region</option>
                          <option value="Tigray Region">Tigray Region</option>
                          <option value="Sidama Region">Sidama Region</option>
                          <option value="Southern Nations, Nationalities, and Peoples Region">Southern Nations, Nationalities, and Peoples Region</option>
                          <option value="Afar Region">Afar Region</option>
                          <option value="Somali Region">Somali Region</option>
                          <option value="Benishangul-gumuz Region">Benishangul-Gumuz Region</option>
                          <option value="Gambela Region">Gambela Region</option>
                          <option value="Harari Region">Harari Region</option>
                        </select>
                      </div>
                      
                      {/* Property Type Filter */}
                      <div className="filter-item">
                        <label className="form-label" style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          marginBottom: '6px', 
                          color: '#444'
                        }}>Property Type</label>
                        <select 
                          className="form-select"
                          value={propertyType}
                          onChange={(e) => setPropertyType(e.target.value)}
                          style={{ 
                            border: '1px solid #e8e8e8',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            fontSize: '14px',
                            width: '100%',
                            boxShadow: 'none',
                            fontWeight: '500',
                            color: '#444',
                            background: 'white'
                          }}
                        >
                          <option value="all">All Types</option>
                          <option value="apartment">Apartment</option>
                          <option value="house">House</option>
                          <option value="villa">Villa</option>
                          <option value="studio">Studio</option>
                          <option value="land">Land</option>
                        </select>
                      </div>
                      
                      {/* Bedrooms Filter */}
                      <div className="filter-item">
                        <label className="form-label" style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          marginBottom: '6px', 
                          color: '#444'
                        }}>Bedrooms</label>
                        <select 
                          className="form-select"
                          value={bedrooms}
                          onChange={(e) => setBedrooms(e.target.value)}
                          style={{ 
                            border: '1px solid #e8e8e8',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            fontSize: '14px',
                            width: '100%',
                            boxShadow: 'none',
                            fontWeight: '500',
                            color: '#444',
                            background: 'white'
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
                          fontSize: '14px', 
                          fontWeight: '600', 
                          marginBottom: '6px', 
                          color: '#444'
                        }}>Bathrooms</label>
                        <select 
                          className="form-select"
                          value={bathrooms}
                          onChange={(e) => setBathrooms(e.target.value)}
                          style={{ 
                            border: '1px solid #e8e8e8',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            fontSize: '14px',
                            width: '100%',
                            boxShadow: 'none',
                            fontWeight: '500',
                            color: '#444',
                            background: 'white'
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
                          fontSize: '14px', 
                          fontWeight: '600', 
                          marginBottom: '6px', 
                          color: '#444'
                        }}>Sort By</label>
                        <select 
                          className="form-select"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          style={{ 
                            border: '1px solid #e8e8e8',
                            borderRadius: '4px',
                            padding: '8px 12px',
                            fontSize: '14px',
                            width: '100%',
                            boxShadow: 'none',
                            fontWeight: '500',
                            color: '#444',
                            background: 'white'
                          }}
                        >
                          <option value="newest">Newest</option>
                          <option value="price-asc">Price (Low to High)</option>
                          <option value="price-desc">Price (High to Low)</option>
                        </select>
                      </div>
                      
                      {/* Apply Filters Button */}
                      <div className="filter-actions" style={{ gridColumn: '1 / -1', textAlign: 'right', marginTop: '10px' }}>
                        <button 
                          type="button"
                          className="btn btn-primary px-4"
                          onClick={applyFilters}
                          style={{
                            backgroundColor: '#a4ff2a',
                            color: '#222',
                            border: 'none',
                            fontWeight: '700',
                            borderRadius: '4px',
                            padding: '8px 20px',
                            fontSize: '14px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
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
