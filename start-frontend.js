/**
 * AddisnEst Frontend Starter
 * This script starts the frontend React application using Vite
 */

const { spawn } = require('child_process');
const colors = require('colors');
const path = require('path');

// Print a styled header
console.log(`
=================================================
       AddisnEst Frontend Vite Launcher           
=================================================
`.green.bold);

// Start frontend server
console.log(`Starting Frontend Vite Server...`.cyan);
const frontendProcess = spawn('npm', ['run', 'frontend'], {
  cwd: process.cwd(), // Use current working directory
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NODE_ENV: 'development' } // Set NODE_ENV for Windows compatibility
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
  console.log('  🚀 Frontend App:      http://localhost:5175'.cyan);
  console.log('  🔌 Backend API:       http://localhost:7000'.cyan);
  console.log('=================================================\n'.yellow);
}, 2000);
