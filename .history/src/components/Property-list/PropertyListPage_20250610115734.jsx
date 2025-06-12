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
            </
