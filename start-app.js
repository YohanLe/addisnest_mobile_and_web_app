/**
 * AddisnEst Application Starter
 * This script starts both the backend server and frontend development server
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configure colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// Print a styled header
console.log(`
${colors.bright}${colors.green}==================================================${colors.reset}
${colors.bright}${colors.yellow}            AddisnEst Full Stack Launcher           ${colors.reset}
${colors.bright}${colors.green}==================================================${colors.reset}
`);

// Check if MongoDB is installed
console.log(`${colors.cyan}Checking system requirements...${colors.reset}`);
const mongodbPath = path.join(process.env.PROGRAMFILES, 'MongoDB', 'Server');

if (!fs.existsSync(mongodbPath)) {
  console.log(`${colors.yellow}⚠️ MongoDB may not be installed in the default location.${colors.reset}`);
  console.log(`${colors.yellow}   This is okay if you're using MongoDB Atlas or a custom installation.${colors.reset}`);
} else {
  console.log(`${colors.green}✅ MongoDB found at: ${mongodbPath}${colors.reset}`);
}

// Start backend server
console.log(`\n${colors.cyan}Starting Backend Server...${colors.reset}`);
const backendPath = path.join(__dirname, 'addisnest-backend');
const backendProcess = spawn('node', ['run-server-with-env.cjs'], {
  cwd: backendPath,
  stdio: 'pipe',
  shell: true
});

// Handle backend output with prefixes
backendProcess.stdout.on('data', (data) => {
  const lines = data.toString().split('\n');
  lines.forEach(line => {
    if (line.trim()) {
      console.log(`${colors.bgBlue}${colors.black} BACKEND ${colors.reset} ${line}`);
    }
  });
});

backendProcess.stderr.on('data', (data) => {
  const lines = data.toString().split('\n');
  lines.forEach(line => {
    if (line.trim()) {
      console.log(`${colors.bgRed}${colors.white} BACKEND ERROR ${colors.reset} ${line}`);
    }
  });
});

// Start frontend server
console.log(`\n${colors.cyan}Starting Frontend Development Server...${colors.reset}`);
const frontendProcess = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'pipe',
  shell: true
});

// Handle frontend output with prefixes
frontendProcess.stdout.on('data', (data) => {
  const lines = data.toString().split('\n');
  lines.forEach(line => {
    if (line.trim()) {
      console.log(`${colors.bgGreen}${colors.black} FRONTEND ${colors.reset} ${line}`);
    }
  });
});

frontendProcess.stderr.on('data', (data) => {
  const lines = data.toString().split('\n');
  lines.forEach(line => {
    if (line.trim()) {
      console.log(`${colors.bgYellow}${colors.black} FRONTEND WARNING ${colors.reset} ${line}`);
    }
  });
});

// Handle process exit
const cleanup = () => {
  console.log(`\n${colors.cyan}Shutting down servers...${colors.reset}`);
  
  // Kill child processes
  backendProcess.kill();
  frontendProcess.kill();
  
  console.log(`${colors.green}Shutdown complete. Goodbye!${colors.reset}`);
  process.exit(0);
};

// Listen for exit signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

console.log(`\n${colors.bright}${colors.green}Both servers are starting up...${colors.reset}`);
console.log(`${colors.dim}Press Ctrl+C to shut down both servers${colors.reset}\n`);
