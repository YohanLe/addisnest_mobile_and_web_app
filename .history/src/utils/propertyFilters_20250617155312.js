// Property Filters utility
// Contains reusable filter logic for property filtering across the application

// Builds query parameters for property filtering
export const buildQueryParams = (options) => {
  const {
    searchQuery = '',
    priceRange = 'any',
    propertyType = 'all',
    bedrooms = 'any',
    bathrooms = 'any',
    regionalState = 'all',
    sortBy = 'newest',
    offeringType = 'For Sale'
  } = options;

