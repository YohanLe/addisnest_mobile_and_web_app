/**
 * AddisnEst Server Launcher with Local MongoDB
 * This script ensures the server uses the local MongoDB configuration
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log(`
=================================================
       AddisnEst Server with Local MongoDB           
=================================================
`);

// Copy the src/.env to the root temporarily
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

console.log('Starting server with local MongoDB configuration...');

// Start the server
const serverProcess = spawn('node', ['src/server.js'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
});

// Handle cleanup
const cleanup = () => {
  console.log('\nShutting down server...');
  
  // Kill child process
  serverProcess.kill();
  
  // Restore original .env if it existed
  if (fs.existsSync(path.join(__dirname, '.env.backup'))) {
    fs.copyFileSync(
      path.join(__dirname, '.env.backup'),
      path.join(__dirname, '.env')
    );
    fs.unlinkSync(path.join(__dirname, '.env.backup'));
    console.log('Restored original environment configuration.');
  }
  
  console.log('Shutdown complete.');
  process.exit(0);
};

// Listen for exit signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

console.log('Press Ctrl+C to shut down the server\n');
