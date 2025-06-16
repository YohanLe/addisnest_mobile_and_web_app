import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GetAllPropertyListings } from '../../Redux-store/Slices/HomeSlice';
import { GetUserPayments } from '../../Redux-store/Slices/PaymentSlice';
import { isAuthenticated } from '../../utils/tokenHandler';
import { Property1, Property2, Property3 } from '../../assets/images';

const PropertyListPage = () => {
  const dispatch = useDispatch();
  const { data, pending } = useSelector((state) => state.Home?.HomeData || { data: null, pending: false });
  const userPayments = useSelector((state) => state.Payments?.userPayments || { data: null, pending: false });
  const isLoggedIn = isAuthenticated();
  const [purchasedProperties, setPurchasedProperties] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
  const [priceRange, setPriceRange] = useState(queryParams.get('priceRange') || 'any');
  const [propertyType, setPropertyType] = useState(queryParams.get('propertyType') || 'all');
  const [bedrooms, setBedrooms] = useState(queryParams.get('bedrooms') || 'any');
  const [bathrooms, setBathrooms] = useState(queryParams.get('bathrooms') || 'any');
  const [regionalState, setRegionalState] = useState(queryParams.get('regionalState') || 'all');
  const [sortBy, setSortBy] = useState(queryParams.get('sortBy') || 'newest');
  const [offeringType, setOfferingType] = useState(location.search.includes('rent') ? 'For Rent' : 'For Sale');
  const [filtersVisible, setFiltersVisible] = useState(true);
  const navigate = useNavigate();

  const applyFilters = () => {
    const queryParams = new URLSearchParams();
    queryParams.set('for', location.search.includes('rent') ? 'rent' : 'buy');
    if (searchQuery) queryParams.set('search', searchQuery);
    if (priceRange && priceRange !== 'any') queryParams.set('priceRange', priceRange);
    if (propertyType && propertyType !== 'all') queryParams.set('propertyType', propertyType);
    if (bedrooms && bedrooms !== 'any') queryParams.set('bedrooms', bedrooms);
    if (bathrooms && bathrooms !== 'any') queryParams.set('bathrooms', bathrooms);
    if (regionalState && regionalState !== 'all') queryParams.set('regionalState', regionalState);
    if (sortBy !== 'newest') queryParams.set('sortBy', sortBy);

    navigate(`/property-list?${queryParams.toString()}`);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('for') || 'buy';
    const searchParam = queryParams.get('search') || '';
    const priceRangeParam = queryParams.get('priceRange') || 'any';
    const propertyTypeParam = queryParams.get('propertyType') || 'all';
    const bedroomsParam = queryParams.get('bedrooms') || 'any';
    const bathroomsParam = queryParams.get('bathrooms') || 'any';
    const regionalStateParam = queryParams.get('regionalState') || 'all';
    const sortByParam = queryParams.get('sortBy') || 'newest';

    setSearchQuery(searchParam);
    setPriceRange(priceRangeParam);
    setPropertyType(propertyTypeParam);
    setBedrooms(bedroomsParam);
    setBathrooms(bathroomsParam);
    setRegionalState(regionalStateParam);
    setSortBy(sortByParam);

    // Fetch initial properties when the component mounts or location changes
    dispatch(
      GetAllPropertyListings({
        type,
        page: 1,
        limit: 50,
        search: searchParam,
        priceRange: priceRangeParam,
        propertyType: propertyTypeParam,
        bedrooms: bedroomsParam,
        bathrooms: bathroomsParam,
        regionalState: regionalStateParam,
        sortBy: sortByParam,
        offeringType: offeringType === 'For Sale' ? ['For Sale', 'For Rent'] : offeringType,
      })
    );

    if (isLoggedIn) {
      dispatch(GetUserPayments());
    }
  }, [dispatch, location.search, isLoggedIn, offeringType]);

  // Process user payments to identify purchased properties
  useEffect(() => {
    if (userPayments.data && userPayments.data.success && data && data.data) {
      // Extract property IDs from completed payments
      const purchasedPropertyIds = userPayments.data.data
        .filter(payment => payment.status === 'completed')
        .map(payment => payment.property?._id);

      // Find purchased properties in the property list
      const purchased = data.data.filter(property => 
        purchasedPropertyIds.includes(property._id)
      );

      setPurchasedProperties(purchased);
    }
  }, [userPayments.data, data]);

  // Toggle filters visibility
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  // Use actual data from database
  const allProperties = data?.data || [];
  
  // Filter out purchased properties from main list to avoid duplication
  const properties = allProperties.filter(property => 
    !purchasedProperties.some(p => p._id === property._id)
  );

  // Format price to display with commas
  const formatPrice = (property) => {
    const price = property.price?.amount || property.price || 0;
    const currency = property.price?.currency || 'ETB';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(price).replace('$', currency + ' ');
  };
  
  // Get beds, baths, area from property
  const getBeds = (property) => {
    return property.specifications?.bedrooms || property.bedrooms || 0;
  };
  
  const getBaths = (property) => {
    return property.specifications?.bathrooms || property.bathrooms || 0;
  };
  
  const getArea = (property) => {
    const size = property.specifications?.area?.size || property.squareFeet || 0;
    const unit = property.specifications?.area?.unit || 'sqft';
    return { size, unit };
  };
  
  const getAddress = (property) => {
    // Handle nested address structure
    if (property.address && typeof property.address === 'object') {
      const { street, city, state, country } = property.address;
      const parts = [street, city, state].filter(Boolean);
      return parts.join(', ');
    }
    
    // Handle flat address fields
    if (property.street || property.city || property.state) {
      const parts = [property.street, property.city, property.state].filter(Boolean);
      return parts.join(', ');
    }
    
    // Handle legacy location field
    if (property.location) {
      const parts = [
        property.location.address,
        property.location.city,
        property.location.state
      ].filter(Boolean);
      return parts.join(', ');
    }
    
    // Fallback
    return property.address || '';
  };
  
  const getListingTags = (property) => {
    const tags = [];
    
    if (property.featured) {
      tags.push('HOT HOME');
    }
    
    return tags;
  };

  return (
    <div className="property-list-page py-5">
      <style>{`
        .property-card .property-image img:hover {
          transform: scale(1.1);
        }
      `}</style>
      <div className="container">
        {/* Purchased Properties Section */}
        {purchasedProperties.length > 0 && (
          <div className="purchased-properties mb-5">
            <h2 className="mb-4" style={{ fontSize: '1.8rem', fontWeight: '700', color: '#333' }}>
              Your Purchased Properties
            </h2>
            <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {purchasedProperties.map((property) => (
                <div key={`purchased-${property._id}`} className="col-lg-4 col-md-6" style={{ flex: '0 0 calc(33.333% - 20px)' }}>
                  <div 
                    className="property-card"
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
                      height: '100%',
                      border: '1px solid #f0f0f0',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      marginBottom: '20px'
                    }}
                  >
                    <div 
                      className="property-image"
                      style={{
                        position: 'relative',
                        height: '200px',
                        overflow: 'hidden'
                      }}
                    >
                      <img 
                        src={property.images?.[0]?.url || property.imageUrl || Property1} 
                        alt={property.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                      
                      {/* Purchased tag */}
                      <div 
                        className="property-tag"
                        style={{
                          position: 'absolute',
                          top: '15px',
                          left: '15px',
                          background: '#007bff',
                          color: '#fff',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          padding: '5px 15px',
                          borderRadius: '6px',
                          zIndex: 2
                        }}
                      >
                        Purchased
                      </div>
                    </div>

                    <div style={{ padding: '20px' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
                        {formatPrice(property)}
                      </h3>
                      
                      <div style={{ 
                        display: 'flex', 
                        gap: '15px',
                        fontSize: '0.9rem',
                        color: '#666',
                        marginBottom: '10px'
                      }}>
                        <span>{getBeds(property)} beds</span>
                        <span>•</span>
                        <span>{getBaths(property)} baths</span>
                        <span>•</span>
                        <span>{getArea(property).size} {getArea(property).unit}</span>
                      </div>
                      
                      <p style={{ 
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        color: '#333',
                        marginBottom: '5px'
                      }}>
                        {getAddress(property)}
                      </p>
                      
                      <p style={{ fontSize: '0.9rem', color: '#666' }}>
                        {property.title}
                      </p>
                    </div>
                    
                    <Link 
                      to={`/property/${property._id || '648a97f4d254d67c1e5f461b'}`} 
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1
                      }}
                      aria-label={`View details for ${property.title}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="page-header mb-4">
          <h1 className="mb-2" style={{ fontSize: '2.2rem', fontWeight: '700', color: '#333' }}>
            <Link 
              to="/property-list" 
              style={{ textDecoration: 'none', color: '#333' }}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (window.location.pathname === '/property-list') {
                  window.location.reload();
                }
              }}
            >
              {location.search.includes('rent') ? 'Properties for Rent' : 'Properties for Sale'}
            </Link>
          </h1>
          <p className="text-muted">Find the perfect property to call home in Ethiopia</p>
        </div>
        
        {/* Apply Filters button moved to inside the filters section */}
        
        {/* Filter toggle button */}
        <div className="filters-toggle mb-3">
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
            marginBottom: filtersVisible ? '24px' : '0'
          }}
        >
          <div className="filter-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {/* Offering Type filter removed as it's now handled by the header navigation */}

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
            
            {/* Apply Filters button moved next to Sort By */}
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
          
          {/* Removed duplicate Apply Filters button as it's now next to Sort By */}
        </div>
        
        {/* Property results count */}
        <div className="results-header mb-4">
          <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#333' }}>
            <span style={{ color: '#0066cc' }}>{properties.length}</span> Properties Found
          </h3>
        </div>
        
        {/* Property listings */}
        {pending ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading properties...</p>
          </div>
        ) : (
          <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {properties.map((property) => (
              <div key={property._id} className="col-lg-4 col-md-6" style={{ flex: '0 0 calc(33.333% - 20px)' }}>
                <div 
                  className="property-card"
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
                    height: '100%',
                    border: '1px solid #f0f0f0',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    marginBottom: '20px'
                  }}
                >
                  <div 
                    className="property-image"
                    style={{
                      position: 'relative',
                      height: '200px',
                      overflow: 'hidden'
                    }}
                  >
                    <img 
                      src={property.images?.[0]?.url || property.imageUrl || Property1} 
                      alt={property.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                    />
                    
                    {/* For sale tag */}
                    <div 
                      className="property-tag"
                      style={{
                        position: 'absolute',
                        top: '15px',
                        left: '15px',
                        background: '#a4ff2a',
                        color: '#222',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        padding: '5px 15px',
                        borderRadius: '6px',
                        zIndex: 2
                      }}
                    >
                      <Link 
                        to="/property-list" 
                        style={{ 
                          textDecoration: 'none', 
                          color: '#222'
                        }}
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          if (window.location.pathname === '/property-list') {
                            window.location.reload();
                          }
                        }}
                      >
                        {location.search.includes('rent') ? 'For Rent' : 'For Sale'}
                      </Link>
                    </div>
                  </div>

                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
                      {formatPrice(property)}
                    </h3>
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: '15px',
                      fontSize: '0.9rem',
                      color: '#666',
                      marginBottom: '10px'
                    }}>
                      <span>{getBeds(property)} beds</span>
                      <span>•</span>
                      <span>{getBaths(property)} baths</span>
                      <span>•</span>
                      <span>{getArea(property).size} {getArea(property).unit}</span>
                    </div>
                    
                    <p style={{ 
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      color: '#333',
                      marginBottom: '5px'
                    }}>
                      {getAddress(property)}
                    </p>
                    
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                      {property.title}
                    </p>
                  </div>
                  
                  <Link 
                    to={`/property/${property._id || '648a97f4d254d67c1e5f461b'}`} 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      zIndex: 1
                    }}
                    aria-label={`View details for ${property.title}`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyListPage;
