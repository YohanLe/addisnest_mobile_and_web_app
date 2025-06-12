/**
 * Test Script for Property Submission 500 Error Fix
 * 
 * This script tests the fixed version of the property submission flow by:
 * 1. Creating a sample property object with all required fields
 * 2. Making an API call to the server to create the property
 * 3. Verifying the server response is successful (no 500 error)
 * 4. Logging the created property details
 * 
 * Usage: 
 * 1. Start the server
 * 2. Run this script using Node.js: 
 *    node test-property-submission-500-fix.js
 */

require('dotenv').config();
const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:7000/api'; // Update this if your server runs on a different port
const TOKEN = process.env.TEST_AUTH_TOKEN || ''; // Get a valid token or set in .env file

// Sample property data with all required fields
const sampleProperty = {
  title: "Test Property - 500 Fix Verification",
  description: "This is a test property to verify the 500 error fix",
  propertyType: "House",
  offeringType: "For Sale",
  price: 5000000,
  area: 250,
  bedrooms: 3,
  bathrooms: 2,
  // Address fields as flat properties (required by MongoDB schema)
  street: "123 Test Street",
  city: "Addis Ababa",
  state: "Addis Ababa City Administration",
  country: "Ethiopia",
  // Features (amenities) as boolean properties
  features: {
    "parking-space": true,
    "24-7-security": true,
    "gym-fitness-center": true
  },
  // Add default images
  images: [
    {
      url: "/uploads/test-property-image-1749260861596-438465535.jpg",
      caption: "Default Property Image"
    },
    {
      url: "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg",
      caption: "Default Property Image 2"
    }
  ],
  isPremium: false,
  isVerified: false,
  // IMPORTANT: Let the server determine status based on promotionType
  promotionType: "Basic", // Can be "Basic", "VIP", or "Diamond"
  furnishingStatus: "Unfurnished"
};

// Test the API call
async function testPropertySubmission() {
  console.log('⏳ Testing property submission with fixed data structure...');
  
  try {
    if (!TOKEN) {
      console.error('❌ ERROR: No authentication token provided. Please set TEST_AUTH_TOKEN in .env file');
      console.log('You can get a token by logging in through the web interface and copying it from localStorage');
      return;
    }

    // Make the API call
    const response = await axios.post(
      `${API_URL}/properties`, 
      sampleProperty,
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Log the response
    console.log('✅ SUCCESS: Property created successfully!');
    console.log('Response status:', response.status);
    console.log('Property ID:', response.data._id);
    console.log('Status set by server:', response.data.status);
    console.log('Promotion Type:', response.data.promotionType);
    
    // Detailed info
    console.log('\n📋 Detailed property info:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    // Handle error
    console.error('❌ ERROR: Failed to create property');
    
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      
      // Special handling for 500 errors (the original issue)
      if (error.response.status === 500) {
        console.error('\n⚠️ The 500 error is still occurring! The fix might not be working properly.');
        console.error('This could indicate a mismatch between the client data structure and server expectations.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from the server. Is the server running?');
    } else {
      // Something else caused the error
      console.error('Error message:', error.message);
    }
    
    console.error('\nCheck the following:');
    console.error('1. Is the server running on the correct port?');
    console.error('2. Is the authentication token valid?');
    console.error('3. Does the property data structure match the server schema?');
    
    return null;
  }
}

// Alternative test: Test different promotion types
async function testPromotionTypes() {
  const promotionTypes = ['Basic', 'VIP', 'Diamond'];
  
  console.log('🧪 Testing different promotion types to verify status setting...');
  
  for (const promo of promotionTypes) {
    const testProperty = {
      ...sampleProperty,
      title: `Test Property - ${promo} Plan`,
      promotionType: promo
    };
    
    console.log(`\n⏳ Testing ${promo} plan submission...`);
    
    try {
      const response = await axios.post(
        `${API_URL}/properties`, 
        testProperty,
        {
          headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`✅ ${promo} plan submission successful!`);
      console.log(`Status set by server: ${response.data.status}`);
      console.log(`Expected status: ${promo === 'Basic' ? 'active' : 'Pending'}`);
      console.log(`Status correct: ${(promo === 'Basic' && response.data.status === 'active') || 
                                    ((promo === 'VIP' || promo === 'Diamond') && response.data.status === 'Pending')}`);
    } catch (error) {
      console.error(`❌ ${promo} plan submission failed:`, error.message);
    }
  }
}

// Execute the tests
async function runTests() {
  console.log('🔍 PROPERTY SUBMISSION 500 ERROR FIX - TEST SCRIPT\n');
  
  // Test basic property submission
  const result = await testPropertySubmission();
  
  // If basic test succeeds, test different promotion types
  if (result) {
    console.log('\n\n====================================');
    await testPromotionTypes();
  }
  
  console.log('\n\n✨ Test completed!');
}

runTests();
