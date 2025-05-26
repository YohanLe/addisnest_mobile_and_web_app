import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

// Async thunk to fetch user details by id
export const fetchUserDetails = createAsyncThunk(
  "userDetails/fetchUserDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await Api.getWithtoken(`users/usersDetails/${userId}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user details");
    }
  }
);

// Async thunk to fetch user property details by id and propertyFor with pagination support
export const fetchUserPropertyDetails = createAsyncThunk(
  "userDetails/fetchUserPropertyDetails",
  async ({ id, propertyFor }, { rejectWithValue }) => {
    try {
      const response = await Api.getWithtoken(`users/usersDetails/${id}?propertyFor=${propertyFor}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user property details");
    }
  }
);

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState: {
    data: null,
    loading: false,
    error: null,
    userPropertyData: null,
    userPropertyLoading: false,
    userPropertyError: null,
    userPropertyPagination: null,
  },
  reducers: {
    clearUserDetails: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
    clearUserPropertyDetails: (state) => {
      state.userPropertyData = null;
      state.userPropertyLoading = false;
      state.userPropertyError = null;
      state.userPropertyPagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user details";
      })
      .addCase(fetchUserPropertyDetails.pending, (state) => {
        state.userPropertyLoading = true;
        state.userPropertyError = null;
      })
      .addCase(fetchUserPropertyDetails.fulfilled, (state, action) => {
        state.userPropertyLoading = false;
        state.userPropertyData = action.payload.data || action.payload;
        state.userPropertyPagination = action.payload.pagination || null;
      })
      .addCase(fetchUserPropertyDetails.rejected, (state, action) => {
        state.userPropertyLoading = false;
        state.userPropertyError = action.payload || "Failed to fetch user property details";
      });
  },
});

export const { clearUserDetails, clearUserPropertyDetails } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;
