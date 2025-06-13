/**
 * Improved server restart script for Addinest application
 * 
 * This script:
 * 1. Checks if the server is already running
 * 2. Kills any existing server processes
 * 3. Restarts the server with proper configuration
 * 4. Provides detailed status messages
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Configuration
const config = {
  serverScriptPath: path.join(__dirname, 'src', 'server.js'),
  serverPort: 7001,
  frontendPort: 5173,
  timeout: 5000 // ms to wait for server to start
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Utility functions
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}[STEP]${colors.reset} ${msg}`)
};

const checkIfProcessRunning = (port) => {
  return new Promise((resolve) => {
    const command = os.platform() === 'win32' 
      ? `netstat -ano | findstr :${port}`
      : `lsof -i :${port}`;
    
    exec(command, (error, stdout) => {
      resolve(!!stdout);
    });
  });
};

const killProcessOnPort = (port) => {
  return new Promise((resolve, reject) => {
    const command = os.platform() === 'win32'
      ? `for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port}') do taskkill /F /PID %a`
      : `lsof -ti:${port} | xargs kill -9`;

    exec(command, (error) => {
      if (error && !error.toString().includes('No tasks')) {
        log.warning(`Could not kill process on port ${port}: ${error}`);
      }
      resolve();
    });
  });
};

const waitFor = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Main function to restart the server
async function restartServer() {
  console.log('\n' + '='.repeat(60));
  log.info(`Addinest Server Restart Utility`);
  console.log('='.repeat(60) + '\n');

  // Step 1: Check if server is already running
  log.step('Checking if server is already running...');
  const serverRunning = await checkIfProcessRunning(config.serverPort);
  
  if (serverRunning) {
    log.warning(`Server is already running on port ${config.serverPort}`);
    log.step('Stopping existing server process...');
    
    await killProcessOnPort(config.serverPort);
    await waitFor(1000); // Give it a moment to shut down
    
    // Verify the process was killed
    const stillRunning = await checkIfProcessRunning(config.serverPort);
    if (stillRunning) {
      log.error(`Failed to stop server on port ${config.serverPort}`);
      log.info('Please stop the server manually and try again');
      process.exit(1);
    } else {
      log.success('Existing server process stopped successfully');
    }
  } else {
    log.info('No existing server process detected');
  }

  // Step 2: Check if the frontend server is running
  log.step('Checking if frontend server is running...');
  const frontendRunning = await checkIfProcessRunning(config.frontendPort);
  
  if (!frontendRunning) {
    log.warning('Frontend server does not appear to be running');
    log.info('You may need to start the frontend separately with "npm run dev"');
  } else {
    log.info('Frontend server is running');
  }

  // Step 3: Ensure server script exists
  log.step('Verifying server script...');
  if (!fs.existsSync(config.serverScriptPath)) {
    log.error(`Server script not found at ${config.serverScriptPath}`);
    process.exit(1);
  }
  log.success('Server script found');

  // Step 4: Start the server
  log.step('Starting server...');
  
  const serverProcess = spawn('node', [config.serverScriptPath], {
    stdio: 'inherit',
    detached: true
  });
  
  // Handle server process events
  serverProcess.on('error', (error) => {
    log.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  });
  
  // Give the server time to start up
  await waitFor(config.timeout);
  
  // Check if server started successfully
  const serverStarted = await checkIfProcessRunning(config.serverPort);
  if (serverStarted) {
    log.success(`Server started successfully on port ${config.serverPort}`);
    log.info('Server is now running in the background');
    
    // Provide access URLs
    console.log('\n' + '-'.repeat(60));
    log.info(`API Server: http://localhost:${config.serverPort}`);
    log.info(`Frontend (if running): http://localhost:${config.frontendPort}`);
    console.log('-'.repeat(60) + '\n');
    
    log.info('Press Ctrl+C to detach from this process (server will continue running)');
    
    // Keep the script running unless terminated
    serverProcess.unref();
    
  } else {
    log.error('Server failed to start within the expected time');
    log.info('Check the server logs for more information');
    process.exit(1);
  }
}

// Run the restart process
restartServer().catch(error => {
  log.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
