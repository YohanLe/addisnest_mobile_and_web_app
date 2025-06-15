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
    <div>
      <h1>Hello World</h1>
    </div>
  );
};

export default FeaturedProperties;
