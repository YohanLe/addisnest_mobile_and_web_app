import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropertyDetail from './sub-component/PropertyDetail';
import { toast } from 'react-toastify';
import { getPropertyDetails, clearPropertyDetails } from '../../Redux-store/Slices';
import { GetHomeData } from '../../Redux-store/Slices/HomeSlice';

const PropertyDetailMain = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { property, loading, error } = useSelector((state) => state.PropertyDetail);
  const { HomeData } = useSelector((state) => state.home);
  const [similarProperties, setSimilarProperties] = useState([]);
  
  useEffect(() => {
    console.log('PropertyDetailMain mounted');
    // Clear any previous property details
    dispatch(clearPropertyDetails());
    
    // Fetch the property details using the id from URL params
    // The Redux slice will handle invalid IDs and return mock data
    dispatch(getPropertyDetails(id))
      .unwrap()
      .catch((err) => {
        console.error("Error fetching property details:", err);
        toast.error("Failed to load property details. Please try again.");
      });
    
    // Fetch properties for the similar properties section
    dispatch(GetHomeData({ type: 'buy', page: 1, limit: 12 }));
      
    // Cleanup on unmount
    return () => {
      dispatch(clearPropertyDetails());
    };
  }, [dispatch, id]);
  
  // When HomeData updates, set the similar properties
  useEffect(() => {
    console.log('HomeData updated:', HomeData);
    if (HomeData && HomeData.data && HomeData.data.properties) {
      console.log('Available properties:', HomeData.data.properties);
      
      // Get 3 random properties that are not the current property
      const filteredProperties = HomeData.data.properties.filter(prop => 
        prop._id !== id && prop.id !== id
      );
      console.log('Filtered properties:', filteredProperties);
      
      // Take up to 3 properties
      const selectedProperties = filteredProperties.slice(0, 3);
      setSimilarProperties(selectedProperties);
      console.log('Set similar properties:', selectedProperties);
    } else {
      console.log('No properties found in HomeData:', HomeData);
    }
  }, [HomeData, id]);

  // Use regex to check if ID is a valid MongoDB ID (24 character hex string)
  const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(id);
  
  // If loading, show a loader
  if (loading) {
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '300px' 
      }}>
        <div className="loader"></div>
      </div>
    );
  }

  // If we have a property, show it - the mock data will be provided by the redux slice
  // if the ID is invalid or there's an error
  return <PropertyDetail PropertyDetails={property || {}} similarProperties={similarProperties} />;
};

export default PropertyDetailMain;
