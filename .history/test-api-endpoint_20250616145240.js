/**
 * API Endpoint Test Script for Addisnest.com
 * 
 * This script tests the API endpoint specified in the .env.production file
 * to verify it's operational before proceeding with the soft launch.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Load environment variables from .env.production
function loadEnvVars() {
  try {
    const envFile = fs.readFileSync(path.join(__dirname, '.env.production'), 'utf8');
    const envVars = {};
    
    envFile.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        const value = match[2] || '';
        envVars[key] = value.replace(/^['"]|['"]$/g, '');
      }
    });
    
    return envVars;
  } catch (error) {
    console.error(`${colors.red}Error loading .env.production file:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Test API endpoint
function testApiEndpoint(apiUrl) {
  console.log(`${colors.cyan}Testing API endpoint:${colors.reset} ${apiUrl}`);
  
  // Handle URLs with or without trailing slash
  const endpoint = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
  
  // Try to append 'health' endpoint if it exists
  const healthEndpoint = `${endpoint}health`;
  
  console.log(`${colors.yellow}First trying health check endpoint:${colors.reset} ${healthEndpoint}`);
  
  makeRequest(healthEndpoint)
    .then(response => {
      console.log(`${colors.green}✓ API health check successful!${colors.reset}`);
      console.log(`${colors.white}Response:${colors.reset}`, response);
      testEndpointFeatures(endpoint);
    })
    .catch(error => {
      console.log(`${colors.yellow}Health check endpoint not available or returned an error.${colors.reset}`);
      console.log(`${colors.yellow}Trying base API endpoint...${colors.reset}`);
      
      makeRequest(endpoint)
        .then(response => {
          console.log(`${colors.green}✓ API base endpoint successful!${colors.reset}`);
          console.log(`${colors.white}Response:${colors.reset}`, response);
          testEndpointFeatures(endpoint);
        })
        .catch(error => {
          console.error(`${colors.red}✗ API endpoint test failed:${colors.reset}`, error);
          console.log(`${colors.red}The API endpoint appears to be unavailable.${colors.reset}`);
          console.log(`${colors.yellow}Please check:${colors.reset}`);
          console.log(`1. The API server is running`);
          console.log(`2. The URL in .env.production is correct`);
          console.log(`3. There are no network issues preventing connection`);
        });
    });
}

// Test additional endpoint features if available
function testEndpointFeatures(baseUrl) {
