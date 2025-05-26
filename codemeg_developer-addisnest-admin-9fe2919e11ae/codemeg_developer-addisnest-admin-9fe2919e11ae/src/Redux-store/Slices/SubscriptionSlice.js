import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

export const fetchSubscriptions = createAsyncThunk(
  "subscription/fetchSubscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api.getWithtoken("admin/allSubscriptions");
      return response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch subscriptions");
    }
  }
);

export const createSubscription = createAsyncThunk(
  "subscription/createSubscription",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await Api.postWithtoken("admin/createSubscriptions", payload);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || "Failed to create subscription");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create subscription");
    }
  }
);

export const updateSubscription = createAsyncThunk(
  "subscription/updateSubscription",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Include id in data payload as well
      const payload = { id, ...data };
      const response = await Api.postWithtoken(`admin/updateSubscriptions/${id}`, payload);
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || "Failed to update subscription");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update subscription");
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    subscriptions: [],
    loading: false,
    error: null,
    createLoading: false,
    createError: null,
    createSuccess: null,
    updateLoading: false,
    updateError: null,
    updateSuccess: null,
  },
  reducers: {
    clearCreateStatus: (state) => {
      state.createLoading = false;
      state.createError = null;
      state.createSuccess = null;
    },
    clearUpdateStatus: (state) => {
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch subscriptions";
      })
      .addCase(createSubscription.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = "Subscription created successfully";
        state.subscriptions.push(action.payload);
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "Failed to create subscription";
      })
      .addCase(updateSubscription.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = null;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = "Subscription updated successfully";
        const index = state.subscriptions.findIndex(sub => sub.id === action.payload.id);
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || "Failed to update subscription";
      });
  },
});

export const { clearCreateStatus, clearUpdateStatus } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
