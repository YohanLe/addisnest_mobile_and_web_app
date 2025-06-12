@echo off
echo.
echo ===============================================================
echo STARTING APP WITH PROPERTY ADDRESS VALIDATION FIX
echo ===============================================================
echo.
echo This script will start the application with the property submission
echo address validation fix applied. You can test the fix by:
echo.
echo  1. Creating a new property listing
echo  2. Intentionally leaving address fields empty
echo  3. Proceeding to the Choose Promotion page
echo  4. Selecting a plan and continuing
echo  5. Verifying the property is saved without 500 errors
echo.
echo See HOW_TO_TEST_PROPERTY_SUBMISSION_FIX.md for detailed instructions.
echo.
echo ===============================================================
echo.
echo Starting the application...
echo.

cd %~dp0
node start-app.js

echo.
echo Application stopped. Press any key to exit...
pause > nul
