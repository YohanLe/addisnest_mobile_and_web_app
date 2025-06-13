@echo off
echo Starting application with MongoDB ID property lookup fix...
echo This will start both the backend and frontend servers with the fix enabled.
echo.
echo Press Ctrl+C to stop the servers when finished testing.
echo.

node launch-with-mongo-id-fix.js

pause
