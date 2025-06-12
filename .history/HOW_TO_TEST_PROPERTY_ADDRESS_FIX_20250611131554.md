# How to Test the Property Address Structure Fix

This guide walks you through testing the nested address structure implementation across the application to ensure property submissions no longer fail due to address validation errors.

## Background

The MongoDB model requires property addresses in a nested structure format:

```javascript
address: {
  street: String,
  city: String,
  state: String,
  country: String
}
```

However, the frontend was previously sending flat address fields, causing validation errors. Our fix implements a standardized nested address structure throughout the application.

## Testing Steps

### 1. Automated API Testing

Run the automated test script to verify API interactions:

```
test-address-structure-fix.bat
```

This script tests:
- Creating a property with nested address structure
- Retrieving a property and confirming the nested structure is present
- Updating a property's address and confirming the changes are properly saved

### 2. Manual Frontend Testing

#### Step 1: Start the Application

Launch the application with all fixes applied:

```
start-app-with-address-fix.bat
```

#### Step 2: Create a New Property

1. Navigate to the property listing form
2. Fill out the form with complete address information:
   - Street Name
   - City
   - Regional State
   - Country (default: Ethiopia)
3. Complete the remaining property details
4. Submit the form and proceed through the payment/promotion flow
5. Verify the property is successfully created without any address validation errors

#### Step 3: Edit an Existing Property

1. Navigate to your property listings
2. Select "Edit" for any existing property
3. Modify the address fields:
   - Change the street name
   - Update the city
   - Select a different regional state
4. Save the changes
5. Verify the changes are saved successfully without validation errors
6. View the property again to confirm the address updates are persisted

### 3. Backend Verification

To verify the data is correctly stored in the database:

1. Check the server logs for any address-related errors
2. Use API endpoints to retrieve property data and inspect the address structure
3. Confirm both the nested address structure and flat address fields are present for backward compatibility

## What to Look For

### Successful Implementation Signs:
- No "Please add a street address" or similar validation errors
- Property creation and updates complete successfully
- The API returns property data with a nested address structure
- Both the property listing form and edit form handle addresses correctly

### Potential Issues:
- 500 Server errors during property creation/update
- Missing address fields in retrieved properties
- Address data not saving correctly when edited

## Components Modified

The following components were updated to implement the nested address structure:

1. `src/controllers/propertyController-nested.js` - New middleware
2. `src/routes/propertyRoutes.js` - Updated routes
3. `src/components/property-list-form/sub-component/PropertyListForm.jsx` - Form component
4. `src/components/property-edit-form/sub-component/EditPropertyForm.jsx` - Edit form

If you encounter any issues, please review these files first to ensure the nested address structure is correctly implemented.
