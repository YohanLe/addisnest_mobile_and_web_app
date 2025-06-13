/**
 * Launcher script for testing MongoDB ID property lookup fix
 * 
 * This script starts the application with the MongoDB ID property lookup fix enabled,
 * allowing the frontend to properly fetch property details using MongoDB ObjectIDs.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const waitOn = require('wait-on');

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

// Helper function for colored console output
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Configuration
const CONFIG = {
  backendPort: 7000,
  frontendPort: 5173,
  mongoDbId: '684a5fb17cb3172bbb3c75d7', // MongoDB ID from error logs
  waitTimeout: 60000,
};

// Make sure the routes are properly set up
function verifyRouteConfiguration() {
  log('Verifying route configuration...', 'blue');
  
  const indexRoutesPath = path.join(__dirname, 'src', 'routes', 'index.js');
  try {
    const content = fs.readFileSync(indexRoutesPath, 'utf8');
    if (content.includes('propertyRoutes-mongo-id-fix')) {
      log('✓ MongoDB ID fix routes are properly configured', 'green');
      return true;
    } else {
      log('! Routes configuration does not include MongoDB ID fix', 'yellow');
      log('You may need to update src/routes/index.js to use propertyRoutes-mongo-id-fix', 'yellow');
      return false;
    }
  } catch (err) {
    log(`✗ Error checking routes configuration: ${err.message}`, 'red');
    return false;
  }
}

// Start the backend server
async function startBackend() {
  log('Starting backend server...', 'cyan');
  
  // Start the server process
  const serverProcess = spawn('node', ['src/server.js'], {
    env: { 
      ...process.env, 
      PORT: CONFIG.backendPort,
      NODE_ENV: 'development'
    },
    stdio: 'pipe'
  });
  
  // Handle server output
  serverProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      console.log(`${colors.blue}[Backend] ${output}${colors.reset}`);
    }
  });
  
  // Handle server errors
  serverProcess.stderr.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      console.error(`${colors.red}[Backend Error] ${output}${colors.reset}`);
    }
  });
  
  // Wait for the server to be available
  log(`Waiting for backend server to be ready at http://localhost:${CONFIG.backendPort}...`, 'yellow');
  try {
    await waitOn({
      resources: [`http://localhost:${CONFIG.backendPort}`],
      timeout: CONFIG.waitTimeout
    });
    log('✓ Backend server is ready', 'green');
    return serverProcess;
  } catch (error) {
    log(`✗ Failed to start backend server: ${error.message}`, 'red');
    serverProcess.kill();
    process.exit(1);
  }
}

// Start the frontend development server
async function startFrontend() {
  log('Starting frontend development server...', 'cyan');
  
  // Start the frontend development server
  const frontendProcess = spawn('npm', ['run', 'dev'], {
    env: { 
      ...process.env,
      VITE_API_BASE_URL: `http://localhost:${CONFIG.backendPort}/api`,
      VITE_TEST_PROPERTY_ID: CONFIG.mongoDbId,
      VITE_ENABLE_MONGODB_ID_FIX: 'true'
    },
    stdio: 'pipe'
  });
  
  // Handle frontend output
  frontendProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      console.log(`${colors.magenta}[Frontend] ${output}${colors.reset}`);
    }
  });
  
  // Handle frontend errors
  frontendProcess.stderr.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      console.error(`${colors.red}[Frontend Error] ${output}${colors.reset}`);
    }
  });
  
  // Wait for the frontend server to be available
  log(`Waiting for frontend server to be ready at http://localhost:${CONFIG.frontendPort}...`, 'yellow');
  try {
    await waitOn({
      resources: [`http://localhost:${CONFIG.frontendPort}`],
      timeout: CONFIG.waitTimeout
    });
    log('✓ Frontend server is ready', 'green');
    return frontendProcess;
  } catch (error) {
    log(`✗ Failed to start frontend server: ${error.message}`, 'red');
    frontendProcess.kill();
    process.exit(1);
  }
}

// Handle graceful shutdown
function setupShutdown(processes) {
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      log('\nShutting down servers...', 'yellow');
      
      // Kill all processes
      processes.forEach(proc => {
        if (proc && !proc.killed) {
          proc.kill();
        }
      });
      
      log('All servers have been stopped', 'green');
      process.exit(0);
    });
  });
}

// Display information about how to test the MongoDB ID property lookup
function displayTestInstructions() {
  log('\n======================================================', 'cyan');
  log('      MongoDB ID Property Lookup Fix Test', 'cyan');
  log('======================================================', 'cyan');
  log('The application is now running with the MongoDB ID property lookup fix enabled.', 'green');
  log('\nTo test the fix:', 'yellow');
  log('1. Navigate to http://localhost:5173', 'yellow');
  log(`2. Try to access a property detail page using the MongoDB ID: ${CONFIG.mongoDbId}`, 'yellow');
  log('   Example URL: http://localhost:5173/property-detail/' + CONFIG.mongoDbId, 'yellow');
  log('\nYou should see the property details load successfully without 401 Unauthorized errors.', 'yellow');
  log('\nCheck the backend console output to verify the API requests are being processed correctly.', 'yellow');
  log('\nPress Ctrl+C to stop all servers when finished testing.', 'red');
  log('======================================================', 'cyan');
}

// Main function to run the application
async function main() {
  log('======================================================', 'magenta');
  log('    Launching App with MongoDB ID Property Lookup Fix', 'magenta');
  log('======================================================', 'magenta');
  
  // Verify the routes configuration
  const routesConfigured = verifyRouteConfiguration();
  if (!routesConfigured) {
    log('Continuing anyway, but the fix may not be properly applied.', 'yellow');
  }
  
  // Start servers
  const processes = [];
  
  try {
    // Start backend
    const backendProcess = await startBackend();
    processes.push(backendProcess);
    
    // Start frontend
    const frontendProcess = await startFrontend();
    processes.push(frontendProcess);
    
    // Setup graceful shutdown
    setupShutdown(processes);
    
    // Display test instructions
    displayTestInstructions();
    
  } catch (error) {
    log(`✗ Error starting application: ${error.message}`, 'red');
    
    // Kill any running processes
    processes.forEach(proc => {
      if (proc && !proc.killed) {
        proc.kill();
      }
    });
    
    process.exit(1);
  }
}

// Run the application
main().catch(error => {
  log(`Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
