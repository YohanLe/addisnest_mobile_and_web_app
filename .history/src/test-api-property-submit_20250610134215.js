/**
 * Script to test property submission and retrieval via API.
 * Usage: node src/test-api-property-submit.js
 */

const axios = require('axios');
require('dotenv').config({ path: '.env' });

const API_BASE = process.env.API_BASE_URL || 'http://localhost:7000/api';

// Login credentials (from test-login.js)
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

async function submitProperty(token) {
  const propertyData = {
    title: "API Test Property",
    description: "This property was submitted via API test script.",
    propertyType: "house",
    propertyFor: "sale",
    offeringType: "For Sale",
    status: "active",
    price: 1234567,
    location: {
      address: "123 Test St",
      city: "Addis Ababa",
      state: "Addis Ababa City Administration",
      country: "Ethiopia"
    },
    specifications: {
      bedrooms: 2,
      bathrooms: 1,
      area: { size: 80, unit: "sqm" }
    },
    features: {
      amenities: ["parking-space", "internet"],
      condition: "good"
    },
    promotionType: "basic",
    isFeatured: false,
    priority: 0,
    images: [
      { url: "/uploads/test-property-image.jpg", caption: "Test Image", isPrimary: true, order: 0 }
    ]
  };

  try {
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
    console.log('Property submission response:', res.data);
    return res.data.data?._id || res.data._id;
  } catch (err) {
    console.error('Error submitting property:', err.response?.data || err.message);
    return null;
  }
}

async function fetchProperties(token) {
  try {
    const res = await axios.get(
      `${API_BASE}/properties`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log('Properties in database:');
    console.log(res.data.data || res.data);
  } catch (err) {
    console.error('Error fetching properties:', err.response?.data || err.message);
  }
}

(async () => {
  console.log('--- API Property Submission Test ---');
  let token;
  try {
    token = await loginAndGetToken();
  } catch {
    console.error('Aborting test due to login failure.');
    return;
  }
  const propertyId = await submitProperty(token);
  if (propertyId) {
    console.log(`Property created with ID: ${propertyId}`);
  }
  await fetchProperties(token);
})();
