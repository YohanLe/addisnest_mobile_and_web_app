import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

export const fetchUserList = createAsyncThunk(
  "userList/fetchUserList",
  async ({ page = 1, search = "" }, { rejectWithValue }) => {
    try {
      const searchQuery = search ? `&search=${encodeURIComponent(search)}` : "";
      const response = await Api.getWithtoken(`admin/allCustomers?page=${page}${searchQuery}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user list");
    }
  }
);

const userListSlice = createSlice({
  name: "userList",
  initialState: {
    customers: [],
    totalPages: 0,
    currentPage: 0,
    totalCustomers: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers || [];
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.currentPage || 1;
        state.totalCustomers = action.payload.totalCustomers || 0;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user list";
      });
  },
});

export default userListSlice.reducer;
