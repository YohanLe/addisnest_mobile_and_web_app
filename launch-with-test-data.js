/**
 * Launch Application with Test Data
 * 
 * This script:
 * 1. Launches the application
 * 2. Opens the seed-property-data.html file to easily add test data
 * 
 * Run this with: node launch-with-test-data.js
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if seed-property-data.html exists
if (!fs.existsSync('./seed-property-data.html')) {
  console.error('Error: seed-property-data.html not found. Run "node seed-property-data.js" first.');
  process.exit(1);
}

console.log('=== LAUNCHING APPLICATION WITH TEST DATA ===');
console.log('This script will:');
console.log('1. Launch the application');
console.log('2. Open the seed-property-data.html in your browser');
console.log('\nAfter the app loads:');
console.log('- Click "Seed Property Data" in the HTML page');
console.log('- Go to the property listings page to see the data');

// Launch the application
console.log('\n🚀 Launching application...');
const appProcess = exec('node app-launcher.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error launching app: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`App stderr: ${stderr}`);
  }
  console.log(`App stdout: ${stdout}`);
});

// Wait for the app to start
setTimeout(() => {
  // Open the seed-property-data.html in the default browser
  console.log('📂 Opening seed-property-data.html...');
  
  const htmlPath = path.resolve('./seed-property-data.html');
  
  // Use the appropriate command based on platform
  let command;
  switch (process.platform) {
    case 'win32':
      command = `start "" "${htmlPath}"`;
      break;
    case 'darwin':
      command = `open "${htmlPath}"`;
      break;
    default:
      command = `xdg-open "${htmlPath}"`;
  }
  
  exec(command, (error) => {
    if (error) {
      console.error(`Error opening HTML file: ${error.message}`);
      return;
    }
    console.log('✅ HTML file opened. Click "Seed Property Data" to add test data.');
    console.log('\n📋 INSTRUCTIONS:');
    console.log('1. In the HTML page that opened, click "Seed Property Data"');
    console.log('2. Go to http://localhost:5173/account-management in your browser');
    console.log('3. Look for the property listings tab to see your test data');
    console.log('\nPress Ctrl+C to stop the application when finished testing.');
  });
}, 3000);
