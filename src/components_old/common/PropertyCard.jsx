import React from 'react';
import { Link } from 'react-router-dom';
import { BsHeart, BsShare } from 'react-icons/bs';
import { GoLocation } from 'react-icons/go';
import ImageWithFallback from './ImageWithFallback';

// Icons for property features
import { FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';

const PropertyCard = ({ 
  property, 
  showStatus = true, 
  showYear = true, 
  showLocationIcon = true,
  isPurchased = false,
  linkState = {}
}) => {
  // Format price with commas, handling invalid values
  const formatPrice = (price) => {
    // Handle undefined, null, NaN, or non-numeric values
    if (price === undefined || price === null || isNaN(price) || typeof price !== 'number') {
      return '$0';
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Get property details helpers directly from database fields
  const getBeds = () => {
    return property.bedrooms || 0;
  };
  
  const getBaths = () => {
    return property.bathrooms || 0;
  };
  
  const getArea = () => {
    const size = property.area || property.squareFeet || 0;
    const unit = 'sq ft';
    return { size, unit };
  };
  
  const getAddress = () => {
    // Handle database format (address is an object with street, city, state fields)
    if (typeof property.address === 'object') {
      return `${property.address.street || ''}, ${property.address.city || ''}, ${property.address.state || ''}`;
    } 
    // Handle legacy location field
    else if (property.location) {
      return `${property.location.address || ''}, ${property.location.city || ''}, ${property.location.state || ''}`;
    }
    // Handle string address
    return property.address || '';
  };
  
  // Get property type from database
  const getPropertyType = () => {
    return property.propertyType || 'Property';
  };
  
  // Get offering type (For Sale/For Rent)
  const getOfferingType = () => {
    // If status is an object, we need to handle it differently
    if (property.offeringType) {
      return property.offeringType;
    }
    
    if (property.status && typeof property.status === 'object') {
      return property.status.text || 'For Sale';
    }
    
    return property.status || 'For Sale';
  };
  
  // Get property status badge text and color
  const getStatusBadge = () => {
    if (isPurchased) {
      return { text: "Purchased", color: "#007bff" };
    }
    
    if (property.status?.text && property.status?.color) {
      return property.status;
    }
    
    // Map database status to display status
    const statusMap = {
      'For Sale': { text: "FOR SALE", color: "#00AE43" },
      'For Rent': { text: "FOR RENT", color: "#0066cc" },
      'Sold': { text: "SOLD", color: "#CE5E2A" },
      'Rented': { text: "RENTED", color: "#CE5E2A" },
      'Pending': { text: "PENDING", color: "#f7b731" },
      'pending_payment': { text: "PAYMENT PENDING", color: "#f7b731" },
      'active': { text: "ACTIVE", color: "#00AE43" }
    };
    
    return statusMap[property.status] || { text: "LISTED", color: "#E93131" };
  };

  return (
    <div className="property-card-container" style={{ position: 'relative', width: '100%', marginBottom: '24px' }}>
      <div 
        className="property-card" 
        style={{ 
          width: '100%',
          maxWidth: '400px',
          borderRadius: '8px', 
          overflow: 'hidden', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
          position: 'relative',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          marginBottom: '8px',
          background: '#fff',
          transform: 'translateZ(0)', /* Force hardware acceleration */
          willChange: 'transform, box-shadow', /* Optimize animations */
        }}
      >
        <div className="property-image" style={{ height: '215px', position: 'relative' }}>
          <ImageWithFallback 
            src={property.images && property.images.length > 0 ? property.images[0].url : property.imageUrl} 
            alt={property.title}
            fallbackSrc="/placeholder-property.jpg"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          
          {/* Status banner or purchased badge */}
          {showStatus && (
            <div style={{ 
              position: 'absolute', 
              top: '12px', 
              left: '0px', 
              background: getStatusBadge().color, 
              color: 'white',
              padding: '4px 12px', 
              fontSize: '11px', 
              fontWeight: 'bold',
              zIndex: 2
            }}>
              {typeof getStatusBadge().text === 'object' 
                ? JSON.stringify(getStatusBadge().text) 
                : String(getStatusBadge().text)}
            </div>
          )}
          
          {/* Year indicator */}
          {showYear && (
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
              {property.year || new Date().getFullYear()}
            </div>
          )}

          {/* Location icon */}
          {showLocationIcon && (
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
          )}
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
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  // Share functionality would go here
                }}
                style={{ 
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#555',
                  zIndex: 2,
                  position: 'relative'
                }}
              >
                <BsShare />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  // Favorite functionality would go here
                }}
                style={{ 
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#555',
                  zIndex: 2,
                  position: 'relative'
                }}
              >
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
              {getAddress()}
            </p>
            <p style={{
              margin: '0 0 8px 0',
              fontSize: '0.85rem',
              color: '#666',
              fontWeight: '500'
            }}>
              {getPropertyType()} • {getOfferingType()}
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              fontSize: '0.9rem', 
              color: '#444', 
              fontWeight: '500',
              alignItems: 'center'
            }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <FaBed style={{ marginRight: '4px' }} /> {getBeds()} beds
              </span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <FaBath style={{ marginRight: '4px' }} /> {getBaths()} baths
              </span>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <FaRulerCombined style={{ marginRight: '4px' }} /> {getArea().size} {getArea().unit}
              </span>
            </div>
          </div>
          
          {/* Agent info */}
          <p style={{ 
            margin: '12px 0 0 0', 
            fontSize: '0.8rem', 
            color: '#666',
            borderTop: '1px solid #eee',
            paddingTop: '12px'
          }}>
            {typeof property.agent === 'object' 
              ? (property.agent?.agency?.name || property.agent?.email || 'Agent Information') 
              : (property.agent || 'Agent Information')}
          </p>
        </div>
      </div>
      
      {/* Clickable overlay linking to property details */}
      <Link 
        to={`/property-detail/${property._id}`}
        state={{ ...linkState }}
        onClick={() => {
          // Log detailed property info for debugging
          console.log('Navigating to property with ID:', property._id);
          
          // Normalize MongoDB ID for consistent format
          let normalizedId = property._id;
          
          // If ID starts with ObjectId, extract the hex string
          if (typeof normalizedId === 'string' && normalizedId.startsWith('ObjectId(') && normalizedId.endsWith(')')) {
            normalizedId = normalizedId.substring(9, normalizedId.length - 1);
            console.log('Extracted ID from ObjectId format:', normalizedId);
          }
          
          // For IDs with quotes, remove them
          if (typeof normalizedId === 'string' && normalizedId.startsWith('"') && normalizedId.endsWith('"')) {
            normalizedId = normalizedId.substring(1, normalizedId.length - 1);
            console.log('Removed quotes from ID:', normalizedId);
          }
          
          // Make sure we have a valid MongoDB ID
          const validMongoId = normalizedId && typeof normalizedId === 'string' && /^[0-9a-fA-F]{24}$/.test(normalizedId);
          
          if (!validMongoId) {
            console.warn('Property has non-MongoDB ID format:', property._id, 'Normalized:', normalizedId);
          } else {
            console.log('Valid MongoDB ID confirmed:', normalizedId);
          }
          
          // Create a more complete property object with all required database fields
          const enhancedProperty = {
            ...property,
            // Ensure critical fields are present from the Property model
            _id: normalizedId || property._id, // Use normalized ID if valid
            owner: property.owner || "6845436d504a2bf073a4a7e2", // Default owner ID if missing
            title: property.title || "Property Title",
            description: property.description || "Property description",
            propertyType: property.propertyType || "House",
            offeringType: property.offeringType || "For Sale",
            status: property.status || "active",
            paymentStatus: property.paymentStatus || "none",
            price: property.price || 0,
            area: property.area || 0,
            bedrooms: property.bedrooms || 0,
            bathrooms: property.bathrooms || 0,
            address: property.address || {},
            images: property.images || [],
            isPremium: property.isPremium || false,
            isVerified: property.isVerified || false,
            views: property.views || 0,
            likes: property.likes || 0
          };
          
          // Store the enhanced property in localStorage for fallback access in detail page
          try {
            console.log('Storing enhanced property in localStorage with ID:', normalizedId || property._id);
            localStorage.setItem('last_clicked_property', JSON.stringify(enhancedProperty));
            
            // Also store in global cache for consistent access across the app
            if (!window.propertyCache) {
              window.propertyCache = {};
            }
            window.propertyCache[normalizedId || property._id] = enhancedProperty;
          } catch (err) {
            console.error('Error storing property in localStorage:', err);
          }
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
        aria-label={`View details for ${property.title || 'this property'}`}
      />
    </div>
  );
};

export default PropertyCard;
