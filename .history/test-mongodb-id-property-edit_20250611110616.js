/**
 * MongoDB ID Property Edit Test
 * 
 * This script tests the MongoDB ID property edit functionality by:
 * 1. Creating a test property with MongoDB-style _id
 * 2. Simulating an edit button click by storing it in localStorage
 * 3. Verifying that the edit form correctly populates with the test data
 */

console.log('========================================');
console.log('MongoDB ID Property Edit Test');
console.log('========================================');

// Mock MongoDB ID format property (using standard 24-character hex ObjectId format)
const mongoProperty = {
    _id: "6849bd6a2b9f36399990f4fb", // Example MongoDB ObjectId format
    id: "6849bd6a2b9f36399990f4fb", // Same as _id for consistency
    propertyId: "6849bd6a2b9f36399990f4fb", // Same as _id for consistency
    property_type: "House",
    property_for: "For Sale",
    total_price: "25000000",
    property_address: "123 MongoDB Street, Addis Ababa",
    number_of_bedrooms: "4",
    number_of_bathrooms: "3",
    property_size: "350",
    status: "ACTIVE",
    regional_state: "Addis Ababa City Administration",
    city: "Addis Ababa",
    country: "Ethiopia",
    description: "This is a test property with MongoDB ObjectId format for testing edit functionality.",
    media: ["/uploads/test-property-image-1749358937909-554283885.jpg"],
    amenities: ["parking_space", "garden_yard", "security_24_7", "gym_fitness"],
    createdAt: new Date().toISOString()
};

// Set force_property_edit flag to ensure EditPropertyForm uses our data
localStorage.setItem('force_property_edit', 'true');

// Store the property data with multiple keys to ensure it's found
console.log('Storing property data with MongoDB _id in localStorage...');

// Store with property_edit_data key (main key used by EditPropertyForm)
localStorage.setItem('property_edit_data', JSON.stringify(mongoProperty));

// Store with property_edit_data_{id} key (used for specific property lookups)
localStorage.setItem(`property_edit_data_${mongoProperty._id}`, JSON.stringify(mongoProperty));

// Also store in sessionStorage as a backup
sessionStorage.setItem(`property_edit_data_${mongoProperty._id}`, JSON.stringify(mongoProperty));

// Create a special key for edit clicks from PropertyListingsTab
localStorage.setItem('property_being_edited', JSON.stringify(mongoProperty));

console.log(`
✅ Test setup complete!

To test the MongoDB ID property edit functionality:
1. Start the backend server with: node src/server.js
2. Start the frontend with: cd src && npm run dev
3. Navigate to: http://localhost:5173/property-edit/${mongoProperty._id}
4. The form should be populated with the test property data

Expected data in form:
- Property Type: House
- Property For: For Sale
- Price: 25000000
- Bedrooms: 4
- Bathrooms: 3
- Address: 123 MongoDB Street, Addis Ababa

The MongoDB ID being used is: ${mongoProperty._id}
`);
