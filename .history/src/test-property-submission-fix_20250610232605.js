/**
 * Test script to debug property submission issue with 500 error
 * Run with: node src/test-property-submission-fix.js
 */

const axios = require('axios');
require('dotenv').config({ path: '.env' });

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

async function testPropertySubmission(token) {
  // Simplified property data that matches the schema requirements
  const propertyData = {
    title: "Test Property with Complete Schema",
    description: "Test property description",
    propertyType: "Apartment",
    offeringType: "For Sale",
    status: "active",
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

  try {
    console.log('Attempting to submit property with data:', JSON.stringify(propertyData, null, 2));
    
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
async function testDataFromUi(token) {
  // This simulates what appears to be sent from ChoosePropmotion.jsx
  const formattedData = {
    title: "dsfda dsfsd",
    description: "hjgh",
    propertyType: "Apartment",
    offeringType: "For Sale",
    status: "active",
    paymentStatus: "none",
    price: 2112,
    area: 56262,
    bedrooms: 2,
    bathrooms: 32,
    features: {},
    address: {
      street: "dghjhj",
      city: "hgggggggggggg",
      state: "Afar Region",
      country: "Ethiopia"
    },
    images: [
      { url: "/uploads/1749622956984-477120850-genMid.731631728_9_0.jpg", caption: "" },
      { url: "/uploads/1749622960442-112509679-genMid.731631728_9_0.jpg", caption: "" }
    ],
    isPremium: false,
    isVerified: false,
    promotionType: "Basic",
    views: 0,
    likes: 0,
    furnishingStatus: "Furnished"
  };

  try {
    console.log('\n\nAttempting to submit property with UI data:', JSON.stringify(formattedData, null, 2));
    
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
    
    console.log('Property submission with UI data successful!');
    console.log('Response:', JSON.stringify(res.data, null, 2));
    return res.data._id || (res.data.data && res.data.data._id);
  } catch (err) {
    console.error('Error submitting property with UI data:');
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
  console.log('--- Property Submission Error Diagnosis ---');
  let token;
  try {
    token = await loginAndGetToken();
  } catch (error) {
    console.error('Aborting test due to login failure.');
    return;
  }

  // Test with clean data
  console.log('\nTEST 1: Submitting with clean, minimal data:');
  const propertyId = await testPropertySubmission(token);
  if (propertyId) {
    console.log(`Property created with ID: ${propertyId}`);
  }

  // Test with UI data
  console.log('\nTEST 2: Submitting with data formatted like the UI:');
  const uiPropertyId = await testDataFromUi(token);
  if (uiPropertyId) {
    console.log(`UI-formatted property created with ID: ${uiPropertyId}`);
  }
})();
