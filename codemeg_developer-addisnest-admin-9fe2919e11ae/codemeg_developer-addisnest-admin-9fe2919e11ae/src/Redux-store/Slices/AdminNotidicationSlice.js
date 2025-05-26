import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const user_id = localStorage.getItem("userId");
      if (!user_id) {
        return rejectWithValue("User ID not found");
      }
      const response = await Api.get("notification", { user_id });
      return response.notifications || [];
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch notifications");
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch notifications";
      });
  },
});

export default notificationSlice.reducer;
