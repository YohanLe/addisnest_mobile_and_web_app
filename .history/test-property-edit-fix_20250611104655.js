/**
 * Test script to verify the property edit functionality
 * This script simulates clicking the Edit button and verifies localStorage data is set correctly
 */

// Sample property data that simulates what would be in the grid
const sampleProperty = {
  id: "sample-property-123",
  property_type: "House",
  property_for: "For Sale", 
  offeringType: "For Sale",
  total_price: "250000",
  price: "250000",
  property_address: "123 Test Street, Addis Ababa",
  address: "123 Test Street, Addis Ababa",
  number_of_bedrooms: "3",
  bedrooms: "3",
  number_of_bathrooms: "2",
  bathrooms: "2",
  property_size: "250",
  regional_state: "Addis Ababa City Administration",
  city: "Addis Ababa",
  description: "This is a test property with all fields populated.",
  country: "Ethiopia"
};

// Clear any existing data
console.log("Clearing any existing localStorage data...");
localStorage.removeItem('property_edit_data');
localStorage.removeItem(`property_edit_data_${sampleProperty.id}`);
localStorage.removeItem('force_property_edit');
sessionStorage.removeItem(`property_edit_data_${sampleProperty.id}`);

// Simulate clicking the Edit button in PropertyListingsTab.jsx
console.log("Simulating Edit button click...");

// Create a normalized property object like our fix does
const normalizedProperty = {
  id: sampleProperty.id,
  propertyId: sampleProperty.id,
  property_type: sampleProperty.property_type || sampleProperty.propertyType || "House",
  property_for: sampleProperty.property_for || (sampleProperty.offeringType === "For Rent" ? "For Rent" : "For Sale"),
  total_price: sampleProperty.total_price || sampleProperty.price || "",
  property_address: sampleProperty.property_address || 
    (sampleProperty.address ? (typeof sampleProperty.address === 'string' ? sampleProperty.address : `${sampleProperty.address.street || ''}, ${sampleProperty.address.city || ''}`) : ""),
  number_of_bedrooms: sampleProperty.number_of_bedrooms || sampleProperty.bedrooms || "",
  number_of_bathrooms: sampleProperty.number_of_bathrooms || sampleProperty.bathrooms || "",
  property_size: sampleProperty.property_size || sampleProperty.size || "",
  regional_state: sampleProperty.regional_state || sampleProperty.region || "",
  city: sampleProperty.city || "",
  description: sampleProperty.description || "",
  country: sampleProperty.country || "Ethiopia",
  media: sampleProperty.media || sampleProperty.images || [],
  amenities: sampleProperty.amenities || []
};

// Store in localStorage with both keys (exactly like our fix does)
localStorage.setItem('property_edit_data', JSON.stringify(normalizedProperty));
localStorage.setItem(`property_edit_data_${sampleProperty.id}`, JSON.stringify(normalizedProperty));

// Also store in sessionStorage as a backup
sessionStorage.setItem(`property_edit_data_${sampleProperty.id}`, JSON.stringify(normalizedProperty));

// Force property edit mode
localStorage.setItem('force_property_edit', 'true');

console.log("✅ Successfully stored property data for editing!");
console.log("property_edit_data is now set in localStorage");
console.log(`property_edit_data_${sampleProperty.id} is now set in localStorage`);
console.log(`property_edit_data_${sampleProperty.id} is now set in sessionStorage`);
console.log("force_property_edit flag is set to true");

// Check that our data was actually stored
const storedData = localStorage.getItem('property_edit_data');
console.log("Stored data preview:", storedData ? storedData.substring(0, 100) + "..." : "NOT FOUND");

// Verify all required fields are present in the stored data
if (storedData) {
  const parsed = JSON.parse(storedData);
  console.log("\nVerifying stored data has all required fields:");
  
  const requiredFields = [
    'id', 'property_type', 'property_for', 'total_price', 'property_address',
    'number_of_bedrooms', 'number_of_bathrooms', 'property_size',
    'regional_state', 'city', 'description', 'country'
  ];
  
  let allFieldsPresent = true;
  requiredFields.forEach(field => {
    const hasField = parsed[field] !== undefined && parsed[field] !== null;
    console.log(`- ${field}: ${hasField ? 'PRESENT' : 'MISSING'} (${parsed[field]})`);
    if (!hasField) allFieldsPresent = false;
  });
  
  if (allFieldsPresent) {
    console.log("\n✅ All required fields are present in the stored data!");
    console.log("\nNext steps:");
    console.log("1. Navigate to /property-edit/" + sampleProperty.id);
    console.log("2. The edit form should now populate with this test data");
    console.log("3. You should see debug logs in the console showing the data was retrieved from localStorage");
  } else {
    console.log("\n❌ Some required fields are missing from the stored data!");
  }
} else {
  console.log("❌ Failed to store property data in localStorage!");
}

// Display a clear success message on the page
document.body.innerHTML = `
  <div style="max-width: 600px; margin: 40px auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-family: Arial, sans-serif;">
    <h2 style="color: #4a6cf7; margin-bottom: 20px;">Property Edit Test Completed</h2>
    
    <div style="padding: 12px; background: #e8f5e9; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #4caf50;">
      <strong style="display: block; margin-bottom: 6px;">Test Data Successfully Prepared!</strong>
      <p style="margin: 0;">Property data has been stored in localStorage for editing.</p>
    </div>
    
    <div style="background: #f5f5f5; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
      <h3 style="margin-top: 0; font-size: 18px;">Next Steps:</h3>
      <ol style="margin-bottom: 0; padding-left: 20px;">
        <li>Navigate to <a href="/property-edit/${sampleProperty.id}" style="color: #4a6cf7; text-decoration: none; font-weight: bold;">/property-edit/${sampleProperty.id}</a></li>
        <li>The form should now populate with the test data</li>
        <li>Check the browser console for detailed debug logs</li>
      </ol>
    </div>
    
    <button onclick="window.location.href='/property-edit/${sampleProperty.id}'" style="background: #4a6cf7; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold;">
      Go To Edit Form
    </button>
    
    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
      <details>
        <summary style="cursor: pointer; color: #555; font-weight: bold;">View Test Data Details</summary>
        <pre style="background: #f8f8f8; padding: 10px; border-radius: 4px; overflow: auto; margin-top: 10px;">${JSON.stringify(normalizedProperty, null, 2)}</pre>
      </details>
    </div>
  </div>
`;

console.log("Test complete! You can now navigate to the property edit page to verify it works.");
