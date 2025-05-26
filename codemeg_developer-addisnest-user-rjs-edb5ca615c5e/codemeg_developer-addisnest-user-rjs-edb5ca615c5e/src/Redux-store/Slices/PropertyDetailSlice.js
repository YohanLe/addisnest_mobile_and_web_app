import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";
import { setToken } from "../../utils/tokenHandler";

const initialState = {
    data: { pending: false, data: null, error: null },
};

export const GetPropertyDetail = createAsyncThunk(
    "user/PropertyDetail",
    async (state) => {
        const id=state.id
        try {
            const response = await Api.getWithtoken(`properties/${id}`);
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

const PropertyDetail = createSlice({
    name: "PropertyDetail",
    initialState,
    reducers: {
        clear: (state) => {
        },
    },
    extraReducers: (builder) => {
        builder
            // for Get PropertyDetail Data
            .addCase(GetPropertyDetail.pending, (state, action) => {
                state.data.pending = true;
            })
            .addCase(GetPropertyDetail.fulfilled, (state, action) => {
                state.data.pending = false;
                if (action.payload.data) {
                    state.data.data = action.payload.data;
                } else {
                    state.data.error = action.payload.error;
                }
            })
            .addCase(GetPropertyDetail.rejected, (state, action) => {
                state.data.pending = false;
                state.data.error = action.payload.error;
            })
    },
});

export const { clear } = PropertyDetail.actions;
export default PropertyDetail.reducer;
