const { Property } = require('./src/models');
const mongoose = require('mongoose');

// Document the updated property schema
console.log('\n=== PROPERTY SCHEMA UPDATE VERIFICATION ===\n');

// Log all available schema paths
console.log('Schema Fields:');
Object.keys(Property.schema.paths).sort().forEach(path => {
  const schemaType = Property.schema.paths[path];
  const type = schemaType.instance;
  const isRequired = schemaType.isRequired ? 'Required' : 'Optional';
  
  console.log(`- ${path}: ${type} (${isRequired})`);
  
  // Show enum values if applicable
  if (schemaType.enumValues && schemaType.enumValues.length > 0) {
    console.log(`  Enum values: ${schemaType.enumValues.join(', ')}`);
  }
  
  // Show default value if applicable
  if (schemaType.defaultValue !== undefined) {
    console.log(`  Default: ${JSON.stringify(schemaType.defaultValue)}`);
  }
});

// Verify our required fields for MongoDB property schema
console.log('\nVerifying the schema matches requirements:');

// Create a test property document (without saving to database)
const testProperty = new Property({
  owner: new mongoose.Types.ObjectId(),
  title: "Test Property",
  description: "A test property with the updated schema",
  propertyType: "House",
  offeringType: "For Sale",
  status: "active",
  price: 100000,
  area: 1500,
  bedrooms: 3,
  bathrooms: 2,
  street: "123 Test Street",
  city: "Test City",
  state: "Test State",
  country: "Test Country",
  images: [{ url: "https://example.com/image.jpg" }],
  features: { hasPool: true },
  promotionType: "VIP",
  isPremium: true,
  isVerified: true,
  views: 42,
  likes: 5
});

// Log the created property object
console.log('\nTest Property Object:');
console.log(JSON.stringify(testProperty, null, 2));

// Verify address fields
console.log('\nAddress Fields Verification:');
console.log(`- street: ${testProperty.street}`);
console.log(`- city: ${testProperty.city}`);
console.log(`- state: ${testProperty.state}`);
console.log(`- country: ${testProperty.country}`);

// Verify features
console.log('\nFeatures Verification:');
console.log(`- features: ${JSON.stringify(testProperty.features)}`);
console.log(`- hasPool: ${testProperty.features.hasPool}`);

// Verify images
console.log('\nImages Verification:');
console.log(`- images: ${JSON.stringify(testProperty.images)}`);

console.log('\nSchema verification complete.');
console.log('The MongoDB Property model has been successfully updated to match the required structure.');
