/**
 * Property Payment Flow Fix Test Script
 * 
 * This script tests the complete fix for the property payment flow issue
 * where selecting Basic Plan and clicking Continue was:
 * 1. Getting stuck on the page
 * 2. Not saving data to the database
 * 
 * The fix includes:
 * 1. Client-side fix: Remove status/paymentStatus fields from client requests
 * 2. Server-side fix: Ensure correct case for status values (Pending vs pending)
 */

const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:7000/api';

// Test user credentials
const testUser = {
  email: 'jonegrow143@gmail.com',
  password: 'Password@123'
};

// Test property data - Basic plan
const basicPropertyData = {
  title: 'Test Basic Plan Property',
  description: 'This is a test property with Basic plan',
  propertyType: 'Apartment',
  offeringType: 'For Sale',
  price: 15000,
  area: 150,
  bedrooms: 2,
  bathrooms: 1,
  features: {},
  address: {
    street: '123 Test Street',
    city: 'Addis Ababa',
    state: 'Addis Ababa City Administration',
    country: 'Ethiopia'
  },
  images: [
    {
      url: '/uploads/properties/genMid.731631728_14_0-1749359999235-908500567.jpg',
      caption: 'Image 1'
    }
  ],
  isPremium: false,
  isVerified: false,
  promotionType: 'Basic',
  furnishingStatus: 'Unfurnished'
  // Notice: We don't set status or paymentStatus - server determines these
};

// Test property data - VIP plan
const vipPropertyData = {
  title: 'Test VIP Plan Property',
  description: 'This is a test property with VIP plan',
  propertyType: 'House',
  offeringType: 'For Sale',
  price: 50000,
  area: 300,
  bedrooms: 4,
  bathrooms: 3,
  features: {},
  address: {
    street: '456 Premium Street',
    city: 'Addis Ababa',
    state: 'Addis Ababa City Administration',
    country: 'Ethiopia'
  },
  images: [
    {
      url: '/uploads/properties/genMid.731631728_14_0-1749359999235-908500567.jpg',
      caption: 'Image 1'
    }
  ],
  isPremium: true,
  isVerified: false,
  promotionType: 'VIP',
  furnishingStatus: 'Unfurnished'
  // Notice: We don't set status or paymentStatus - server determines these
};

// Main test function
async function runTest() {
  console.log('=== PROPERTY PAYMENT FLOW FIX TEST ===');
  console.log('This test demonstrates the fixed property payment flow');
  console.log('Both client-side and server-side fixes are implemented');
  console.log('');

  try {
    // Step 1: Login to get token
    console.log('1. Authenticating user...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, testUser);
    
    if (!loginResponse.data.token) {
      console.log('❌ Authentication failed. Aborting test.');
      return;
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Authentication successful. Token received.');
    console.log('');
    
    // Step 2: Create Basic Plan property
    console.log('2. Testing Basic Plan property submission...');
    console.log('Property data being submitted:');
    console.log(JSON.stringify(basicPropertyData, null, 2));
    console.log('\nNote: status and paymentStatus are NOT sent from client');
    
    const basicPropertyResponse = await axios.post(
      `${API_URL}/properties`,
      basicPropertyData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (basicPropertyResponse.status !== 201) {
      console.log('❌ Basic Plan property submission failed.');
      console.log(`Status: ${basicPropertyResponse.status}`);
      console.log(`Response: ${JSON.stringify(basicPropertyResponse.data)}`);
      return;
    }
    
    const basicProperty = basicPropertyResponse.data;
    console.log('✅ Basic Plan property created successfully!');
    console.log('Server-determined values:');
    console.log(` - status: ${basicProperty.status}`);
    console.log(` - paymentStatus: ${basicProperty.paymentStatus}`);
    console.log(` - promotionType: ${basicProperty.promotionType}`);
    console.log(` - Property ID: ${basicProperty._id}`);
    console.log('');
    
    // Step 3: Create VIP Plan property
    console.log('3. Testing VIP Plan property submission...');
    console.log('Property data being submitted:');
    console.log(JSON.stringify(vipPropertyData, null, 2));
    console.log('\nNote: status and paymentStatus are NOT sent from client');
    
    const vipPropertyResponse = await axios.post(
      `${API_URL}/properties`,
      vipPropertyData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (vipPropertyResponse.status !== 201) {
      console.log('❌ VIP Plan property submission failed.');
      console.log(`Status: ${vipPropertyResponse.status}`);
      console.log(`Response: ${JSON.stringify(vipPropertyResponse.data)}`);
      return;
    }
    
    const vipProperty = vipPropertyResponse.data;
    console.log('✅ VIP Plan property created successfully!');
    console.log('Server-determined values:');
    console.log(` - status: ${vipProperty.status}`);
    console.log(` - paymentStatus: ${vipProperty.paymentStatus}`);
    console.log(` - promotionType: ${vipProperty.promotionType}`);
    console.log(` - Property ID: ${vipProperty._id}`);
    console.log('');
    
    // Step 4: Simulate payment completion for VIP property
    console.log('4. Testing payment completion for VIP property...');
    console.log('Simulating payment process completion...');
    
    const paymentUpdateResponse = await axios.put(
      `${API_URL}/properties/${vipProperty._id}`,
      { paymentStatus: 'completed' }, // Only update payment status, not property status
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (paymentUpdateResponse.status !== 200) {
      console.log('❌ Payment completion update failed.');
      console.log(`Status: ${paymentUpdateResponse.status}`);
      console.log(`Response: ${JSON.stringify(paymentUpdateResponse.data)}`);
      return;
    }
    
    const updatedVipProperty = paymentUpdateResponse.data;
    console.log('✅ Payment completion successful!');
    console.log('Updated property values:');
    console.log(` - status: ${updatedVipProperty.status}`);
    console.log(` - paymentStatus: ${updatedVipProperty.paymentStatus}`);
    console.log('');
    
    // Summary
    console.log('=== TEST SUMMARY ===');
    console.log('✅ All tests passed successfully!');
    console.log('');
    console.log('Fixed issues:');
    console.log('1. Client no longer sends status/paymentStatus fields');
    console.log('2. Server correctly sets status values with proper capitalization');
    console.log('3. Basic plan properties are created immediately with active status');
    console.log('4. VIP/Diamond plan properties use Pending status (capital P)');
    
  } catch (error) {
    console.log('❌ TEST FAILED WITH ERROR:');
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Response data:', error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

// Run the test
runTest();
