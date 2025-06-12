/**
 * Test script to verify property submission image handling
 * 
 * This script tests the fixed property submission flow by:
 * 1. Creating a property with default images (no custom _id fields)
 * 2. Submitting it to the API to ensure it's accepted
 */

const Api = require('./src/Apis/Api');

// Default fallback images (without custom _id fields)
const DEFAULT_IMAGES = [
  {
    url: "/uploads/test-property-image-1749260861596-438465535.jpg",
    caption: "Default Property Image"
  },
  {
    url: "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg", 
    caption: "Default Property Image 2"
  }
];

// Test property data
const testProperty = {
  title: "Test Property for Image Fix",
  description: "This is a test property to verify the image handling fix",
  propertyType: "House",
  offeringType: "For Sale",
  price: 5000000,
  area: 250,
  bedrooms: 3,
  bathrooms: 2,
  features: { "parking-space": true, "garage": true },
  address: {
    street: "Test Address",
    city: "Addis Ababa",
    state: "Addis Ababa City Administration",
    country: "Ethiopia"
  },
  images: DEFAULT_IMAGES,
  isPremium: false,
  isVerified: false,
  promotionType: "Basic",
  views: 0,
  likes: 0,
  furnishingStatus: "Unfurnished"
};

// Run the test
async function testPropertySubmission() {
  console.log('Starting property submission test with default images...');
  console.log('Using these default images:');
  console.log(JSON.stringify(DEFAULT_IMAGES, null, 2));
  
  try {
    console.log('Attempting to save property with the API...');
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      console.error('Authentication required. Please login first.');
      return;
    }
    
    const response = await Api.postWithtoken('properties', testProperty);
    
    console.log('Successfully saved property:');
    console.log(JSON.stringify(response, null, 2));
    console.log('✅ TEST PASSED: Property submission with default images works!');
    
    return response;
  } catch (error) {
    console.error('❌ TEST FAILED: Error submitting property:');
    console.error(error.message);
    if (error.response?.data) {
      console.error('Server response:', error.response.data);
    }
  }
}

// To run this test, execute in the browser console:
// testPropertySubmission()
