import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

// Async thunk to fetch agent details by id
export const fetchAgentDetails = createAsyncThunk(
  "agentDetails/fetchAgentDetails",
  async (agentId, { rejectWithValue }) => {
    try {
      const response = await Api.getWithtoken(`users/agents/${agentId}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch agent details");
    }
  }
);

// Async thunk to fetch agent property details by id and propertyFor with pagination support
export const fetchAgentPropertyDetails = createAsyncThunk(
  "agentDetails/fetchAgentPropertyDetails",
  async ({ id, propertyFor }, { rejectWithValue }) => {
    try {
      const response = await Api.getWithtoken(`users/agents/${id}?propertyFor=${propertyFor}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch agent property details");
    }
  }
);

const agentDetailsSlice = createSlice({
  name: "agentDetails",
  initialState: {
    data: null,
    loading: false,
    error: null,
    agentPropertyData: null,
    agentPropertyLoading: false,
    agentPropertyError: null,
    agentPropertyPagination: null,
  },
  reducers: {
    clearAgentDetails: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
    clearAgentPropertyDetails: (state) => {
      state.agentPropertyData = null;
      state.agentPropertyLoading = false;
      state.agentPropertyError = null;
      state.agentPropertyPagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAgentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch agent details";
      })
      .addCase(fetchAgentPropertyDetails.pending, (state) => {
        state.agentPropertyLoading = true;
        state.agentPropertyError = null;
      })
      .addCase(fetchAgentPropertyDetails.fulfilled, (state, action) => {
        state.agentPropertyLoading = false;
        state.agentPropertyData = action.payload.data || action.payload; // assuming data is inside payload.data
        state.agentPropertyPagination = action.payload.pagination || null;
      })
      .addCase(fetchAgentPropertyDetails.rejected, (state, action) => {
        state.agentPropertyLoading = false;
        state.agentPropertyError = action.payload || "Failed to fetch agent property details";
      });
  },
});

export const { clearAgentDetails, clearAgentPropertyDetails } = agentDetailsSlice.actions;

export default agentDetailsSlice.reducer;
