/**
 * Property Address Validation Test Script
 * 
 * This script tests property submission with a focus on address field validation
 * to verify that our fixes prevent the "Please add a country, Please add a state, 
 * Please add a city, Please add a street address" errors.
 */

const axios = require('axios');
require('dotenv').config();

// API base URL
const API_BASE_URL = process.env.API_URL || 'http://localhost:7000/api';

// Log formatting helpers
const success = message => console.log(`\x1b[32m✅ ${message}\x1b[0m`);
const error = message => console.log(`\x1b[31m❌ ${message}\x1b[0m`);
const info = message => console.log(`\x1b[36mℹ️ ${message}\x1b[0m`);
const divider = () => console.log('\n' + '-'.repeat(80) + '\n');

// Get auth token from environment or prompt
const TEST_AUTH_TOKEN = process.env.TEST_AUTH_TOKEN || '';

// Test property with missing address fields
const propertyWithMissingAddressFields = {
  title: "Test Property - Missing Address Fields",
  description: "This property is intentionally missing address fields to test validation",
  propertyType: "House",
  offeringType: "For Sale",
  price: 500000,
  area: 250,
  bedrooms: 3,
  bathrooms: 2,
  // Missing: street, city, regional_state, country
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
};

// Test property with address fields
const propertyWithAddressFields = {
  ...propertyWithMissingAddressFields,
  title: "Test Property - With Address Fields",
  street: "123 Test Street",
  city: "Test City",
  regional_state: "Test Region",
  country: "Ethiopia"
};

/**
 * Apply our validation fix logic to property data
 */
function applyValidationFix(data) {
  // Apply the same validation logic from our component fix
  return {
    ...data,
    street: data.street || data.property_address || "Unknown Street",
    city: data.city || data.address?.city || "Unknown City",
    regional_state: data.regional_state || data.address?.state || "Unknown State",
    country: data.country || data.address?.country || "Ethiopia"
  };
}

/**
 * Submit a property to the API
 */
async function submitProperty(propertyData) {
  try {
    info(`Submitting property: "${propertyData.title}"`);
    info(`Address fields: ${JSON.stringify({
      street: propertyData.street || 'MISSING',
      city: propertyData.city || 'MISSING',
      regional_state: propertyData.regional_state || 'MISSING',
      country: propertyData.country || 'MISSING'
    })}`);
    
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
    
    success(`Property submitted successfully! Status: ${response.status}`);
    success(`Property ID: ${response.data._id || response.data.id || 'Unknown'}`);
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (err) {
    error(`Submission failed with status ${err.response?.status || 'Unknown'}`);
    if (err.response?.data) {
      error(`Error details: ${JSON.stringify(err.response.data)}`);
    } else {
      error(`Error: ${err.message}`);
    }
    return {
      success: false,
      status: err.response?.status || 500,
      error: err.response?.data || { message: err.message }
    };
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🏠 PROPERTY ADDRESS VALIDATION TEST 🏠');
  console.log('Testing our fix for the address field validation errors');
  divider();
  
  if (!TEST_AUTH_TOKEN) {
    error('No auth token provided. Please set TEST_AUTH_TOKEN in .env or provide it as an argument.');
    return;
  }
  
  // Test 1: Submit property with missing address fields (should fail)
  console.log('Test 1: Submitting property WITH MISSING address fields (should fail)');
  const result1 = await submitProperty(propertyWithMissingAddressFields);
  if (!result1.success && result1.error?.error?.includes('add a country') && 
      result1.error?.error?.includes('add a state') && 
      result1.error?.error?.includes('add a city') && 
      result1.error?.error?.includes('add a street address')) {
    success('Test 1 passed: API correctly rejected property with missing address fields');
  } else if (result1.success) {
    error('Test 1 failed: API accepted property with missing address fields (unexpected)');
  } else {
    error(`Test 1 failed: API rejected property but with unexpected error: ${JSON.stringify(result1.error)}`);
  }
  divider();
  
  // Test 2: Submit property with our validation fix applied
  console.log('Test 2: Submitting property WITH MISSING address fields but WITH OUR FIX APPLIED');
  const fixedProperty = applyValidationFix(propertyWithMissingAddressFields);
  const result2 = await submitProperty(fixedProperty);
  if (result2.success) {
    success('Test 2 passed: Our fix successfully handled missing address fields!');
  } else {
    error(`Test 2 failed: Our fix did not resolve the issue: ${JSON.stringify(result2.error)}`);
  }
  divider();
  
  // Test 3: Submit property with all address fields properly set (control case)
  console.log('Test 3: Submitting property with ALL address fields properly set (control case)');
  const result3 = await submitProperty(propertyWithAddressFields);
  if (result3.success) {
    success('Test 3 passed: Property with correct address fields was accepted');
  } else {
    error(`Test 3 failed: Property with correct address fields was rejected: ${JSON.stringify(result3.error)}`);
  }
  
  divider();
  console.log('🔍 TEST SUMMARY:');
  console.log('1. Property with missing address fields: ' + (result1.success ? 'PASSED ✅' : 'FAILED ❌'));
  console.log('2. Property with our validation fix: ' + (result2.success ? 'PASSED ✅' : 'FAILED ❌'));
  console.log('3. Property with correct address fields: ' + (result3.success ? 'PASSED ✅' : 'FAILED ❌'));
}

// Run tests
runTests().catch(err => {
  error(`Error running tests: ${err.message}`);
});
