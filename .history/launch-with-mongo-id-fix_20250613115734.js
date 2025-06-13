/**
 * Launch script for testing the MongoDB ID property lookup fix
 * 
 * This script launches the application with the MongoDB ID fix enabled
 * and opens a browser to test a property detail page using a MongoDB ID.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const colors = require('colors');
const open = require('open');

// Configuration
const config = {
  serverScript: 'src/server-with-mongo-id-fix.js',
  frontendPort: 5173,
  backendPort: 7000,
  testPropertyId: '684a5fb17cb3172bbb3c75d7',
  waitTimeBeforeOpeningBrowser: 3000 // ms
};

// Helper function for colored console output
function log(message, color = 'white') {
  console.log(colors[color](message));
}

// Start the backend server
function startBackendServer() {
  log('\nStarting backend server with MongoDB ID fix...', 'cyan');
  
  const serverProcess = spawn('node', [config.serverScript], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      PORT: config.backendPort,
      NODE_ENV: 'development',
      DEBUG_MONGODB_ID: 'true' // Enable extra debugging for MongoDB ID lookups
    }
  });
  
  serverProcess.on('error', (error) => {
    log(`✗ Error starting backend server: ${error.message}`, 'red');
    process.exit(1);
  });
  
  return serverProcess;
}

// Start the frontend application
function startFrontendApp() {
  log('\nStarting frontend application...', 'cyan');
  
  const frontendProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      VITE_API_BASE_URL: `http://localhost:${config.backendPort}/api`,
      VITE_TEST_PROPERTY_ID: config.testPropertyId
    }
  });
  
  frontendProcess.on('error', (error) => {
    log(`✗ Error starting frontend application: ${error.message}`, 'red');
    process.exit(1);
  });
  
  return frontendProcess;
}

// Open browser to test property detail page
function openBrowser() {
  const url = `http://localhost:${config.frontendPort}/property-detail/${config.testPropertyId}`;
  log(`\nOpening browser to test property detail page: ${url}`, 'green');
  
  open(url).catch((error) => {
    log(`✗ Error opening browser: ${error.message}`, 'red');
    log(`  Please manually open: ${url}`, 'yellow');
  });
}

// Main function
async function main() {
  log('\n=======================================================', 'magenta');
  log('   MongoDB ID Property Lookup Fix - Test Launcher', 'magenta');
  log('=======================================================\n', 'magenta');
  
  // Check if server script exists
  if (!fs.existsSync(path.resolve(config.serverScript))) {
    log(`✗ Server script not found: ${config.serverScript}`, 'red');
    log('  Please make sure the fixed server script exists.', 'yellow');
    process.exit(1);
  }
  
  // Start backend server
  const serverProcess = startBackendServer();
  
  // Start frontend application
  const frontendProcess = startFrontendApp();
  
  // Wait for servers to start, then open browser
  log('\nWaiting for servers to start...', 'yellow');
  setTimeout(() => {
    openBrowser();
    
    log('\n✓ Application launched with MongoDB ID fix enabled!', 'green');
    log('  Test property ID: ' + config.testPropertyId, 'cyan');
    log('  Backend server running on port: ' + config.backendPort, 'cyan');
    log('  Frontend application running on port: ' + config.frontendPort, 'cyan');
    
    log('\nPress Ctrl+C to stop all processes.', 'yellow');
  }, config.waitTimeBeforeOpeningBrowser);
  
  // Handle process termination
  process.on('SIGINT', () => {
    log('\nShutting down...', 'yellow');
    serverProcess.kill();
    frontendProcess.kill();
    process.exit(0);
  });
}

// Run the script
main().catch(error => {
  log(`\n✗ Unexpected error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
