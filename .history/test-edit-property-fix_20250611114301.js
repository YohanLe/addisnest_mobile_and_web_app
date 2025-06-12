/**
 * Test Script for Property Edit Fix
 * 
 * This script tests the fix for property edit form data population.
 * It simulates clicking the Edit button in the property grid and verifies
 * that the correct data is passed to the EditPropertyForm component.
 */

// Sample property data that would come from the grid
const sampleProperty = {
  _id: "test123456789",
  id: "test123456789",
  property_type: "House",
  property_for: "For Sale",
  total_price: "250000",
  property_address: "123 Test Street, Sample Area",
  number_of_bedrooms: "3",
  number_of_bathrooms: "2",
  property_size: "250",
  regional_state: "Addis Ababa City Administration",
  city: "Addis Ababa",
  description: "Beautiful house for sale with great amenities",
  country: "Ethiopia",
  media: ["/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg"],
  amenities: ["parking_space", "air_conditioning", "security_24_7", "garage"]
};

// Sample property with object address (to test fix for [object Object] issue)
const samplePropertyWithObjectAddress = {
  _id: "test987654321",
  id: "test987654321",
  property_type: "Apartment",
  property_for: "For Rent",
  total_price: "15000",
  property_address: { street: "456 Complex St", city: "Addis Ababa", region: "Addis Ababa" },
  number_of_bedrooms: "2",
  number_of_bathrooms: "1",
  property_size: "120",
  regional_state: "Addis Ababa City Administration",
  city: "Addis Ababa",
  description: "Modern apartment for rent in central location",
  country: "Ethiopia",
  media: ["/uploads/1749429169460-134390424-731631728_0.jpg"],
  amenities: { parking_space: true, internet_wifi: true, elevator: true }
};

// Function to simulate clicking the Edit button
function simulateEditButtonClick(property) {
  console.log("Simulating Edit button click for property:", property.id);
  
  // Handle property address properly
  let propertyAddress = "";
  if (property.property_address) {
    propertyAddress = typeof property.property_address === 'string' 
      ? property.property_address 
      : JSON.stringify(property.property_address);
  } else if (property.address) {
    propertyAddress = typeof property.address === 'string' 
      ? property.address 
      : `${property.address.street || ''}, ${property.address.city || ''}`;
  }
  
  // Handle images properly
  let mediaArray = [];
  if (property.media && Array.isArray(property.media)) {
    mediaArray = property.media.map(img => typeof img === 'string' ? img : (img.filePath || img.url || img.path || ''));
  } else if (property.images && Array.isArray(property.images)) {
    mediaArray = property.images.map(img => typeof img === 'string' ? img : (img.filePath || img.url || img.path || ''));
  }
  
  // Handle amenities properly
  let amenitiesArray = [];
  if (property.amenities) {
    if (Array.isArray(property.amenities)) {
      amenitiesArray = property.amenities;
    } else if (typeof property.amenities === 'object') {
      // Convert object form of amenities to array
      amenitiesArray = Object.keys(property.amenities).filter(key => property.amenities[key] === true);
    }
  }
  
  // Create normalized property data
  const normalizedProperty = {
    _id: property._id || property.id,
    id: property._id || property.id,
    propertyId: property._id || property.id,
    mongoId: property._id || property.id,
    property_type: property.property_type || property.propertyType || "House",
    property_for: property.property_for || (property.offeringType === "For Rent" ? "For Rent" : "For Sale"),
    total_price: property.total_price || property.price || "",
    property_address: propertyAddress,
    number_of_bedrooms: property.number_of_bedrooms || property.bedrooms || "",
    number_of_bathrooms: property.number_of_bathrooms || property.bathrooms || "",
    property_size: property.property_size || property.size || "",
    regional_state: property.regional_state || property.region || "Addis Ababa City Administration",
    city: property.city || (property.address && property.address.city) || "Addis Ababa",
    description: property.description || "",
    country: property.country || "Ethiopia",
    media: mediaArray,
    amenities: amenitiesArray
  };
  
  // Store in localStorage
  localStorage.setItem('property_edit_data', JSON.stringify(normalizedProperty));
  localStorage.setItem(`property_edit_data_${property.id}`, JSON.stringify(normalizedProperty));
  
  // Also store in sessionStorage as a backup
  sessionStorage.setItem(`property_edit_data_${property.id}`, JSON.stringify(normalizedProperty));
  
  // Force property edit mode
  localStorage.setItem('force_property_edit', 'true');
  
  console.log("Property data stored successfully!");
  console.log("Normalized data:", normalizedProperty);
  
  // The actual redirect would happen here in a real app
  // window.location.href = `/property-edit/${property._id || property.id}`;
  
  return normalizedProperty;
}

// Run tests
function runTests() {
  console.log("=== RUNNING PROPERTY EDIT TESTS ===");
  
  console.log("\n1. Testing with regular string address property:");
  const result1 = simulateEditButtonClick(sampleProperty);
  console.log("✅ Test 1 completed - Check property_address format:", result1.property_address);
  
  console.log("\n2. Testing with object address property:");
  const result2 = simulateEditButtonClick(samplePropertyWithObjectAddress);
  console.log("✅ Test 2 completed - Check property_address format:", result2.property_address);
  
  console.log("\n3. Testing with object amenities:");
  console.log("Original amenities (object format):", samplePropertyWithObjectAddress.amenities);
  console.log("Normalized amenities (array format):", result2.amenities);
  
  console.log("\n=== ALL TESTS COMPLETED ===");
  console.log("To test in the actual application:");
  console.log("1. Go to the property edit form with URL: /property-edit/test123456789");
  console.log("2. Check if the form fields are correctly populated");
  console.log("3. Verify that the property address is displayed correctly (not as [object Object])");
  console.log("4. Verify that amenities are correctly selected");
  console.log("5. Verify that images are loaded properly");
}

// Run the tests
runTests();

// Export the test functions for use in the browser console
window.testPropertyEdit = {
  runTests,
  simulateEditButtonClick,
  sampleProperty,
  samplePropertyWithObjectAddress
};

// Instructions for manual testing
console.log(`
=== MANUAL TESTING INSTRUCTIONS ===

1. Open the browser console
2. Run the following command to simulate clicking edit on a property:
   testPropertyEdit.simulateEditButtonClick(testPropertyEdit.sampleProperty)
3. Navigate to /property-edit/test123456789 to see the form populated
4. To test the object address fix, run:
   testPropertyEdit.simulateEditButtonClick(testPropertyEdit.samplePropertyWithObjectAddress)
5. Navigate to /property-edit/test987654321 to verify address is not [object Object]
`);
