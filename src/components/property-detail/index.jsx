import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropertyDetail from './sub-component/PropertyDetail';
import { toast } from 'react-toastify';
import { getPropertyDetails, clearPropertyDetails } from '../../Redux-store/Slices';

const PropertyDetailMain = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { property, loading, error } = useSelector((state) => state.PropertyDetail);
  
  useEffect(() => {
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
      
    // Cleanup on unmount
    return () => {
      dispatch(clearPropertyDetails());
    };
  }, [dispatch, id]);

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
  return <PropertyDetail PropertyDetails={property || {}} />;
};

export default PropertyDetailMain;
