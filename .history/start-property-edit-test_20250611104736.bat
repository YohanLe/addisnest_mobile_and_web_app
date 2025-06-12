@echo off
echo Starting Addinest with Property Edit Fix...

:: Start the backend server
start cmd /k "node src/server.js"

:: Wait for server to start
timeout /t 5

:: Start the frontend
start cmd /k "cd src && npm run dev"

:: Wait for frontend to start
timeout /t 8

:: Open the test page in browser
start http://localhost:5173/test-property-edit.html

echo Property Edit Test started successfully!
echo 1. Click "Run Test" on the test page
echo 2. Then click "Go To Edit Form" to verify the form populates with test data
echo 3. Check browser console for detailed logs
