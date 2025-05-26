import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

export const fetchAgentList = createAsyncThunk(
  "agentList/fetchAgentList",
  async ({ page = 1, search = "" }, { rejectWithValue }) => {
    try {
      const searchQuery = search ? `&search=${encodeURIComponent(search)}` : "";
      const response = await Api.getWithtoken(`admin/allAgents?page=${page}${searchQuery}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch agent list");
    }
  }
);

const agentListSlice = createSlice({
  name: "agentList",
  initialState: {
    agents: [],
    totalPages: 0,
    currentPage: 0,
    totalAgents: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgentList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgentList.fulfilled, (state, action) => {
        state.loading = false;
        state.agents = action.payload.agents || [];
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.currentPage || 1;
        state.totalAgents = action.payload.totalAgents || 0;
      })
      .addCase(fetchAgentList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch agent list";
      });
  },
});

export default agentListSlice.reducer;
