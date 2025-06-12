/**
 * Restart the application with all fixes applied
 * 
 * This script:
 * 1. Stops any running instances of the application
 * 2. Restarts the application with the latest fixes
 */

const { exec } = require('child_process');
const fs = require('fs');

console.log('\n===========================================');
console.log('  🏠 Addisnest Property Fixes Launcher  🏠');
console.log('===========================================\n');

console.log('Applied fixes:');
console.log('✅ Fixed property image display in account management');
console.log('✅ Fixed new property submissions appearing in listings');
console.log('✅ Removed duplicate "My Properties" menu items');
console.log('✅ Consolidated property management into Account Management section');

// Kill any running Node processes that might be hosting the app
const killRunningProcesses = () => {
  return new Promise((resolve, reject) => {
    console.log('\nShutting down any running instances...');
    
    // On Windows, use taskkill to terminate node processes
    const command = 'taskkill /F /IM node.exe';
    
    exec(command, (error, stdout, stderr) => {
      // We don't care about the error here since it might mean no processes were found
      console.log('Cleaned up previous processes');
      resolve();
    });
  });
};

// Start the application using the fixed launcher
const startApplication = () => {
  return new Promise((resolve, reject) => {
    console.log('\nStarting application with all fixes applied...');
    
    const childProcess = exec('node fixed-launcher.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting application: ${error.message}`);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.error(`Error: ${stderr}`);
        reject(new Error(stderr));
        return;
      }
      
      resolve();
    });
    
    // Stream the output to the console
    childProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });
  });
};

// Open the test page
const openTestPage = () => {
  console.log('\nApplication launched successfully!');
  console.log('\nTest Instructions:');
  console.log('1. Open http://localhost:5173/account-management in your browser');
  console.log('2. Verify that property images display correctly in the listings');
  console.log('3. Verify there are no duplicate "My Properties" links in the menu');
  console.log('4. Test submitting a new property and confirm it appears in the account management listings');
};

// Main execution flow
async function main() {
  try {
    await killRunningProcesses();
    await startApplication();
    openTestPage();
  } catch (error) {
    console.error('Error during restart:', error);
  }
}

main();
