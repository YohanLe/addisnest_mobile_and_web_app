/**
 * AddisnEst Application Launcher
 * This script starts both the frontend and backend servers with proper port configuration
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const colors = require('colors');

console.log(`
=================================================
     AddisnEst Application Launcher           
=================================================
`.green.bold);

// Function to start the backend server
function startBackendServer() {
  console.log(`Starting Backend Server on port 7000...`.cyan);
  
  // Set up environment for local MongoDB
  console.log('Setting up local MongoDB environment...');
  const srcEnvPath = path.join(__dirname, 'src', '.env');
  const tempEnvPath = path.join(__dirname, '.env.temp');

  // Read the src/.env file
  const envContent = fs.readFileSync(srcEnvPath, 'utf8');

  // Create a temporary .env file in the root
  fs.writeFileSync(tempEnvPath, envContent);

  // Backup the current .env
  if (fs.existsSync(path.join(__dirname, '.env'))) {
    fs.copyFileSync(
      path.join(__dirname, '.env'),
      path.join(__dirname, '.env.backup')
    );
  }

  // Replace the .env with our temporary one
  fs.copyFileSync(tempEnvPath, path.join(__dirname, '.env'));

  // Remove the temporary file
  fs.unlinkSync(tempEnvPath);
  
  // Start the server
  const serverProcess = spawn('node', ['src/server.js'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: '7000', NODE_ENV: 'development' }
  });

  // Handle server exit
  serverProcess.on('exit', (code) => {
    console.log(`Backend server exited with code ${code}`.yellow);
    
    // Restore original .env if it existed
    if (fs.existsSync(path.join(__dirname, '.env.backup'))) {
      fs.copyFileSync(
        path.join(__dirname, '.env.backup'),
        path.join(__dirname, '.env')
      );
      fs.unlinkSync(path.join(__dirname, '.env.backup'));
      console.log('Restored original environment configuration.');
    }
  });

  return serverProcess;
}

// Function to start the frontend server
function startFrontendServer() {
  console.log(`\nStarting Frontend Vite Server...`.cyan);
  
  const frontendProcess = spawn('npm', ['run', 'frontend'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' }
  });

  // Handle frontend exit
  frontendProcess.on('exit', (code) => {
    console.log(`Frontend server exited with code ${code}`.yellow);
  });

  return frontendProcess;
}

// Start both servers
const backendServer = startBackendServer();
const frontendServer = startFrontendServer();

// Handle process exit
const cleanup = () => {
  console.log(`\nShutting down servers...`.cyan);
  
  // Kill child processes
  backendServer.kill();
  frontendServer.kill();
  
  console.log(`Shutdown complete. Goodbye!`.green);
  process.exit(0);
};

// Listen for exit signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

console.log(`\nBoth servers are starting up...`.green.bold);
console.log(`Press Ctrl+C to shut down the servers\n`.dim);

// Output links to access the application
setTimeout(() => {
  console.log('\n================================================='.yellow);
  console.log('  🚀 Frontend App:      http://localhost:5175'.cyan);
  console.log('  🔌 Backend API:       http://localhost:7000'.cyan);
  console.log('=================================================\n'.yellow);
}, 3000);
