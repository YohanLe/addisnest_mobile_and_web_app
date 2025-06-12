/**
 * AddisnEst Application Launcher (Fixed Version)
 * This script starts both the frontend and backend servers with proper port configuration
 * and checks for port availability before starting servers
 */

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

// ANSI color codes for terminal output
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

// Function to check if a port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      } else {
        // Other errors may indicate the port is actually available
        resolve(true);
      }
    });
    
    server.once('listening', () => {
      // Close the server if it managed to start listening
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
}

// Function to find an available port starting from the preferred port
async function findAvailablePort(preferredPort, maxAttempts = 10) {
  let port = preferredPort;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (await isPortAvailable(port)) {
      return port;
    }
    port++;
  }
  
  throw new Error(`Could not find an available port after ${maxAttempts} attempts starting from ${preferredPort}`);
}

// Log with colors
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Header
log('\n=================================================', 'green');
log('     AddisnEst Application Launcher (Fixed)      ', 'green');
log('=================================================\n', 'green');

// First, make sure no node processes are running that might conflict
log('Checking for running node processes...', 'cyan');

// Function to start the backend server
async function startBackendServer() {
  log('Starting Backend Server...', 'cyan');
  
  // Find an available port for the backend
  const backendPort = await findAvailablePort(7000);
  log(`Using backend port: ${backendPort}`, 'yellow');
  
  // Find an available port for WebSocket
  const wsPort = await findAvailablePort(5178);
  log(`Using WebSocket port: ${wsPort}`, 'yellow');
  
  // Set up environment for local MongoDB
  log('Setting up local MongoDB environment...', 'cyan');
  const srcEnvPath = path.join(__dirname, 'src', '.env');
  
  // Read the src/.env file
  const envContent = fs.readFileSync(srcEnvPath, 'utf8');
  
  // Update port in environment variables
  const updatedEnvContent = envContent
    .replace(/PORT=\d+/g, `PORT=${backendPort}`)
    .replace(/WEBSOCKET_PORT=\d+/g, `WEBSOCKET_PORT=${wsPort}`);
  
  // Backup the current .env
  if (fs.existsSync(path.join(__dirname, '.env'))) {
    fs.copyFileSync(
      path.join(__dirname, '.env'),
      path.join(__dirname, '.env.backup')
    );
  }
  
  // Write the updated .env with our port settings
  fs.writeFileSync(path.join(__dirname, '.env'), updatedEnvContent);
  
  // Start the server with the new ports
  const serverProcess = spawn('node', ['src/server.js'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true,
    env: { 
      ...process.env, 
      PORT: backendPort.toString(), 
      WEBSOCKET_PORT: wsPort.toString(),
      NODE_ENV: 'development' 
    }
  });
  
  // Handle server exit
  serverProcess.on('exit', (code) => {
    log(`Backend server exited with code ${code}`, 'yellow');
    
    // Restore original .env if it existed
    if (fs.existsSync(path.join(__dirname, '.env.backup'))) {
      fs.copyFileSync(
        path.join(__dirname, '.env.backup'),
        path.join(__dirname, '.env')
      );
      fs.unlinkSync(path.join(__dirname, '.env.backup'));
      log('Restored original environment configuration.', 'green');
    }
  });
  
  return { 
    process: serverProcess, 
    ports: { 
      backend: backendPort, 
      websocket: wsPort 
    } 
  };
}

// Function to start the frontend server
async function startFrontendServer() {
  log('\nStarting Frontend Vite Server...', 'cyan');
  
  // Find an available port for frontend
  const frontendPort = await findAvailablePort(5173);
  log(`Using frontend port: ${frontendPort}`, 'yellow');
  
  // Create a temp Vite config to ensure port availability
  const viteConfigPath = path.join(__dirname, 'vite.config.temp.js');
  const viteConfigContent = `
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';

  export default defineConfig({
    plugins: [react()],
    server: {
      port: ${frontendPort},
      strictPort: true
    }
  });
  `;
  
  fs.writeFileSync(viteConfigPath, viteConfigContent);
  
  // Start frontend with custom port
  const frontendProcess = spawn('npx', ['vite', '--config', viteConfigPath], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true,
    env: { 
      ...process.env, 
      VITE_PORT: frontendPort.toString(),
      NODE_ENV: 'development' 
    }
  });
  
  // Handle frontend exit
  frontendProcess.on('exit', (code) => {
    log(`Frontend server exited with code ${code}`, 'yellow');
    
    // Remove temp Vite config
    if (fs.existsSync(viteConfigPath)) {
      fs.unlinkSync(viteConfigPath);
    }
  });
  
  return { 
    process: frontendProcess, 
    port: frontendPort 
  };
}

// Start the application
async function startApplication() {
  try {
    // Start backend first
    const backend = await startBackendServer();
    
    // Give the backend a moment to initialize
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Start frontend
    const frontend = await startFrontendServer();
    
    // Set up cleanup handler
    const cleanup = () => {
      log('\nShutting down servers...', 'cyan');
      
      // Kill child processes
      backend.process.kill();
      frontend.process.kill();
      
      // Remove temp files
      const viteConfigPath = path.join(__dirname, 'vite.config.temp.js');
      if (fs.existsSync(viteConfigPath)) {
        fs.unlinkSync(viteConfigPath);
      }
      
      log('Shutdown complete. Goodbye!', 'green');
      process.exit(0);
    };
    
    // Listen for exit signals
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
    log(`\nBoth servers are starting up...`, 'green');
    log(`Press Ctrl+C to shut down the servers\n`, 'dim');
    
    // Output links to access the application
    setTimeout(() => {
      log('\n=================================================', 'yellow');
      log(`  🚀 Frontend App:      http://localhost:${frontend.port}`, 'cyan');
      log(`  🔌 Backend API:       http://localhost:${backend.ports.backend}`, 'cyan');
      log(`  🔌 WebSocket Server:  http://localhost:${backend.ports.websocket}`, 'cyan');
      log('=================================================\n', 'yellow');
    }, 3000);
    
    return { backend, frontend };
  } catch (error) {
    log(`Error starting application: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Execute the startup sequence
startApplication();
