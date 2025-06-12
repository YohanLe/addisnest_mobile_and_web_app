const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Import the Property model
const Property = require('./src/models/Property');

// Create a test property with the new schema structure
const testProperty = new Property({
  owner: new mongoose.Types.ObjectId(), // This creates a new ObjectId
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

// Validate the model (this will throw an error if the schema doesn't match)
const validationError = testProperty.validateSync();
if (validationError) {
  console.error('Validation Error:', validationError);
} else {
  console.log('Property validation successful with the new schema!');
  console.log('Test property:', JSON.stringify(testProperty, null, 2));
}

// Clean up (don't save to DB, just disconnect)
mongoose.disconnect()
  .then(() => console.log('MongoDB Disconnected'))
  .catch(err => console.error('Error disconnecting from MongoDB:', err));
