/**
 * Property Edit Form Fixes
 * 
 * This module provides fixes for common issues in the property editing workflow:
 * - Properly handling nested address structures
 * - Fixing amenities handling
 * - Ensuring images are properly loaded and displayed
 */

// Extract street from address object or string
export const extractStreet = (address) => {
  if (!address) return '';
  
  if (typeof address === 'string') {
    return address;
  }
  
  if (typeof address === 'object') {
    // Direct street property
    if (address.street) {
      return address.street;
    }
    
    // Fallback to concatenating available properties
    const entries = Object.entries(address)
      .filter(([_, v]) => v && typeof v === 'string')
      .map(([_, v]) => v);
    
    return entries.join(', ');
  }
  
  return '';
};

// Extract city from address object or other property
export const extractCity = (property) => {
  if (!property) return '';
  
  // Direct city property
  if (property.city && typeof property.city === 'string') {
    return property.city;
  }
  
  // City in address object
  if (property.address && typeof property.address === 'object' && property.address.city) {
    return property.address.city;
  }
  
  return '';
};

// Extract regional state from property
export const extractRegionalState = (property) => {
  if (!property) return '';
  
  // Direct regional_state property
  if (property.regional_state && typeof property.regional_state === 'string') {
    return property.regional_state;
  }
  
  // State in address object
  if (property.address && typeof property.address === 'object') {
    return property.address.state || property.address.region || '';
  }
  
  // Alternative property names
  return property.region || property.state || '';
};

// Extract amenities and convert to expected format
export const normalizeAmenities = (property) => {
  if (!property) return {};
  
  // Handle different amenities formats
  let amenitiesObj = {};
  
  // Handle array format (most common)
  if (Array.isArray(property.amenities)) {
    property.amenities.forEach(amenity => {
      if (typeof amenity === 'string') {
        amenitiesObj[amenity] = true;
      }
    });
  } 
  // Handle object format
  else if (property.amenities && typeof property.amenities === 'object') {
    amenitiesObj = property.amenities;
  }
  // Handle features array (alternative field name)
  else if (Array.isArray(property.features)) {
    property.features.forEach(feature => {
      if (typeof feature === 'string') {
        amenitiesObj[feature] = true;
      }
    });
  }
  // Handle features object (alternative field name)
  else if (property.features && typeof property.features === 'object') {
    Object.keys(property.features).forEach(key => {
      if (property.features[key] === true) {
        amenitiesObj[key] = true;
      }
    });
  }
  
  return amenitiesObj;
};

// Extract images from property data
export const extractImages = (property) => {
  if (!property) return [];
  
  let images = [];
  
  // Handle media array
  if (property.media && Array.isArray(property.media)) {
    property.media.forEach(mediaItem => {
      if (typeof mediaItem === 'string') {
        images.push(mediaItem);
      } else if (mediaItem && typeof mediaItem === 'object') {
        const path = mediaItem.filePath || mediaItem.url || mediaItem.path;
        if (path) {
          images.push(path);
        }
      }
    });
  }
  // Handle images array (alternative field name)
  else if (property.images && Array.isArray(property.images)) {
    property.images.forEach(image => {
      if (typeof image === 'string') {
        images.push(image);
      } else if (image && typeof image === 'object') {
        const path = image.filePath || image.url || image.path;
        if (path) {
          images.push(path);
        }
      }
    });
  }
  
  return images;
};

// Normalize property data to ensure consistent structure
export const normalizePropertyData = (property) => {
  if (!property) return null;
  
  // Ensure we have an ID
  const id = property._id || property.id || property.propertyId;
  if (!id) {
    console.error('Property data missing ID');
    return null;
  }
  
  // Create normalized property object
  return {
    _id: id,
    id: id,
    propertyId: id,
    property_type: property.property_type || property.propertyType || '',
    property_for: property.property_for || property.offeringType || 'For Sale',
    total_price: property.total_price || property.price || '',
    property_address: extractStreet(property.property_address || property.address),
    city: extractCity(property),
    regional_state: extractRegionalState(property),
    country: property.country || 'Ethiopia',
    number_of_bedrooms: property.number_of_bedrooms || property.bedrooms || '',
    number_of_bathrooms: property.number_of_bathrooms || property.bathrooms || '',
    property_size: property.property_size || property.area || property.size || '',
    description: property.description || '',
    amenities: normalizeAmenities(property),
    media: extractImages(property)
  };
};
