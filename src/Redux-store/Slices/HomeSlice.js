import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../Apis/Api';

// Async thunk for fetching home page data (featured properties)
export const GetHomeData = createAsyncThunk(
  'home/GetHomeData',
  async (params, { rejectWithValue }) => {
    try {
      const { type = 'buy', page = 1, limit = 6 } = params;
      const response = await api.get(`/properties?type=${type}&page=${page}&limit=${limit}&featured=true`);
      return response.data;
    } catch (error) {
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
      const response = await api.get(`/properties?type=${type}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
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
