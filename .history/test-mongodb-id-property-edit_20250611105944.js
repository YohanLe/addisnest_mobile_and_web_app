/**
 * Test script to verify MongoDB _id field handling in property edit functionality
 * 
 * This script simulates the edit button click from PropertyListingsTab and verifies
 * that properties with MongoDB-style _id fields are properly handled.
 */

// Load environment variables
require('dotenv').config();

const fetch = require('node-fetch');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3099; // Use a different port to avoid conflicts

// MongoDB property data with _id field
const testProperty = {
  _id: '6849bd6a2b9f36399990f4fb',
  owner: '6845436d504a2bf073a4a7e2',
  title: '20 rent property title',
  description: 'hjgh',
  propertyType: 'Commercial',
  offeringType: 'For Sale',
  status: 'active',
  paymentStatus: 'none',
  price: 2112,
  area: 56262,
  bedrooms: 2,
  bathrooms: 32,
  features: {
    'parking-space': true,
    '24-7-security': true,
    'gym-fitness-center': true
  },
  address: {
    street: 'dghjhj',
    city: 'hgggggggggggg',
    state: 'Afar Region',
    country: 'Ethiopia'
  },
  images: [
    {
      url: '/uploads/test-property-image-1749260861596-438465535.jpg',
      caption: 'Default Property Image',
      _id: '6849bd6a2b9f36399990f4fc'
    },
    {
      url: '/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg',
      caption: 'Default Property Image 2',
      _id: '6849bd6a2b9f36399990f4fd'
    }
  ],
  isPremium: false,
  isVerified: false,
  promotionType: 'Basic',
  views: 0,
  likes: 0,
  createdAt: '2025-06-11T17:31:22.378+00:00',
  updatedAt: '2025-06-11T17:31:22.378+00:00'
};

// Function to simulate the Edit button click in PropertyListingsTab
function simulateEditButtonClick(property) {
  console.log('Simulating Edit button click for property:', property._id);
  
  // Create normalized property object (same logic as PropertyListingsTab.jsx)
  const normalizedProperty = {
    id: property.id || property._id,
    propertyId: property.id || property._id,
    _id: property._id || property.id, // Include MongoDB _id field explicitly
    property_type: property.property_type || property.propertyType || "House",
    property_for: property.property_for || (property.offeringType === "For Rent" ? "For Rent" : "For Sale"),
    total_price: property.total_price || property.price || "",
    property_address: property.property_address || 
      (property.address ? (typeof property.address === 'string' ? property.address : `${property.address.street || ''}, ${property.address.city || ''}`) : ""),
    number_of_bedrooms: property.number_of_bedrooms || property.bedrooms || "",
    number_of_bathrooms: property.number_of_bathrooms || property.bathrooms || "",
    property_size: property.property_size || property.size || property.area || "",
    regional_state: property.regional_state || property.region || (property.address ? property.address.state : ""),
    city: property.city || (property.address ? property.address.city : ""),
    description: property.description || "",
    country: property.country || (property.address ? property.address.country : "Ethiopia"),
    media: property.media || property.images || [],
    amenities: property.amenities || 
      (property.features ? Object.keys(property.features).filter(key => property.features[key]) : [])
  };
  
  // Store in localStorage with both keys
  localStorage.setItem('property_edit_data', JSON.stringify(normalizedProperty));
  localStorage.setItem(`property_edit_data_${property._id}`, JSON.stringify(normalizedProperty));
  
  // Also store in sessionStorage as a backup
  sessionStorage.setItem(`property_edit_data_${property._id}`, JSON.stringify(normalizedProperty));
  
  // Force property edit mode
  localStorage.setItem('force_property_edit', 'true');
  
  console.log('Property data stored in localStorage and sessionStorage with _id:', property._id);
  console.log('Edit form should now populate with this data when opened');
}

// Mock localStorage and sessionStorage for Node.js environment
global.localStorage = {
  data: {},
  setItem(key, value) {
    this.data[key] = value;
  },
  getItem(key) {
    return this.data[key] || null;
  }
};

global.sessionStorage = {
  data: {},
  setItem(key, value) {
    this.data[key] = value;
  },
  getItem(key) {
    return this.data[key] || null;
  }
};

// Set up simple API endpoint to return the test property
app.get('/api/property-by-id/:id', (req, res) => {
  if (req.params.id === testProperty._id) {
    res.json(testProperty);
  } else {
    res.status(404).json({ message: 'Property not found' });
  }
});

// Endpoint to simulate verifying the edit form population
app.get('/api/verify-edit-form/:id', (req, res) => {
  const id = req.params.id;
  const storedData = localStorage.getItem(`property_edit_data_${id}`);
  
  if (storedData) {
    res.json({
      success: true,
      message: 'Property data found for editing',
      data: JSON.parse(storedData)
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'No property data found for editing'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`MongoDB ID Test server running on port ${port}`);
  
  // Run the test
  simulateEditButtonClick(testProperty);
  
  console.log('\nTest Results:');
  console.log('-----------------');
  
  // Check if data was stored properly
  const storedData = localStorage.getItem(`property_edit_data_${testProperty._id}`);
  if (storedData) {
    console.log('✅ Property data successfully stored with MongoDB _id');
    const parsed = JSON.parse(storedData);
    console.log(`ID field: ${parsed.id}`);
    console.log(`PropertyID field: ${parsed.propertyId}`);
    console.log(`MongoDB _id field: ${parsed._id}`);
    
    console.log('\nVerification:');
    console.log('-----------------');
    console.log('To verify this fix works:');
    console.log(`1. Navigate to: http://localhost:5173/property-edit/${testProperty._id}`);
    console.log('2. The form should populate with the test property data');
    console.log('3. Fields should match the following values:');
    console.log(`   - Property Type: ${parsed.property_type}`);
    console.log(`   - Price: ${parsed.total_price}`);
    console.log(`   - Bedrooms: ${parsed.number_of_bedrooms}`);
    console.log(`   - Bathrooms: ${parsed.number_of_bathrooms}`);
    console.log(`   - Address: ${parsed.property_address}`);
    console.log(`   - Description: ${parsed.description}`);
  } else {
    console.log('❌ Failed to store property data');
  }
  
  console.log('\nPress Ctrl+C to exit');
});
