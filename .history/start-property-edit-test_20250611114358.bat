@echo off
echo Starting Property Edit Test...

echo Opening test page in default browser...
start "" test-edit-property-fix.html

echo Test page opened. Please follow the instructions on the page.
echo 1. Click "Run All Tests" to execute all test cases
echo 2. Click "Simulate Edit Click" on each test case to store property data
echo 3. Click "Open Edit Form" to navigate to the edit form and verify the data is displayed correctly
echo.
echo NOTE: Make sure your application is running on port 5173 for the edit form links to work.
echo       If your app is on a different port, please update the URLs in the HTML file.
echo.
pause
