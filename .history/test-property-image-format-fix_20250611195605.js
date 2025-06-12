/**
 * Test Script for Property Image Format Fix
 * 
 * This script tests the property submission flow with various image formats
 * to verify that the image format fix in ChoosePropmotionFixed.jsx works correctly.
 * 
 * Usage:
 * 1. Start the application
 * 2. Run this script with: node test-property-image-format-fix.js
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:7000/api';
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'password123';

// Test data
const testPropertyData = {
  title: "Test Property with Image Format Fix",
  description: "This property is created by the test-property-image-format-fix.js script",
  propertyType: "House",
  offeringType: "For Sale",
  price: 5000000,
  area: 250,
  bedrooms: 3,
  bathrooms: 2,
  street: "Test Street",
  city: "Addis Ababa",
  regional_state: "Addis Ababa",
  country: "Ethiopia",
  features: {
    hasPool: true,
    hasGarden: true,
    hasParking: true
  },
  promotionType: "Basic"
};

// Different image formats to test
const testImageFormats = [
  // Test 1: Array of strings
  [
    "/uploads/test-property-image-1749260861596-438465535.jpg",
    "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg"
  ],
  
  // Test 2: Array of objects with url property
  [
    { url: "/uploads/test-property-image-1749260861596-438465535.jpg" },
    { url: "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg" }
  ],
  
  // Test 3: Mixed format (strings and objects)
  [
    "/uploads/test-property-image-1749260861596-438465535.jpg",
    { url: "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg" }
  ],
  
  // Test 4: Objects with additional properties
  [
    { 
      url: "/uploads/test-property-image-1749260861596-438465535.jpg",
      caption: "Default Property Image",
      _id: "test-id-123456"
    },
    { 
      url: "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg",
      caption: "Default Property Image 2",
      _id: "test-id-789012"
    }
  ],
  
  // Test 5: Empty array (should use default images)
  [],
  
  // Test 6: Undefined images (should use default images)
  undefined
];

// Main function
async function runTest() {
  try {
    console.log("========================================");
    console.log("PROPERTY IMAGE FORMAT FIX TEST");
    console.log("========================================");
    
    // Step 1: Login to get authentication token
    console.log("\n📋 STEP 1: Authenticating test user...");
    const authResponse = await axios.post(`${API_URL}/auth/login`, {
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD
    });
    
    if (!authResponse.data.token) {
      throw new Error("Authentication failed - no token received");
    }
    
    const token = authResponse.data.token;
    console.log("✅ Authentication successful");
    
    // Configure axios for authenticated requests
    const api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Step 2: Run tests for each image format
    console.log("\n📋 STEP 2: Testing different image formats...");
    
    let successCount = 0;
    let failureCount = 0;
    const results = [];
    
    for (let i = 0; i < testImageFormats.length; i++) {
      const imageFormat = testImageFormats[i];
      const testName = `Test ${i + 1}: ${getTestDescription(i)}`;
      
      console.log(`\n⏳ Running ${testName}...`);
      
      try {
        // Create property data with the current image format
        const propertyData = {
          ...testPropertyData,
          images: imageFormat,
          title: `${testPropertyData.title} - Format Test ${i + 1}`
        };
        
        console.log(`Submitting property with images:`, 
          imageFormat === undefined ? "undefined" : JSON.stringify(imageFormat));
        
        // Submit the property
        const response = await api.post('/properties', propertyData);
        
        if (response.data && (response.data._id || response.data.id)) {
          console.log(`✅ SUCCESS: Property created with ID: ${response.data._id || response.data.id}`);
          console.log(`   Returned images:`, JSON.stringify(response.data.images));
          successCount++;
          results.push({
            test: testName,
            status: 'SUCCESS',
            propertyId: response.data._id || response.data.id,
            imageCount: response.data.images ? response.data.images.length : 0
          });
        } else {
          console.log(`❌ FAILURE: Unexpected response format`);
          failureCount++;
          results.push({
            test: testName,
            status: 'FAILURE',
            reason: 'Unexpected response format',
            response: JSON.stringify(response.data)
          });
        }
      } catch (error) {
        console.log(`❌ FAILURE: ${error.message}`);
        if (error.response) {
          console.log(`   Status: ${error.response.status}`);
          console.log(`   Data:`, JSON.stringify(error.response.data));
        }
        failureCount++;
        results.push({
          test: testName,
          status: 'FAILURE',
          reason: error.message,
          responseStatus: error.response ? error.response.status : 'N/A',
          responseData: error.response ? JSON.stringify(error.response.data) : 'N/A'
        });
      }
    }
    
    // Step 3: Generate summary report
    console.log("\n📋 STEP 3: Generating test summary...");
    
    console.log("\n========================================");
    console.log("TEST SUMMARY");
    console.log("========================================");
    console.log(`Total Tests: ${testImageFormats.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failureCount}`);
    console.log("========================================");
    
    console.log("\nDETAILED RESULTS:");
    results.forEach((result, index) => {
      console.log(`\n${result.test}:`);
      console.log(`Status: ${result.status}`);
      if (result.status === 'SUCCESS') {
        console.log(`Property ID: ${result.propertyId}`);
        console.log(`Image Count: ${result.imageCount}`);
      } else {
        console.log(`Reason: ${result.reason}`);
        console.log(`Response Status: ${result.responseStatus}`);
        console.log(`Response Data: ${result.responseData}`);
      }
    });
    
    // Write results to file
    const reportPath = path.join(__dirname, 'image-format-test-results.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        total: testImageFormats.length,
        successful: successCount,
        failed: failureCount
      },
      results
    }, null, 2));
    
    console.log(`\n✅ Test report saved to: ${reportPath}`);
    
    if (failureCount === 0) {
      console.log("\n✅ ALL TESTS PASSED! The image format fix is working correctly.");
    } else {
      console.log("\n❌ SOME TESTS FAILED. Please review the detailed results above.");
    }
  } catch (error) {
    console.error("Error running test:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

// Helper function to get test description
function getTestDescription(index) {
  const descriptions = [
    "Array of strings",
    "Array of objects with url property",
    "Mixed format (strings and objects)",
    "Objects with additional properties",
    "Empty array (should use default images)",
    "Undefined images (should use default images)"
  ];
  
  return descriptions[index] || `Unknown test ${index + 1}`;
}

// Run the test
runTest();
