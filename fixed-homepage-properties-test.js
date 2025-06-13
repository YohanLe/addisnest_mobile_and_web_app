/**
 * Fixed Test Script for Homepage Properties Display
 * 
 * This script tests the display of all properties on the homepage
 * and includes debugging information to trace the data flow.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('====== HOMEPAGE PROPERTIES DISPLAY DEBUGGING TOOL ======');
console.log('\nRunning test for displaying properties on the home page...\n');

// Set environment variables
process.env.MONGODB_URI = 'mongodb://localhost:27017/addinest';
process.env.SHOW_ALL_PROPERTIES = 'true';
process.env.PORT = '7000'; // Match the port in .env file

// Start the server process
console.log('Starting server on port 7000...');
const serverProcess = spawn('node', ['src/server.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: 7000,
    NODE_ENV: 'development',
    MONGODB_URI: 'mongodb://localhost:27017/addinest',
    SHOW_ALL_PROPERTIES: 'true'
  }
});

console.log('Server process started with PID:', serverProcess.pid);

// Start the frontend application after a short delay
setTimeout(() => {
  console.log('Starting frontend application...');
  
  const frontendProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      VITE_API_URL: 'http://localhost:7000/api',
      SHOW_ALL_PROPERTIES: 'true'
    }
  });
  
  console.log('Frontend process started with PID:', frontendProcess.pid);
  
  // Handle cleanup when the script is terminated
  const cleanup = () => {
    console.log('\nCleaning up processes...');
    if (serverProcess && !serverProcess.killed) {
      serverProcess.kill();
      console.log('Server process terminated');
    }
    if (frontendProcess && !frontendProcess.killed) {
      frontendProcess.kill();
      console.log('Frontend process terminated');
    }
    process.exit(0);
  };
  
  // Register cleanup handlers
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', cleanup);
  
  console.log('\n');
  console.log('='.repeat(80));
  console.log('APPLICATION STARTED WITH DEBUGGING FOR HOMEPAGE PROPERTIES');
  console.log('-'.repeat(80));
  console.log('Changes made:');
  console.log('1. Added debug logging in HomePage component');
  console.log('2. Added debug logging in FeaturedProperties component');
  console.log('3. Set up consistent API URL and port configuration');
  console.log('4. Updated title to "All Properties" instead of "Featured Properties"');
  console.log('='.repeat(80));
  console.log('\n');
  console.log('Access the application at: http://localhost:3000');
  console.log('Check the browser console logs for debug information!');
  console.log('\n');
  
}, 3000);
