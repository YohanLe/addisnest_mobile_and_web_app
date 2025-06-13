import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Api from '../../Apis/Api';

// Function to transform API data to property detail format
// This is extracted to a separate function to avoid code duplication
const transformApiDataToPropertyDetail = (apiData) => {
  if (!apiData) return null;
  
  console.log('Transforming API data to property detail format:', apiData);
  
  // Create consistent address structure
  const addressObj = apiData.address || {
    street: apiData.street || '',
    city: apiData.city || '',
    state: apiData.state || '',
    country: apiData.country || 'Ethiopia'
  };
  
  // Create consistent property address string
  const propertyAddressString = apiData.property_address || 
    `${apiData.street || addressObj.street || ''}, ${apiData.city || addressObj.city || ''}, ${apiData.state || addressObj.state || ''}, ${apiData.country || addressObj.country || 'Ethiopia'}`;
  
  // Extract street, city, state, country from address object if present
  const street = apiData.street || (typeof addressObj === 'object' ? addressObj.street : '');
  const city = apiData.city || (typeof addressObj === 'object' ? addressObj.city : '');
  const state = apiData.state || (typeof addressObj === 'object' ? addressObj.state : '');
  const country = apiData.country || (typeof addressObj === 'object' ? addressObj.country : 'Ethiopia');
  
  // Process images to handle different formats
  const mediaArray = apiData.media_paths || 
    (apiData.images && Array.isArray(apiData.images) ? 
      apiData.images.map(img => typeof img === 'string' ? img : (img.url || img)) : 
      (Array.isArray(apiData.media) ? apiData.media : [])) || 
    []; // Use empty array if no images found
  
  // Correctly handle features as a key-value object
  const featuresData = apiData.features || {};
  
  // Create transformed data object
  return {
    // ID and basic info
    id: apiData._id || apiData.id,
    _id: apiData._id || apiData.id, // Include _id for direct matching
    owner: apiData.owner || '', // Direct owner field
    title: apiData.title || 'Property Title',
    description: apiData.description || 'No description available',
    
    // Price information
    price: apiData.total_price || apiData.price || 0,
    total_price: apiData.total_price || apiData.price || 0,
    
    // Address - include both formats for compatibility
    address: addressObj,
    property_address: propertyAddressString,
    street: street,
    city: city,
    state: state,
    country: country,
    
    // Location data
    regional_state: apiData.regional_state || state,
    
    // Property type and status
    property_for: apiData.property_for || apiData.offeringType || 'For Sale',
    propertyFor: apiData.property_for || apiData.offeringType || 'For Sale',
    offeringType: apiData.offeringType || apiData.property_for || 'For Sale',
    property_type: apiData.property_type || apiData.propertyType || 'House',
    propertyType: apiData.propertyType || apiData.property_type || 'House',
    
    // Property specifications
    property_size: apiData.property_size || apiData.area || apiData.size || 0,
    size: apiData.property_size || apiData.area || apiData.size || 0,
    area: apiData.area || apiData.property_size || apiData.size || 0,
    
    number_of_bedrooms: apiData.number_of_bedrooms || apiData.bedrooms || 0,
    bedrooms: apiData.bedrooms || apiData.number_of_bedrooms || 0,
    beds: apiData.bedrooms || apiData.number_of_bedrooms || 0,
    
    number_of_bathrooms: apiData.number_of_bathrooms || apiData.bathrooms || 0,
    bathrooms: apiData.bathrooms || apiData.number_of_bathrooms || 0,
    bathroom_information: Array(apiData.bathrooms || apiData.number_of_bathrooms || 0).fill({}),
    
    furnishing: apiData.furnishing || apiData.furnishingStatus || 'Not specified',
    
    // Nested specifications for components
    specifications: {
      bedrooms: apiData.bedrooms || apiData.number_of_bedrooms || 0,
      bathrooms: apiData.bathrooms || apiData.number_of_bathrooms || 0,
      area: {
        size: apiData.area || apiData.property_size || apiData.size || 0
      }
    },
    
    // Status and additional data
    promotionType: apiData.promotionType || apiData.promotion_package || 'Basic',
    promotion_package: apiData.promotionType || apiData.promotion_package || 'Basic',
    isPremium: apiData.isPremium || false,
    isVerified: apiData.isVerified || false,
    paymentStatus: apiData.paymentStatus || 'none',
    status: apiData.status || 'active',
    createdAt: apiData.createdAt || new Date().toISOString(),
    updatedAt: apiData.updatedAt || apiData.createdAt || new Date().toISOString(),
    views: apiData.views || 0,
    likes: apiData.likes || 0,
    
    // Media and images
    media: mediaArray,
    media_paths: apiData.media_paths || [],
    images: apiData.images || [],
    
    // Amenities and features
    amenities: apiData.amenities || [],
    features: featuresData,
    
    // Owner/user information
    user: {
      id: apiData.owner?._id || apiData.owner || 'owner-id',
      name: apiData.owner ? 
        `${apiData.owner.firstName || ''} ${apiData.owner.lastName || ''}` : 
        'Property Owner',
      profile_img: apiData.owner?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    
    // Keep original data for debugging
    _originalData: apiData
  };
};

// Async thunk for fetching property details
export const getPropertyDetails = createAsyncThunk(
  'propertyDetail/getPropertyDetails',
  async (propertyId, { rejectWithValue }) => {
    try {
      // Validate the property ID
      if (!propertyId || propertyId === 'undefined' || propertyId === 'null') {
        console.log('Invalid property ID');
        return rejectWithValue('Invalid property ID');
      }
      
      // Check if this is a valid MongoDB ObjectID
      const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(propertyId);
      if (!isValidMongoId) {
        console.log('Not a valid MongoDB ID');
        return rejectWithValue('Not a valid MongoDB ID');
      }
      
      console.log('Fetching property with ID:', propertyId);
      
      const response = await Api.getPublic(`properties/${propertyId}`);
        
      // Validate response
      if (!response || !response.data) {
        console.log('API returned no data');
        return rejectWithValue('API returned no data');
      }
      
      // Check for success/failure in the response
      if (response.data.hasOwnProperty('success') && response.data.success === false) {
        console.log('API returned unsuccessful response');
        return rejectWithValue(response.data.error || 'API returned unsuccessful response');
      }
      
      console.log('API returned successful response');
      
      // Extract and transform the data
      const apiData = response.data.data || response.data;
      console.log('Raw API data structure:', JSON.stringify(apiData, null, 2));
      
      if (!apiData) {
        console.log('API data is empty or undefined');
        return rejectWithValue('API data is empty or undefined');
      }
      
      // Transform the API data
      return transformApiDataToPropertyDetail(apiData);

    } catch (error) {
      console.error('Error in getPropertyDetails thunk:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch property details');
    }
  }
);

// Initial state
const initialState = {
  property: null,
  loading: false,
  error: null,
};

// Create slice
const propertyDetailSlice = createSlice({
  name: 'propertyDetail',
  initialState,
  reducers: {
    clearPropertyDetails: (state) => {
      state.property = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getPropertyDetails
      .addCase(getPropertyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPropertyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.property = action.payload;
      })
      .addCase(getPropertyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch property details';
      });
  },
});

// Export actions and reducer
export const { clearPropertyDetails } = propertyDetailSlice.actions;

export default propertyDetailSlice.reducer;
