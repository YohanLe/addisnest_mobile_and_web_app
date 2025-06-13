/**
 * Test script for MongoDB ID property lookup fix
 * 
 * This script tests the API endpoints for MongoDB ID property lookup.
 * It makes requests to all three endpoints to verify at least one works.
 */

const axios = require('axios');
const colors = require('colors');

// Test configuration
const CONFIG = {
  apiBaseUrl: 'http://localhost:7000/api',
  testIds: [
    '684a5fb17cb3172bbb3c75d7', // ID from error logs
    '684a57857cb3172bbb3c73d9'  // ID from browser URL
  ],
  timeoutMs: 10000
};

// Helper function for colored console output
function log(message, color = 'white') {
  console.log(colors[color](message));
}

// Helper function to make API requests
async function makeRequest(endpoint, id) {
  try {
    const url = `${CONFIG.apiBaseUrl}/${endpoint}/${id}?t=${Date.now()}`;
    log(`Making request to: ${url}`, 'cyan');
    
    const response = await axios.get(url, { 
      timeout: CONFIG.timeoutMs,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 0,
      error: error.message,
      data: error.response?.data || null
    };
  }
}

// Test function for each endpoint
async function testEndpoint(endpoint, id) {
  log(`\nTesting endpoint: ${endpoint} with ID: ${id}`, 'yellow');
  log('-'.repeat(50), 'gray');
  
  const result = await makeRequest(endpoint, id);
  
  if (result.success) {
    log(`✓ SUCCESS: ${endpoint} (Status: ${result.status})`, 'green');
    log(`Response data: ${JSON.stringify(result.data?.data?._id || result.data?._id || 'No ID in response')}`, 'green');
    return true;
  } else {
    log(`✗ FAILED: ${endpoint} (Status: ${result.status})`, 'red');
    log(`Error: ${result.error}`, 'red');
    if (result.data) {
      log(`Response data: ${JSON.stringify(result.data)}`, 'gray');
    }
    return false;
  }
}

// Test all MongoDB ID endpoints
async function testMongoIdEndpoints(id) {
  log(`\n========================================================`, 'cyan');
  log(`Testing MongoDB ID property lookup for ID: ${id}`, 'cyan');
  log(`========================================================`, 'cyan');
  
  // Test the mongo-id endpoint
  const mongoIdResult = await testEndpoint('properties/mongo-id', id);
  
  // Test the standard endpoint
  const standardResult = await testEndpoint('properties', id);
  
  // Test the direct-db-query endpoint
  const directDbResult = await testEndpoint('properties/direct-db-query', id);
  
  // Check if at least one endpoint succeeded
  if (mongoIdResult || standardResult || directDbResult) {
    log(`\n✓ SUCCESS: At least one endpoint works for ID: ${id}`, 'green');
    return true;
  } else {
    log(`\n✗ FAILED: All endpoints failed for ID: ${id}`, 'red');
    return false;
  }
}

// Main test function
async function runTests() {
  log('\n=== MongoDB ID Property Lookup Fix Test ===', 'magenta');
  
  let allSucceeded = true;
  
  // Test each ID
  for (const id of CONFIG.testIds) {
    const success = await testMongoIdEndpoints(id);
    if (!success) {
      allSucceeded = false;
    }
  }
  
  // Final result
  log('\n========================================================', 'cyan');
  if (allSucceeded) {
    log('✓ OVERALL TEST RESULT: SUCCESS - MongoDB ID property lookup fix is working!', 'green');
  } else {
    log('✗ OVERALL TEST RESULT: FAILED - Some MongoDB ID lookups are not working', 'red');
    log('Please check the server logs for more details', 'yellow');
  }
  log('========================================================\n', 'cyan');
}

// Run the tests
runTests()
  .catch(error => {
    log(`Error running tests: ${error.message}`, 'red');
    process.exit(1);
  });
