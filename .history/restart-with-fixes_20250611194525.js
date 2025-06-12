/**
 * Comprehensive Application Restart with Property Submission 500 Error Fix
 * 
 * This script:
 * 1. Stops any running server instances
 * 2. Applies the property controller fix
 * 3. Clears server cache
 * 4. Restarts the application with the fixes in place
 * 
 * Usage: node restart-with-fixes.js
 */

const { spawn, exec, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configure paths
const CONTROLLER_PATH = path.join(__dirname, 'src', 'controllers', 'propertyController.js');
const FIX_PATH = path.join(__dirname, 'src', 'controllers', 'propertyController-fix.js');
const BACKUP_PATH = path.join(__dirname, 'backups', 'propertyController.js.bak');
const BACKUPS_DIR = path.join(__dirname, 'backups');

// Define colors for console output
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

// Utility functions
function log(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step, message) {
  console.log(`\n${colors.blue}[STEP ${step}]${colors.reset} ${message}`);
}

function logSuccess(message) {
  console.log(`${colors.green}✓ SUCCESS: ${message}${colors.reset}`);
}

function logError(message) {
  console.log(`${colors.red}✗ ERROR: ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}! WARNING: ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.cyan}ℹ INFO: ${message}${colors.reset}`);
}

function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    logInfo(`Created directory: ${directory}`);
  }
}

// Check if a process is running on a specific port
function isPortInUse(port) {
  try {
    // For Windows
    if (process.platform === 'win32') {
      const result = execSync(`netstat -ano | findstr :${port}`).toString();
      return result.length > 0;
    }
    // For Unix-based systems
    else {
      const result = execSync(`lsof -i:${port}`).toString();
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
      const result = execSync(`netstat -ano | findstr :${port}`).toString();
      const lines = result.split('\n');
      for (const line of lines) {
        const match = line.match(/\s+(\d+)$/);
        if (match && match[1]) {
          const pid = match[1];
          logWarning(`Killing process with PID ${pid} on port ${port}`);
          execSync(`taskkill /F /PID ${pid}`);
        }
      }
    } else {
      execSync(`kill $(lsof -t -i:${port})`);
    }
    return true;
  } catch (e) {
    logError(`Failed to kill process on port ${port}: ${e.message}`);
    return false;
  }
}

// Apply the property controller fix
function applyControllerFix() {
  try {
    // Ensure backup directory exists
    ensureDirectoryExists(BACKUPS_DIR);
    
    // Check if original controller exists
    if (!fs.existsSync(CONTROLLER_PATH)) {
      throw new Error(`Original controller not found at ${CONTROLLER_PATH}`);
    }
    
    // Check if fix controller exists
    if (!fs.existsSync(FIX_PATH)) {
      throw new Error(`Fixed controller not found at ${FIX_PATH}`);
    }
    
    // Create backup of original controller
    fs.copyFileSync(CONTROLLER_PATH, BACKUP_PATH);
    logInfo(`Backed up original controller to ${BACKUP_PATH}`);
    
    // Replace with fixed controller
    fs.copyFileSync(FIX_PATH, CONTROLLER_PATH);
    logSuccess(`Applied property controller fix`);
    
    return true;
  } catch (error) {
    logError(`Failed to apply controller fix: ${error.message}`);
    return false;
  }
}

// Clear node_modules/.cache to ensure fresh compilation
function clearCache() {
  try {
    const cachePath = path.join(__dirname, 'node_modules', '.cache');
    if (fs.existsSync(cachePath)) {
      // For Windows
      if (process.platform === 'win32') {
        execSync(`rmdir /s /q "${cachePath}"`);
      } else {
        execSync(`rm -rf "${cachePath}"`);
      }
      logSuccess('Cleared Node.js cache');
    } else {
      logInfo('No cache directory found, skipping cache clear');
    }
    return true;
  } catch (error) {
    logWarning(`Failed to clear cache: ${error.message}`);
    return false;
  }
}

// Start the application
function startApplication() {
  return new Promise((resolve, reject) => {
    log('\nStarting application...', colors.cyan);
    
    // Use npm start to run the application
    const startCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const app = spawn(startCommand, ['start'], { 
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true
    });
    
    let appStarted = false;
    let output = '';
    
    app.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);
      
      // Check for indicators that the app has started successfully
      if (text.includes('Server running in') || 
          text.includes('listening on port') || 
          text.includes('server started')) {
        appStarted = true;
        logSuccess('Application started successfully');
        resolve(app);
      }
    });
    
    app.stderr.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stderr.write(text);
    });
    
    app.on('error', (error) => {
      logError(`Failed to start application: ${error.message}`);
      reject(error);
    });
    
    app.on('close', (code) => {
      if (!appStarted) {
        logError(`Application process exited with code ${code} before starting`);
        if (output.includes('EADDRINUSE')) {
          logError('Port is already in use. Try killing the process first.');
        }
        reject(new Error(`Application failed to start (exit code ${code})`));
      }
    });
    
    // Set a timeout in case the app never signals it's ready
    setTimeout(() => {
      if (!appStarted) {
        logWarning('Application did not signal startup within timeout period');
        logInfo('This may be normal if startup takes longer than expected');
        logInfo('Continuing anyway - check console output for errors');
        resolve(app);
      }
    }, 15000);
  });
}

// Main function to coordinate the restart process
async function restartWithFixes() {
  console.clear();
  log('=====================================================', colors.cyan);
  log('  PROPERTY SUBMISSION 500 ERROR FIX - FULL RESTART  ', colors.cyan);
  log('=====================================================', colors.cyan);
  log('\nThis script will:');
  log('1. Stop any running server instances');
  log('2. Apply the property controller fix');
  log('3. Clear server cache');
  log('4. Restart the application with fixes applied');
  log('\nThe fix addresses the 500 error that occurs when submitting');
  log('properties with missing address fields.');
  log('=====================================================\n', colors.cyan);
  
  // Confirm with user
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const confirm = await new Promise(resolve => {
    rl.question(`${colors.yellow}Do you want to proceed? (y/n)${colors.reset} `, answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
  
  if (!confirm) {
    logInfo('Restart cancelled by user');
    return;
  }
  
  try {
    // Step 1: Stop any running server instances
    logStep(1, 'Stopping any running server instances');
    
    const apiPort = 7000; // Adjust based on your API server port
    const clientPort = 3000; // Adjust based on your client app port
    
    if (isPortInUse(apiPort)) {
      logWarning(`API server is running on port ${apiPort}`);
      if (killProcessOnPort(apiPort)) {
        logSuccess(`Stopped process on port ${apiPort}`);
      }
    } else {
      logInfo(`No process found running on API port ${apiPort}`);
    }
    
    if (isPortInUse(clientPort)) {
      logWarning(`Client app is running on port ${clientPort}`);
      if (killProcessOnPort(clientPort)) {
        logSuccess(`Stopped process on port ${clientPort}`);
      }
    } else {
      logInfo(`No process found running on client port ${clientPort}`);
    }
    
    // Step 2: Apply the property controller fix
    logStep(2, 'Applying the property controller fix');
    if (!applyControllerFix()) {
      throw new Error('Failed to apply controller fix');
    }
    
    // Step 3: Clear cache
    logStep(3, 'Clearing server cache');
    clearCache();
    
    // Step 4: Restart the application
    logStep(4, 'Restarting the application');
    const app = await startApplication();
    
    log('\n=====================================================', colors.green);
    log('  APPLICATION RESTARTED SUCCESSFULLY WITH FIXES  ', colors.green);
    log('=====================================================', colors.green);
    log('\nThe application is now running with the property submission');
    log('500 error fix applied. You can test the fix by attempting to');
    log('submit a property with missing address fields.');
    log('\nPress Ctrl+C when you want to stop the server.', colors.yellow);
    log('=====================================================\n', colors.green);
    
    // Handle application process exit
    app.on('close', (code) => {
      logInfo(`Application process has exited with code ${code}`);
      
      // Restore original controller
      try {
        if (fs.existsSync(BACKUP_PATH)) {
          fs.copyFileSync(BACKUP_PATH, CONTROLLER_PATH);
          logSuccess('Restored original property controller');
        }
      } catch (error) {
        logError(`Failed to restore original controller: ${error.message}`);
      }
      
      log('\nThank you for using the Property Submission Fix tool!', colors.cyan);
    });
    
  } catch (error) {
    logError(`Restart process failed: ${error.message}`);
    log('\nTrying to restore original controller...', colors.yellow);
    
    try {
      if (fs.existsSync(BACKUP_PATH)) {
        fs.copyFileSync(BACKUP_PATH, CONTROLLER_PATH);
        logSuccess('Restored original property controller');
      }
    } catch (restoreError) {
      logError(`Failed to restore original controller: ${restoreError.message}`);
    }
    
    log('\nPlease try the following manual steps:', colors.yellow);
    log('1. Stop any running server instances');
    log('2. Copy src/controllers/propertyController-fix.js to src/controllers/propertyController.js');
    log('3. Run npm start');
    log('\nIf problems persist, please refer to the documentation in PROPERTY_SUBMISSION_500_FIX.md', colors.yellow);
  }
}

// Run the restart process
restartWithFixes();
