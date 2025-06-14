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
        req.body.paymentStatus = 'none'; // FIXED: Changed from 'active' to 'none' to match valid enum values
        req.body.promotionType = 'Basic';
      } else if (promotionType === 'VIP' || promotionType === 'Diamond') {
        req.body.status = 'pending';
        req.body.paymentStatus = 'pending';
        req.body.promotionType = promotionType;
      } else {
        req.body.status = 'active';
        req.body.paymentStatus = 'none'; // FIXED: Changed from 'active' to 'none' to match valid enum values
        req.body.promotionType = promotionType;
      }
      
      // Handle nested address structure
      if (req.body.address) {
        // If nested address is provided, ensure the flat fields are also set for backward compatibility
        req.body.street = req.body.address.street || req.body.street;
        req.body.city = req.body.address.city || req.body.city;
        req.body.state = req.body.address.state || req.body.state;
        req.body.country = req.body.address.country || req.body.country || 'Ethiopia';
      } else if (req.body.street || req.body.city || req.body.state || req.body.country) {
        // If only flat fields are provided, create the nested structure
        req.body.address = {
          street: req.body.street || '',
          city: req.body.city || '',
          state: req.body.state || '',
          country: req.body.country || 'Ethiopia'
        };
      }
      
      console.log('Creating property with data:', req.body);
      
      // Basic validation
      if (!req.body.propertyType || !req.body.price || !req.body.title || !req.body.offeringType) {
        return this.sendError(res, new ErrorResponse('Missing required fields (propertyType, price, title, or offeringType)', 400));
      }
      
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
      
      // Remove promotionType from property data if present (keep it in propertyData)
      const propertyData = { ...req.body };

      const property = await Property.create(propertyData);
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

  getAllProperties = this.asyncHandler(async (req, res) => {
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude from being directly copied
    const removeFields = ['select', 'sort', 'page', 'limit', 'for', 'search', 'priceRange', 'propertyType', 'bedrooms', 'bathrooms', 'regionalState', 'sortBy'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Handle 'for' parameter for offering type
    if (req.query.for) {
        const offeringTypeMap = {
            'buy': 'For Sale',
            'rent': 'For Rent',
            'sell': 'For Sale'
        };
        if (offeringTypeMap[req.query.for]) {
            reqQuery.offeringType = offeringTypeMap[req.query.for];
        }
    }

    // Handle search query
    if (req.query.search) {
        const searchQuery = req.query.search;
        reqQuery.$or = [
            { title: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
            { 'address.city': { $regex: searchQuery, $options: 'i' } },
            { 'address.state': { $regex: searchQuery, $options: 'i' } },
            { propertyType: { $regex: searchQuery, $options: 'i' } }
        ];
    }

    // Handle propertyType filter
    if (req.query.propertyType && req.query.propertyType !== 'all') {
        reqQuery.propertyType = req.query.propertyType;
    }

    // Handle regionalState filter
    if (req.query.regionalState && req.query.regionalState !== 'all') {
        reqQuery['address.state'] = req.query.regionalState;
    }

    // Handle priceRange filter
    if (req.query.priceRange && req.query.priceRange !== 'any') {
        if (req.query.priceRange.includes('-')) {
            const [min, max] = req.query.priceRange.split('-');
            reqQuery.price = {};
            if (min) reqQuery.price.$gte = parseInt(min, 10);
            if (max) reqQuery.price.$lte = parseInt(max, 10);
        } else if (req.query.priceRange.endsWith('+')) {
            const min = req.query.priceRange.slice(0, -1);
            reqQuery.price = { $gte: parseInt(min, 10) };
        }
    }

    // Handle bedrooms filter
    if (req.query.bedrooms && req.query.bedrooms !== 'any') {
        reqQuery.bedrooms = { $gte: parseInt(req.query.bedrooms, 10) };
    }

    // Handle bathrooms filter
    if (req.query.bathrooms && req.query.bathrooms !== 'any') {
        reqQuery.bathrooms = { $gte: parseInt(req.query.bathrooms, 10) };
    }
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    console.log('Final property filter query:', queryStr);
    
    // Finding resource
    let query = Property.find(JSON.parse(queryStr))
    .populate({
      path: 'owner',
      select: 'firstName lastName email phone'
    })
    .populate({
      path: 'images',
      select: 'url'
    });

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sortBy) {
        const sortBy = req.query.sortBy.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Property.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const properties = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    this.sendResponse(res, {
      count: properties.length,
      pagination,
      data: properties
    });
  });

  // @desc    Get single property
  // @route   GET /api/properties/:id
  // @access  Public
  getPropertyById = this.asyncHandler(async (req, res) => {
    // Normalize the ID to handle various formats
    let propertyId = req.params.id;
    
    // Log the request for debugging
    console.log(`getPropertyById called with ID: ${propertyId}`);
    
    // Handle ObjectId format - extract the hex string if ID is in format ObjectId("...")
    if (typeof propertyId === 'string' && propertyId.startsWith('ObjectId(') && propertyId.endsWith(')')) {
      propertyId = propertyId.substring(9, propertyId.length - 1);
      console.log(`Extracted ID from ObjectId format: ${propertyId}`);
    }
    
    // Remove quotes if present
    if (typeof propertyId === 'string' && 
        ((propertyId.startsWith('"') && propertyId.endsWith('"')) || 
         (propertyId.startsWith("'") && propertyId.endsWith("'")))) {
      propertyId = propertyId.substring(1, propertyId.length - 1);
      console.log(`Removed quotes from ID: ${propertyId}`);
    }
    
    // Validate MongoDB ID format
    const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(propertyId);
    if (!isValidMongoId) {
      console.error(`Invalid MongoDB ID format: ${propertyId}`);
      // Return a formatted error response instead of throwing an error
      return this.sendError(res, new ErrorResponse(`Invalid property ID format: ${req.params.id}`, 400));
    }
    
    try {
      const property = await Property.findById(propertyId).populate({
        path: 'owner',
        select: 'firstName lastName email phone'
      });

      if (!property) {
        console.log(`Property not found with id: ${propertyId}`);
        // Return a formatted error response instead of throwing an error
        return this.sendError(res, new ErrorResponse(`Property not found with id of ${propertyId}`, 404));
      }

      try {
        // Increment view count in a try-catch to ensure it doesn't break the response
        property.views += 1;
        await property.save();
      } catch (viewError) {
        // Log view count error but continue with the response
        console.error(`Error updating view count for property ${propertyId}:`, viewError);
      }

      console.log(`Successfully retrieved property: ${propertyId}`);
      this.sendResponse(res, property);
    } catch (error) {
      console.error(`Error finding property with ID ${propertyId}:`, error);
      // Return a formatted error response instead of throwing an error
      return this.sendError(res, new ErrorResponse(`Error retrieving property: ${error.message}`, 500));
    }
  });

  // @desc    Update property
  // @route   PUT /api/properties/:id
  // @access  Private
  updateProperty = this.asyncHandler(async (req, res) => {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return this.sendError(res, new ErrorResponse(`Property not found with id of ${req.params.id}`, 404));
    }
