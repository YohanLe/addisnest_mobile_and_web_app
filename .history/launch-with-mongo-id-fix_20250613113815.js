/**
 * Launch script for testing the MongoDB ID property lookup fix
 * 
 * This script:
 * 1. Starts the backend server with MongoDB ID fix
 * 2. Starts the frontend development server
 * 3. Opens the browser to a specific property detail page using MongoDB ID
 */

const { spawn } = require('child_process');
const { exec } = require('child_process');
const path = require('path');
const readline = require('readline');

// Configuration
const BACKEND_PORT = 7000;
const FRONTEND_PORT = 5175;
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

// Start the backend server
function startBackend() {
  log('Starting backend server...', 'cyan');
  
  // Create server process
  const server = spawn('node', ['src/server.js'], {
    stdio: 'pipe',
    env: { ...process.env, PORT: BACKEND_PORT }
  });
  
  // Handle server output
  server.stdout.on('data', (data) => {
    console.log(`${colors.blue}[Backend] ${data.toString().trim()}${colors.reset}`);
  });
  
  server.stderr.on('data', (data) => {
    console.error(`${colors.red}[Backend Error] ${data.toString().trim()}${colors.reset}`);
  });
  
  server.on('close', (code) => {
    log(`Backend server process exited with code ${code}`, 'yellow');
  });
  
  return server;
}

// Start the frontend development server
function startFrontend() {
  log('Starting frontend development server...', 'cyan');
  
  // Run npm script to start frontend in development mode
  const frontend = spawn('npm', ['run', 'dev', '--', '--port', FRONTEND_PORT], {
    stdio: 'pipe',
    cwd: path.resolve(__dirname),
    shell: true
  });
  
  // Flag to track when the frontend is ready
  let frontendReady = false;
  
  // Handle frontend output
  frontend.stdout.on('data', (data) => {
    const output = data.toString().trim();
    console.log(`${colors.green}[Frontend] ${output}${colors.reset}`);
    
    // Check if frontend is ready
    if (output.includes('Local:') && !frontendReady) {
      frontendReady = true;
      log('Frontend development server is ready!', 'green');
      
      // Open the property detail page in browser
      setTimeout(() => {
        openPropertyDetailPage();
      }, 2000);
    }
  });
  
  frontend.stderr.on('data', (data) => {
    console.error(`${colors.red}[Frontend Error] ${data.toString().trim()}${colors.reset}`);
  });
  
  frontend.on('close', (code) => {
    log(`Frontend server process exited with code ${code}`, 'yellow');
  });
  
  return frontend;
}

// Open the property detail page in the browser
function openPropertyDetailPage() {
  const url = `http://localhost:${FRONTEND_PORT}/property/${TEST_PROPERTY_ID}`;
  log(`Opening property detail page: ${url}`, 'magenta');
  
  // Use the appropriate command to open the URL in the default browser
  let command;
  switch (process.platform) {
    case 'darwin': // macOS
      command = `open "${url}"`;
      break;
    case 'win32': // Windows
      command = `start "${url}"`;
      break;
    default: // Linux
      command = `xdg-open "${url}"`;
      break;
  }
  
  exec(command, (error) => {
    if (error) {
      console.error(`${colors.red}Failed to open browser: ${error.message}${colors.reset}`);
    }
  });
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Start the application
log('=====================================================', 'magenta');
log('MongoDB ID Property Lookup Fix Test', 'magenta');
log('=====================================================', 'magenta');
log('This script will:');
log('1. Start the backend server with MongoDB ID fix');
log('2. Start the frontend development server');
log('3. Open the browser to a property detail page using MongoDB ID');
log('=====================================================', 'magenta');

rl.question('Press Enter to start the application...', () => {
  const backend = startBackend();
  
  // Wait for backend to initialize before starting frontend
  setTimeout(() => {
    const frontend = startFrontend();
    
    // Handle process termination
    process.on('SIGINT', () => {
      log('Terminating servers...', 'yellow');
      backend.kill();
      frontend.kill();
      rl.close();
      process.exit();
    });
  }, 3000);
});
