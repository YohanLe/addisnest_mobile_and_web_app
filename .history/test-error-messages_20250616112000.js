/**
 * Test script for login error message improvements
 * 
 * This script starts the frontend application
 * and allows testing of the improved login error messages.
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log('\x1b[36m%s\x1b[0m', '    LOGIN ERROR MESSAGE TESTING SCRIPT');
console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log();

console.log('\x1b[33m%s\x1b[0m', 'Starting frontend application...');

// Navigate to the src directory and start the React application
const startFrontend = () => {
  return new Promise((resolve, reject) => {
    console.log('\x1b[33m%s\x1b[0m', 'Launching the React application...');
    
    // Change directory to src and run npm start
    const frontendProcess = exec('cd src && npm run dev', (error) => {
      if (error) {
        console.error(`Error starting frontend: ${error}`);
        reject(error);
