import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api.getWithtoken("admin/dashboard");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    roleCounts: {},
    propertyCounts: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.roleCounts = action.payload.roleCounts;
        state.propertyCounts = action.payload.propertyCounts;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch dashboard stats";
      });
  },
});

export default dashboardSlice.reducer;
