/**
 * Property Data Seeding Script
 * 
 * This script creates sample property data and adds it directly to localStorage
 * to test our fixes without requiring a new property submission.
 * 
 * Run this script before visiting the property listings page.
 */

// Import required modules
const fs = require('fs');
const path = require('path');

// Generate realistic sample property data
const sampleProperties = [
  {
    id: "prop1-" + Date.now(),
    title: "Modern Apartment in City Center",
    property_address: "Bole Road, Addis Ababa",
    property_type: "Apartment",
    property_for: "For Rent",
    status: "ACTIVE",
    total_price: "15000",
    image: "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg",
    createdAt: new Date().toISOString(),
    bedrooms: 2,
    bathrooms: 1,
    area: 85
  },
  {
    id: "prop2-" + Date.now(),
    title: "Luxury Villa with Garden",
    property_address: "Bishoftu, Oromia",
    property_type: "Villa",
    property_for: "For Sale",
    status: "ACTIVE",
    total_price: "12500000",
    media_paths: ["/uploads/1749428932303-180111256-731631728_0.jpg"],
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    bedrooms: 4,
    bathrooms: 3,
    area: 350
  },
  {
    id: "prop3-" + Date.now(),
    title: "Commercial Office Space",
    address: {
      street: "Kazanchis Business District",
      city: "Addis Ababa"
    },
    propertyType: "Commercial",
    offeringType: "For Rent",
    status: "PENDING",
    price: "35000",
    images: [
      {
        url: "/uploads/test-property-image-1749260861596-438465535.jpg",
        caption: "Office Front"
      }
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    bedrooms: 0,
    bathrooms: 2,
    area: 150
  },
  {
    id: "prop4-" + Date.now(),
    title: "Land for Development",
    property_address: "Legetafo, Oromia Region",
    property_type: "Land",
    property_for: "For Sale",
    status: "ACTIVE",
    total_price: "6500000",
    images: [
      "/uploads/1749427436617-451971651-genMid.731631728_27_0.jpg",
      "/uploads/1749427440561-229959854-genMid.731631728_22_0.jpg"
    ],
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    area: 500
  },
  {
    id: "prop5-" + Date.now(),
    title: "Residential House with Yard",
    address: {
      street: "CMC Road",
      city: "Addis Ababa",
      state: "Addis Ababa"
    },
    propertyType: "House",
    offeringType: "For Sale",
    status: "SOLD",
    price: "8200000",
    images: [
      {
        url: "/uploads/1749427761735-723996293-genMid.731631728_27_0.jpg",
        caption: "House Front"
      },
      {
        url: "/uploads/1749427766262-487266227-731631728_18_0.jpg",
        caption: "Backyard"
      }
    ],
    createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    bedrooms: 3,
    bathrooms: 2,
    area: 200
  }
];

// Verify images exist
function checkImagesExist() {
  console.log("\n===== CHECKING IF SAMPLE IMAGES EXIST =====\n");
  
  const imagePaths = [
    "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg",
    "/uploads/1749428932303-180111256-731631728_0.jpg",
    "/uploads/test-property-image-1749260861596-438465535.jpg",
    "/uploads/1749427436617-451971651-genMid.731631728_27_0.jpg",
    "/uploads/1749427440561-229959854-genMid.731631728_22_0.jpg",
    "/uploads/1749427761735-723996293-genMid.731631728_27_0.jpg",
    "/uploads/1749427766262-487266227-731631728_18_0.jpg"
  ];
  
  let allImagesExist = true;
  
  imagePaths.forEach(imagePath => {
    const relativePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    const localPath = path.resolve(__dirname, relativePath);
    const parentPath = path.resolve(__dirname, '..', relativePath);
    
    if (fs.existsSync(localPath)) {
      console.log(`✅ Image exists: ${imagePath}`);
    } else if (fs.existsSync(parentPath)) {
      console.log(`✅ Image exists: ${imagePath}`);
    } else {
      console.log(`❌ Image not found: ${imagePath}`);
      allImagesExist = false;
    }
  });
  
  return allImagesExist;
}

// Generate the localStorage data
function generateLocalStorageCommands() {
  const imagesExist = checkImagesExist();
  if (!imagesExist) {
    console.log("\n⚠️ WARNING: Some images were not found. The properties might display without images.");
  }
  
  console.log("\n===== COPY AND PASTE THESE COMMANDS INTO YOUR BROWSER CONSOLE =====\n");
  
  // Create localStorage command for propertyListings (PropertyAlert format)
  console.log(`// Clear existing data first`);
  console.log(`localStorage.removeItem('propertyListings');`);
  console.log(`localStorage.removeItem('property_listings');`);
  console.log(`localStorage.removeItem('property_edit_data');`);
  console.log();
  
  // Set the sample properties in localStorage
  console.log(`// Set sample properties in propertyListings (PropertyAlert format)`);
  console.log(`localStorage.setItem('propertyListings', '${JSON.stringify(sampleProperties)}');`);
  
  console.log();
  console.log(`console.log("✅ Sample property data has been added to localStorage.")`);
  console.log(`console.log("🔄 Now refresh the property listings page to see the data.")`);
  
  console.log("\n===== END OF COMMANDS =====\n");
  
  // Also write to an HTML file for easy running in browser
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Property Data Seeder</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1 {
      color: #2c3e50;
    }
    button {
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 20px;
    }
    button:hover {
      background-color: #45a049;
    }
    .success {
      color: green;
      font-weight: bold;
    }
    .error {
      color: red;
      font-weight: bold;
    }
    pre {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <h1>Property Data Seeder</h1>
  <p>This tool will add sample property data to your browser's localStorage.</p>
  <p>After adding the data, refresh your property listings page to see the properties.</p>
  
  <button id="seedData">Seed Property Data</button>
  <button id="clearData" style="background-color: #f44336; margin-left: 10px;">Clear Property Data</button>
  
  <div id="status" style="margin-top: 20px;"></div>
  
  <h3>Sample Properties:</h3>
  <pre id="sampleData">${JSON.stringify(sampleProperties, null, 2)}</pre>
  
  <script>
    // Sample property data
    const sampleProperties = ${JSON.stringify(sampleProperties)};
    
    document.getElementById('seedData').addEventListener('click', function() {
      try {
        // Clear existing data first
        localStorage.removeItem('propertyListings');
        localStorage.removeItem('property_listings');
        localStorage.removeItem('property_edit_data');
        
        // Set the sample properties in localStorage
        localStorage.setItem('propertyListings', JSON.stringify(sampleProperties));
        
        document.getElementById('status').innerHTML = '<p class="success">✅ Sample property data has been added to localStorage.</p>' +
          '<p>🔄 Now <a href="/account-management" target="_blank">open the property listings page</a> to see the data.</p>';
      } catch (error) {
        document.getElementById('status').innerHTML = '<p class="error">❌ Error: ' + error.message + '</p>';
      }
    });
    
    document.getElementById('clearData').addEventListener('click', function() {
      try {
        // Clear existing data
        localStorage.removeItem('propertyListings');
        localStorage.removeItem('property_listings');
        localStorage.removeItem('property_edit_data');
        
        document.getElementById('status').innerHTML = '<p class="success">✅ Property data has been cleared from localStorage.</p>';
      } catch (error) {
        document.getElementById('status').innerHTML = '<p class="error">❌ Error: ' + error.message + '</p>';
      }
    });
  </script>
</body>
</html>
  `;
  
  try {
    fs.writeFileSync('seed-property-data.html', htmlContent);
    console.log("HTML file created: seed-property-data.html");
    console.log("Open this file in your browser to easily add sample property data.");
  } catch (error) {
    console.error("Error writing HTML file:", error);
  }
}

// Run the script
console.log("=== PROPERTY DATA SEEDING SCRIPT ===");
console.log("This script generates sample property data and commands to add it to your browser's localStorage.");
generateLocalStorageCommands();
