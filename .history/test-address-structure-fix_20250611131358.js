/**
 * Address Structure Fix Test Script
 * 
 * This script tests that the property data is correctly using the nested address structure
 * throughout the application. It validates both API requests and responses to ensure
 * consistency.
 */

const axios = require('axios');
require('dotenv').config();

// Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
const TOKEN = process.env.TEST_TOKEN || localStorage.getItem('token');

// Test data
const testProperty = {
  title: 'Test Property with Nested Address',
  description: 'This property tests the nested address structure',
  price: 500000,
  offeringType: 'For Sale',
  propertyType: 'House',
  bedrooms: 3,
  bathrooms: 2,
  area: 150,
  
  // Both flat and nested address fields
  street: '123 Test Street',
  city: 'Addis Ababa',
  regional_state: 'Addis Ababa City Administration',
  country: 'Ethiopia',
  
  // Nested address structure
  address: {
    street: '123 Test Street',
    city: 'Addis Ababa',
    state: 'Addis Ababa City Administration',
    country: 'Ethiopia'
  }
};

// Headers setup
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${TOKEN}`
};

// Test functions
async function testCreateProperty() {
  console.log('Testing property creation with nested address...');
  
  try {
    const response = await axios.post(`${API_URL}/properties`, testProperty, { headers });
    console.log('✅ Property created successfully');
    
    // Check if the returned data has nested address
    if (response.data?.data?.address && 
        response.data.data.address.street === testProperty.address.street) {
      console.log('✅ Response contains nested address structure');
    } else {
      console.log('❌ Response missing nested address structure');
    }
    
    return response.data?.data?._id || response.data?.data?.id;
  } catch (error) {
    console.error('❌ Failed to create property:', error.response?.data || error.message);
    return null;
  }
}

async function testGetProperty(propertyId) {
  console.log(`Testing property retrieval for ID: ${propertyId}...`);
  
  try {
    const response = await axios.get(`${API_URL}/properties/${propertyId}`, { headers });
    console.log('✅ Property retrieved successfully');
    
    // Check if the returned data has nested address
    if (response.data?.data?.address && 
        response.data.data.address.street === testProperty.address.street) {
      console.log('✅ Response contains nested address structure');
    } else {
      console.log('❌ Response missing nested address structure');
    }
    
    return response.data?.data;
  } catch (error) {
    console.error('❌ Failed to retrieve property:', error.response?.data || error.message);
    return null;
  }
}

async function testUpdateProperty(propertyId) {
  console.log(`Testing property update for ID: ${propertyId}...`);
  
  const updateData = {
    // Update both flat and nested for testing
    street: '456 New Street',
    city: 'New City',
    
    // Nested address with updated values
    address: {
      street: '456 New Street',
      city: 'New City',
      state: testProperty.address.state,
      country: testProperty.address.country
    }
  };
  
  try {
    const response = await axios.put(`${API_URL}/properties/${propertyId}`, updateData, { headers });
    console.log('✅ Property updated successfully');
    
    // Check if the returned data has nested address with updated values
    if (response.data?.data?.address && 
        response.data.data.address.street === updateData.address.street) {
      console.log('✅ Response contains updated nested address structure');
    } else {
      console.log('❌ Response missing updated nested address structure');
    }
    
    return response.data?.data;
  } catch (error) {
    console.error('❌ Failed to update property:', error.response?.data || error.message);
    return null;
  }
}

async function testNestedAddressConsistency() {
  console.log('\n=========================================');
  console.log('PROPERTY ADDRESS STRUCTURE FIX TEST');
  console.log('=========================================\n');
  
  // Check if token is available
  if (!TOKEN) {
    console.error('❌ Authentication token not found. Please set TEST_TOKEN environment variable or login first.');
    return;
  }
  
  // Test creating a property with nested address
  const propertyId = await testCreateProperty();
  
  if (!propertyId) {
    console.error('❌ Cannot proceed with tests due to property creation failure.');
    return;
  }
  
  console.log(`\nCreated property with ID: ${propertyId}\n`);
  
  // Test getting the property to verify nested address is returned
  await testGetProperty(propertyId);
  
  // Test updating the property with nested address
  await testUpdateProperty(propertyId);
  
  console.log('\n=========================================');
  console.log('TEST COMPLETED');
  console.log('=========================================\n');
}

// Run the tests
testNestedAddressConsistency().catch(error => {
  console.error('Test failed with error:', error);
});
