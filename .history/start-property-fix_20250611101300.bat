@echo off
echo ===================================================
echo AddisnEst Property Submission Fix Launcher
echo ===================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Error: Node.js is not installed or not in PATH.
  echo Please install Node.js from https://nodejs.org/
  echo.
  pause
  exit /b 1
)

REM Check if the fixed property launcher exists
if not exist fixed-property-launcher.js (
  echo Error: fixed-property-launcher.js not found.
  echo Please make sure you are running this batch file from the project root directory.
  echo.
  pause
  exit /b 1
)

REM Check if the fixed components exist
if not exist src\components\account-management\sub-component\account-tab\PropertyAlertFixed.jsx (
  echo Error: PropertyAlertFixed.jsx not found.
  echo.
  pause
  exit /b 1
)

if not exist src\components\account-management\sub-component\AccountMainFixed.jsx (
  echo Error: AccountMainFixed.jsx not found.
  echo.
  pause
  exit /b 1
)

echo Starting AddisnEst with property submission fix...
echo.
echo Documentation: See PROPERTY_SUBMISSION_DISPLAY_FIX.md for details
echo.

REM Run the fixed property launcher
node fixed-property-launcher.js

REM If node exits with an error, pause to show the error
if %ERRORLEVEL% neq 0 (
  echo.
  echo An error occurred while running the property submission fix.
  echo.
  pause
)
