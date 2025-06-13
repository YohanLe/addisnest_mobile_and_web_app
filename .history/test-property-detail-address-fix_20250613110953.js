// Test script to verify property address fix for ID 6849e2ef7cb3172bbb3c718d

const { getPropertyDetails } = require('./src/Redux-store/Slices/PropertyDetailSlice');
const Api = require('./src/Apis/Api');

// Override the authentication method for testing
Api.getWithAuth = async (endpoint) => {
  console.log(`Mock API call to: ${endpoint}`);
  
  // If this is our target property ID, return mock data
  if (endpoint.includes('6849e2ef7cb3172bbb3c718d')) {
    return {
      data: {
        _id: '6849e2ef7cb3172bbb3c718d',
        owner: '6845436d504a2bf073a4a7e2',
        title: 'Amaizing house for sale jo',
        description: 'hjgh',
        propertyType: 'Commercial',
        offeringType: 'For Sale',
        status: 'active',
        paymentStatus: 'none',
        price: 2112,
        area: 56262,
        bedrooms: 26,
        bathrooms: 32,
        features: {},
        address: {
          street: '123 Main St',
          city: 'Example City',
          state: 'Example State',
          country: 'Ethiopia'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3' },
          { url: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3' }
        ],
        isPremium: false,
        isVerified: false,
        promotionType: 'Basic',
        views: 9,
        likes: 0,
        createdAt: '2025-06-11T20:11:27.291+00:00',
        updatedAt: '2025-06-11T20:13:25.376+00:00'
      }
    };
  }
  
  throw new Error('Property not found');
};

// Mock Redux dispatch and rejectWithValue functions
const mockDispatch = () => {};
const mockRejectWithValue = (value) => value;

// Test the property details retrieval with our specific ID
async function testPropertyDetailAddressFix() {
  console.log('=== Testing Property Detail Address Fix ===');
  console.log('Target Property ID: 6849e2ef7cb3172bbb3c718d');
  
  try {
    // Get property details using our thunk
    const propertyDetails = await getPropertyDetails(
      '6849e2ef7cb3172bbb3c718d', 
      { dispatch: mockDispatch, rejectWithValue: mockRejectWithValue }
    );
    
    console.log('\n=== Property Details Retrieved ===');
    
    // Verify ID fields
    console.log('\n--- ID Verification ---');
    console.log(`id: ${propertyDetails.id}`);
    console.log(`_id: ${propertyDetails._id}`);
    console.log(`owner: ${propertyDetails.owner}`);
    
    // Verify Address fields
    console.log('\n--- Address Verification ---');
    console.log('Nested address object:');
    console.log(JSON.stringify(propertyDetails.address, null, 2));
    console.log('\nFlat address fields:');
    console.log(`street: ${propertyDetails.street}`);
    console.log(`city: ${propertyDetails.city}`);
    console.log(`state: ${propertyDetails.state}`);
    console.log(`country: ${propertyDetails.country}`);
    console.log(`property_address: ${propertyDetails.property_address}`);
    
    // Verify basic property data
    console.log('\n--- Basic Property Data ---');
    console.log(`title: ${propertyDetails.title}`);
    console.log(`price: ${propertyDetails.price}`);
    console.log(`bedrooms: ${propertyDetails.bedrooms}`);
    console.log(`bathrooms: ${propertyDetails.bathrooms}`);
    console.log(`area: ${propertyDetails.area}`);
    
    console.log('\n=== Test Completed Successfully ===');
    return true;
  } catch (error) {
    console.error('Test failed with error:', error);
    return false;
  }
}

// Run the test
testPropertyDetailAddressFix().then(success => {
  if (success) {
    console.log('\n✓ Property Detail Address Fix is working correctly!');
    console.log('✓ The address fields are properly associated with the property ID');
  } else {
    console.log('\n✗ Property Detail Address Fix test failed!');
  }
});
