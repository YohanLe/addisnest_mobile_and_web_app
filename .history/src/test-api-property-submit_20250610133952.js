/**
 * Script to test property submission and retrieval via API.
 * Usage: node src/test-api-property-submit.js
 */

const axios = require('axios');
require('dotenv').config({ path: '.env' });

const API_BASE = process.env.API_BASE_URL || 'http://localhost:7000/api';
const ACCESS_TOKEN = process.env.TEST_ACCESS_TOKEN || ''; // Set a valid JWT for a test user

async function submitProperty() {
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
          Authorization: `Bearer ${ACCESS_TOKEN}`,
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

async function fetchProperties() {
  try {
    const res = await axios.get(
      `${API_BASE}/properties`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`
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
  const propertyId = await submitProperty();
  if (propertyId) {
    console.log(`Property created with ID: ${propertyId}`);
  }
  await fetchProperties();
})();
