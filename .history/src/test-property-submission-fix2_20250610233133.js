/**
 * Test script to verify our property formatting fix works correctly
 * Run with: node src/test-property-submission-fix2.js
 */

const axios = require('axios');
require('dotenv').config({ path: '.env' });
const { formatPropertyData } = require('./property-submit-fix');

const API_BASE = process.env.API_BASE_URL || 'http://localhost:7000/api';

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

async function testPropertySubmissionWithFix(token) {
  // Test data that previously failed
  const rawPropertyData = {
    title: "Test Property with Fixed Format",
    description: "Test property description",
    propertyType: "Apartment",
    offeringType: "For Sale",
    price: 15000,
    area: 150,
    bedrooms: 2,
    bathrooms: 1,
    features: {
      parking: true,
      airConditioning: false,
      furnished: true
    },
    address: {
      street: "123 Test Street",
      city: "Addis Ababa",
      state: "Addis Ababa City Administration",
      country: "Ethiopia"
    },
    images: [
      { url: "/uploads/properties/genMid.731631728_14_0-1749359999235-908500567.jpg", caption: "Image 1" }
    ]
  };

  // Apply our fix to format the data correctly
  const formattedData = formatPropertyData(rawPropertyData, 'basic');
  
  try {
    console.log('Attempting to submit property with FIXED data:', JSON.stringify(formattedData, null, 2));
    
    const res = await axios.post(
      `${API_BASE}/properties`,
      formattedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Property submission successful!');
    console.log('Response:', JSON.stringify(res.data, null, 2));
    return res.data._id || (res.data.data && res.data.data._id);
  } catch (err) {
    console.error('Error submitting property:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Response data:', err.response.data);
      console.error('Response headers:', err.response.headers);
    } else if (err.request) {
      console.error('No response received:', err.request);
    } else {
      console.error('Error setting up request:', err.message);
    }
    return null;
  }
}

// Compare this with the data being sent from the UI
async function testUiDataWithFix(token) {
  // This simulates what appears to be sent from ChoosePropmotion.jsx
  const rawUiData = {
    title: "dsfda dsfsd",
    description: "hjgh",
    propertyType: "Apartment",
    offeringType: "For Sale",
    total_price: 2112,
    property_size: 56262,
    number_of_bedrooms: 2,
    number_of_bathrooms: 32,
    property_address: "dghjhj",
    city: "hgggggggggggg",
    regional_state: "Afar Region",
    country: "Ethiopia",
    media_paths: [
      { url: "/uploads/1749622956984-477120850-genMid.731631728_9_0.jpg", caption: "" },
      { url: "/uploads/1749622960442-112509679-genMid.731631728_9_0.jpg", caption: "" }
    ],
    furnishing: "Furnished"
  };

  // Apply our fix to format the UI data correctly
  const formattedUiData = formatPropertyData(rawUiData, 'basic');

  try {
    console.log('\n\nAttempting to submit property with FIXED UI data:', JSON.stringify(formattedUiData, null, 2));
    
    const res = await axios.post(
      `${API_BASE}/properties`,
      formattedUiData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Property submission with FIXED UI data successful!');
    console.log('Response:', JSON.stringify(res.data, null, 2));
    return res.data._id || (res.data.data && res.data.data._id);
  } catch (err) {
    console.error('Error submitting property with FIXED UI data:');
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

(async () => {
  console.log('--- Property Submission Fix Verification ---');
  let token;
  try {
    token = await loginAndGetToken();
  } catch (error) {
    console.error('Aborting test due to login failure.');
    return;
  }

  // Test with fixed data
  console.log('\nTEST 1: Submitting with fixed data format:');
  const propertyId = await testPropertySubmissionWithFix(token);
  if (propertyId) {
    console.log(`SUCCESS: Property created with ID: ${propertyId}`);
  } else {
    console.log(`FAILED: Could not create property with fixed data`);
  }

  // Test with fixed UI data
  console.log('\nTEST 2: Submitting with fixed UI data format:');
  const uiPropertyId = await testUiDataWithFix(token);
  if (uiPropertyId) {
    console.log(`SUCCESS: UI-formatted property created with ID: ${uiPropertyId}`);
  } else {
    console.log(`FAILED: Could not create property with fixed UI data`);
  }
})();
