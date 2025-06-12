import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { GetAllPropertyListings } from '../../Redux-store/Slices/HomeSlice';
import { GetUserPayments } from '../../Redux-store/Slices/PaymentSlice';
import { isAuthenticated } from '../../utils/tokenHandler';
import { Property1, Property2, Property3 } from '../../assets/images';

const PropertyListPage = () => {
  const dispatch = useDispatch();
  const { data, pending } = useSelector((state) => state.Home?.PropertyListings || { data: null, pending: false });
  const userPayments = useSelector((state) => state.Payments?.userPayments || { data: null, pending: false });
  const isLoggedIn = isAuthenticated();
  const [purchasedProperties, setPurchasedProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('any');
  const [propertyType, setPropertyType] = useState('all');
  const [bedrooms, setBedrooms] = useState('any');
  const [bathrooms, setBathrooms] = useState('any');
  const [regionalState, setRegionalState] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [filtersVisible, setFiltersVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Fetch all property listings
    dispatch(GetAllPropertyListings({ type: 'buy', page: 1, limit: 50 }));

    // Extract search query from URL if it exists
    const queryParams = new URLSearchParams(location.search);
    const searchParam = queryParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }

    // Fetch user payments if logged in
    if (isLoggedIn) {
      dispatch(GetUserPayments());
    }
  }, [dispatch, location.search, isLoggedIn]);

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

  // Fallback properties if API fails or is pending
  const fallbackProperties = [
    {
      _id: '1',
      title: 'Modern Apartment in City Center',
      address: 'Bole, Addis Ababa',
      price: 5500000,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1500,
      propertyType: 'Apartment',
      imageUrl: Property1,
      featured: true
    },
    {
      _id: '2',
      title: 'Luxury Villa with Garden',
      address: 'CMC, Addis Ababa',
      price: 12000000,
      bedrooms: 5,
      bathrooms: 4,
      squareFeet: 3200,
      propertyType: 'House',
      imageUrl: Property2,
      featured: false
    },
    {
      _id: '3',
      title: 'Cozy Studio for Professionals',
      address: 'Kazanchis, Addis Ababa',
      price: 2800000,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 800,
      propertyType: 'Studio',
      imageUrl: Property3,
      featured: false
    },
    {
      _id: '4',
      title: 'Family Home with Beautiful View',
      address: 'Ayat, Addis Ababa',
      price: 7800000,
      bedrooms: 4,
      bathrooms: 3,
      squareFeet: 2200,
      propertyType: 'House',
      imageUrl: Property1,
      featured: true
    },
    {
      _id: '5',
      title: 'Penthouse with City Skyline View',
      address: 'Bole, Addis Ababa',
      price: 15000000,
      bedrooms: 3,
      bathrooms: 3,
      squareFeet: 1800,
      propertyType: 'Apartment',
      imageUrl: Property2,
      featured: false
    },
    {
      _id: '6',
      title: 'Spacious Apartment Near Park',
      address: 'Gerji, Addis Ababa',
      price: 4200000,
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1200,
      propertyType: 'Apartment',
      imageUrl: Property3,
      featured: false
    },
    {
      _id: '7',
      title: 'Modern Townhouse in Gated Community',
      address: 'Lebu, Addis Ababa',
      price: 6700000,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1800,
      propertyType: 'Townhouse',
      imageUrl: Property1,
      featured: true
    },
    {
      _id: '8',
      title: 'Elegant Villa with Pool',
      address: 'Old Airport, Addis Ababa',
      price: 18000000,
      bedrooms: 5,
      bathrooms: 4,
      squareFeet: 4000,
      propertyType: 'Villa',
      imageUrl: Property2,
      featured: false
    },
    {
      _id: '9',
      title: 'Affordable Studio for Students',
      address: 'Mexico, Addis Ababa',
      price: 1800000,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 600,
      propertyType: 'Studio',
      imageUrl: Property3,
      featured: false
    },
    {
      _id: '10',
      title: 'Luxury Condominium with Modern Amenities',
      address: 'Summit, Addis Ababa',
      price: 9500000,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1700,
      propertyType: 'Apartment',
      imageUrl: Property1,
      featured: false
    },
    {
      _id: '11',
      title: 'Commercial Property in Business District',
      address: 'Kasanchis, Addis Ababa',
      price: 25000000,
      bedrooms: 0,
      bathrooms: 2,
      squareFeet: 3500,
      propertyType: 'Commercial',
      imageUrl: Property2,
      featured: true
    },
    {
      _id: '12',
      title: 'Charming Cottage with Garden',
      address: 'Entoto, Addis Ababa',
      price: 4800000,
      bedrooms: 2,
      bathrooms: 1,
      squareFeet: 1100,
      propertyType: 'House',
      imageUrl: Property3,
      featured: false
    }
  ];

  // Use data from API if available, otherwise use fallback
  const allProperties = data?.data?.length > 0 ? data.data : fallbackProperties;
  
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
    if (property.location) {
      return `${property.location.address}, ${property.location.city}, ${property.location.state}`;
    }
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
              Properties for Sale
            </Link>
          </h1>
          <p className="text-muted">Find the perfect property to call home in Ethiopia</p>
        </div>
        
        {/* Main search bar */}
        <div className="search-filter mb-4">
          <div className="input-group" style={{ 
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.07)',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}>
            <input 
              type="text" 
              placeholder="Search by location, property type, or keyword..." 
              className="form-control form-control-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                border: '1px solid #f0f0f0', 
                borderRight: 'none',
                borderRadius: '12px 0 0 12px',
                padding: '15px 20px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#444',
                transition: 'all 0.2s ease'
              }}
            />
            <button 
              className="btn btn-primary px-4"
              style={{
                backgroundColor: '#a4ff2a',
                color: '#222',
                border: 'none',
                fontWeight: '700',
                borderRadius: '0 12px 12px 0',
                padding: '15px 30px',
                fontSize: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
              Search
            </button>
          </div>
        </div>
        
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
                <option value="addis-ababa">Addis Ababa</option>
                <option value="oromia">Oromia</option>
                <option value="amhara">Amhara</option>
                <option value="tigray">Tigray</option>
                <option value="sidama">Sidama</option>
                <option value="snnpr">SNNPR</option>
                <option value="afar">Afar</option>
                <option value="somali">Somali</option>
                <option value="benishangul-gumuz">Benishangul-Gumuz</option>
                <option value="gambela">Gambela</option>
                <option value="harari">Harari</option>
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
          </div>
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
                        For sale
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
