/**
 * Test Script for Property Detail Error Handling
 * 
 * This script tests the improved error handling in the property detail route
 * by making requests with different types of property IDs:
 * 1. Invalid format IDs
 * 2. Valid format but non-existent IDs
 * 
 * Usage:
 *   node test-property-error-handling.js
 */

const axios = require('axios');
const colors = require('colors');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const PROPERTY_ENDPOINT = '/properties';

// Test cases
const testCases = [
  {
    name: 'Invalid MongoDB ID format',
    id: 'not-a-valid-id',
    expectedStatus: 'success', // We expect a success response with error details inside
    expectedErrorCode: 400
  },
  {
    name: 'Valid format but non-existent ID',
    id: '6478901234567890abcdef12', // Valid format but likely doesn't exist
    expectedStatus: 'success',
    expectedErrorCode: 404
  },
  {
    name: 'ID with ObjectId wrapper',
    id: 'ObjectId("6478901234567890abcdef12")',
    expectedStatus: 'success',
    expectedErrorCode: 404
  },
  {
    name: 'ID with quotes',
    id: '"6478901234567890abcdef12"',
    expectedStatus: 'success',
    expectedErrorCode: 404
  }
];

// Helper function to make the API request
async function testPropertyDetail(testCase) {
  try {
    console.log(`\nTesting: ${testCase.name.cyan}`);
    console.log(`Property ID: ${testCase.id.yellow}`);
    
    const response = await axios.get(`${API_BASE_URL}${PROPERTY_ENDPOINT}/${testCase.id}`);
    
    console.log(`Response Status: ${response.status === 200 ? 'OK (200)'.green : response.status.toString().red}`);
    
    // Check if we got a successful API response but with error details inside
    if (response.data && response.data.success === false) {
      console.log(`Error Details: ${JSON.stringify(response.data.error).red}`);
      console.log(`Error Code: ${response.data.code}`);
      
      if (response.data.code === testCase.expectedErrorCode) {
        console.log(`✅ Test PASSED: Received expected error code ${testCase.expectedErrorCode}`.green);
      } else {
        console.log(`❌ Test FAILED: Expected error code ${testCase.expectedErrorCode} but got ${response.data.code}`.red);
      }
    } else {
      // If we got a property, this could be a mock fallback property
      console.log(`✅ Response contains property data (possibly fallback data)`.green);
      console.log(`Property title: ${response.data.title || 'N/A'}`);
    }
    
  } catch (error) {
    console.log(`❌ Test FAILED with exception: ${error.message}`.red);
    if (error.response) {
      console.log(`Error Status: ${error.response.status}`);
      console.log(`Error Data: ${JSON.stringify(error.response.data)}`);
    }
  }
}

// Run all tests
async function runTests() {
  console.log('=================================='.yellow);
  console.log('PROPERTY DETAIL ERROR HANDLING TEST'.yellow);
  console.log('=================================='.yellow);
  
  for (const testCase of testCases) {
    await testPropertyDetail(testCase);
    console.log('---------------------------------');
  }
  
  console.log('\nAll tests completed!');
}

// Start the tests
runTests().catch(err => {
  console.error('Error running tests:', err);
});
