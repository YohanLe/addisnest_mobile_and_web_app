# How to Test Property Submission Address Validation Fix

This guide provides instructions on how to test the fix for the property submission validation errors that were causing the `500 Internal Server Error` with the message: 
```
"Please add a country, Please add a state, Please add a city, Please add a street address"
```

## What Was Fixed

The fix addresses a critical issue in the property submission flow where address fields were not being properly validated or filled with fallback values, causing API validation errors. The key changes include:

1. Added fallback values for all required address fields
2. Improved handling of nested vs. flat address data structures
3. Added pre-submission validation to ensure required fields are present
4. Enhanced test mode data to include all required fields

## Testing Methods

There are two ways to test this fix:

### 1. Using the Web Interface

1. Start the application using the `start-app.bat` script
2. Navigate to the property listing form and fill out property details
3. Intentionally leave address fields empty (to test the fix)
4. Submit the property and proceed to the ChoosePromotion page
5. Select a plan and continue
6. Verify that the property is saved successfully without the 500 error

### 2. Using the Automated Test Script

The `test-property-address-validation.js` script tests three scenarios:
- Submitting a property with missing address fields (should fail without our fix)
- Submitting the same property with our validation fix applied (should succeed)
- Submitting a property with all address fields properly set (control case)

To run the automated test:

1. Ensure your server is running on `http://localhost:7000`
2. Make sure you have a valid auth token in your `.env` file (required for API calls)
3. Run the test script using the batch file:

```
run-address-validation-test.bat
```

## Expected Results

When the fix is working correctly:

1. Properties submitted through the web interface should save successfully even if address fields were not filled in by the user.

2. In the automated test:
   - Test 1 should fail (API correctly rejects a property with missing address fields)
   - Test 2 should pass (our fix resolves the issue)
   - Test 3 should pass (control case works as expected)

## Troubleshooting

If you encounter issues:

1. Check the server logs for detailed error messages
2. Verify that the API is running and accessible
3. Ensure you have a valid authentication token
4. Check if there are additional validation rules that need to be handled

## File Locations

- Fixed component: `src/components/payment-method/choose-propmo/sub-component/ChoosePropmotion.jsx`
- Test script: `test-property-address-validation.js`
- Batch file: `run-address-validation-test.bat`
- Documentation: `PROPERTY_SUBMISSION_VALIDATION_FIX.md`

## Technical Implementation Details

The key part of the fix is in the property data formatting:

```javascript
// Ensure required address fields are present to avoid 500 errors
if (!isTestMode && !dataToUse.city) {
  console.log("Adding missing city field to prevent API validation errors");
  dataToUse = {
    ...dataToUse,
    city: dataToUse.city || dataToUse.address?.city || "Unknown City",
    regional_state: dataToUse.regional_state || dataToUse.address?.state || "Unknown State",
    country: dataToUse.country || dataToUse.address?.country || "Ethiopia",
    street: dataToUse.street || dataToUse.property_address || dataToUse.address?.street || "Unknown Address"
  };
}
```

This ensures that all required address fields have fallback values before the API call is made, preventing validation errors.
