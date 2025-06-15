import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GetHomeData } from '../../../Redux-store/Slices/HomeSlice';
import { Property1, Property2, Property3 } from '../../../assets/images';
import { BsHeart, BsShare } from 'react-icons/bs';
import { GoLocation } from 'react-icons/go';

const FeaturedProperties = () => {
  const dispatch = useDispatch();
  const { data, pending, error } = useSelector((state) => state.Home?.HomeData || { data: null, pending: false, error: null });
  console.log("Rendering FeaturedProperties");
  // Debug data in console
  useEffect(() => {
    if (data) {
      console.log('HomeData received in FeaturedProperties:', data);
    }
    if (error) {
      console.error('Error loading properties:', error);
    }
  }, [data, error]);
  const [propertyType, setPropertyType] = useState('buy');
  
  useEffect(() => {
    // Fetch all property listings
    dispatch(GetHomeData({ type: propertyType, page: 1, limit: 12 }));
  }, [dispatch, propertyType]);

  // Generate status labels for properties based on property type
  const getPropertyStatus = (property) => {
    if (!property) return { text: "For Sale", color: "#00AE43" };
    
    const offeringType = property.offeringType || property.status;
    if (offeringType && offeringType.includes('Rent')) {
      return { text: "For Rent", color: "#0066cc" };
    }
    
    // If it's a new property (less than 7 days old)
    const createdDate = new Date(property.createdAt);
    const now = new Date();
    const daysDifference = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
    
    if (daysDifference < 1) {
      return { text: "NEW TODAY", color: "#00AE43" };
    } else if (daysDifference < 7) {
      return { text: `NEW ${daysDifference} DAYS AGO`, color: "#00AE43" };
    }
    
    return { text: "For Sale", color: "#E93131" };
  };

  // Format price with commas
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Get formatted address from property
  const getPropertyAddress = (property) => {
    if (!property) return "No address available";
    
    // Try nested address structure first
    if (property.address && typeof property.address === 'object') {
      const { street, city, state, country } = property.address;
      const addressParts = [street, city, state, country].filter(part => part);
      if (addressParts.length > 0) {
        return addressParts.join(', ');
      }
    }
    
    // Fall back to flat address structure
    const flatAddressParts = [property.street, property.city, property.state, property.country].filter(part => part);
    if (flatAddressParts.length > 0) {
      return flatAddressParts.join(', ');
    }
    
    return property.title || "No address available";
  };
  
  // Get property image URL
  const getPropertyImageUrl = (property) => {
    if (!property) return Property1;
    
    // Check if images array exists and has at least one item with a URL
    if (property.images && property.images.length > 0 && property.images[0].url) {
      return property.images[0].url;
    }
    
    // Fall back to imageUrl if available
    if (property.imageUrl) {
      return property.imageUrl;
    }
    
    // Default fallback images based on property ID
    const fallbackImages = [Property1, Property2, Property3];
    const idSum = property._id ? property._id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) : 0;
    return fallbackImages[idSum % fallbackImages.length];
  };

  return (
    <section className="featured-properties-section" style={{ padding: '30px 0', background: '#fff' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="section-heading" style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>All Properties</h2>
          <p style={{ color: '#666' }}>Discover your dream home among our property listings</p>
        </div>
        
        {pending && (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <div style={{ display: 'inline-block', width: '50px', height: '50px', border: '5px solid #f3f3f3', 
                         borderTop: '5px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}>
            </div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {!pending && (
          <div className="property-grid" style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            justifyContent: 'center',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {data && data.data && data.data.length > 0 ? (
              data.data.slice(0, 12).map((property) => (
                <div key={property._id} className="property-card" style={{ 
                  width: '100%',
                  maxWidth: '400px',
                  borderRadius: '8px', 
                  overflow: 'hidden', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                  position: 'relative',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  background: '#fff',
                }}>
                  <div className="property-image" style={{ height: '215px', position: 'relative' }}>
                    <img 
                      src={getPropertyImageUrl(property)} 
                      alt={property.title || "Property"}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = Property1;
                      }}
                    />
                    
                    {/* Status banner */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '12px', 
                      left: '0px', 
                      background: getPropertyStatus(property).color, 
                      color: 'white',
                      padding: '4px 12px', 
                      fontSize: '11px', 
                      fontWeight: 'bold',
                      zIndex: 2
                    }}>
                      {getPropertyStatus(property).text}
                    </div>
                    
                    {/* Year indicator */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '12px', 
                      right: '12px', 
                      background: 'rgba(0,0,0,0.5)', 
                      color: 'white',
                      padding: '2px 8px', 
                      fontSize: '10px', 
                      borderRadius: '4px',
                      zIndex: 2
                    }}>
                      {new Date(property.createdAt).getFullYear() || new Date().getFullYear()}
                    </div>

                    {/* Location icon */}
                    <div style={{ 
                      position: 'absolute', 
                      bottom: '12px', 
                      right: '12px', 
                      background: 'rgba(0,0,0,0.6)', 
                      color: 'white',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2
                    }}>
                      <GoLocation style={{ fontSize: '18px' }} />
                    </div>
                  </div>
              
                  <div className="property-details" style={{ padding: '16px' }}>
                    {/* Price and action buttons */}
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <h3 style={{ 
                        margin: 0, 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold',
                        color: '#2b2b2b'
                      }}>
                        {formatPrice(property.price)}
                      </h3>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button style={{ 
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '20px',
                          color: '#555'
                        }}>
                          <BsShare />
                        </button>
                        <button style={{ 
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '20px',
                          color: '#555'
                        }}>
                          <BsHeart />
                        </button>
                      </div>
                    </div>
                    
                    {/* Property details */}
                    <div style={{ marginBottom: '10px' }}>
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '0.95rem', 
                        color: '#333',
                        fontWeight: '500',
                        lineHeight: '1.4'
                      }}>
                        {getPropertyAddress(property)}
                      </p>
                      <div style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        fontSize: '0.9rem', 
                        color: '#444', 
                        fontWeight: '500'
                      }}>
                        <span>{property.bedrooms || 0} beds</span>
                        <span>{property.bathrooms || 0} baths</span>
                        <span>{property.area || 0} sq ft</span>
                      </div>
                    </div>
                    
                    {/* Property type or title */}
                    <p style={{ 
                      margin: '12px 0 0 0', 
                      fontSize: '0.8rem', 
                      color: '#666',
                      borderTop: '1px solid #eee',
                      paddingTop: '12px'
                    }}>
                      {property.propertyType || property.title || "Property"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '50px 0' }}>
                <p>No properties available at the moment. Check back soon!</p>
              </div>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link 
            to="/property-list" 
            style={{
              display: 'inline-block',
              padding: '12px 30px',
              background: '#0066cc',
              color: 'white',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              transition: 'background 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
