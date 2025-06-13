import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Api from '../../Apis/Api';

// Mock properties for fallback when API fails
const mockProperties = [
  {
    id: '6849e2ef7cb3172bbb3c718d',
    title: 'Amaizing house for sale jo',
    description: 'hjgh',
    propertyType: 'Commercial',
    offeringType: 'For Sale',
    status: 'active',
    paymentStatus: 'none',
    price: 2112,
    area: 56262,
    bedrooms: 26,
    bathrooms: 32,
    isPremium: false,
    isVerified: false,
    promotionType: 'Basic',
    views: 9,
    likes: 0,
    features: {},
    address: {
      street: '123 Main St',
      city: 'Example City',
      state: 'Example State',
      country: 'Ethiopia'
    },
    media: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3',
      'https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3'
    ],
    createdAt: '2025-06-11T20:11:27.291+00:00',
    updatedAt: '2025-06-11T20:13:25.376+00:00'
  }
];


// Async thunk for fetching property details
export const getPropertyDetails = createAsyncThunk(
  'propertyDetail/getPropertyDetails',
  async (propertyId, { rejectWithValue, dispatch }) => {
    try {
      // Validate if we have a reasonable ID
      if (!propertyId || propertyId === 'undefined' || propertyId === 'null') {
        console.log('Invalid property ID, using mock data instead');
        // Return the first mock property for invalid IDs
        return mockProperties[0];
      }
      
  // Check if this is a valid MongoDB ObjectID
  const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(propertyId);
  
  if (!isValidMongoId) {
    console.log('Not a valid MongoDB ID, using mock data');
    // If it's a mock ID, find the matching mock property
    const mockProperty = mockProperties.find(p => p.id === propertyId);
    
    // If found specific mock property, return it, otherwise return first mock
    return mockProperty || mockProperties[0];
  }

  // Log which API endpoint we're calling
  console.log(`API endpoint being called: /properties/${propertyId}`);
      
      console.log('Fetching property with ID:', propertyId);
      
  try {
    // Add a timestamp parameter to prevent caching issues
    const response = await Api.get(`/properties/${propertyId}?t=${Date.now()}`);
    
    // Check if we have a successful response with data
    if (!response || !response.data) {
      console.log('API returned no data, using mock data');
      return mockProperties[0];
    }
    

    console.log('API returned successful response:', response.data);
        
        // Transform API response to match the format expected by the PropertyDetail component
        const apiData = response.data.data || response.data;
        
        console.log('Received API data:', apiData);
        
        // Log the raw API data for debugging
        console.log('Raw API data structure:', JSON.stringify(apiData, null, 2));
        
        // Early return if apiData is empty or undefined
        if (!apiData) {
          console.log('API data is empty or undefined, using mock data');
          return mockProperties[0];
        }
        
        // Map the API response fields to match what PropertyDetail.jsx expects
        const transformedData = {
          // ID and basic info
          id: apiData._id || apiData.id,
          title: apiData.title || 'Property Title',
          description: apiData.description || 'No description available',
          
          // Price information - handle both total_price and price fields
          price: apiData.total_price || apiData.price || 0,
          total_price: apiData.total_price || apiData.price || 0,
          
          // Address handling - support multiple formats
          address: apiData.property_address || 
            (apiData.address ? 
              (typeof apiData.address === 'string' ? apiData.address : 
              `${apiData.address.street || ''}, ${apiData.address.city || ''}, ${apiData.address.state || ''}`) : 
              `${apiData.street || ''}, ${apiData.city || ''}, ${apiData.state || ''}`),
          property_address: apiData.property_address || '',
          
          // Location data with fallbacks
          city: apiData.city || (apiData.address && typeof apiData.address !== 'string' ? apiData.address.city : ''),
          regional_state: apiData.regional_state || apiData.state || 
                         (apiData.address && typeof apiData.address !== 'string' ? apiData.address.state : ''),
          country: apiData.country || 
                  (apiData.address && typeof apiData.address !== 'string' ? apiData.address.country : 'Ethiopia'),
          
          // Property type and status with aliases
          property_for: apiData.property_for || apiData.offeringType || 'For Sale',
          propertyFor: apiData.property_for || apiData.offeringType || 'For Sale',
          offeringType: apiData.offeringType || apiData.property_for || 'For Sale',
          property_type: apiData.property_type || apiData.propertyType || 'House',
          propertyType: apiData.propertyType || apiData.property_type || 'House',
          
          // Property specifications with multiple fallbacks
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
          
          // Nested specifications object for components that expect this structure
          specifications: {
            bedrooms: apiData.bedrooms || apiData.number_of_bedrooms || 0,
            bathrooms: apiData.bathrooms || apiData.number_of_bathrooms || 0,
            area: {
              size: apiData.area || apiData.property_size || apiData.size || 0
            }
          },
          
          // Additional data
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
          
          // Handle different image structures
          media: apiData.media_paths || 
                 (apiData.images && Array.isArray(apiData.images) ? 
                   apiData.images.map(img => typeof img === 'string' ? img : (img.url || img)) : 
                   (Array.isArray(apiData.media) ? apiData.media : [])) || 
                 mockProperties[0].media, // Fallback to mock property images if none found
          
          // Copy original media_paths and images for debugging
          media_paths: apiData.media_paths || [],
          images: apiData.images || [],
          
          // Amenities and features
          amenities: apiData.amenities || [],
          features: apiData.features ? 
            (typeof apiData.features === 'object' && !Array.isArray(apiData.features) ? 
              Object.entries(apiData.features).flatMap(([type, items]) => 
                Array.isArray(items) ? items.map(item => ({ type, name: item })) : 
                (items === true ? [{ type, name: type }] : [])
              ) : 
              apiData.features) : 
            [],
            
          // Owner/user information
          user: {
            id: apiData.owner?._id || 'owner-id',
            name: apiData.owner ? 
              `${apiData.owner.firstName || ''} ${apiData.owner.lastName || ''}` : 
              'Property Owner',
            profile_img: apiData.owner?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'
          },
          
          // Original data - keep complete original data for debugging
          _originalData: apiData
        };
        
        console.log('Transformed property data:', transformedData);
        return transformedData;
  } catch (apiError) {
    console.error('API Error:', apiError);
    // Try to get more detailed error information
    console.log('API Error details:', {
      message: apiError.message,
      response: apiError.response ? {
        status: apiError.response.status,
        data: apiError.response.data
      } : 'No response',
      request: apiError.request ? 'Request exists' : 'No request'
    });
    
    // If the error is 500 Internal Server Error, log more details and try an alternative endpoint
    if (apiError.response && apiError.response.status === 500) {
      console.log('500 Server Error encountered. This could be due to:');
      console.log('1. Invalid property ID format in the database');
      console.log('2. Database connection issues');
      console.log('3. Server-side validation errors');
      
      try {
        // Try an alternative endpoint or approach if available
        console.log('Attempting to use alternative endpoint for property data');
        const altResponse = await Api.get(`/properties/mongo-id/${propertyId}?t=${Date.now()}`);
        
        if (altResponse && altResponse.data) {
          console.log('Alternative endpoint succeeded:', altResponse.data);
          return altResponse.data;
        }
      } catch (altError) {
        console.log('Alternative endpoint also failed:', altError.message);
      }
    }
    
    // If all API calls fail, use mock data as a last resort
    console.log('All API attempts failed, using mock data as fallback');
    return mockProperties[0];
  }
    } catch (error) {
      console.error('Failed to fetch property details:', error);
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
