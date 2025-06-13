/**
 * Test script for MongoDB ID property lookup fix
 * 
 * This script tests the ability to look up properties by MongoDB ID
 * via three different endpoints to ensure at least one works.
 */

const axios = require('axios');
const { spawn } = require('child_process');
const waitOn = require('wait-on');

// Configuration
const API_BASE_URL = 'http://localhost:7000/api';
const TEST_PROPERTY_ID = '684a5fb17cb3172bbb3c75d7'; // MongoDB ID from error logs

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Helper to print colored messages
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Start the backend server for testing
async function startServer() {
  log('Starting backend server for testing...', 'cyan');
  
  // Create server process with modified routes
  const server = spawn('node', ['src/server.js'], {
    stdio: 'pipe',
    env: { ...process.env, PORT: 7000 }
  });
  
  // Handle server output
  server.stdout.on('data', (data) => {
    console.log(`${colors.blue}[Server] ${data.toString().trim()}${colors.reset}`);
  });
  
  server.stderr.on('data', (data) => {
    console.error(`${colors.red}[Server Error] ${data.toString().trim()}${colors.reset}`);
  });
  
  // Wait for the server to be available
  log('Waiting for server to be ready...', 'yellow');
  try {
    await waitOn({ resources: ['http://localhost:7000'], timeout: 30000 });
    log('Server is ready!', 'green');
    return server;
  } catch (error) {
    log(`Failed to start server: ${error.message}`, 'red');
    server.kill();
    process.exit(1);
  }
}

// Test all property lookup endpoints
async function testEndpoints() {
  const endpoints = [
    {
      name: 'MongoDB ID Endpoint',
      url: `${API_BASE_URL}/properties/mongo-id/${TEST_PROPERTY_ID}`,
      description: 'Dedicated endpoint for MongoDB ID lookup'
    },
    {
      name: 'Standard Endpoint',
      url: `${API_BASE_URL}/properties/${TEST_PROPERTY_ID}`,
      description: 'Standard property endpoint with ID parameter'
    },
    {
      name: 'Direct DB Query Endpoint',
      url: `${API_BASE_URL}/properties/direct-db-query/${TEST_PROPERTY_ID}`,
      description: 'Fallback endpoint using direct database query'
    }
  ];
  
  log('\n===== TESTING PROPERTY LOOKUP ENDPOINTS =====', 'cyan');
  
  let overallSuccess = false;
  
  for (const endpoint of endpoints) {
    log(`\nTesting: ${endpoint.name}`, 'yellow');
    log(`URL: ${endpoint.url}`, 'blue');
    log(`Description: ${endpoint.description}`, 'blue');
    
    try {
      // Add timestamp to prevent caching
      const url = `${endpoint.url}?t=${Date.now()}`;
      log(`Making request to: ${url}`, 'blue');
      
      // Use axios to make the request with dummy Authorization header
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'public'
        }
      });
      
      if (response.status === 200 && response.data.success) {
        log(`✓ SUCCESS: ${endpoint.name}`, 'green');
        log('Response data:', 'green');
        
        const property = response.data.data;
        log(`  - ID: ${property._id || property.id}`, 'green');
        log(`  - Title: ${property.title}`, 'green');
        log(`  - Price: ${property.price || property.total_price}`, 'green');
        
        overallSuccess = true;
      } else {
        log(`✗ FAILED: ${endpoint.name} - Unexpected response format`, 'red');
        log(`Response status: ${response.status}`, 'yellow');
        log(`Response data: ${JSON.stringify(response.data, null, 2)}`, 'yellow');
      }
    } catch (error) {
      log(`✗ ERROR: ${endpoint.name}`, 'red');
      
      if (error.response) {
        // Server responded with an error status
        log(`Status: ${error.response.status}`, 'red');
        log(`Error data: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
      } else if (error.request) {
        // Request was made but no response received
        log('No response received from server', 'red');
      } else {
        // Error in setting up the request
        log(`Error message: ${error.message}`, 'red');
      }
    }
  }
  
  return overallSuccess;
}

// Main test function
async function runTest() {
  log('======================================================', 'magenta');
  log('MongoDB ID Property Lookup Fix Test', 'magenta');
  log('======================================================', 'magenta');
  log('This test verifies that properties can be retrieved using MongoDB Object IDs.');
  log('It tests three different endpoints to ensure at least one works properly.');
  log('======================================================', 'magenta');
  
  const server = await startServer();
  
  try {
    // Wait a moment for routes to initialize fully
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Run the tests
    const success = await testEndpoints();
    
    if (success) {
      log('\n✓ TEST PASSED: At least one endpoint successfully retrieved the property', 'green');
    } else {
      log('\n✗ TEST FAILED: All endpoints failed to retrieve the property', 'red');
    }
  } catch (error) {
    log(`\n✗ TEST ERROR: ${error.message}`, 'red');
  } finally {
    // Clean up
    log('\nShutting down test server...', 'yellow');
    server.kill();
  }
}

// Run the test
runTest().catch(error => {
  log(`Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
