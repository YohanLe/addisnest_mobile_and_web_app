/**
 * Property Controller with Unified Address Structure
 * 
 * This controller handles the transition from flat address structure to nested address structure
 * to ensure all parts of the application use a consistent address format.
 */

// Import the original property controller
const originalController = require('./propertyController');

/**
 * Middleware to ensure nested address structure
 * Used before saving to database
 */
const ensureNestedAddress = (req, res, next) => {
  try {
    const { street, city, regional_state, country, ...rest } = req.body;
    
    // If flat address fields are provided, create nested address structure
    if (street || city || regional_state || country) {
      // Create the nested address object
      const address = {
        street: street || '',
        city: city || '',
        state: regional_state || '', // Map regional_state to state
        country: country || 'Ethiopia'
      };
      
      // Update the request body with nested address
      req.body = {
        ...rest,
        address
      };
      
      console.log('Converted flat address to nested structure:', req.body);
    }
    
    next();
  } catch (error) {
    console.error('Error in ensureNestedAddress middleware:', error);
    next(error);
  }
};

/**
 * Create a wrapped version of each controller method that applies
 * the appropriate address structure conversion
 */
const wrapControllerMethods = () => {
  const wrappedController = {};
  
  // Process each method in the original controller
  Object.entries(originalController).forEach(([key, method]) => {
    if (typeof method === 'function') {
      // Wrap the method with our middleware
      wrappedController[key] = async (req, res) => {
        try {
          // Apply conversion to nested address structure before proceeding
          ensureNestedAddress(req, res, () => {
            // Call the original method
            return method(req, res);
          });
        } catch (error) {
          console.error(`Error in wrapped controller method ${key}:`, error);
          res.status(500).json({ 
            success: false, 
            message: 'Internal server error during address structure conversion' 
          });
        }
      };
    } else {
      // Non-function properties are copied directly
      wrappedController[key] = method;
    }
  });
  
  return wrappedController;
};

// Export the wrapped controller
module.exports = {
  ...wrapControllerMethods(),
  // Also export the middleware for direct use
  ensureNestedAddress
};
