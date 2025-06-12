/**
 * Property Submission Test with Updated Schema
 * This script tests the property submission flow with the updated MongoDB schema
 */

const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Test data - matches our updated schema format
const testPropertyData = {
  title: "Test Property with Updated Schema",
  description: "Property created to test the updated MongoDB schema",
  propertyType: "House",
  offeringType: "For Sale",
  price: 100000,
  area: 1500,
  bedrooms: 3,
  bathrooms: 2,
  street: "123 Main Street",
  city: "Test City",
  state: "Test State",
  country: "Test Country",
  images: [{ url: "https://example.com/test-image.jpg" }],
  features: { hasPool: true },
  promotionType: "VIP",
  isPremium: true,
  isVerified: true,
  views: 42,
  likes: 5
};

// Function to login and get auth token
async function getAuthToken() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: process.env.TEST_USER_EMAIL || 'test@example.com',
      password: process.env.TEST_USER_PASSWORD || 'password123'
    });
    
    if (response.data.token) {
      console.log('Login successful, received auth token');
      return response.data.token;
    } else {
      throw new Error('No token received in login response');
    }
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
}

// Function to create a property using the API
async function createProperty(token, propertyData) {
  try {
    const response = await axios.post('http://localhost:5000/api/properties', propertyData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Property created successfully via API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Property creation failed:', error.response?.data || error.message);
    throw error;
  }
}

// Function to retrieve a property by ID
async function getProperty(token, propertyId) {
  try {
    const response = await axios.get(`http://localhost:5000/api/properties/${propertyId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Property retrieved successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Property retrieval failed:', error.response?.data || error.message);
    throw error;
  }
}

// Function to delete a property by ID
async function deleteProperty(token, propertyId) {
  try {
    const response = await axios.delete(`http://localhost:5000/api/properties/${propertyId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Property deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Property deletion failed:', error.response?.data || error.message);
    throw error;
  }
}

// Main test function
async function runTest() {
  let token = null;
  let createdPropertyId = null;
  
  try {
    console.log('Starting property submission test with updated schema...');
    
    // Login to get token
    token = await getAuthToken();
    
    // Create property
    console.log('Creating test property with data:', JSON.stringify(testPropertyData, null, 2));
    const createdProperty = await createProperty(token, testPropertyData);
    createdPropertyId = createdProperty._id;
    
    console.log('Successfully created property with ID:', createdPropertyId);
    console.log('Created property data:', JSON.stringify(createdProperty, null, 2));
    
    // Verify property was created correctly
    console.log('Retrieving property to verify data...');
    const retrievedProperty = await getProperty(token, createdPropertyId);
    
    // Validate key fields
    console.log('\nValidating property data:');
    console.log('- Title matches:', retrievedProperty.title === testPropertyData.title);
    console.log('- Price matches:', retrievedProperty.price === testPropertyData.price);
    console.log('- Street matches:', retrievedProperty.street === testPropertyData.street);
    console.log('- City matches:', retrievedProperty.city === testPropertyData.city);
    console.log('- State matches:', retrievedProperty.state === testPropertyData.state);
    console.log('- Country matches:', retrievedProperty.country === testPropertyData.country);
    console.log('- Has images:', Array.isArray(retrievedProperty.images) && retrievedProperty.images.length > 0);
    console.log('- Has features:', retrievedProperty.features && typeof retrievedProperty.features === 'object');
    
    // Clean up - delete the test property
    if (createdPropertyId) {
      console.log('\nCleaning up - deleting test property...');
      await deleteProperty(token, createdPropertyId);
    }
    
    console.log('\nTest completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('\nTest failed:', error);
    
    // Clean up - delete the test property if it was created
    if (token && createdPropertyId) {
      try {
        console.log('\nCleaning up - deleting test property...');
        await deleteProperty(token, createdPropertyId);
      } catch (cleanupError) {
        console.error('Cleanup failed:', cleanupError);
      }
    }
    
    return { success: false, error: error.message };
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

// Run the test
runTest().then(result => {
  console.log('Test result:', result);
  process.exit(result.success ? 0 : 1);
}).catch(err => {
  console.error('Unhandled error during test:', err);
  process.exit(1);
});
