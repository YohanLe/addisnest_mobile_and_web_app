import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Api from '../../Apis/Api';
import { transformApiDataToPropertyDetail } from '../../utils/propertyTransformers';

// Function to transform API data to property detail format moved to utils/propertyTransformers.js

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

// Async thunk for fetching similar properties
export const getSimilarProperties = createAsyncThunk(
  'propertyDetail/getSimilarProperties',
  async (propertyDetails, { rejectWithValue }) => {
    try {
      if (!propertyDetails) {
        console.log('No property details provided for getting similar properties');
        return rejectWithValue('No property details provided');
      }
      
      // Extract criteria to find similar properties
      const { 
        property_type, 
        propertyType, 
        regional_state, 
        city, 
        property_for, 
        propertyFor,
        offeringType,
        price,
        total_price,
        _id
      } = propertyDetails;
      
      // Build query params to find similar properties
      const queryParams = new URLSearchParams({
        propertyType: property_type || propertyType || 'all',
        regionalState: regional_state || 'all',

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
