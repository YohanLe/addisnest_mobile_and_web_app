@echo off
echo ===================================================================
echo PROPERTY SUBMISSION 500 ERROR FIX TEST
echo ===================================================================
echo This script will test the property submission fix by sending a test
echo property to the API endpoint and verifying it doesn't return a 500 error.
echo.
echo Prerequisites:
echo  1. Server must be running
echo  2. A valid authentication token must be in .env file
echo.

:: Check if .env file exists
if not exist .env (
  echo WARNING: No .env file found. Creating a template .env file...
  echo # Authentication token for API testing > .env
  echo TEST_AUTH_TOKEN=paste_your_token_here >> .env
  echo.
  echo An .env file has been created. Please edit it to add your authentication token.
  echo You can get a token by logging in through the web interface and copying it
  echo from localStorage (access_token).
  echo.
  pause
  exit /b
)

:: Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Node.js is not installed or not in PATH.
  echo Please install Node.js from https://nodejs.org/
  pause
  exit /b
)

:: Check if the test script exists
if not exist test-property-submission-500-fix.js (
  echo ERROR: test-property-submission-500-fix.js not found.
  echo Please make sure you're running this batch file from the correct directory.
  pause
  exit /b
)

echo Starting server in the background...
start "Addinest Server" cmd /c "node src/server.js"

echo Waiting for server to start (5 seconds)...
timeout /t 5 /nobreak >nul

echo.
echo ===================================================================
echo Running property submission test...
echo ===================================================================
echo.

node test-property-submission-500-fix.js

echo.
echo ===================================================================
echo Test complete! Press any key to close the server and exit...
echo ===================================================================
echo.

pause

:: Find and kill the server process
for /f "tokens=2" %%a in ('tasklist /fi "windowtitle eq Addinest Server" /fo list ^| find "PID:"') do (
  echo Shutting down server (PID: %%a)...
  taskkill /PID %%a /F >nul 2>nul
)

echo Done!
