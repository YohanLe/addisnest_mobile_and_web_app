# How to Test the MongoDB ID Property Lookup Fix

This guide provides step-by-step instructions for testing the MongoDB ID property lookup fix, which addresses the issue with 401 Unauthorized errors when accessing property details using MongoDB ObjectIDs.

## Prerequisites

- Node.js installed
- MongoDB running locally on port 27017
- The application code checked out

## Step 1: Seed Test Properties

First, we need to ensure we have test properties with specific MongoDB IDs in the database:

1. Run the property seeder script:
   ```
   run-seed-test-property.bat
   ```
   or directly with Node:
   ```
   node seed-test-property-data.js
   ```

This script will:
- Create test properties with the specific MongoDB IDs used in our tests
- Create a test user if needed
- Display success or error messages

## Step 2: Test the API Endpoints

Next, test if the API endpoints are correctly set up and working:

1. Run the MongoDB ID test script:
   ```
   run-property-mongo-id-fix-test.bat
   ```
   or directly with Node:
   ```
   node test-property-mongo-id-fix.js
   ```

This script will:
- Test all three API endpoints for MongoDB ID property lookup
- Check both MongoDB IDs (from logs and browser)
- Display success or failure for each endpoint
- Show overall test results

## Step 3: Launch the Application with the Fix

Start the application with the MongoDB ID lookup fix enabled:

1. Run the application with the fix:
   ```
   start-app-with-mongo-id-fix.bat
   ```
   or directly with Node:
   ```
   node launch-with-mongo-id-fix.js
   ```

2. Wait for both the backend and frontend servers to start

## Step 4: Verify in the Browser

1. Open your browser and navigate to:
   ```
   http://localhost:5173/property-detail/684a5fb17cb3172bbb3c75d7
   ```
   and
   ```
   http://localhost:5173/property-detail/684a57857cb3172bbb3c73d9
   ```

2. Verify that both property detail pages load successfully without 401 Unauthorized errors

## Troubleshooting

If you encounter issues:

### API Returns 401 Unauthorized

1. Check that the route order in `src/routes/propertyRoutes-mongo-id-fix.js` places the MongoDB ID endpoints before the auth middleware
2. Verify that `src/routes/index.js` is using the correct routes file
3. Restart the server to ensure changes take effect

### Property Not Found (404)

1. Make sure you've run the seed script successfully
2. Check the MongoDB database to verify properties exist with the correct IDs
3. Try accessing the API directly with a tool like Postman or curl

### Server Crashes or Other Errors

1. Check the server console for error messages
2. Verify MongoDB is running and accessible
3. Check that all required dependencies are installed

## Additional Notes

- The fix creates public endpoints for property lookup that don't require authentication
- Three different endpoints are available for fallback purposes:
  - `/api/properties/mongo-id/:id` - Primary endpoint for MongoDB ID lookup
  - `/api/properties/:id` - Standard endpoint
  - `/api/properties/direct-db-query/:id` - Direct database query endpoint
- The fix has built-in logging to help diagnose issues

## Validating the Fix

A successful fix implementation will show:

1. No 401 Unauthorized errors when accessing property details by MongoDB ID
2. Successful response from at least one of the API endpoints
3. Property details displayed correctly in the browser
