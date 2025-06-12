import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * ImageWithFallback component
 * 
 * A wrapper around the standard img element that handles loading errors
 * by displaying a fallback image when the primary image fails to load.
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Primary image source URL
 * @param {string} props.fallbackSrc - Fallback image source URL to use if primary fails
 * @param {string} props.alt - Alt text for the image
 * @param {Object} props.style - CSS styles to apply to the image
 * @param {string} props.className - CSS class(es) to apply to the image
 * @param {Function} props.onError - Optional callback when image error occurs
 */
const ImageWithFallback = ({
  src,
  fallbackSrc = '/placeholder-property.jpg',
  alt = 'Property Image',
  style = {},
  className = '',
  onError,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);

  // Process the image source URL to ensure it's correctly formatted
  const processImageUrl = (url) => {
    if (!url) return fallbackSrc;
    
    // If it's a data URL (from URL.createObjectURL), return as is
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      return url;
    }
    
    // If already a fully qualified URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // For fallback images in the public directory, don't modify the path
    if (url === fallbackSrc || url.startsWith('/placeholder')) {
      return url;
    }

    // Handle relative URLs - make sure they start with '/'
    const normalizedUrl = url.startsWith('/') ? url : `/${url}`;

    // For development - use the local server with correct port
    // First try to use the environment variable, then fallback to localhost with proper port
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000';
    
    // If the image path starts with /uploads/properties/, ensure we're using port 7000 where static files are served
    if (normalizedUrl.includes('/uploads/properties/')) {
      return `http://localhost:7000${normalizedUrl}`;
    }
    
    // Ensure we use the correct base URL format (remove /api/ if present when accessing uploads)
    const formattedBaseUrl = normalizedUrl.startsWith('/uploads') 
      ? baseUrl.replace('/api', '') // Remove /api for upload URLs
      : baseUrl;

    // Return the full URL
    return `${formattedBaseUrl}${normalizedUrl}`;
  };

  // Handle image loading errors
  const handleError = (e) => {
    if (hasError) {
      // Already showing fallback, nothing more to do
      return;
    }

    // Log error details
    console.error(`Image failed to load: ${src}`, e);
    
    // Save error details for debugging
    setErrorDetails({
      originalSrc: src,
      processedSrc: imgSrc,
      error: e.type,
      time: new Date().toISOString()
    });
    
    // Set error state
    setHasError(true);
    
    // Switch to fallback image
    setImgSrc(fallbackSrc);
    
    // Call user-provided onError handler if available
    if (onError) {
      onError(e, { originalSrc: src, fallbackSrc });
    }
  };

  return (
    <>
      <img
        src={processImageUrl(imgSrc)}
        alt={alt}
        style={style}
        className={className}
        onError={handleError}
        {...props}
      />
      
      {/* Always show image error indicator to users */}
      {hasError && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'rgba(255, 0, 0, 0.7)',
            color: 'white',
            fontSize: '11px',
            padding: '3px 6px',
            borderRadius: '0 0 0 5px',
            fontWeight: 'bold',
            zIndex: 2
          }}
          title={`Image Error: Please try again or select a different image`}
        >
          ⚠️ Image Error
        </div>
      )}
      
      {/* Show detailed error info only in development environment */}
      {import.meta.env.DEV && hasError && errorDetails && (
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            fontSize: '10px',
            padding: '2px 5px',
            borderRadius: '0 3px 0 0',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
          title={`Failed to load image: ${errorDetails.originalSrc}`}
        >
          🔍 Debug: {errorDetails.error || 'Load failed'}
        </div>
      )}
    </>
  );
};

ImageWithFallback.propTypes = {
  src: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string,
  alt: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  onError: PropTypes.func
};

export default ImageWithFallback;
