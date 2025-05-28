import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";
import { setToken } from "../../utils/tokenHandler";

const initialState = {
    data: { pending: false, data: null, error: null },
};

export const GetAgentDetails = createAsyncThunk(
    "user/AgentDetails",
    async (state) => {
        const id=state.id
        try {
            const response = await Api.getWithtoken(`users/agents/${id}`);
            const data = response;
           
            return { data };
        } catch (error) {
            console.log("catch", error);
            const { status, data } = error.response;
            return {
                error: {
                    type: "server",
                    message: data.detail,
                },
            };
        }
    }
);

const AgentDetails = createSlice({
    name: "AgentDetails",
    initialState,
    reducers: {
        clear: (state) => {
        },
    },
    extraReducers: (builder) => {
        builder
            // for Get AgentDetails Data
            .addCase(GetAgentDetails.pending, (state, action) => {
                state.data.pending = true;
            })
            .addCase(GetAgentDetails.fulfilled, (state, action) => {
                state.data.pending = false;
                if (action.payload.data) {
                    state.data.data = action.payload.data;
                } else {
                    state.data.error = action.payload.error;
                }
            })
            .addCase(GetAgentDetails.rejected, (state, action) => {
                state.data.pending = false;
                state.data.error = action.payload.error;
            })
    },
});

export const { clear } = AgentDetails.actions;
export default AgentDetails.reducer;
