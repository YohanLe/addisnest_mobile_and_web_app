# MongoDB Property Schema Update

## Overview

The Property model schema has been updated to match the specified structure with the following key characteristics:

```javascript
{
  "_id": ObjectId(),
  "owner": ObjectId(),
  "title": "...",
  "description": "...",
  "propertyType": "...",
  "offeringType": "...",
  "status": "...",
  "price": 100000,
  "area": 1500,
  "bedrooms": 3,
  "bathrooms": 2,
  "street": "...",
  "city": "...",
  "state": "...",
  "country": "...",
  "images": [ { "url": "..." } ],
  "features": { "hasPool": true },
  "promotionType": "VIP",
  "isPremium": true,
  "isVerified": true,
  "views": 42,
  "likes": 5,
  "createdAt": "...",
  "updatedAt": "..."
}
```

## Key Changes Made

1. **Address Fields**: 
   - Address fields are now top-level properties in the schema (street, city, state, country)
   - Each field is a required String type

2. **Features Structure**:
   - The `features` field is now a Mixed type object with `hasPool` boolean property
   - Default value is `{ hasPool: false }`

3. **Images Structure**:
   - The `images` field is an array of objects with URL strings
   - Each image object has the structure `{ url: String }`

4. **Additional Fields**:
   - `promotionType`: String enum with values 'Basic', 'VIP', 'Diamond', 'None'
   - `isPremium`: Boolean, default false
   - `isVerified`: Boolean, default false
   - `views`: Number, default 0
   - `likes`: Number, default 0

## Verification Tests

The following verification tests were created and run successfully:

1. `test-property-schema-update.js` - Creates and validates a property with the new schema structure
2. `test-property-model-validation.js` - Tests the schema structure against expected fields
3. `verify-property-schema-update.js` - Detailed verification of all schema fields and their properties

## Validation Results

The schema validation tests confirmed:

- All required fields are present in the schema
- Address fields are correctly defined as top-level properties
- Features object is correctly defined with hasPool property
- Images array with URL objects works as expected
- All other fields (promotionType, isPremium, isVerified, views, likes) are properly defined

## Usage Example

```javascript
const property = new Property({
  owner: userId, // MongoDB ObjectId
  title: "Sample Property",
  description: "A beautiful property for sale",
  propertyType: "House",
  offeringType: "For Sale",
  status: "active",
  price: 250000,
  area: 2000,
  bedrooms: 4,
  bathrooms: 3,
  street: "123 Main Street",
  city: "Sample City",
  state: "Sample State",
  country: "Sample Country",
  images: [{ url: "https://example.com/image.jpg" }],
  features: { hasPool: true },
  promotionType: "VIP",
  isPremium: true,
  isVerified: true
});

await property.save();
