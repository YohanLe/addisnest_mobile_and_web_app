/**
 * Test Script for Nested Address Structure
 * 
 * This script tests the implementation of the nested address structure in the property controller.
 * It verifies that:
 * 1. Properties can be created with flat address fields and converted to nested structure
 * 2. Properties can be created with nested address structure directly
 * 3. Updating property addresses works correctly with both formats
 */

const axios = require('axios');
require('dotenv').config();

// Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
let authToken = null;
let testPropertyIds = [];

// Test data
const testPropertyFlat = {
  title: 'Test Property - Flat Address',
  description: 'This property is created with flat address fields',
  price: 5000000,
  offeringType: 'For Sale',
  propertyType: 'House',
  bedrooms: 3,
  bathrooms: 2,
  area: 150,
  // Flat address fields
  street: '123 Test Street',
  city: 'Addis Ababa',
  regional_state: 'Addis Ababa City Administration',
  country: 'Ethiopia'
};

const testPropertyNested = {
  title: 'Test Property - Nested Address',
  description: 'This property is created with nested address structure',
  price: 6000000,
  offeringType: 'For Sale',
  propertyType: 'Apartment',
  bedrooms: 2,
  bathrooms: 1,
  area: 120,
  // Nested address structure
  address: {
    street: '456 Test Avenue',
    city: 'Addis Ababa',
    state: 'Addis Ababa City Administration',
    country: 'Ethiopia'
  }
};

const updateAddressFlat = {
  street: 'Updated Street Name',
  city: 'Updated City',
  regional_state: 'Oromia Region',
  country: 'Ethiopia'
};

const updateAddressNested = {
  address: {
    street: 'Nested Updated Street',
    city: 'Nested Updated City',
    state: 'Amhara Region',
    country: 'Ethiopia'
  }
};

// Helper functions
const login = async () => {
  try {
    console.log('Logging in to get auth token...');
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: process.env.TEST_USER_EMAIL || 'test@example.com',
      password: process.env.TEST_USER_PASSWORD || 'password123'
    });
    
    authToken = response.data.token || response.data.data.token;
    console.log('Login successful!');
    return true;
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const createProperty = async (propertyData) => {
  try {
    console.log(`Creating property: ${propertyData.title}`);
    const response = await axios.post(`${API_URL}/properties`, propertyData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    const createdPropertyId = response.data.data.id || response.data.data._id;
    testPropertyIds.push(createdPropertyId);
    
    console.log(`Property created successfully! ID: ${createdPropertyId}`);
    return { success: true, propertyId: createdPropertyId };
  } catch (error) {
    console.error('Error creating property:', error.response?.data?.message || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

const getProperty = async (propertyId) => {
  try {
    console.log(`Retrieving property: ${propertyId}`);
    const response = await axios.get(`${API_URL}/properties/${propertyId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    const property = response.data.data;
    console.log(`Property retrieved successfully! Address structure:`);
    console.log(JSON.stringify(property.address, null, 2));
    return { success: true, property };
  } catch (error) {
    console.error('Error retrieving property:', error.response?.data?.message || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

const updateProperty = async (propertyId, updateData) => {
  try {
    console.log(`Updating property: ${propertyId}`);
    const response = await axios.put(`${API_URL}/properties/${propertyId}`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    console.log(`Property updated successfully!`);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('Error updating property:', error.response?.data?.message || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

const cleanupTestData = async () => {
  if (testPropertyIds.length === 0) return;
  
  console.log('\n=======================================');
  console.log('Cleaning up test data...');
  
  for (const propertyId of testPropertyIds) {
    try {
      await axios.delete(`${API_URL}/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log(`Deleted test property: ${propertyId}`);
    } catch (error) {
      console.warn(`Failed to delete test property ${propertyId}:`, error.message);
    }
  }
  
  console.log('Cleanup complete!');
};

// Main test function
const runTests = async () => {
  console.log('=======================================');
  console.log('NESTED ADDRESS STRUCTURE TEST');
  console.log('=======================================\n');
  
  // Step 1: Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.error('Cannot proceed with tests due to login failure');
    return;
  }
  
  // Step 2: Create property with flat address
  console.log('\n---------------------------------------');
  console.log('TEST 1: Create property with flat address');
  console.log('---------------------------------------');
  const flatPropertyResult = await createProperty(testPropertyFlat);
  
  if (!flatPropertyResult.success) {
    console.error('Test 1 failed: Could not create property with flat address');
  } else {
    // Verify the property has the correct nested address structure
    const flatPropertyGet = await getProperty(flatPropertyResult.propertyId);
    if (flatPropertyGet.success) {
      const property = flatPropertyGet.property;
      const hasNestedAddress = property.address && 
                              typeof property.address === 'object' &&
                              property.address.street === testPropertyFlat.street;
      
      if (hasNestedAddress) {
        console.log('✅ TEST 1 PASSED: Property created with flat address was converted to nested structure');
      } else {
        console.error('❌ TEST 1 FAILED: Property does not have correct nested address structure');
        console.log('Expected:', { street: testPropertyFlat.street, city: testPropertyFlat.city });
        console.log('Actual:', property.address);
      }
    }
  }
  
  // Step 3: Create property with nested address
  console.log('\n---------------------------------------');
  console.log('TEST 2: Create property with nested address');
  console.log('---------------------------------------');
  const nestedPropertyResult = await createProperty(testPropertyNested);
  
  if (!nestedPropertyResult.success) {
    console.error('Test 2 failed: Could not create property with nested address');
  } else {
    // Verify the property has the correct nested address structure
    const nestedPropertyGet = await getProperty(nestedPropertyResult.propertyId);
    if (nestedPropertyGet.success) {
      const property = nestedPropertyGet.property;
      const hasCorrectNestedAddress = property.address && 
                                     typeof property.address === 'object' &&
                                     property.address.street === testPropertyNested.address.street;
      
      if (hasCorrectNestedAddress) {
        console.log('✅ TEST 2 PASSED: Property created with nested address has correct structure');
      } else {
        console.error('❌ TEST 2 FAILED: Property does not have correct nested address structure');
        console.log('Expected:', testPropertyNested.address);
        console.log('Actual:', property.address);
      }
    }
  }
  
  // Step 4: Update property with flat address fields
  if (flatPropertyResult.success) {
    console.log('\n---------------------------------------');
    console.log('TEST 3: Update property with flat address fields');
    console.log('---------------------------------------');
    
    const updateFlatResult = await updateProperty(flatPropertyResult.propertyId, updateAddressFlat);
    if (updateFlatResult.success) {
      // Verify the update
      const updatedFlatGet = await getProperty(flatPropertyResult.propertyId);
      if (updatedFlatGet.success) {
        const property = updatedFlatGet.property;
        const hasUpdatedAddress = property.address && 
                                property.address.street === updateAddressFlat.street &&
                                property.address.city === updateAddressFlat.city;
        
        if (hasUpdatedAddress) {
          console.log('✅ TEST 3 PASSED: Property updated with flat address fields has correct nested structure');
        } else {
          console.error('❌ TEST 3 FAILED: Property update with flat address fields failed');
          console.log('Expected street:', updateAddressFlat.street);
          console.log('Actual:', property.address);
        }
      }
    } else {
      console.error('Test 3 failed: Could not update property with flat address fields');
    }
  }
  
  // Step 5: Update property with nested address structure
  if (nestedPropertyResult.success) {
    console.log('\n---------------------------------------');
    console.log('TEST 4: Update property with nested address structure');
    console.log('---------------------------------------');
    
    const updateNestedResult = await updateProperty(nestedPropertyResult.propertyId, updateAddressNested);
    if (updateNestedResult.success) {
      // Verify the update
      const updatedNestedGet = await getProperty(nestedPropertyResult.propertyId);
      if (updatedNestedGet.success) {
        const property = updatedNestedGet.property;
        const hasUpdatedNestedAddress = property.address && 
                                      property.address.street === updateAddressNested.address.street &&
                                      property.address.city === updateAddressNested.address.city;
        
        if (hasUpdatedNestedAddress) {
          console.log('✅ TEST 4 PASSED: Property updated with nested address structure has correct values');
        } else {
          console.error('❌ TEST 4 FAILED: Property update with nested address structure failed');
          console.log('Expected street:', updateAddressNested.address.street);
          console.log('Actual:', property.address);
        }
      }
    } else {
      console.error('Test 4 failed: Could not update property with nested address structure');
    }
  }
  
  // Clean up test data
  await cleanupTestData();
  
  console.log('\n=======================================');
  console.log('TEST SUITE COMPLETED');
  console.log('=======================================');
};

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error in test suite:', error);
  cleanupTestData();
});
