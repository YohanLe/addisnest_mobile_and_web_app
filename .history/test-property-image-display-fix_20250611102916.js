/**
 * Test script to verify the property image display fix in account management
 * This script:
 * 1. Makes sure a property with images exists in the database
 * 2. Updates the local storage with a reference to that property
 * 3. Opens the account management page to visually confirm the fix
 */

const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Use environment variables or defaults
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/addisnest';
const PORT = process.env.PORT || 5173;

// Sample property data with image paths
const sampleProperty = {
  title: "Image Test Property",
  description: "Property created to test image display in account management",
  price: 5000000,
  offeringType: "For Sale",
  propertyType: "House",
  status: "active",
  bedrooms: 3,
  bathrooms: 2,
  area: 180,
  address: {
    street: "Test Address, Addis Ababa",
    city: "Addis Ababa",
    state: "Addis Ababa City Administration",
    country: "Ethiopia"
  },
  media_paths: [
    {
      url: "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg",
      caption: "Test Property Main Image",
      _id: "img-" + Date.now() + "-main"
    },
    {
      url: "/uploads/1749428932303-180111256-731631728_0.jpg",
      caption: "Test Property Second Image",
      _id: "img-" + Date.now() + "-second"
    }
  ],
  images: [
    {
      url: "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg",
      caption: "Test Property Main Image",
      _id: "img-" + Date.now() + "-main-img"
    },
    {
      url: "/uploads/1749428932303-180111256-731631728_0.jpg",
      caption: "Test Property Second Image",
      _id: "img-" + Date.now() + "-second-img"
    }
  ],
  createdAt: new Date()
};

async function run() {
  console.log('\n===========================================');
  console.log('  🏠 Property Image Display Fix Tester  🏠');
  console.log('===========================================\n');

  try {
    // Connect to MongoDB
    console.log(`Connecting to MongoDB: ${MONGODB_URI}`);
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('MongoDB connected successfully');

    const db = client.db();
    const properties = db.collection('properties');

    // Check if we already have a test property
    console.log('Checking for existing test properties...');
    const existingProperty = await properties.findOne({ title: "Image Test Property" });

    let propertyId;
    let property;

    if (existingProperty) {
      console.log('Found existing test property, using it for the test');
      propertyId = existingProperty._id;
      property = existingProperty;

      // Update the existing property with our image paths to ensure they're correct
      await properties.updateOne(
        { _id: propertyId },
        { 
          $set: { 
            media_paths: sampleProperty.media_paths,
            images: sampleProperty.images
          } 
        }
      );
      console.log('Updated test property with current image paths');
    } else {
      // Create a new test property
      console.log('Creating new test property with images...');
      const result = await properties.insertOne(sampleProperty);
      propertyId = result.insertedId;
      property = sampleProperty;
      property._id = propertyId;
      console.log(`Created new test property with ID: ${propertyId}`);
    }

    // Save property to localStorage for the frontend to use
    // We'll use a temporary HTML file to set localStorage and redirect
    console.log('Creating localStorage setup page...');
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Setting up test property...</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .container {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
          }
          h2 {
            color: #4a6cf7;
          }
          .progress {
            margin: 20px 0;
            height: 10px;
            background-color: #e0e0e0;
            border-radius: 5px;
            overflow: hidden;
          }
          .progress-bar {
            height: 100%;
            width: 0%;
            background-color: #4a6cf7;
            animation: progress 2s ease-in-out forwards;
          }
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
          .details {
            text-align: left;
            margin-top: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Setting Up Test Property</h2>
          <p>Configuring localStorage and preparing to verify image display...</p>
          
          <div class="progress">
            <div class="progress-bar"></div>
          </div>
          
          <div class="details">
            <p><strong>Property ID:</strong> ${propertyId}</p>
            <p><strong>Title:</strong> ${property.title}</p>
            <p><strong>Images:</strong> ${property.images.length} images configured</p>
          </div>
        </div>

        <script>
          // Store the property in multiple localStorage keys for redundancy
          const property = ${JSON.stringify(property)};
          localStorage.setItem('propertyListings', JSON.stringify([property]));
          localStorage.setItem('property_listings', JSON.stringify([property]));
          localStorage.setItem('test_property', JSON.stringify(property));
          
          // Mock user authentication (required to view account management)
          localStorage.setItem('access_token', 'test-token-for-image-display-test');
          localStorage.setItem('user', JSON.stringify({
            _id: "test-user-123",
            email: "test@example.com",
            firstName: "Test",
            lastName: "User",
            role: "user"
          }));
          
          // Redirect to account management after 2 seconds
          setTimeout(() => {
            window.location.href = 'http://localhost:${PORT}/account-management';
          }, 2000);
        </script>
      </body>
      </html>
    `;

    // Write the HTML file
    const tempHtmlPath = path.join(__dirname, 'temp-setup-property.html');
    fs.writeFileSync(tempHtmlPath, html);
    console.log(`Created temporary HTML file: ${tempHtmlPath}`);

    // Instructions to manually open the HTML file
    console.log('\n===========================================');
    console.log('  MANUAL TEST INSTRUCTIONS');
    console.log('===========================================');
    console.log(`1. Open this file in your browser: ${tempHtmlPath}`);
    console.log('2. The file will automatically redirect you to the account management page');
    console.log('3. Verify that property images are now displaying correctly in the grid');
    console.log('4. The fix ensures image paths are properly formatted with leading slashes');
    console.log('\nTest setup complete. Please follow the instructions above to verify the fix.');
    
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
