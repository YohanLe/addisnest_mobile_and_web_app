/**
 * Final test script to demonstrate the fixed property submission
 * Run with: node src/test-property-submission-final-fix.js
 */

const axios = require('axios');
require('dotenv').config({ path: '.env' });

const API_BASE = process.env.API_BASE_URL || 'http://localhost:7001/api';

// Login credentials
const loginData = {
  email: 'jonegrow143@gmail.com',
  password: 'password123'
};

async function loginAndGetToken() {
  try {
    const response = await axios.post(
      `${API_BASE.replace('/api', '')}/api/auth/login`,
      loginData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    const token = response.data?.data?.token || response.data?.token;
    if (!token) throw new Error('No token received from login');
    console.log('Login successful, received token.');
    return token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function submitPropertyWithFixedFormat(token) {
  // This data simulates what comes from the PropertyListForm component
  // CRITICAL: We removed status and paymentStatus fields to let the server set them
  const propertyFormData = {
    title: "Fixed Property Submission Test",
    description: "This property was submitted with the fixed format",
    propertyType: "Apartment",
    offeringType: "For Sale",
    price: 15000,
    area: 150,
    bedrooms: 2,
    bathrooms: 1,
    address: {
      street: "123 Test Street",
      city: "Addis Ababa",
      state: "Addis Ababa City Administration",
      country: "Ethiopia"
    },
    images: [
      { url: "/uploads/properties/genMid.731631728_14_0-1749359999235-908500567.jpg", caption: "Image 1" }
    ],
    isPremium: false,
    isVerified: false,
    promotionType: "Basic",
    views: 0,
    likes: 0,
    furnishingStatus: "Unfurnished"
  };
  
  console.log('Formatted property data for submission (omitting status/paymentStatus):');
  console.log(JSON.stringify(propertyFormData, null, 2));
  console.log('\nNOTE: We\'re letting the server determine the correct status and paymentStatus values');
  
  try {
    console.log('\nSubmitting property with fixed format...');
    
    const res = await axios.post(
      `${API_BASE}/properties`,
      propertyFormData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('\n✅ SUCCESS! Property submission successful with fixed format');
    console.log('Response:', JSON.stringify(res.data, null, 2));
    return res.data._id || (res.data.data && res.data.data._id);
  } catch (err) {
    console.error('\n❌ ERROR: Property submission failed:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Response data:', err.response.data);
    } else if (err.request) {
      console.error('No response received:', err.request);
    } else {
      console.error('Error setting up request:', err.message);
    }
    return null;
  }
}

// Test the VIP plan too
async function testPremiumPlanSubmission(token) {
  // CRITICAL: We removed status and paymentStatus fields to let the server set them
  const propertyData = {
    title: "Premium Property VIP Plan Test",
    description: "This property was submitted with a VIP plan",
    propertyType: "House",
    offeringType: "For Sale",
    price: 50000,
    area: 300,
    bedrooms: 4,
    bathrooms: 3,
    address: {
      street: "456 Premium Street",
      city: "Addis Ababa",
      state: "Addis Ababa City Administration",
      country: "Ethiopia"
    },
    images: [
      { url: "/uploads/properties/genMid.731631728_14_0-1749359999235-908500567.jpg", caption: "Image 1" }
    ],
    isPremium: true,
    isVerified: false,
    promotionType: "VIP",
    views: 0,
    likes: 0,
    furnishingStatus: "Unfurnished"
  };
  
  console.log('\n\nFormatted VIP property data for submission (omitting status/paymentStatus):');
  console.log(JSON.stringify(propertyData, null, 2));
  console.log('\nNOTE: We\'re letting the server determine the correct status and paymentStatus values');
  
  try {
    console.log('\nSubmitting VIP property...');
    
    const res = await axios.post(
      `${API_BASE}/properties`,
      propertyData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('\n✅ SUCCESS! VIP property submission successful');
    console.log('Response:', JSON.stringify(res.data, null, 2));
    return res.data._id || (res.data.data && res.data.data._id);
  } catch (err) {
    console.error('\n❌ ERROR: VIP property submission failed:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Response data:', err.response.data);
    } else if (err.request) {
      console.error('No response received:', err.request);
    } else {
      console.error('Error setting up request:', err.message);
    }
    return null;
  }
}

// Main function
(async () => {
  console.log('=== FINAL PROPERTY SUBMISSION TEST - CLIENT-SIDE FIX ===');
  console.log('This test demonstrates the client-side solution to the 500 error');
  console.log('The fix is to NOT send status/paymentStatus fields from the client\n');
  
  let token;
  try {
    token = await loginAndGetToken();
  } catch (error) {
    console.error('Aborting test due to login failure.');
    return;
  }

  // Test with basic plan
  console.log('\n*** TEST 1: Basic Plan Property Submission ***');
  const basicPropertyId = await submitPropertyWithFixedFormat(token);
  if (basicPropertyId) {
    console.log(`✅ SUCCESS: Basic plan property created with ID: ${basicPropertyId}`);
  } else {
    console.log(`❌ FAILED: Could not create basic plan property`);
  }

  // Test with VIP plan
  console.log('\n*** TEST 2: VIP Plan Property Submission ***');
  const vipPropertyId = await testPremiumPlanSubmission(token);
  if (vipPropertyId) {
    console.log(`✅ SUCCESS: VIP plan property created with ID: ${vipPropertyId}`);
  } else {
    console.log(`❌ FAILED: Could not create VIP plan property`);
  }
  
  console.log('\n=== SUMMARY ===');
  if (basicPropertyId && vipPropertyId) {
    console.log('✅ All tests passed! The property submission fix is working correctly.');
    console.log('\nTo fix the issue in your React components:');
    console.log('1. DO NOT set status or paymentStatus fields in your request data');
    console.log('2. Let the server determine the correct values based on promotionType');
    console.log('3. The server will handle proper enum values for all plan types');
  } else {
    console.log('❌ Some tests failed. Check the error messages for details.');
  }
})();
