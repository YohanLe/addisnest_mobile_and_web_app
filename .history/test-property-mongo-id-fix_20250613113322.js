/**
 * Test script for the MongoDB ID property lookup fix
 * 
 * This script:
 * 1. Starts the server with the MongoDB ID lookup fix
 * 2. Makes direct requests to the property lookup endpoints
 * 3. Outputs the results
 */

const { spawn } = require('child_process');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// Configuration
const API_BASE_URL = 'http://localhost:7000/api';
const TEST_PROPERTY_ID = '684a5fb17cb3172bbb3c75d7'; // MongoDB ID from error logs

// Colorize console output
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

// Start the server
function startServer() {
  log('Starting server...', 'cyan');
  
  // Create server process
  const server = spawn('node', ['src/server.js'], {
    stdio: 'pipe',
    env: { ...process.env, PORT: 7000 }
  });
  
  // Handle server output
  server.stdout.on('data', (data) => {
    console.log(`${colors.blue}[Server] ${data.toString().trim()}${colors.reset}`);
    
    // When we see this message, server is ready
    if (data.toString().includes('Server running')) {
      log('Server is ready. Starting tests...', 'green');
      setTimeout(runTests, 1000); // Wait a second before testing
    }
  });
  
  server.stderr.on('data', (data) => {
    console.error(`${colors.red}[Server Error] ${data.toString().trim()}${colors.reset}`);
  });
  
  server.on('close', (code) => {
    log(`Server process exited with code ${code}`, 'yellow');
  });
  
  return server;
}

// Run the test cases
async function runTests() {
  try {
    log('=====================================================', 'magenta');
    log('Testing MongoDB ID property lookup fix', 'magenta');
    log('=====================================================', 'magenta');
    
    // Test 1: Try mongo-id endpoint
    log('\nTest 1: Testing mongo-id endpoint...', 'cyan');
    try {
      const mongoIdResponse = await axios.get(
        `${API_BASE_URL}/properties/mongo-id/${TEST_PROPERTY_ID}`,
        { timeout: 5000 }
      );
      
      if (mongoIdResponse.data && mongoIdResponse.data.success) {
        log('✅ mongo-id endpoint SUCCESS!', 'green');
        log(`Property Title: ${mongoIdResponse.data.data.title}`, 'green');
        log(`Property ID: ${mongoIdResponse.data.data._id}`, 'green');
      } else {
        log('❌ mongo-id endpoint returned unexpected response format', 'red');
        log(JSON.stringify(mongoIdResponse.data, null, 2), 'yellow');
      }
    } catch (error) {
      log('❌ mongo-id endpoint FAILED:', 'red');
      log(`Status: ${error.response?.status}`, 'red');
      log(`Message: ${error.message}`, 'red');
      if (error.response?.data) {
        log(JSON.stringify(error.response.data, null, 2), 'yellow');
      }
    }
    
    // Test 2: Try direct-db-query endpoint
    log('\nTest 2: Testing direct-db-query endpoint...', 'cyan');
    try {
      const directDbResponse = await axios.get(
        `${API_BASE_URL}/properties/direct-db-query/${TEST_PROPERTY_ID}`,
        { timeout: 5000 }
      );
      
      if (directDbResponse.data && directDbResponse.data.success) {
        log('✅ direct-db-query endpoint SUCCESS!', 'green');
        log(`Property Title: ${directDbResponse.data.data.title}`, 'green');
        log(`Property ID: ${directDbResponse.data.data._id}`, 'green');
      } else {
        log('❌ direct-db-query endpoint returned unexpected response format', 'red');
        log(JSON.stringify(directDbResponse.data, null, 2), 'yellow');
      }
    } catch (error) {
      log('❌ direct-db-query endpoint FAILED:', 'red');
      log(`Status: ${error.response?.status}`, 'red');
      log(`Message: ${error.message}`, 'red');
      if (error.response?.data) {
        log(JSON.stringify(error.response.data, null, 2), 'yellow');
      }
    }
    
    // Test 3: Try regular property endpoint
    log('\nTest 3: Testing standard property endpoint...', 'cyan');
    try {
      const standardResponse = await axios.get(
        `${API_BASE_URL}/properties/${TEST_PROPERTY_ID}`,
        { timeout: 5000 }
      );
      
      if (standardResponse.data) {
        log('✅ Standard property endpoint SUCCESS!', 'green');
        if (standardResponse.data._id) {
          log(`Property Title: ${standardResponse.data.title}`, 'green');
          log(`Property ID: ${standardResponse.data._id}`, 'green');
        } else if (standardResponse.data.data?._id) {
          log(`Property Title: ${standardResponse.data.data.title}`, 'green');
          log(`Property ID: ${standardResponse.data.data._id}`, 'green');
        } else {
          log('⚠️ Property data found but in unexpected format', 'yellow');
          log(JSON.stringify(standardResponse.data, null, 2), 'yellow');
        }
      } else {
        log('❌ Standard property endpoint returned unexpected response format', 'red');
        log(JSON.stringify(standardResponse.data, null, 2), 'yellow');
      }
    } catch (error) {
      log('❌ Standard property endpoint FAILED:', 'red');
      log(`Status: ${error.response?.status}`, 'red');
      log(`Message: ${error.message}`, 'red');
      if (error.response?.data) {
        log(JSON.stringify(error.response.data, null, 2), 'yellow');
      }
    }
    
    log('\n=====================================================', 'magenta');
    log('Tests completed! Check results above.', 'magenta');
    log('=====================================================', 'magenta');
    
    // Allow some time for logs to flush before exiting
    setTimeout(() => process.exit(0), 1000);
    
  } catch (error) {
    log('Error running tests:', 'red');
    log(error.message, 'red');
    setTimeout(() => process.exit(1), 1000);
  }
}

// Run the script
const server = startServer();

// Handle process termination
process.on('SIGINT', () => {
  log('Terminating server...', 'yellow');
  server.kill();
  process.exit();
});
