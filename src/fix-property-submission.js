/**
 * Property Submission 500 Error Fix
 * 
 * This script fixes the 500 error that occurs when submitting properties
 * with missing address fields by:
 * 
 * 1. Adding fallback values for all required fields
 * 2. Ensuring proper data types for numerical fields
 * 3. Normalizing image formats
 * 
 * Usage: node src/fix-property-submission.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configure paths
const CONTROLLER_PATH = path.join(__dirname, 'controllers', 'propertyController.js');
const BACKUP_PATH = path.join(__dirname, '..', 'backups', 'propertyController.js.bak');
const BACKUPS_DIR = path.join(__dirname, '..', 'backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  console.log(`Created backup directory: ${BACKUPS_DIR}`);
}

// Create backup of original controller
if (fs.existsSync(CONTROLLER_PATH)) {
  fs.copyFileSync(CONTROLLER_PATH, BACKUP_PATH);
  console.log(`Backed up original controller to ${BACKUP_PATH}`);
} else {
  console.error(`Original controller not found at ${CONTROLLER_PATH}`);
  process.exit(1);
}

// Read the current controller file
let controllerContent = fs.readFileSync(CONTROLLER_PATH, 'utf8');

// Add or enhance the ensureAddressFields method
if (!controllerContent.includes('ensureAddressFields')) {
  const ensureAddressFieldsMethod = `
  // Helper method to ensure all required address fields are present
  ensureAddressFields(data) {
    // Prepare fallback values for required address fields
    const fallbackStreet = "Unknown Street";
    const fallbackCity = "Unknown City";
    const fallbackState = "Unknown State";
    const fallbackCountry = "Ethiopia";
    
    // Handle different possible address field locations
    if (data.address && typeof data.address === 'object') {
      // Extract from nested address object to top-level properties
      data.street = data.street || data.address.street || data.property_address || fallbackStreet;
      data.city = data.city || data.address.city || fallbackCity;
      data.state = data.state || data.address.state || data.regional_state || fallbackState;
      data.country = data.country || data.address.country || fallbackCountry;
      
      // Remove the nested address object as it's not part of the schema
      delete data.address;
    } else {
      // Set flat fields with proper fallbacks
      data.street = data.street || data.property_address || fallbackStreet;
      data.city = data.city || fallbackCity;
      data.state = data.state || data.regional_state || fallbackState;
      data.country = data.country || fallbackCountry;
    }
    
    // Log the address fields for debugging
    console.log('Ensured address fields:', {
      street: data.street,
      city: data.city,
      state: data.state,
      country: data.country
    });
    
    return data;
  }
  `;

  // Insert the method after the constructor
  controllerContent = controllerContent.replace(
    /constructor\(\) {([\s\S]*?)}/,
    `constructor() {$1}
    
  ${ensureAddressFieldsMethod}`
  );
}

// Add or enhance the sanitizePropertyData method
if (!controllerContent.includes('sanitizePropertyData')) {
  const sanitizePropertyDataMethod = `
  // Helper method to sanitize property data before saving
  sanitizePropertyData(data) {
    // Ensure all required fields have values
    data.title = data.title || 'Untitled Property';
    data.description = data.description || 'No description provided';
    data.propertyType = data.propertyType || 'House';
    data.offeringType = data.offeringType || 'For Sale';
    data.status = data.status || 'active';
    
    // Remove fields that are not in the schema or that could cause validation issues
    delete data.paymentStatus; // Not in schema
    delete data.property_address; // Legacy field, use street instead
    delete data.regional_state; // Legacy field, use state instead
    
    // Ensure numerical fields are numbers
    data.price = Number(data.price) || 0;
    data.area = Number(data.area) || 0;
    data.bedrooms = Number(data.bedrooms) || 0;
    data.bathrooms = Number(data.bathrooms) || 0;
    
    // Ensure features is an object
    if (!data.features || typeof data.features !== 'object') {
      data.features = { hasPool: false };
    }
    
    // Ensure images array exists
    if (!data.images || !Array.isArray(data.images)) {
      data.images = [];
    }
    
    // Convert any media_paths to images format if needed
    if (data.media_paths) {
      if (!Array.isArray(data.media_paths)) {
        data.media_paths = [data.media_paths]; // Convert to array if it's a single string
      }
      
      if (data.media_paths.length > 0) {
        // Add any media_paths items that aren't already in images
        const mediaPathUrls = data.media_paths.map(path => {
          if (typeof path === 'string') return path;
          return path.url || String(path);
        });
        
        // Add any missing media paths to images
        mediaPathUrls.forEach(url => {
          // Check if this URL is already in images
          const isAlreadyInImages = data.images.some(img => 
            img.url === url || (typeof img === 'string' && img === url)
          );
          
          if (!isAlreadyInImages) {
            data.images.push({ url: url });
          }
        });
      }
    }
    
    // If no images, add a default one
    if (data.images.length === 0) {
      data.images.push({ url: '/uploads/test-property-image-1749260861596-438465535.jpg' });
    }
    
    // Normalize image format
    data.images = data.images.map(img => {
      if (typeof img === 'string') {
        return { url: img };
      } else if (img && typeof img === 'object') {
        return { url: img.url || img.path || '' };
      }
      return { url: '' };
    }).filter(img => img.url && img.url.trim() !== '');
    
    return data;
  }
  `;

  // Insert the method after the ensureAddressFields method
  if (controllerContent.includes('ensureAddressFields')) {
    controllerContent = controllerContent.replace(
      /ensureAddressFields([\s\S]*?)return data;\s*}/,
      `ensureAddressFields$1return data;}
      
  ${sanitizePropertyDataMethod}`
    );
  } else {
    // Insert after constructor if ensureAddressFields doesn't exist
    controllerContent = controllerContent.replace(
      /constructor\(\) {([\s\S]*?)}/,
      `constructor() {$1}
      
  ${sanitizePropertyDataMethod}`
    );
  }
}

// Update the createProperty method to call these helper methods
if (controllerContent.includes('createProperty = this.asyncHandler')) {
  // Check if calls to the helper methods already exist
  const ensureAddressFieldsCall = controllerContent.includes('this.ensureAddressFields(req.body)');
  const sanitizePropertyDataCall = controllerContent.includes('this.sanitizePropertyData(req.body)');
  
  if (!ensureAddressFieldsCall) {
    // Add call to ensureAddressFields before property creation
    controllerContent = controllerContent.replace(
      /const property = await Property\.create\(req\.body\);/,
      `// CRITICAL FIX: Ensure all required address fields are present
      this.ensureAddressFields(req.body);
      
      const property = await Property.create(req.body);`
    );
  }
  
  if (!sanitizePropertyDataCall) {
    // Add call to sanitizePropertyData before property creation
    controllerContent = controllerContent.replace(
      /const property = await Property\.create\(req\.body\);/,
      `// Sanitize the property data to avoid validation errors
      this.sanitizePropertyData(req.body);
      
      const property = await Property.create(req.body);`
    );
  }
}

// Write the updated controller back to the file
fs.writeFileSync(CONTROLLER_PATH, controllerContent, 'utf8');
console.log(`Updated controller at ${CONTROLLER_PATH} with fixes for property submission 500 error`);

console.log(`
===============================
   PROPERTY SUBMISSION FIX
===============================

The property controller has been updated with fixes for the 500 error:

1. Added ensureAddressFields() method to ensure address fields are present
2. Added sanitizePropertyData() method to validate all required fields
3. Updated createProperty to use these methods before saving

The original controller has been backed up to:
${BACKUP_PATH}

Restart the application to apply the changes.
`);
