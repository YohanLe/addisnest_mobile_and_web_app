/**
 * Seed script for creating a test property with specific fields for testing
 * This creates a property with the exact structure mentioned in the database fix
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Function to create test property
const createTestProperty = async () => {
  try {
    // First check if we have a Property model defined
    let Property;
    try {
      Property = mongoose.model('Property');
    } catch (e) {
      // If model is not already defined, define it
      const propertySchema = new mongoose.Schema({}, { strict: false }); // Use flexible schema for testing
      Property = mongoose.model('Property', propertySchema);
    }

    // Create the test property with the exact fields from the database
    const testProperty = {
      _id: new mongoose.Types.ObjectId('6844fe2675f07c438fc2a3f4'), // Using a specific ID for testing
      title: "Test Property With Fixed Image URLs",
      property_type: "House",
      property_for: "For Sale",
      regional_state: "Addis Ababa",
      city: "Addis Ababa",
      country: "Ethiopia",
      property_address: "Test Address",
      total_price: 1000000,
      description: "Test property with fixed image URLs",
      property_size: 100,
      number_of_bathrooms: 2,
      number_of_bedrooms: 3,
      furnishing: "Furnished",
      amenities: [
        "Swimming Pool",
        "Garden"
      ],
      promotion_package: "basic",
      media_paths: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
      ],
      createdAt: new Date("2025-06-08T03:06:14.439Z"),
      updatedAt: new Date("2025-06-08T03:06:14.439Z"),
      __v: 0
    };

    // Check if property with this ID already exists
    const existingProperty = await Property.findById('6844fe2675f07c438fc2a3f4');
    
    if (existingProperty) {
      console.log('Test property already exists - updating...');
      await Property.findByIdAndUpdate('6844fe2675f07c438fc2a3f4', testProperty);
      console.log('Test property updated successfully');
    } else {
      console.log('Creating new test property...');
      await Property.create(testProperty);
      console.log('Test property created successfully');
    }

    // Also create the property with the ID from the URL for debugging
    const debugProperty = {
      ...testProperty,
      _id: new mongoose.Types.ObjectId('684a57857cb3172bbb3c73d9'),
      title: "Debug Property With Fixed Image URLs"
    };

    // Check if debug property already exists
    const existingDebugProperty = await Property.findById('684a57857cb3172bbb3c73d9');
    
    if (existingDebugProperty) {
      console.log('Debug property already exists - updating...');
      await Property.findByIdAndUpdate('684a57857cb3172bbb3c73d9', debugProperty);
      console.log('Debug property updated successfully');
    } else {
      console.log('Creating new debug property...');
      await Property.create(debugProperty);
      console.log('Debug property created successfully');
    }

    console.log('Test properties created/updated with IDs:');
    console.log('- 6844fe2675f07c438fc2a3f4 (Main test property)');
    console.log('- 684a57857cb3172bbb3c73d9 (Debug property)');

  } catch (error) {
    console.error('Error creating test property:', error);
  }
};

// Main execution
const run = async () => {
  await connectDB();
  await createTestProperty();
  console.log('Seed script completed!');
  process.exit(0);
};

run();
