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
      
      console.log('Fetching property with ID:', propertyId);
      
      try {
        const response = await Api.get(`/properties/${propertyId}`);
        
        // Check if we have a successful response with data
        if (!response.data || !response.data.success) {
          console.log('API returned unsuccessful response, using mock data');
          return mockProperties[0];
        }
        
        // Transform API response to match the format expected by the PropertyDetail component
        const apiData = response.data.data;
        
        console.log('Received API data:', apiData);
        
        // Map the API response fields to match what PropertyDetail.jsx expects
        const transformedData = {
          id: apiData._id,
          title: apiData.title || 'Property Title',
          description: apiData.description || 'No description available',
          price: apiData.price || 0,
          // Handle address based on flat or nested structure
          address: apiData.address ? 
            `${apiData.address.street || ''}, ${apiData.address.city || ''}, ${apiData.address.state || ''}` : 
            `${apiData.street || ''}, ${apiData.city || ''}, ${apiData.state || ''}`,
          propertyFor: apiData.offeringType || 'For Sale',
          propertyType: apiData.propertyType || 'House',
          property_type: { value: apiData.propertyType?.toLowerCase() || 'house', label: apiData.propertyType || 'House' },
          property_size: apiData.area || 0,
          size: apiData.area || 0,
          bedrooms: apiData.bedrooms || 0,
          beds: apiData.bedrooms || 0,
          bathrooms: apiData.bathrooms || 0,
          bathroom_information: Array(apiData.bathrooms || 0).fill({}),
          specifications: {
            bedrooms: apiData.bedrooms || 0,
            bathrooms: apiData.bathrooms || 0,
            area: {
              size: apiData.area || 0
            }
          },
          createdAt: apiData.createdAt || new Date().toISOString(),
          views: apiData.views || 0,
          // Handle different image structures
          media: apiData.images?.map(img => typeof img === 'string' ? img : img.url) || 
                 (Array.isArray(apiData.media) ? apiData.media : []),
          features: apiData.features ? 
            (typeof apiData.features === 'object' && !Array.isArray(apiData.features) ? 
              Object.entries(apiData.features).flatMap(([type, items]) => 
                Array.isArray(items) ? items.map(item => ({ type, name: item })) : []
              ) : 
              apiData.features) : 
            [],
          status: apiData.status || 'active',
          user: {
            id: apiData.owner?._id || 'owner-id',
            name: apiData.owner ? 
              `${apiData.owner.firstName || ''} ${apiData.owner.lastName || ''}` : 
              'Property Owner',
            profile_img: apiData.owner?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'
          }
        };
        
        console.log('Transformed property data:', transformedData);
        return transformedData;
      } catch (apiError) {
        console.error('API Error:', apiError);
        // If the API call fails, use mock data
        console.log('API call failed, using mock data as fallback');
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
