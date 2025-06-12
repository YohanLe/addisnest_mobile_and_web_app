/**
 * AddisnEst Application Launcher
 * This script starts both the MongoDB backend server
 */

const { spawn } = require('child_process');
const colors = require('colors');
const kill = require('tree-kill');

// Print a styled header
console.log(`
=================================================
            AddisnEst Backend Launcher           
=================================================
`.green.bold);

// Start backend server
console.log(`Starting Backend Server...`.cyan);
const backendProcess = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Handle process exit
const cleanup = () => {
  console.log(`\nShutting down server...`.cyan);
  
  // Kill child process
  kill(backendProcess.pid, 'SIGKILL', (err) => {
    if (err) {
      console.error('Failed to kill process:', err);
    } else {
      console.log('Process killed successfully.');
    }
    console.log(`Shutdown complete. Goodbye!`.green);
    process.exit(0);
  });
};

// Listen for exit signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

console.log(`\nServer is starting up...`.green.bold);
console.log(`Press Ctrl+C to shut down the server\n`.dim);

// Output links to access the application
setTimeout(() => {
  console.log('\n================================================='.yellow);
  console.log('  🚀 Backend API:       http://localhost:7000'.cyan);
  console.log('  🔌 WebSocket Test:    http://localhost:5177'.cyan);
  console.log('  📂 API Documentation: http://localhost:7000/api-docs'.cyan);
  console.log('=================================================\n'.yellow);
}, 2000);
