import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

export const fetchRentList = createAsyncThunk(
  "rentList/fetchRentList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api.getWithtoken("admin/property");
      // Filter properties where propertyFor is 'rent'
      const rentProperties = response.data.filter(
        (property) => property.propertyFor && property.propertyFor.toLowerCase() === "rent"
      );
      return {
        properties: rentProperties,
        totalProperties: rentProperties.length,
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch rent properties");
    }
  }
);

const rentListSlice = createSlice({
  name: "rentList",
  initialState: {
    properties: [],
    totalProperties: 0,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRentList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRentList.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties || [];
        state.totalProperties = action.payload.totalProperties || 0;
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchRentList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch rent properties";
      });
  },
});

export default rentListSlice.reducer;
