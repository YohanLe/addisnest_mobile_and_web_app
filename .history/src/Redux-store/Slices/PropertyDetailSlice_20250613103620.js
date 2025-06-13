import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Api from '../../Apis/Api';

// Import mock data from PropertyListSlice
const mockProperties = [
  {
    id: "mock1",
    property_type: { value: 'house', label: 'House' },
    propertyFor: "For Sale",
    price: 5000000,
    address: "Bole Road, Addis Ababa",
    beds: 3,
    bathroom_information: [{}, {}], // 2 bathrooms
    property_size: 250,
    status: "active",
    createdAt: new Date().toISOString(),
    views: 125,
    description: "Beautiful house in prime location with modern amenities. This property features spacious rooms, a beautiful garden, and is located in a quiet neighborhood close to all amenities.",
    media: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1453&q=80",
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1558&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    ],
    features: [
      { type: "Interior", name: "Air Conditioning" },
      { type: "Interior", name: "Hardwood Floors" },
      { type: "Exterior", name: "Garden" },
      { type: "Exterior", name: "Parking" },
      { type: "Community", name: "Security" }
    ],
    user: {
      id: "agent1",
      name: "John Doe",
      profile_img: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  },
  {
    id: "mock2",
    property_type: { value: 'apartment', label: 'Apartment' },
    propertyFor: "For Rent",
    price: 25000,
    address: "CMC Area, Addis Ababa",
    beds: 2,
    bathroom_information: [{}], // 1 bathroom
    property_size: 120,
    status: "pending",
    createdAt: new Date().toISOString(),
    views: 87,
    description: "Modern apartment with great amenities in a convenient location. Features include a well-equipped kitchen, spacious living area, and access to community facilities.",
    media: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1598928636135-d146006ff4be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
    ],
    features: [
      { type: "Interior", name: "Built-in Wardrobes" },
      { type: "Interior", name: "Modern Kitchen" },
      { type: "Community", name: "Gym" },
      { type: "Community", name: "Swimming Pool" }
    ],
    user: {
      id: "agent2",
      name: "Jane Smith",
      profile_img: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  },
  {
    id: "mock3",
    property_type: { value: 'villa', label: 'Villa' },
    propertyFor: "For Sale",
    price: 12000000,
    address: "Old Airport, Addis Ababa",
    beds: 5,
    bathroom_information: [{}, {}, {}, {}], // 4 bathrooms
    property_size: 450,
    status: "active",
    createdAt: new Date().toISOString(),
    views: 215,
    description: "Luxurious villa with garden and pool in an exclusive neighborhood. This property offers spacious living areas, high-end finishes, and premium amenities for comfortable family living.",
    media: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1558&q=80",
      "https://images.unsplash.com/photo-1584622781867-1c5e76b48ba7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    ],
    features: [
      { type: "Interior", name: "High Ceilings" },
      { type: "Interior", name: "Marble Floors" },
      { type: "Exterior", name: "Swimming Pool" },
      { type: "Exterior", name: "Large Garden" },
      { type: "Security", name: "CCTV" },
      { type: "Security", name: "24/7 Security" }
    ],
    user: {
      id: "agent3",
      name: "Michael Johnson",
      profile_img: "https://randomuser.me/api/portraits/men/45.jpg"
    }
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
    
    // Only use mock data if response.data.success is explicitly false
    if (response.data.hasOwnProperty('success') && response.data.success === false) {
      console.log('API returned unsuccessful response, using mock data');
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
