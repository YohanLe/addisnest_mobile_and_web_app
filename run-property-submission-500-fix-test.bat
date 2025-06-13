@echo off
echo.
echo ==================================================================
echo    Running AddiNest with Property Submission 500 Error Fix
echo ==================================================================
echo.
echo This script will start the application with the property submission fix
echo that resolves the 500 Internal Server Error when submitting properties.
echo.
echo Press any key to continue or CTRL+C to cancel...
pause > nul

:: Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Error: Node.js is not installed or not in the PATH.
  echo Please install Node.js and try again.
  exit /b 1
)

:: Set environment variables for testing
set NODE_ENV=development
set USE_PROPERTY_SUBMISSION_FIX=true

echo.
echo Starting AddiNest with property submission fix enabled...
echo.
echo [TEST MODE] You can test the property submission process by:
echo  1. Navigate to /property-list-form
echo  2. Create a property listing
echo  3. Select a promotion plan
echo  4. Click Continue/Make Payment
echo.
echo The fix should prevent the 500 Internal Server Error that was occurring.
echo.

:: Run the application with the fix
node src/fix-property-submission.js & npm run dev

echo.
echo Test completed.
echo.
