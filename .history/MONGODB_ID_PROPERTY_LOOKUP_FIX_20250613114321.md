# MongoDB ID Property Lookup Fix

## Problem

The property detail component is failing to fetch property details when using MongoDB ObjectIDs. This is happening because:

1. API calls to `/properties/mongo-id/:id` are returning 401 Unauthorized errors
2. Fallback calls to standard endpoints are also failing
3. This is caused by the routes requiring authentication for endpoints that should be public

## Fix Implementation

We've implemented a solution that ensures properties can be retrieved by MongoDB ObjectID without requiring authentication:

1. Created dedicated controller functions for MongoDB ID lookup in `src/controllers/property-mongo-id-fix.js`
2. Updated route configurations in `src/routes/propertyRoutes-mongo-id-fix.js`
3. Made the MongoDB ID lookup endpoints public by moving them before the authentication middleware
4. Added proper fallback mechanisms in the property detail Redux slice

### Key Changes

1. **New Public MongoDB ID Endpoints**:
   - `/api/properties/mongo-id/:id` - Dedicated endpoint for MongoDB ObjectID lookup
   - `/api/properties/direct-db-query/:id` - Direct database query fallback endpoint

2. **Route Configuration**:
   - MongoDB ID routes are defined before auth middleware to make them public
   - Route declaration order is maintained to prevent conflicts

3. **API Client**:
   - The frontend API client is properly configured to send requests with appropriate headers
   - Fallback mechanisms are in place to try multiple endpoints

4. **Error Handling**:
   - Improved error logging to diagnose issues
   - Added validation for MongoDB ID format
   - Multiple fallback strategies to maximize chances of success

## How to Test

### Using Test Scripts

1. **API Test**:
   ```bash
   npm test-property-mongo-id-fix.js
   # or
   node test-property-mongo-id-fix.js
   ```
   This will test all three endpoints to ensure at least one works properly.

2. **Full Application Test**:
   ```bash
   npm start-app-with-mongo-id-fix.bat
   # or
   node launch-with-mongo-id-fix.js
   ```
   This will start both the backend and frontend with the fix enabled.

### Manual Testing

1. Start the application with the fix enabled:
   ```bash
   npm start-app-with-mongo-id-fix.bat
   ```

2. Navigate to the property detail page using a MongoDB ObjectID:
   ```
   http://localhost:5173/property-detail/684a5fb17cb3172bbb3c75d7
   ```

3. Verify the property details are loaded successfully without 401 errors.

## Technical Details

### Controller Implementation

The MongoDB ID lookup implementation:

```javascript
// Add a specific route for MongoDB ID property lookup
router.get('/mongo-id/:id', async (req, res) => {
  try {
    // Get the MongoDB _id from params
    let mongoId = req.params.id;
    
    console.log(`[mongo-id] Lookup called with ID: ${mongoId}`);
    
    // Validate MongoDB ID format
    const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(mongoId);
    if (!isValidMongoId) {
      console.error(`[mongo-id] Invalid MongoDB ID format: ${mongoId}`);
      return res.status(400).json({
        success: false,
        error: `Invalid MongoDB ID format: ${mongoId}`
      });
    }
    
    // Try to find the property - no auth check needed for public endpoint
    const { Property } = require('../models');
    
    // First try direct _id lookup
    let property = await Property.findOne({ _id: mongoId }).populate({
      path: 'owner',
      select: 'firstName lastName email phone'
    });
    
    // If not found, try id field (some records might use id instead of _id)
    if (!property) {
      property = await Property.findOne({ id: mongoId }).populate({
        path: 'owner',
        select: 'firstName lastName email phone'
      });
    }

    if (!property) {
      console.log(`[mongo-id] Property not found with MongoDB _id: ${mongoId}`);
      return res.status(404).json({
        success: false,
        error: `Property not found with MongoDB _id: ${mongoId}`
      });
    }

    console.log(`[mongo-id] Successfully retrieved property with MongoDB _id: ${mongoId}`);

    // Try to increment view count if possible
    try {
      property.views = (property.views || 0) + 1;
      await property.save();
    } catch (viewError) {
      // Log but don't fail if view count update fails
      console.warn(`[mongo-id] Could not update view count: ${viewError.message}`);
    }
    
    // Return the property
    return res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error(`[mongo-id] Error finding property with MongoDB ID:`, error);
    return res.status(500).json({
      success: false,
      error: `Error retrieving property: ${error.message}`
    });
  }
});
```

### Redux Implementation

The property detail Redux slice includes fallback mechanisms:

```javascript
// Primary approach: Use the mongo-id endpoint
console.log(`Attempting to use mongo-id endpoint: /properties/mongo-id/${propertyId}`);
const response = await Api.getPublic(`properties/mongo-id/${propertyId}`);
// ...

// Fallback approach 1: Try standard endpoint
try {
  console.log('Attempting to use standard endpoint as fallback');
  const altResponse = await Api.getPublic(`properties/${propertyId}`);
  // ...
} catch (altError) {
  console.log('Alternative endpoint failed:', altError.message);
}

// Fallback approach 2: Try direct database query endpoint
try {
  console.log('Attempting direct database query as final fallback');
  const dbResponse = await Api.getPublic(`properties/direct-db-query/${propertyId}`);
  // ...
} catch (dbError) {
  console.log('Direct database query failed:', dbError.message);
}
```

## Notes and Considerations

- This implementation prioritizes backwards compatibility while fixing the issue
- The order of route declarations is critical for proper functionality
- The fix ensures public access to property details without requiring authentication
- The solution maintains security by only making property detail endpoints public
