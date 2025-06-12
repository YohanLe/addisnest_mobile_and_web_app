const { BaseController, ErrorResponse } = require('./baseController');
const { Property, User } = require('../models');

class PropertyController extends BaseController {
  constructor() {
    super();
  }

  // @desc    Create a new property
  // @route   POST /api/properties
  // @access  Private
  createProperty = this.asyncHandler(async (req, res) => {
    try {
      // Add user to req.body
      req.body.owner = req.user.id;
      console.log('User role:', req.user.role);
      
      // Check promotionType for logic
      const promotionType = req.body.promotionType || 'Basic';
      if (promotionType === 'Basic' || promotionType === 'None') {
        req.body.status = 'active';
        req.body.promotionType = 'Basic';
      } else if (promotionType === 'VIP' || promotionType === 'Diamond') {
        req.body.status = 'Pending';  // Fixed: changed from 'pending' to 'Pending' to match enum
        req.body.promotionType = promotionType;
      } else {
        req.body.status = 'active';
        req.body.promotionType = promotionType;
      }
      
      console.log('Creating property with data:', req.body);
      
      // Basic validation for required fields
      if (!req.body.propertyType || !req.body.price || !req.body.title || !req.body.offeringType) {
        return this.sendError(res, new ErrorResponse('Missing required fields (propertyType, price, title, or offeringType)', 400));
      }
      
      // CRITICAL FIX: Ensure all required address fields are present
      // These are required by the Property schema
      this.ensureAddressFields(req.body);
      
      // Check for duplicate properties before creating a new one
      const potentialDuplicate = await Property.findOne({
        owner: req.user.id,
        title: req.body.title,
        price: req.body.price,
        propertyType: req.body.propertyType,
        createdAt: { $gte: new Date(Date.now() - 60 * 1000) } // Check only within the last minute
      });
      
      if (potentialDuplicate) {
        console.log(`Prevented duplicate property creation. Existing property: ${potentialDuplicate._id}`);
        return this.sendResponse(res, potentialDuplicate, 200);
      }
      
      // Remove any fields that could cause validation errors
      this.sanitizePropertyData(req.body);
      
      // Create the property
      const property = await Property.create(req.body);
      console.log('Property created successfully:', property._id);
      this.sendResponse(res, property, 201);
    } catch (err) {
      console.error('Create property error:', err);
      if (err.name === 'ValidationError') {
        // Handle mongoose validation errors
        const messages = Object.values(err.errors).map(val => val.message);
        return this.sendError(res, new ErrorResponse(messages.join(', '), 400));
      }
      this.sendError(res, new ErrorResponse(err.message || 'Error creating property', 500));
    }
  });

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
  
  // Helper method to sanitize property data before saving
  sanitizePropertyData(data) {
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
    
    return data;
  }

  // @desc    Get all properties
  // @route   GET /api/properties
  // @access  Public
  getAllProperties = this.asyncHandler(async (req, res) => {
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Handle the 'for' parameter separately for filtering by offering type
    if (req.query.for) {
      // Map 'for' parameter values to offeringType values in the database
      const offeringTypeMap = {
        'buy': 'For Sale',
        'rent': 'For Rent', 
        'sell': 'For Sale'
      };
      
      // Add offeringType filter based on 'for' parameter
      if (offeringTypeMap[req.query.for]) {
        reqQuery.offeringType = offeringTypeMap[req.query.for];
        console.log(`Filtering properties by offeringType: ${reqQuery.offeringType}`);
      }
      
      // Remove the 'for' parameter since we've handled it separately
      delete reqQuery.for;
    }
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    console.log('Final property filter query:', queryStr);
    
    // Finding resource
    let query = Property.find(JSON.parse(queryStr)).populate({
      path: 'owner',
      select: 'firstName lastName email phone'
    });

    // Select Fields
    if (req.query.select) {
      const fields = req.query.
