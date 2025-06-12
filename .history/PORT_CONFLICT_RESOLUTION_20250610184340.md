# AddinEst Port Conflict Resolution Guide

This guide provides instructions for resolving port conflicts in the AddinEst application.

## Problem

The application was experiencing port conflicts with the following symptoms:
- Error message: `510PPAnode start-frontend.js` (typo in command)
- Multiple Node.js processes competing for the same ports
- Backend API and WebSocket servers failing to start properly

## Solution

A comprehensive solution has been implemented with the following components:

### 1. Fixed Application Launcher (`fixed-launcher.js`)

A robust Node.js script that:
- Automatically finds available ports for all services
- Sets up proper environment configuration
- Handles clean startup and shutdown
- Provides clear console output with status information

### 2. Diagnostic Tool (`check-app-status.js`)

A utility script that:
- Verifies all services are running correctly
- Tests API connectivity
- Provides helpful troubleshooting information

### 3. Easy Startup Script (`start-app.bat`)

A Windows batch file that:
- Provides a simple way to start the application
- Includes options to kill existing Node.js processes
- Provides clear error messages and troubleshooting steps

## Usage Instructions

### Starting the Application

1. Open a command prompt in the project directory
2. Run the startup script:
   ```
   start-app.bat
   ```
3. Follow the on-screen prompts
4. When prompted, decide whether to kill existing Node.js processes
5. The application will start and display URLs for accessing the services

### Checking Application Status

If you encounter issues, you can check the status of all services:

```
node check-app-status.js
```

This will show:
- Which services are running and on which ports
- Whether the API is accessible
- Troubleshooting steps if there are problems

### Manual Startup (Advanced)

For more control, you can run the launcher script directly:

```
node fixed-launcher.js
```

## Troubleshooting

If you encounter issues:

1. Kill all Node.js processes:
   ```
   taskkill /im node.exe /f
   ```

2. Check application status:
   ```
   node check-app-status.js
   ```

3. Ensure MongoDB is running (if required)

4. Restart the application:
   ```
   start-app.bat
   ```

## Port Information

The application uses the following default ports:
- Frontend: 5173 (or next available port)
- Backend API: 7000 (or next available port)
- WebSocket: 5178 (or next available port)
