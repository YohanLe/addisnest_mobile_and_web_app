/**
 * Database Property Verification Script
 * 
 * This script helps check if database properties are being fetched correctly
 * and displays helpful debugging info to fix any issues.
 */

// Import required modules
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== DATABASE PROPERTY VERIFICATION ===');

// Check if API server is running
function checkServerStatus() {
  console.log('\nChecking server status...');
  
  try {
    // Try to ping the server
    const response = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/api/properties', { stdio: 'pipe' });
    console.log(`API server responded with status: ${response.toString()}`);
    return response.toString() !== '000';
  } catch (error) {
    console.log('Could not connect to API server. Make sure it\'s running.');
    return false;
  }
}

// Collect debugging info about the Redux setup
function checkReduxSetup() {
  console.log('\nChecking Redux setup...');
  
  const slicePath = path.resolve(__dirname, 'src/Redux-store/Slices/PropertyListSlice.js');
  
  if (fs.existsSync(slicePath)) {
    console.log('PropertyListSlice.js found at:', slicePath);
    
    try {
      const sliceContent = fs.readFileSync(slicePath, 'utf8');
      
      // Check if the file contains the necessary actions
      const hasGetPropertyList = sliceContent.includes('GetPropertyList');
      console.log('- GetPropertyList action exists:', hasGetPropertyList);
      
      // Check API endpoint being used
      const apiEndpointMatch = sliceContent.match(/url\s*:\s*['"]([^'"]+)['"]/);
      if (apiEndpointMatch) {
        console.log('- API endpoint:', apiEndpointMatch[1]);
      } else {
        console.log('- Could not determine API endpoint from slice');
      }
      
      return true;
    } catch (error) {
      console.log('Error reading PropertyListSlice.js:', error.message);
      return false;
    }
  } else {
    console.log('PropertyListSlice.js not found. Please check the Redux setup.');
    return false;
  }
}

// Check PropertyListingsTab component 
function checkPropertyListingsComponent() {
  console.log('\nChecking PropertyListingsTab component...');
  
  const componentPath = path.resolve(__dirname, 'src/components/account-management/sub-component/account-tab/PropertyListingsTab.jsx');
  
  if (fs.existsSync(componentPath)) {
    console.log('PropertyListingsTab.jsx found at:', componentPath);
    
    try {
      const componentContent = fs.readFileSync(componentPath, 'utf8');
      
      // Check if the component is fetching data correctly
      const hasFetchEffect = componentContent.includes('useEffect') && 
                            componentContent.includes('dispatch(GetPropertyList');
      console.log('- Fetch effect exists:', hasFetchEffect);
      
      // Check if component is using the data from Redux
      const hasReduxData = componentContent.includes('useSelector') && 
                          componentContent.includes('state.PropertyList.Data');
      console.log('- Redux data usage exists:', hasReduxData);
      
      return true;
    } catch (error) {
      console.log('Error reading PropertyListingsTab.jsx:', error.message);
      return false;
    }
  } else {
    console.log('PropertyListingsTab.jsx not found. Please check the component path.');
    return false;
  }
}

// Create a debug HTML file that can be used to view database properties
function createDebugHtml() {
  console.log('\nCreating debug HTML file...');
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Database Property Debugger</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1, h2 {
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
    .property-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .property-card {
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .property-image {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 5px;
    }
    .property-address {
      font-weight: bold;
      margin: 10px 0 5px;
    }
    .property-price {
      color: #2c3e50;
      font-weight: bold;
    }
    .property-type {
      color: #7f8c8d;
      margin-bottom: 5px;
    }
    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 3px;
      font-size: 12px;
      font-weight: bold;
    }
    .status-active {
      background-color: #e8f5e8;
      color: #28a745;
    }
    .tabs {
      display: flex;
      border-bottom: 1px solid #ddd;
      margin-bottom: 20px;
    }
    .tab {
      padding: 10px 15px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
    }
    .tab.active {
      border-bottom: 2px solid #4CAF50;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <h1>Database Property Debugger</h1>
  <p>This tool helps verify that database properties are being fetched correctly.</p>
  
  <div class="tabs">
    <div class="tab active" onclick="switchTab(this, 'database')">Database Properties</div>
    <div class="tab" onclick="switchTab(this, 'localstorage')">LocalStorage Properties</div>
    <div class="tab" onclick="switchTab(this, 'combined')">Combined View</div>
  </div>
  
  <div id="database" class="tab-content">
    <h2>Database Properties</h2>
    <button id="fetchData">Fetch Database Properties</button>
    <p id="db-status"></p>
    <div id="database-properties" class="property-grid"></div>
  </div>
  
  <div id="localstorage" class="tab-content" style="display:none">
    <h2>LocalStorage Properties</h2>
    <p id="ls-status"></p>
    <div id="localstorage-properties" class="property-grid"></div>
  </div>
  
  <div id="combined" class="tab-content" style="display:none">
    <h2>Combined View (DB + LocalStorage)</h2>
    <p id="combined-status"></p>
    <div id="combined-properties" class="property-grid"></div>
  </div>
  
  <script>
    // Switch between tabs
    function switchTab(tabElement, tabId) {
      // Hide all tab contents
      const tabContents = document.querySelectorAll('.tab-content');
      tabContents.forEach(content => content.style.display = 'none');
      
      // Remove active class from all tabs
      const tabs = document.querySelectorAll('.tab');
      tabs.forEach(tab => tab.classList.remove('active'));
      
      // Show selected tab content and mark tab as active
      document.getElementById(tabId).style.display = 'block';
      tabElement.classList.add('active');
      
      // Load data for the selected tab
      if (tabId === 'database') {
        // Don't automatically fetch to avoid rate limiting
      } else if (tabId === 'localstorage') {
        displayLocalStorageProperties();
      } else if (tabId === 'combined') {
        displayCombinedProperties();
      }
    }
    
    // Helper function to get best image for a property
    function getBestImage(property) {
      // First try the PropertyAlert format
      if (property?.image) {
        return property.image;
      }
      
      // Next try media_paths
      if (property?.media_paths && property.media_paths.length > 0) {
        const mainImage = property.media_paths[0];
        
        if (typeof mainImage === 'string') {
          return mainImage;
        } else if (mainImage.filePath) {
          return mainImage.filePath;
        } else if (mainImage.url) {
          return mainImage.url;
        } else if (mainImage.path) {
          return mainImage.path;
        }
      }
      
      // Try images array
      if (property?.images && property.images.length > 0) {
        const firstImage = property.images[0];
        return typeof firstImage === 'string' ? firstImage :
          firstImage.url || firstImage.filePath || firstImage.path;
      }
      
      // Fallback
      return "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg";
    }
    
    // Helper function to get address
    function getAddress(property) {
      if (property.property_address) {
        return property.property_address;
      }
      
      if (property.address) {
        if (typeof property.address === 'string') {
