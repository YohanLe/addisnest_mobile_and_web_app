@echo off
echo ===================================================
echo Property Submission 500 Error Fix Test
echo ===================================================
echo This test verifies that our fix for the 500 error 
echo during property submission works correctly.
echo.
echo The test will:
echo 1. Submit a property with missing address fields
echo 2. Verify the controller adds fallback values
echo 3. Confirm no 500 errors occur
echo ===================================================
echo.

echo Installing required dependencies...
call npm install colors axios dotenv --no-save

echo.
echo Running test...
node test-property-submission-500-fix.js

echo.
echo Test completed.
echo ===================================================
pause
