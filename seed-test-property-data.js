/**
 * Seed test property data with specific MongoDB IDs
 * 
 * This script creates property records with specific MongoDB IDs
 * for testing the MongoDB ID property lookup fix.
 */

const mongoose = require('mongoose');
const { MongoClient, ObjectId } = require('mongodb');
const colors = require('colors');

// Configuration
const config = {
  mongoUri: 'mongodb://localhost:27017/addisnest',
  propertyIds: [
    '684a5fb17cb3172bbb3c75d7',
    '684a57857cb3172bbb3c73d9'
  ]
};

// Helper function for colored console output
function log(message, color = 'white') {
  console.log(colors[color](message));
}

// Sample property data generator
function generatePropertyData(id, index) {
  return {
    _id: new ObjectId(id),
    title: `Test Property ${index + 1} for MongoDB ID Lookup`,
    description: `This is a test property with MongoDB ID ${id} created for testing the MongoDB ID lookup fix.`,
    price: 250000 + (index * 50000),
    address: {
      street: `${123 + index} Main Street`,
      city: 'Test City',
      state: 'Test State',
      zipcode: `1000${index}`,
      country: 'Test Country'
    },
    propertyType: index % 2 === 0 ? 'house' : 'apartment',
    bedrooms: 2 + index,
    bathrooms: 1 + index,
    area: 1000 + (index * 200),
    features: [
      'Test Feature 1',
      'Test Feature 2',
      'MongoDB ID Lookup Test'
    ],
    images: [
      {
        url: 'https://via.placeholder.com/800x600.png?text=Test+Property+Image',
        alt: `Test Property ${index + 1} Image`
      }
    ],
    status: 'active',
    isVerified: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: new ObjectId('60d0fe4f5311236168a109ca'), // A placeholder user ID
    location: {
      type: 'Point',
      coordinates: [38.7578 + (index * 0.1), 9.0289 + (index * 0.1)]
    }
  };
}

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    log('\nConnecting to MongoDB...', 'cyan');
    const client = new MongoClient(config.mongoUri);
    await client.connect();
    log('✓ MongoDB connection successful', 'green');
    return client;
  } catch (error) {
    log(`✗ MongoDB connection error: ${error.message}`, 'red');
    throw error;
  }
}

// Create test properties with specific IDs
async function createTestProperties(client) {
  const db = client.db();
  const propertyCollection = db.collection('properties');
  
  log('\nCreating test properties with specific MongoDB IDs...', 'cyan');
  
  // Check if properties already exist with these IDs
  const existingDocs = await propertyCollection.find({
    _id: { $in: config.propertyIds.map(id => new ObjectId(id)) }
  }).toArray();
  
  const existingIds = existingDocs.map(doc => doc._id.toString());
  log(`Found ${existingIds.length} existing test properties`, 'yellow');
  
  // Create promises for inserting missing properties
  const insertPromises = [];
  
  for (let i = 0; i < config.propertyIds.length; i++) {
    const id = config.propertyIds[i];
    
    if (existingIds.includes(id)) {
      log(`Property with ID ${id} already exists, updating...`, 'yellow');
      
      // Update existing property
      await propertyCollection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: {
            ...generatePropertyData(id, i),
            updatedAt: new Date() 
          }
        }
      );
      
      log(`✓ Updated property with ID ${id}`, 'green');
    } else {
      log(`Creating new property with ID ${id}...`, 'cyan');
      
      // Insert new property with specific ID
      insertPromises.push(
        propertyCollection.insertOne(generatePropertyData(id, i))
      );
    }
  }
  
  // Execute all insert operations
  if (insertPromises.length > 0) {
    await Promise.all(insertPromises);
    log(`✓ Created ${insertPromises.length} new test properties`, 'green');
  }
  
  // Verify all properties exist
  const finalDocs = await propertyCollection.find({
    _id: { $in: config.propertyIds.map(id => new ObjectId(id)) }
  }).toArray();
  
  return finalDocs;
}

// Verify test user exists or create one
async function verifyTestUser(client) {
  const db = client.db();
  const userCollection = db.collection('users');
  
  log('\nVerifying test user exists...', 'cyan');
  
  // Check if test user exists
  const testUserId = '60d0fe4f5311236168a109ca';
  const testUser = await userCollection.findOne({ _id: new ObjectId(testUserId) });
  
  if (testUser) {
    log(`✓ Test user found with ID ${testUserId}`, 'green');
    return testUser;
  }
  
  // Create test user if not found
  log('Creating new test user...', 'yellow');
  
  const newUser = {
    _id: new ObjectId(testUserId),
    name: 'Test User',
    email: 'test.user@example.com',
    password: '$2a$10$X/GR.MpdUBEZrMsP6F4D0OVFMgTUmCUJK8Fv73gzTxHj4BMMIF6WW', // hashed 'password123'
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await userCollection.insertOne(newUser);
  log(`✓ Created test user with ID ${testUserId}`, 'green');
  
  return newUser;
}

// Main function
async function main() {
  let client;
  
  try {
    log('\n=======================================================', 'magenta');
    log('   Seed Test Property Data for MongoDB ID Lookup Fix', 'magenta');
    log('=======================================================\n', 'magenta');
    
    // Connect to MongoDB
    client = await connectToMongoDB();
    
    // Verify test user exists
    await verifyTestUser(client);
    
    // Create test properties
    const properties = await createTestProperties(client);
    
    log('\n=== Summary ===', 'cyan');
    log(`✓ Total test properties: ${properties.length}`, 'green');
    
    for (const property of properties) {
      log(`  - ID: ${property._id.toString()} (${property.title})`, 'green');
    }
    
    log('\n✓ Database seeding completed successfully!', 'green');
    log('You can now run the application with the MongoDB ID lookup fix to test it.', 'cyan');
    log('Use the script: start-app-with-mongo-id-fix.bat\n', 'cyan');
    
  } catch (error) {
    log(`\n✗ Error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      log('MongoDB connection closed.', 'cyan');
    }
  }
}

// Run the script
main();
