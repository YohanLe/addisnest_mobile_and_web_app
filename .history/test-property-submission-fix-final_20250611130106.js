/**
 * Property Submission Fix Test Script
 * 
 * This script tests the property submission functionality to verify 
 * that our fixes in the ChoosePropmotion component resolve the 500 Internal Server error.
 */

const axios = require('axios');
require('dotenv').config();

// Default token for authentication - replace with your own
const token = process.env.TEST_AUTH_TOKEN || 'YOUR_AUTH_TOKEN';

// API base URL
const API_BASE_URL = process.env.API_URL || 'http://localhost:7000/api';

// Test property data
const testPropertyData = {
  title: "Test Property Submission",
  description: "This is a test property to verify the submission fix",
  propertyType: "House",
  offeringType: "For Sale",
  price: 2500000,
  area: 250,
  bedrooms: 3,
  bathrooms: 2,
  // Explicit address fields to prevent validation errors
  street: "10600 Test Street",
  city: "Test City",
  regional_state: "Test Region",
  country: "Ethiopia",
  features: {
    "parking-space": true,
    "24-7-security": true,
    "gym-fitness-center": true
  },
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
  promotionType: "Basic",
  views: 0,
  likes: 0,
  furnishingStatus: "Unfurnished"
};

/**
 * Test the property submission
 */
async function testPropertySubmission() {
  console.log("🏠 Starting property submission test...");
  console.log("📤 Submitting property with the following data:");
  console.log(JSON.stringify(testPropertyData, null, 2));

  try {
    const response = await axios.post(
      `${API_BASE_URL}/properties`, 
      testPropertyData, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log("\n✅ Property submission successful!");
    console.log("📊 Response status:", response.status);
    console.log("🆔 Property ID:", response.data._id || response.data.id || "Unknown");
    console.log("📄 Response data:", JSON.stringify(response.data, null, 2));
    
    return {
      success: true,
      propertyId: response.data._id || response.data.id,
      data: response.data
    };
  } catch (error) {
    console.error("\n❌ Property submission failed!");
    
    if (error.response) {
      console.error("📊 Response status:", error.response.status);
      console.error("📄 Error data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("🔥 Error:", error.message);
    }
    
    return {
      success: false,
      error: error.response ? error.response.data : error.message
    };
  }
}

/**
 * Main function to run tests
 */
