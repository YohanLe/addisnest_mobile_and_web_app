/**
 * Fixed Property Submission Launcher
 * 
 * This script launches the AddisnEst application with fixed components that correctly
 * display properties submitted through the PropertyListForm in the Listed Property Alert tab.
 * 
 * The key fixes include:
 * 1. Using the PropertyAlertFixed component which properly processes the property data
 *    from the form submission
 * 2. Using the AccountMainFixed component which imports the fixed PropertyAlert component
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { setTimeout } = require('timers/promises');

// Create a temporary backup of the original files
const backupFiles = async () => {
  console.log('Creating backups of original files...');
  
  try {
    // Backup PropertyAlert.jsx
    const propertyAlertPath = path.join(__dirname, 'src/components/account-management/sub-component/account-tab/PropertyAlert.jsx');
    const propertyAlertBackupPath = path.join(__dirname, 'src/components/account-management/sub-component/account-tab/PropertyAlert.jsx.bak');
    
    if (fs.existsSync(propertyAlertPath)) {
      fs.copyFileSync(propertyAlertPath, propertyAlertBackupPath);
      console.log('✅ PropertyAlert.jsx backup created');
    }
    
    // Backup AccountMain.jsx
    const accountMainPath = path.join(__dirname, 'src/components/account-management/sub-component/AccountMain.jsx');
    const accountMainBackupPath = path.join(__dirname, 'src/components/account-management/sub-component/AccountMain.jsx.bak');
    
    if (fs.existsSync(accountMainPath)) {
      fs.copyFileSync(accountMainPath, accountMainBackupPath);
      console.log('✅ AccountMain.jsx backup created');
    }
  } catch (err) {
    console.error('Error creating backups:', err);
    throw err;
  }
};

// Replace the original files with the fixed versions
const replaceWithFixedFiles = async () => {
  console.log('Replacing original files with fixed versions...');
  
  try {
    // Replace PropertyAlert.jsx with PropertyAlertFixed.jsx
    const propertyAlertFixedPath = path.join(__dirname, 'src/components/account-management/sub-component/account-tab/PropertyAlertFixed.jsx');
    const propertyAlertPath = path.join(__dirname, 'src/components/account-management/sub-component/account-tab/PropertyAlert.jsx');
    
    if (fs.existsSync(propertyAlertFixedPath)) {
      const fixedContent = fs.readFileSync(propertyAlertFixedPath, 'utf8');
      fs.writeFileSync(propertyAlertPath, fixedContent);
      console.log('✅ PropertyAlert.jsx replaced with fixed version');
    } else {
      console.error('❌ PropertyAlertFixed.jsx not found');
    }
    
    // Replace AccountMain.jsx with AccountMainFixed.jsx
    const accountMainFixedPath = path.join(__dirname, 'src/components/account-management/sub-component/AccountMainFixed.jsx');
    const accountMainPath = path.join(__dirname, 'src/components/account-management/sub-component/AccountMain.jsx');
    
    if (fs.existsSync(accountMainFixedPath)) {
      const fixedContent = fs.readFileSync(accountMainFixedPath, 'utf8');
      fs.writeFileSync(accountMainPath, fixedContent);
      console.log('✅ AccountMain.jsx replaced with fixed version');
    } else {
      console.error('❌ AccountMainFixed.jsx not found');
    }
  } catch (err) {
    console.error('Error replacing files:', err);
    throw err;
  }
};

// Restore the original files on shutdown
const restoreOriginalFiles = async () => {
  console.log('Restoring original files...');
  
  try {
    // Restore PropertyAlert.jsx
    const propertyAlertBackupPath = path.join(__dirname, 'src/components/account-management/sub-component/account-tab/PropertyAlert.jsx.bak');
    const propertyAlertPath = path.join(__dirname, 'src/components/account-management/sub-component/account-tab/PropertyAlert.jsx');
    
    if (fs.existsSync(propertyAlertBackupPath)) {
      fs.copyFileSync(propertyAlertBackupPath, propertyAlertPath);
      fs.unlinkSync(propertyAlertBackupPath);
      console.log('✅ PropertyAlert.jsx restored from backup');
    }
    
    // Restore AccountMain.jsx
    const accountMainBackupPath = path.join(__dirname, 'src/components/account-management/sub-component/AccountMain.jsx.bak');
    const accountMainPath = path.join(__dirname, 'src/components/account-management/sub-component/AccountMain.jsx');
    
    if (fs.existsSync(accountMainBackupPath)) {
      fs.copyFileSync(accountMainBackupPath, accountMainPath);
      fs.unlinkSync(accountMainBackupPath);
      console.log('✅ AccountMain.jsx restored from backup');
    }
  } catch (err) {
    console.error('Error restoring files:', err);
  }
};

// Start the frontend and backend servers
const startServers = async () => {
  // Start backend server
  const backendProcess = exec('node src/server.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Backend server error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Backend stderr: ${stderr}`);
      return;
    }
    console.log(`Backend stdout: ${stdout}`);
  });

  console.log('Backend server started on port 7000');

  // Wait for the backend to start up
  await setTimeout(2000);

  // Start frontend development server
  const frontendProcess = exec('npx vite --port 5173', (error, stdout, stderr) => {
    if (error) {
      console.error(`Frontend server error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Frontend stderr: ${stderr}`);
      return;
    }
    console.log(`Frontend stdout: ${stdout}`);
  });

  console.log('Frontend server started on port 5173');

  return { backendProcess, frontendProcess };
};

// Setup process termination handler
const setupTerminationHandler = (processes) => {
  const cleanup = async () => {
    console.log('Cleaning up before exit...');
    
    // Kill server processes
    processes.backendProcess.kill();
    processes.frontendProcess.kill();
    
    // Restore original files
    await restoreOriginalFiles();
    
    console.log('Cleanup complete. Exiting...');
    process.exit(0);
  };

  // Handle termination signals
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('exit', cleanup);
};

// Main function
const main = async () => {
  console.log('===================================================');
  console.log('🏠 AddisnEst Property Submission Fix Launcher 🏠');
  console.log('===================================================');
  console.log('This launcher temporarily replaces key components to fix');
  console.log('property submission display in the Listed Property Alert tab.');
  console.log('---------------------------------------------------');
  
  try {
    // Backup original files
    await backupFiles();
    
    // Replace with fixed files
    await replaceWithFixedFiles();
    
    // Start servers
    const processes = await startServers();
    
    // Setup cleanup on termination
    setupTerminationHandler(processes);
    
    // Serve a simple web page explaining the fix
    const app = express();
    app.get('/', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Property Submission Fix</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 20px;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              color: #4a6cf7;
              border-bottom: 2px solid #4a6cf7;
              padding-bottom: 10px;
            }
            .info-box {
              background-color: #f0f7ff;
              border: 1px solid #4a6cf7;
              border-radius: 5px;
              padding: 15px;
              margin: 20px 0;
            }
            .server-info {
              background-color: #f5f5f5;
              border-radius: 5px;
              padding: 15px;
              margin: 20px 0;
            }
            .steps {
              background-color: #e8f5e9;
              border: 1px solid #4caf50;
              border-radius: 5px;
              padding: 15px;
              margin: 20px 0;
            }
            .step {
              margin-bottom: 10px;
            }
            .code {
              font-family: monospace;
              background-color: #f1f1f1;
              padding: 2px 5px;
              border-radius: 3px;
            }
            a {
              color: #4a6cf7;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <h1>Property Submission Fix</h1>
          
          <div class="info-box">
            <h2>Fixed Issue:</h2>
            <p>Property submissions from the PropertyListForm were not being displayed in the Listed Property Alert tab.</p>
          </div>
          
          <div class="server-info">
            <h2>Running Servers:</h2>
            <p><strong>Frontend:</strong> <a href="http://localhost:5173" target="_blank">http://localhost:5173</a></p>
            <p><strong>Backend API:</strong> <a href="http://localhost:7000" target="_blank">http://localhost:7000</a></p>
          </div>
          
          <div class="steps">
            <h2>Steps to test the fix:</h2>
            <div class="step">1. Go to <a href="http://localhost:5173" target="_blank">http://localhost:5173</a></div>
            <div class="step">2. Click "List Property +" button in the navigation</div>
            <div class="step">3. Fill out the property form and continue to promotion</div>
            <div class="step">4. Choose the Basic (free) plan and continue</div>
            <div class="step">5. You should be redirected to the Account Management page</div>
            <div class="step">6. Your new property should now appear in the Listed Property Alert tab</div>
          </div>
          
          <p><strong>Note:</strong> The original files will be restored when this process is terminated.</p>
          <p>Press Ctrl+C in the terminal to stop the servers and restore the original files.</p>
        </body>
        </html>
      `);
    });
    
    const fixInfoPort = 8080;
    app.listen(fixInfoPort, () => {
      console.log(`Fix information page available at: http://localhost:${fixInfoPort}`);
      console.log('---------------------------------------------------');
      console.log('🚀 AddisnEst is now running with the property submission fix!');
      console.log('• Frontend: http://localhost:5173');
      console.log('• Backend: http://localhost:7000');
      console.log('• Fix Info: http://localhost:8080');
      console.log('---------------------------------------------------');
      console.log('Press Ctrl+C to stop and restore original files');
      console.log('===================================================');
    });
    
  } catch (err) {
    console.error('Error running launcher:', err);
    await restoreOriginalFiles();
    process.exit(1);
  }
};

// Run the main function
main();
