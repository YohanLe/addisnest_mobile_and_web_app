import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../Apis/Api';

// Async thunk for fetching home page data (all properties)
export const GetHomeData = createAsyncThunk(
  'home/GetHomeData',
  async (params, { rejectWithValue }) => {
    try {
      const { type = 'buy', page = 1, limit = 12, featured = false } = params;
      
      // Enhanced logging for debugging
      console.log('Fetching all properties for home page, not filtering by featured status');
      console.log('API Request URL:', `/properties?type=${type}&page=${page}&limit=${limit}`);
      
      // Make the API request
      const response = await api.get(`/properties?page=${page}&limit=${limit}`);
      
      // Log the response
      console.log('API Response for properties:', response.data);
      
      // Return the data
      return response.data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch home data');
    }
  }
);

// Async thunk for fetching all property listings
export const GetAllPropertyListings = createAsyncThunk(
  'home/GetAllPropertyListings',
  async (params, { rejectWithValue }) => {
    try {
      const { type = 'buy', page = 1, limit = 9 } = params;
      // Using 'for' parameter instead of 'type' to match the backend controller
      console.log(`Fetching properties with for=${type}, page=${page}, limit=${limit}`);
      const response = await api.get(`/properties?for=${type}&page=${page}&limit=${limit}`);
      console.log('Properties response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching property listings:', error);
      return rejectWithValue(error.response?.data || 'Failed to fetch property listings');
    }
  }
);

const initialState = {
  HomeData: {
    data: null,
    pending: false,
    error: null
  },
  PropertyListings: {
    data: null,
    pending: false,
    error: null
  }
};

const HomeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    resetHomeData: (state) => {
      state.HomeData = {
        data: null,
        pending: false,
        error: null
      };
    },
    resetPropertyListings: (state) => {
      state.PropertyListings = {
        data: null,
        pending: false,
        error: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Featured properties reducers
      .addCase(GetHomeData.pending, (state) => {
        state.HomeData.pending = true;
        state.HomeData.error = null;
      })
      .addCase(GetHomeData.fulfilled, (state, action) => {
        state.HomeData.pending = false;
        state.HomeData.data = action.payload;
      })
      .addCase(GetHomeData.rejected, (state, action) => {
        state.HomeData.pending = false;
        state.HomeData.error = action.payload;
      })
      
      // All property listings reducers
      .addCase(GetAllPropertyListings.pending, (state) => {
        state.PropertyListings.pending = true;
        state.PropertyListings.error = null;
      })
      .addCase(GetAllPropertyListings.fulfilled, (state, action) => {
        state.PropertyListings.pending = false;
        state.PropertyListings.data = action.payload;
      })
      .addCase(GetAllPropertyListings.rejected, (state, action) => {
        state.PropertyListings.pending = false;
        state.PropertyListings.error = action.payload;
      });
  }
});

export const { resetHomeData } = HomeSlice.actions;
export default HomeSlice.reducer;
