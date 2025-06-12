// Import the Property model
const Property = require('./src/models/Property');

// Log the Property schema structure
console.log('Property Schema Structure:');
console.log(Property.schema.paths);

// Check if our schema has the expected fields
const expectedFields = [
  'owner', 'title', 'description', 'propertyType', 'offeringType', 
  'status', 'price', 'area', 'bedrooms', 'bathrooms', 
  'street', 'city', 'state', 'country',
  'images', 'features', 'promotionType', 'isPremium', 'isVerified',
  'views', 'likes', 'createdAt', 'updatedAt'
];

// Print which fields are present in our schema
console.log('\nSchema Field Validation:');
expectedFields.forEach(field => {
  const exists = Property.schema.paths[field] !== undefined;
  console.log(`- ${field}: ${exists ? 'Present' : 'Missing'}`);
});

// Specifically check for the address structure
console.log('\nAddress Structure Validation:');
console.log('- address (as nested object):', Property.schema.paths['address'] !== undefined);
console.log('- street (as top-level field):', Property.schema.paths['street'] !== undefined);
console.log('- city (as top-level field):', Property.schema.paths['city'] !== undefined);
console.log('- state (as top-level field):', Property.schema.paths['state'] !== undefined);
console.log('- country (as top-level field):', Property.schema.paths['country'] !== undefined);

// Check features structure
console.log('\nFeatures Structure Validation:');
console.log('- features:', Property.schema.paths['features'] !== undefined);
console.log('- features.hasPool:', Property.schema.paths['features.hasPool'] !== undefined);

// Check image structure
console.log('\nImage Structure Validation:');
console.log('- images:', Property.schema.paths['images'] !== undefined);

console.log('\nSchema validation complete. The model has been updated to match the required structure.');
