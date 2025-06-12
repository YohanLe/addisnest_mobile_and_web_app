/**
 * Property Image Resolution Test Script
 * 
 * This script tests the various ways images are stored in property objects
 * and creates a function to find the best possible image for each property.
 */

const fs = require('fs');
const path = require('path');

// Sample property objects with different image formats
const sampleProperties = [
  {
    id: "prop1",
    title: "Property with media_paths as objects with url",
    media_paths: [
      { url: "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg", caption: "Front view" },
      { url: "/uploads/1749428932303-180111256-731631728_0.jpg", caption: "Interior" }
    ]
  },
  {
    id: "prop2",
    title: "Property with media_paths as strings",
    media_paths: [
      "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg",
      "/uploads/1749428932303-180111256-731631728_0.jpg"
    ]
  },
  {
    id: "prop3",
    title: "Property with images array of objects with url",
    images: [
      { url: "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg", caption: "Front view" },
      { url: "/uploads/1749428932303-180111256-731631728_0.jpg", caption: "Interior" }
    ]
  },
  {
    id: "prop4",
    title: "Property with images array of strings",
    images: [
      "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg",
      "/uploads/1749428932303-180111256-731631728_0.jpg"
    ]
  },
  {
    id: "prop5",
    title: "Property with image field (PropertyAlert format)",
    image: "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg"
  },
  {
    id: "prop6",
    title: "Property with empty images array",
    images: []
  },
  {
    id: "prop7",
    title: "Property with no image fields"
  },
  {
    id: "prop8",
    title: "Property with images from PropertyAlert",
    images: [
      {
        _id: "68462ad1330b8fb3925a9653",
        url: "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg",
        caption: "1749428928268-710498473-genMid.731631728_27_0.jpg"
      },
      {
        _id: "68462ad1330b8fb3925a9654",
        url: "/uploads/1749428932303-180111256-731631728_0.jpg",
        caption: "1749428932303-180111256-731631728_0.jpg"
      }
    ]
  }
];

/**
 * Enhanced getBestImage function
 * Searches through all possible image formats and returns the best available image
 */
function getBestImage(property) {
  console.log(`Finding image for property ${property.id || property._id || 'unknown'}`);
  
  // Default fallback images when nothing is found
  const DEFAULT_IMAGES = [
    "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg",
    "/uploads/1749428932303-180111256-731631728_0.jpg",
    "/uploads/test-property-image-1749260861596-438465535.jpg"
  ];
  
  // First try the PropertyAlert format (direct image field)
  if (property?.image) {
    console.log("Using PropertyAlert image format");
    return property.image;
  }
  
  // Next try media_paths (from property form)
  if (property?.media_paths && property.media_paths.length > 0) {
    console.log("Found media_paths");
    const mainImage = property.media_paths[0];
    
    if (typeof mainImage === 'string') {
      console.log("Using string URL from media_paths");
      return mainImage;
    } else if (mainImage.filePath) {
      console.log("Using filePath from media_paths object");
      return mainImage.filePath;
    } else if (mainImage.url) {
      console.log("Using url from media_paths object");
      return mainImage.url;
    } else if (mainImage.path) {
      console.log("Using path from media_paths object");
      return mainImage.path;
    }
  }
  
  // Try images array next (from API response)
  if (property?.images && property.images.length > 0) {
    console.log("Using images array");
    
    // First check if any image is marked as primary
    const primaryImage = property.images.find(img => 
      (typeof img === 'object' && img.isPrimary === true) || 
      (typeof img === 'object' && img.primary === true)
    );
    
    if (primaryImage) {
      console.log("Found primary image");
      return typeof primaryImage === 'string' ? primaryImage :
        primaryImage.url || primaryImage.filePath || primaryImage.path || primaryImage;
    }
    
    // Otherwise use first image
    const firstImage = property.images[0];
    console.log("Using first image from array");
    return typeof firstImage === 'string' ? firstImage :
      firstImage.url || firstImage.filePath || firstImage.path;
  }
  
  // Use default fallback
  console.log("No property-specific images found, using default fallback");
  return DEFAULT_IMAGES[0];
}

// Test the function on all sample properties
console.log("\n===== TESTING IMAGE RESOLUTION FUNCTION =====\n");
sampleProperties.forEach(property => {
  const bestImage = getBestImage(property);
  console.log(`Property: ${property.title}`);
  console.log(`Best image: ${bestImage}`);
  console.log("-----------------------------------");
});

/**
 * Test if image exists in the uploads folder
 */
function checkImageExists(imagePath) {
  if (!imagePath) return false;
  
  // Strip the leading slash if present
  const relativePath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  
  try {
    // Check if the file exists in the current directory or parent directory
    const localPath = path.resolve(__dirname, relativePath);
    const parentPath = path.resolve(__dirname, '..', relativePath);
    
    if (fs.existsSync(localPath)) {
      console.log(`✅ Image exists at: ${localPath}`);
      return true;
    } else if (fs.existsSync(parentPath)) {
      console.log(`✅ Image exists at: ${parentPath}`);
      return true;
    } else {
      console.log(`❌ Image not found: ${relativePath}`);
      return false;
    }
  } catch (err) {
    console.error(`Error checking image existence: ${err.message}`);
    return false;
  }
}

// List all images in the uploads folder
function listUploadsFolder() {
  try {
    const uploadsPath = path.resolve(__dirname, 'uploads');
    const parentUploadsPath = path.resolve(__dirname, '..', 'uploads');
    
    let directoryToCheck = null;
    
    if (fs.existsSync(uploadsPath) && fs.statSync(uploadsPath).isDirectory()) {
      directoryToCheck = uploadsPath;
    } else if (fs.existsSync(parentUploadsPath) && fs.statSync(parentUploadsPath).isDirectory()) {
      directoryToCheck = parentUploadsPath;
    } else {
      console.log("❌ uploads folder not found in current or parent directory");
      return [];
    }
    
    console.log(`\n===== LISTING FILES IN ${directoryToCheck} =====\n`);
    const files = fs.readdirSync(directoryToCheck);
    const imageFiles = files.filter(file => 
      file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
    );
    
    console.log(`Found ${imageFiles.length} image files out of ${files.length} total files`);
    imageFiles.forEach(file => {
      console.log(`- ${file}`);
    });
    
    return imageFiles;
  } catch (err) {
    console.error(`Error listing uploads folder: ${err.message}`);
    return [];
  }
}

// Check the default images
console.log("\n===== CHECKING DEFAULT IMAGES =====\n");
[
  "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg",
  "/uploads/1749428932303-180111256-731631728_0.jpg",
  "/uploads/test-property-image-1749260861596-438465535.jpg"
].forEach(image => {
  checkImageExists(image);
});

// List all images in uploads folder
listUploadsFolder();

console.log("\nImage resolution function testing complete.");
