const mongoose = require('mongoose');
require('dotenv').config();
const { Property } = require('./src/models');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

async function testPropertyCreation() {
  try {
    // Create a test user ID (replace with a real one if needed)
    const testOwnerId = new mongoose.Types.ObjectId();
    
    // Create a test property with all the new schema fields
    const propertyData = {
      owner: testOwnerId,
      title: "Test Property with New Schema",
      description: "This property is created to test the updated schema",
      propertyType: "House",
      offeringType: "For Sale",
      status: "active",
      price: 100000,
      area: 1500,
      bedrooms: 3,
      bathrooms: 2,
      street: "123 Main Street",
      city: "Test City",
      state: "Test State", 
      country: "Test Country",
      images: [{ url: "https://example.com/test-image.jpg" }],
      features: { hasPool: true },
      promotionType: "VIP",
      isPremium: true,
      isVerified: true,
      views: 42,
      likes: 5
    };

    // Attempt to create the property in the database
    console.log('Creating property with data:', JSON.stringify(propertyData, null, 2));
    const property = await Property.create(propertyData);
    
    console.log('Property created successfully with ID:', property._id);
    console.log('Property data in database:', JSON.stringify(property, null, 2));
    
    // Verify we can retrieve the property
    const retrievedProperty = await Property.findById(property._id);
    console.log('Retrieved property from database:', JSON.stringify(retrievedProperty, null, 2));
    
    // Clean up - delete the test property
    await Property.findByIdAndDelete(property._id);
    console.log('Test property deleted');
    
    return { success: true, message: 'Property creation test successful' };
  } catch (error) {
    console.error('Error during property creation test:', error);
    return { success: false, error: error.message };
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  }
}

// Run the test
testPropertyCreation();
