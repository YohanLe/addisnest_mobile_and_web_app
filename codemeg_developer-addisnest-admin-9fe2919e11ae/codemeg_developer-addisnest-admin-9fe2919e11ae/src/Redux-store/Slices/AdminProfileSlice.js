import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

export const fetchProfile = createAsyncThunk(
  "adminProfile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Api.getWithtoken("auth/profile");
      if (response.result && response.result.success) {
        return response.result.data;
      } else {
        return rejectWithValue("Failed to fetch profile");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch profile");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "adminProfile/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await Api.postWithtoken("auth/updateProfile", payload);
      console.log(response.update.success)
      if (response.update && response.update.success) {
          console.log(response)
        return response.update.data;
      }
     else {
        return rejectWithValue("Failed to update profile");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update profile");
    }
  }
);

const adminProfileSlice = createSlice({
  name: "adminProfile",
  initialState: {
    profile: null,
    loading: false,
    error: null,
    updateLoading: false,
    updateError: null,
    updateSuccess: null,
  },
  reducers: {
    clearUpdateStatus: (state) => {
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch profile";
      })
      .addCase(updateProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = "Profile updated successfully";
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || "Failed to update profile";
      });
  },
});

export const { clearUpdateStatus } = adminProfileSlice.actions;

export default adminProfileSlice.reducer;
