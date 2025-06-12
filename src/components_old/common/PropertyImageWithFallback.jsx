import React from 'react';
import PropTypes from 'prop-types';
import ImageWithFallback from './ImageWithFallback';

/**
 * PropertyImageWithFallback component
 * 
 * A specialized version of ImageWithFallback specifically for property images
 * that handles various formats of property image paths and ensures they're correctly
 * displayed with proper server URL prefixing.
 */
const PropertyImageWithFallback = ({
  src,
  fallbackSrc = '/placeholder-property.jpg',
  alt = 'Property Image',
  style = {},
  className = '',
  width = 80,
  height = 60,
  ...props
}) => {
  // Process the property image URL to ensure it's correctly formatted
  const processPropertyImageUrl = (url) => {
    if (!url) return fallbackSrc;
    
    // If it's already a valid URL or data URL, use it as is
    if (url.startsWith('blob:') || 
        url.startsWith('data:') || 
        url.startsWith('http://') || 
        url.startsWith('https://')) {
      return url;
    }
    
    // For fallback images in the public directory, don't modify the path
    if (url === fallbackSrc || url.startsWith('/placeholder')) {
      return url;
    }
    
    // Ensure path starts with a slash
    const normalizedPath = url.startsWith('/') ? url : `/${url}`;
    
    // Ensure uploads/properties path is included
    let formattedPath = normalizedPath;
    if (!formattedPath.includes('/uploads/properties') && 
        !formattedPath.includes('/uploads/')) {
      formattedPath = `/uploads/properties${formattedPath}`;
    } else if (formattedPath.includes('/properties/') && 
              !formattedPath.includes('/uploads/')) {
      formattedPath = `/uploads${formattedPath}`;
    }
    
    // Add server URL - use port 7000 where the backend is running
    return `http://localhost:7000${formattedPath}`;
  };

  // Add default style properties
  const defaultStyle = {
    width: width,
    height: height,
    objectFit: 'cover',
    borderRadius: '4px',
    ...style
  };

  return (
    <ImageWithFallback
      src={processPropertyImageUrl(src)}
      fallbackSrc={fallbackSrc}
      alt={alt}
      style={defaultStyle}
      className={className}
      {...props}
    />
  );
};

PropertyImageWithFallback.propTypes = {
  src: PropTypes.string,
  fallbackSrc: PropTypes.string,
  alt: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number
};

export default PropertyImageWithFallback;
