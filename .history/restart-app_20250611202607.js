/**
 * Non-interactive App Restart with Fixes
 * 
 * This script automatically restarts the application with all fixes applied
 * without requiring user confirmation.
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('====================================');
console.log('  ADDINEST AUTOMATIC RESTART');
console.log('====================================');
console.log('');
console.log('This script will:');
console.log('1. Kill any running server instances');
console.log('2. Clear Node.js cache');
console.log('3. Start the application with all fixes applied');
console.log('');

// Check if a process is running on a specific port
function isPortInUse(port) {
  try {
    // For Windows
    if (process.platform === 'win32') {
      const result = require('child_process').execSync(`netstat -ano | findstr :${port}`).toString();
      return result.length > 0;
    }
    // For Unix-based systems
    else {
      const result = require('child_process').execSync(`lsof -i:${port}`).toString();
      return result.length > 0;
    }
  } catch (e) {
    return false; // If command fails, assume port is not in use
  }
}

// Kill process running on a specific port
function killProcessOnPort(port) {
  try {
    if (process.platform === 'win32') {
      // First get the PID
      const result = require('child_process').execSync(`netstat -ano | findstr :${port}`).toString();
      const lines = result.split('\n');
      for (const line of lines) {
        const match = line.match(/\s+(\d+)$/);
        if (match && match[1]) {
          const pid = match[1];
          console.log(`Killing process with PID ${pid} on port ${port}`);
          require('child_process').execSync(`taskkill /F /PID ${pid}`);
        }
      }
    } else {
      require('child_process').execSync(`kill $(lsof -t -i:${port})`);
    }
    return true;
  } catch (e) {
    console.error(`Failed to kill process on port ${port}: ${e.message}`);
    return false;
  }
}

// Step 1: Kill any running server instances
const apiPorts = [7000, 7001];
const frontendPorts = [3000, 5173, 5174, 5175, 5176, 5177, 5178, 5179];

apiPorts.forEach(port => {
  if (isPortInUse(port)) {
    console.log(`API server is running on port ${port}`);
    if (killProcessOnPort(port)) {
      console.log(`✓ Stopped process on port ${port}`);
    }
  }
});

frontendPorts.forEach(port => {
  if (isPortInUse(port)) {
    console.log(`Frontend server is running on port ${port}`);
    if (killProcessOnPort(port)) {
      console.log(`✓ Stopped process on port ${port}`);
    }
  }
});

// Step 2: Clear Node.js cache (if it exists)
const cachePath = path.join(__dirname, 'node_modules', '.cache');
if (fs.existsSync(cachePath)) {
  console.log('Clearing Node.js cache...');
  try {
    if (process.platform === 'win32') {
      exec(`rmdir /s /q "${cachePath}"`);
    } else {
      exec(`rm -rf "${cachePath}"`);
    }
    console.log('✓ Cache cleared');
  } catch (error) {
    console.log(`× Failed to clear cache: ${error.message}`);
  }
}

// Step 3: Start the application with fixed-launcher.js
console.log('\nStarting application with all fixes applied...');
console.log('\n====================');
console.log('  APPLICATION READY');
console.log('====================');
console.log('\nFrontend: http://localhost:5173');
console.log('Backend: http://localhost:7001');
console.log('WebSocket: http://localhost:5179');
console.log('\nPress Ctrl+C to shut down all servers.');

// Start the application using fixed-launcher.js
const app = spawn('node', ['fixed-launcher.js'], { 
  stdio: 'inherit',
  shell: true
});

app.on('error', (error) => {
  console.error(`Failed to start application: ${error.message}`);
});

app.on('close', (code) => {
  console.log(`Application process exited with code ${code}`);
});
