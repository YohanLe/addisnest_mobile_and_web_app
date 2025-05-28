import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

const initialState = {
    data: { pending: false, data: null, error: null },
};

export const GetWishList = createAsyncThunk(
    "user/WishList",
    async (state) => {
        try {
            const response = await Api.getWithtoken(`wishlist`);
            const data = response;
            return {data };
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

const WishList = createSlice({
    name: "WishList",
    initialState,
    reducers: {
        changeStatus: (state, action) => {
            // const { id } = action.payload;
            // if (state?.alldata?.data) {
            //     state.alldata.data = state.alldata.data.map((item) => {
            //         if (item.id === id) {
            //             return { ...item, active_status: item.active_status === 'ACTIVE' ? 'IN-ACTIVE' : 'ACTIVE' };
            //         }
            //         return item;
            //     });
            // }
        },
        clear: (state) => {
        },
    },
    extraReducers: (builder) => {
        builder
            // for Get AllActiveService Data
            .addCase(GetWishList.pending, (state, action) => {
                state.data.pending = true;
            })
            .addCase(GetWishList.fulfilled, (state, action) => {
                state.data.pending = false;
                if (action.payload.data) {
                    state.data.data = action.payload.data;
                } else {
                    state.data.data = [];
                    state.data.error = action.payload.error;
                }
            })
            .addCase(GetWishList.rejected, (state, action) => {
                state.data.data = null;
                state.data.pending = false;
                state.data.error = null;
            })
    },
});

export const { clear } = WishList.actions;
export default WishList.reducer;
