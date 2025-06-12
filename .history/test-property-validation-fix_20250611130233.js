/**
 * Property Submission Validation Fix Test Script
 * 
 * This script simulates property submissions with various scenarios
 * to verify that our validation fixes prevent 500 Internal Server errors.
 */

const axios = require('axios');
require('dotenv').config();

// API base URL
const API_BASE_URL = process.env.API_URL || 'http://localhost:7000/api';

// Default auth token - replace with your own token for testing
const TEST_AUTH_TOKEN = process.env.TEST_AUTH_TOKEN || '';

// Log formatting helpers
const success = (message) => console.log(`\x1b[32m✅ ${message}\x1b[0m`);
const error = (message) => console.log(`\x1b[31m❌ ${message}\x1b[0m`);
const info = (message) => console.log(`\x1b[36mℹ️ ${message}\x1b[0m`);
const warning = (message) => console.log(`\x1b[33m⚠️ ${message}\x1b[0m`);
const divider = () => console.log('\n' + '-'.repeat(80) + '\n');

// Test cases with varying levels of completeness
const testCases = [
  {
    name: "Complete Data (Control Case)",
    data: {
      title: "Test Property - Complete Data",
      description: "This is a test property with all required fields",
      propertyType: "House",
      offeringType: "For Sale",
      price: 500000,
      area: 250,
      bedrooms: 3,
      bathrooms: 2,
      street: "123 Test Street",
      city: "Test City",
      regional_state: "Test Region",
      country: "Ethiopia",
      features: {
        "parking-space": true,
        "24-7-security": true
      },
      images: [
        {
          url: "/uploads/test-property-image-1749260861596-438465535.jpg",
          caption: "Default Property Image"
        }
      ],
      furnishingStatus: "Unfurnished",
      promotionType: "Basic"
    }
  },
  {
    name: "Missing Address Fields (Should be fixed by our code)",
    data: {
      title: "Test Property - Missing Address",
      description: "This property is missing address fields that should be auto-filled",
      propertyType: "Apartment",
      offeringType: "For Sale",
      price: 350000,
      area: 150,
      bedrooms: 2,
      bathrooms: 1,
      // Missing: street, city, regional_state, country
      features: {
        "parking-space": true
      },
      images: [
        {
          url: "/uploads/test-property-image-1749260861596-438465535.jpg",
          caption: "Default Property Image"
        }
      ],
      furnishingStatus: "Unfurnished",
      promotionType: "Basic"
    }
  },
  {
    name: "Legacy Field Names (Should be mapped correctly)",
    data: {
      title: "Test Property - Legacy Field Names",
      description: "This property uses legacy field names that should be mapped",
      property_type: "Land", // Legacy field name
      property_for: "For Rent", // Legacy field name
      total_price: 1500000, // Legacy field name
      property_size: 500, // Legacy field name
      number_of_bedrooms: 0, // Legacy field name
      number_of_bathrooms: 0, // Legacy field name
      property_address: "456 Legacy Street", // Legacy field name for street
      city: "Legacy City",
      regional_state: "Legacy Region",
      country: "Ethiopia",
      amenities: ["Parking", "Security"], // Legacy field name for features
      furnishing: "Unfurnished", // Legacy field name
      images: [
        {
          url: "/uploads/test-property-image-1749260861596-438465535.jpg",
          caption: "Default Property Image"
        }
      ],
      promotionType: "Basic"
    }
  }
];

/**
 * Submit a property to the API
 */
async function submitProperty(propertyData) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/properties`,
      propertyData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TEST_AUTH_TOKEN}`
        }
      }
    );
    
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (err) {
    return {
      success: false,
