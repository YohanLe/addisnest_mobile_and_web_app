import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";
import { setToken } from "../../utils/tokenHandler";

const initialState = {
    Data: { pending: false, data: null, error: null },
};

export const GetPropertyList = createAsyncThunk(
    "agent/PropertyList",
    async (state) => {
        const type=state.type
        try {
            const response = await Api.getWithtoken(`properties/agentProperties?status=${type}&limit=1000`);
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

const PropertyList = createSlice({
    name: "PropertyList",
    initialState,
    reducers: {
        clear: (state) => {
        },
    },
    extraReducers: (builder) => {
        builder
            // for Get PropertyList Data
            .addCase(GetPropertyList.pending, (state, action) => {
                state.Data.pending = true;
            })
            .addCase(GetPropertyList.fulfilled, (state, action) => {
                state.Data.pending = false;
                if (action.payload.data) {
                    state.Data.data = action.payload.data;
                } else {
                    state.Data.error = action.payload.error;
                }
            })
            .addCase(GetPropertyList.rejected, (state, action) => {
                state.Data.pending = false;
                state.Data.error = action.payload.error;
            })
    },
});

export const { clear } = PropertyList.actions;
export default PropertyList.reducer;
