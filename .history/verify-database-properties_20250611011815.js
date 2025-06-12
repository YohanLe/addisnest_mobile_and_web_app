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

// Create a simple HTML file for viewing database properties
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
    }
    h1 { color: #2c3e50; }
    button {
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .property-card {
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 15px;
      margin: 10px 0;
    }
    .property-image {
      max-width: 100%;
      height: 200px;
      object-fit: cover;
    }
  </style>
</head>
<body>
  <h1>Database Property Debugger</h1>
  <p>This tool verifies database properties are being fetched correctly.</p>
  
  <button onclick="fetchDatabaseProperties()">Fetch Database Properties</button>
  <div id="status"></div>
  <div id="properties-container"></div>
  
  <script>
    async function fetchDatabaseProperties() {
      document.getElementById('status').innerHTML = 'Fetching properties...';
      document.getElementById('properties-container').innerHTML = '';
      
      try {
        const response = await fetch('/api/properties');
        const data = await response.json();
        
        document.getElementById('status').innerHTML = 
          \`Found \${data.data ? data.data.length : 0} properties in database\`;
        
        if (data.data && data.data.length > 0) {
          const container = document.getElementById('properties-container');
          
          data.data.forEach(property => {
            const card = document.createElement('div');
            card.className = 'property-card';
            
            // Find the best image
            let imageUrl = "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg";
            if (property.images && property.images.length > 0) {
              const img = property.images[0];
              imageUrl = typeof img === 'string' ? img : img.url || imageUrl;
            }
            
            // Get address
            const address = property.property_address || 
              (property.address ? JSON.stringify(property.address) : 'Unknown address');
            
            // Create card content
            card.innerHTML = \`
              <img src="\${imageUrl}" class="property-image" onerror="this.src='/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg'">
              <h3>\${address}</h3>
              <p>Type: \${property.property_type || property.propertyType || 'Unknown'}</p>
              <p>Price: \${property.price || property.total_price || 0} ETB</p>
              <p>Status: \${property.status || 'ACTIVE'}</p>
            \`;
            
            container.appendChild(card);
          });
        } else {
          document.getElementById('properties-container').innerHTML = 
            '<p>No properties found in database. You may need to create some.</p>';
        }
      } catch (error) {
        document.getElementById('status').innerHTML = 
          \`Error fetching properties: \${error.message}\`;
      }
    }
  </script>
</body>
</html>
  `;
  
  try {
    fs.writeFileSync('database-property-debugger.html', htmlContent);
    console.log('Debug HTML file created: database-property-debugger.html');
  } catch (error) {
    console.error('Error creating debug HTML file:', error.message);
  }
}

// Run all checks
function runAllChecks() {
  const serverRunning = checkServerStatus();
  const reduxSetupOk = checkReduxSetup();
  const componentOk = checkPropertyListingsComponent();
  
  console.log('\n=== VERIFICATION RESULTS ===');
  console.log('API Server running:', serverRunning ? '✅ YES' : '❌ NO');
  console.log('Redux setup correct:', reduxSetupOk ? '✅ YES' : '❌ NO');
  console.log('Component setup correct:', componentOk ? '✅ YES' : '❌ NO');
  
  if (serverRunning && reduxSetupOk && componentOk) {
    console.log('\n✅ All checks passed! Database properties should be loading correctly.');
    console.log('If you\'re still not seeing database properties, try these steps:');
    console.log('1. Check if you have any properties in the database');
    console.log('2. Verify API endpoint in PropertyListSlice.js is correct');
    console.log('3. Check browser console for any errors');
  } else {
    console.log('\n❌ Some checks failed. Please fix the issues above.');
  }
  
  // Create debug HTML file regardless of check results
  createDebugHtml();
  console.log('\nDebug HTML file created. Open it in your browser to test database properties directly.');
}

// Run all checks
runAllChecks();
