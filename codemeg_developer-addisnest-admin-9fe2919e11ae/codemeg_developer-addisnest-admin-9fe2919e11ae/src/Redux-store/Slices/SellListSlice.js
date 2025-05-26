import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

export const fetchSellList = createAsyncThunk(
  "sellList/fetchSellList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api.getWithtoken("admin/property");
      // Filter properties where propertyFor is 'sell'
      const sellProperties = response.data.filter(
        (property) => property.propertyFor && property.propertyFor.toLowerCase() === "sell"
      );
      return {
        properties: sellProperties,
        totalProperties: sellProperties.length,
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch sell properties");
    }
  }
);

const sellListSlice = createSlice({
  name: "sellList",
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
      .addCase(fetchSellList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellList.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties || [];
        state.totalProperties = action.payload.totalProperties || 0;
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchSellList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch sell properties";
      });
  },
});

export default sellListSlice.reducer;
