import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";
import { setToken } from "../../utils/tokenHandler";

const initialState = {
    HomeData: { pending: false, data: null, error: null },
};

export const GetHomeData = createAsyncThunk(
    "user/home",
    async (state) => {
        const type=state.type
        try {
            const response = await Api.getWithtoken(`properties/allProperties?propertyFor=${type}`);
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

const Home = createSlice({
    name: "Home",
    initialState,
    reducers: {
        clear: (state) => {
        },
    },
    extraReducers: (builder) => {
        builder
            // for Get Home Data
            .addCase(GetHomeData.pending, (state, action) => {
                state.HomeData.pending = true;
            })
            .addCase(GetHomeData.fulfilled, (state, action) => {
                state.HomeData.pending = false;
                if (action.payload.data) {
                    state.HomeData.data = action.payload.data;
                } else {
                    state.HomeData.error = action.payload.error;
                }
            })
            .addCase(GetHomeData.rejected, (state, action) => {
                state.HomeData.pending = false;
                state.HomeData.error = action.payload.error;
            })
    },
});

export const { clear } = Home.actions;
export default Home.reducer;
