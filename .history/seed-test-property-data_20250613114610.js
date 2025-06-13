/**
 * Property Seeder Script for MongoDB ID Fix Testing
 * 
 * This script adds test properties with specific MongoDB IDs to ensure our MongoDB ID lookup
 * functionality can be properly tested.
 */

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const dotenv = require('dotenv');
const path = require('path');
const colors = require('colors');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Force using local MongoDB
    const conn = await mongoose.connect('mongodb://localhost:27017/addisnest', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`.red);
    process.exit(1);
  }
};

// Import the Property model
const Property = require('./src/models/Property');
const User = require('./src/models/User');

// Define specific MongoDB IDs for testing
const testIds = [
  '684a5fb17cb3172bbb3c75d7', // ID from original logs
  '684a57857cb3172bbb3c73d9'  // ID from browser screenshot
];

// Create a sample property with a specific MongoDB ID
const createPropertyWithId = async (id, user) => {
  try {
    // Check if property with this ID already exists
    const existingProperty = await Property.findById(id);
    
    if (existingProperty) {
      console.log(`Property with ID ${id} already exists`.yellow);
      return existingProperty;
    }
    
    // Create new property with the specific ID
    const property = new Property({
      _id: new ObjectId(id),
      owner: user._id,
      title: `Test Property with ID ${id.substring(0, 6)}...`,
      description: `This is a test property created for MongoDB ID fix testing with ID ${id}`,
      propertyType: 'House',
      offeringType: 'For Sale',
      status: 'For Sale',
      price: 250000,
      area: 2000,
      bedrooms: 3,
      bathrooms: 2,
      street: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      country: 'Ethiopia',
      address: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        country: 'Ethiopia'
      },
      images: [
        { url: '/uploads/properties/test-property-1.jpg' },
        { url: '/uploads/properties/test-property-2.jpg' }
      ],
      features: {
        hasPool: true,
        hasGarden: true,
        hasSecurity: true
      },
      promotionType: 'VIP',
      isPremium: true,
      isVerified: true
    });
    
    await property.save();
    console.log(`Created property with ID: ${id}`.green);
    return property;
  } catch (error) {
    console.error(`Error creating property with ID ${id}: ${error.message}`.red);
    throw error;
  }
};

// Main function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();
    
    // Get or create a test user
    let user = await User.findOne({ email: 'testuser@example.com' });
    
    if (!user) {
      console.log('Creating test user...'.yellow);
      user = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'agent'
      });
      
      await user.save();
      console.log('Test user created'.green);
    }
    
    // Create properties with specific IDs
    console.log('Creating test properties with specific MongoDB IDs...'.cyan);
    
    for (const id of testIds) {
      await createPropertyWithId(id, user);
    }
    
    console.log('Database seeding completed!'.green.bold);
    
    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed'.yellow);
    
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`.red.bold);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();
