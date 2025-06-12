# How to Test the Property Submission 500 Error Fix

This guide explains how to test the fix for the 500 Internal Server Error that was occurring during property submission.

## Background

The application was experiencing a 500 Internal Server Error when users attempted to submit property listings through the ChoosePropmotion component. The issue has been fixed by:

1. Removing fields that conflicted with server-side validation
2. Ensuring proper formatting of property data structure
3. Adding proper fallbacks for required fields

## Testing Methods

There are two ways to test the fix:

1. **Automated Test Script** - Using a Node.js script to directly test the API
2. **Manual UI Testing** - Testing through the application UI

## Method 1: Using the Automated Test Script

### Prerequisites

- Node.js installed
- Server running locally on port 7000 (or configured port)
- Valid authentication token

### Steps

1. **Run the batch file**:
   ```
   run-property-submission-500-fix-test.bat
   ```
   
   This will:
   - Start the server if it's not running
   - Check for a valid authentication token
   - Run the test script
   - Display results

2. **Alternatively, run the test script directly**:
   ```
   node test-property-submission-500-fix.js
   ```

3. **Check the output**:
   - Success: You'll see "Property created successfully!" and property details
   - Failure: Error details will be displayed

### Modifying the Test

You can modify `test-property-submission-500-fix.js` to test different scenarios:

- Change the `promotionType` to "Basic", "VIP", or "Diamond" to test different promotion plans
- Modify property details to test different combinations of data
- Remove certain fields to test fallback mechanisms

## Method 2: Manual UI Testing

### Prerequisites

- Application running locally
- User account with login credentials

### Steps

1. **Start the application**:
   ```
   npm run dev
   ```
   or use the provided batch file:
   ```
   start-app.bat
   ```

2. **Navigate to the property listing form**:
   - Log in to your account
   - Click "Add Property" or navigate to `/property-list-form`

3. **Complete the property form**:
   - Fill out all required fields
   - Upload at least one property image (or enable test mode to use default images)
   - Click "Continue to Promotion"

4. **Select a promotion plan**:
   - Choose Basic (free), VIP, or Diamond plan
   - For Basic plan, click "Continue"
   - For paid plans, click "Make Payment"

5. **Verify success**:
   - If using Basic plan: You should be redirected to account management with a success notification
   - If using paid plans: You should be redirected to the payment process page
   - Check the browser console for any errors (there should be no 500 errors)

6. **Optional: Test with Test Mode**:
   - In the property listing form, find the "Test Mode" toggle in the bottom right corner
   - Enable it to bypass validation and use mock data
   - Complete the process and verify it works without errors

## Expected Results

### Successful Fix Verification

A successful fix will show:

1. No 500 Internal Server Error in the browser console or server logs
2. Property correctly saved to the database with all fields
3. Proper status set based on promotion type:
   - Basic plan: status = "active"
   - VIP/Diamond plans: status = "Pending"

### Verifying the Database

You can verify the property was correctly saved by:

1. Checking the MongoDB database:
   ```
   use addinest
   db.properties.find({title: "Test Property - 500 Fix Verification"}).pretty()
   ```

2. Or by viewing your property listings in the application UI:
   - Navigate to account management
   - Go to "My Properties" tab
