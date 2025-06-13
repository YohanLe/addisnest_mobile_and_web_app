/**
 * Launch script with MongoDB ID property lookup fix
 * 
 * This script:
 * 1. Seeds the database with test properties with specific MongoDB IDs
 * 2. Launches the application with the MongoDB ID property lookup fix enabled
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const colors = require('colors');

// Configuration
const CONFIG = {
  // MongoDB connection string
  mongoUri: 'mongodb://localhost:27017/addisnest',
  // Server port
  serverPort: 7000,
  // Client port
  clientPort: 5173,
  // Wait time before opening browser (ms)
  browserWaitTime: 5000,
  // Test property IDs
  testPropertyIds: [
    '684a5fb17cb3172bbb3c75d7',
    '684a57857cb3172bbb3c73d9'
  ]
};

// Helper for colored console output
function log(message, color = 'white') {
  console.log(colors[color](message));
}

// Seed test properties
async function seedTestProperties() {
  return new Promise((resolve, reject) => {
    log('\n=== Seeding test properties with specific MongoDB IDs ===', 'cyan');
    
    const seedProcess = spawn('node', ['seed-test-property-data.js'], {
      stdio: 'inherit'
    });
    
    seedProcess.on('close', (code) => {
      if (code === 0) {
        log('✓ Test properties seeded successfully!', 'green');
        resolve();
      } else {
        log('✗ Failed to seed test properties', 'red');
        reject(new Error('Seed process failed'));
      }
    });
  });
}

// Start the server
function startServer() {
  return new Promise((resolve) => {
    log('\n=== Starting server with MongoDB ID property lookup fix ===', 'cyan');
    
    // Ensure we're using the fixed routes
    const serverProcess = spawn('node', ['src/server.js'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        PORT: CONFIG.serverPort,
        MONGODB_URI: CONFIG.mongoUri,
        NODE_ENV: 'development',
        USE_MONGODB_ID_FIX: 'true'
      }
    });
    
    serverProcess.on('error', (err) => {
      log(`Server error: ${err.message}`, 'red');
    });
    
    // Give the server some time to start
    setTimeout(() => {
      log(`✓ Server started on port ${CONFIG.serverPort}`, 'green');
      resolve(serverProcess);
    }, 2000);
  });
}

// Start the client
function startClient() {
  return new Promise((resolve) => {
    log('\n=== Starting client application ===', 'cyan');
    
    const clientProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      cwd: path.join(process.cwd(), 'src')
    });
    
    clientProcess.on('error', (err) => {
      log(`Client error: ${err.message}`, 'red');
    });
    
    // Give the client some time to start
    setTimeout(() => {
      log(`✓ Client started on port ${CONFIG.clientPort}`, 'green');
      resolve(clientProcess);
    }, 3000);
  });
}

// Open the browser to test the property detail pages
function openBrowser() {
  log('\n=== Opening browser to test property detail pages ===', 'cyan');
  
  setTimeout(() => {
    // Get the first test property ID
    const testId = CONFIG.testPropertyIds[0];
    
    // Open browser to the test property detail page
    const command = process.platform === 'win32' 
      ? `start http://localhost:${CONFIG.clientPort}/property-detail/${testId}`
      : process.platform === 'darwin' 
        ? `open http://localhost:${CONFIG.clientPort}/property-detail/${testId}`
        : `xdg-open http://localhost:${CONFIG.clientPort}/property-detail/${testId}`;
    
    exec(command, (err) => {
      if (err) {
        log(`Error opening browser: ${err.message}`, 'red');
      } else {
        log(`✓ Browser opened to test property detail page: ${testId}`, 'green');
        
        // Show instructions for testing
        log('\n=== Testing instructions ===', 'yellow');
        log('1. Check that the property detail page loads correctly without 401 errors', 'yellow');
        log('2. Test the other property ID by navigating to:', 'yellow');
        log(`   http://localhost:${CONFIG.clientPort}/property-detail/${CONFIG.testPropertyIds[1]}`, 'cyan');
        log('3. Press Ctrl+C twice to stop the application when done', 'yellow');
      }
    });
  }, CONFIG.browserWaitTime);
}

// Main function
async function main() {
  log('\n===============================================================', 'magenta');
  log('     MongoDB ID Property Lookup Fix - Test & Launch Script', 'magenta');
  log('===============================================================\n', 'magenta');
  
  try {
    // Step 1: Seed test properties
    await seedTestProperties();
    
    // Step 2: Start the server
    const serverProcess = await startServer();
    
    // Step 3: Start the client
    const clientProcess = await startClient();
    
    // Step 4: Open browser to test
    openBrowser();
    
    // Handle process termination
    process.on('SIGINT', () => {
      log('\nShutting down...', 'yellow');
      
      serverProcess.kill();
      clientProcess.kill();
      
      process.exit(0);
    });
    
  } catch (error) {
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the script
main();
