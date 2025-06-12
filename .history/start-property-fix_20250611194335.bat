@echo off
echo ===================================================
echo Property Submission 500 Error Fix Launcher
echo ===================================================
echo This script will start the server with the fixed property controller
echo that properly handles missing address fields.
echo.
echo Steps:
echo 1. Backing up original propertyController.js
echo 2. Replacing it with propertyController-fix.js
echo 3. Starting the server
echo 4. On exit, restoring the original controller
echo ===================================================
echo.

REM Create backups directory if it doesn't exist
if not exist "backups" mkdir backups

REM Check if original controller exists
if not exist "src\controllers\propertyController.js" (
  echo ERROR: src\controllers\propertyController.js not found!
  echo Please run this script from the project root directory.
  goto end
)

REM Check if fixed controller exists
if not exist "src\controllers\propertyController-fix.js" (
  echo ERROR: src\controllers\propertyController-fix.js not found!
  echo Please ensure the fixed controller file exists.
  goto end
)

REM Backup original controller
echo Backing up original propertyController.js...
copy "src\controllers\propertyController.js" "backups\propertyController.js.bak"

REM Replace with fixed controller
echo Replacing with fixed controller...
copy "src\controllers\propertyController-fix.js" "src\controllers\propertyController.js"

REM Start server
echo.
echo Starting server with fixed controller...
echo Press Ctrl+C to stop the server and restore the original controller.
echo.
call npm start

REM Restore original controller when server is stopped
echo.
echo Restoring original controller...
copy "backups\propertyController.js.bak" "src\controllers\propertyController.js"
echo Original controller restored.

:end
echo.
echo ===================================================
pause
