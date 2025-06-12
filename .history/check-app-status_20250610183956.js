/**
 * AddisnEst Application Status Checker
 * This script checks if the application services are running properly
 */

const http = require('http');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Log with colors
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Header
log('\n=================================================', 'green');
log('     AddisnEst Application Status Checker        ', 'green');
log('=================================================\n', 'green');

// Simple HTTP GET request function
function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (response) => {
      const { statusCode } = response;
      const contentType = response.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\nStatus Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error(`Invalid content-type.\nExpected application/json but received ${contentType}`);
      }
      
      if (error) {
        console.error(error.message);
        // Consume response data to free up memory
        response.resume();
        reject(error);
        return;
      }

      response.setEncoding('utf8');
      let rawData = '';
      response.on('data', (chunk) => { rawData += chunk; });
      response.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          resolve(parsedData);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}

// Check if a port is open by attempting a connection
function isPortOpen(host, port) {
  return new Promise((resolve) => {
    const socket = new require('net').Socket();
    
    const onError = () => {
      socket.destroy();
      resolve(false);
    };
    
    socket.setTimeout(1000);
    socket.once('error', onError);
    socket.once('timeout', onError);
    
    socket.connect(port, host, () => {
      socket.end();
      resolve(true);
    });
  });
}

// Main function to check application status
async function checkApplicationStatus() {
  const services = [
    { name: 'Frontend Server', host: 'localhost', port: 5173 },
    { name: 'Backend API Server', host: 'localhost', port: 7000 },
    { name: 'WebSocket Server', host: 'localhost', port: 5178 }
  ];
  
  log('Checking application services...', 'cyan');
  
  // Check if services are running
  for (const service of services) {
    try {
      const isOpen = await isPortOpen(service.host, service.port);
      if (isOpen) {
        log(`✅ ${service.name} is running on port ${service.port}`, 'green');
      } else {
        log(`❌ ${service.name} is NOT running on port ${service.port}`, 'red');
      }
    } catch (error) {
      log(`❌ Error checking ${service.name}: ${error.message}`, 'red');
    }
  }
  
  // Try to check API endpoint
  log('\nChecking backend API endpoint...', 'cyan');
  try {
    const data = await httpGet('http://localhost:7000/api/status');
    log(`✅ API Status: ${data.message || 'Running'}`, 'green');
  } catch (error) {
    log(`❌ API Status: Error - ${error.message}`, 'red');
    
    // Try alternative endpoints
    try {
      log('Trying alternative API endpoints...', 'yellow');
      const data = await httpGet('http://localhost:7000/api');
      log(`✅ API endpoint '/api' is accessible`, 'green');
    } catch (secondError) {
      log(`❌ API endpoint '/api' is not accessible`, 'red');
    }
  }
  
  log('\nApplication links:', 'cyan');
  log(`🌐 Frontend:   http://localhost:5173`, 'white');
  log(`🔌 Backend:    http://localhost:7000`, 'white');
  log(`🔌 WebSocket:  http://localhost:5178`, 'white');
  
  log('\n=================================================', 'green');
  log('If your application is not working correctly:', 'yellow');
  log('1. Make sure all services are running (green checkmarks)', 'white');
  log('2. Check for port conflicts with other applications', 'white');
  log('3. Restart the application using fixed-launcher.js', 'white');
  log('4. Try accessing the frontend directly in the browser', 'white');
  log('=================================================\n', 'green');
}

// Run the checker
checkApplicationStatus().catch(error => {
  log(`Error running status check: ${error.message}`, 'red');
});
