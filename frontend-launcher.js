/**
 * AddisnEst Frontend Application Launcher
 * This script starts the frontend React application
 */

const { spawn } = require('child_process');
const colors = require('colors');
const path = require('path');
const fs = require('fs');

// Print a styled header
console.log(`
=================================================
        AddisnEst Frontend Launcher           
=================================================
`.green.bold);

// Check if we're in the correct directory
console.log(`Checking for frontend application...`.cyan);
const frontendPath = path.join(__dirname);

if (!fs.existsSync(frontendPath)) {
  console.error(`Frontend directory not found at: ${frontendPath}`.red);
  console.log(`Make sure the frontend React application is in the correct location.`.yellow);
  console.log(`Expected location: ${frontendPath}`.yellow);
  process.exit(1);
}

// Start frontend server
console.log(`Starting Frontend Server...`.cyan);
const frontendProcess = spawn('npm', ['run', 'frontend'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Handle process exit
const cleanup = () => {
  console.log(`\nShutting down frontend server...`.cyan);
  
  // Kill child process
  frontendProcess.kill();
  
  console.log(`Shutdown complete. Goodbye!`.green);
  process.exit(0);
};

// Listen for exit signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

console.log(`\nFrontend server is starting up...`.green.bold);
console.log(`Press Ctrl+C to shut down the server\n`.dim);

// Output links to access the application
setTimeout(() => {
  console.log('\n================================================='.yellow);
  console.log('  🚀 Frontend App:      http://localhost:5185'.cyan);
  console.log('=================================================\n'.yellow);
}, 2000);
