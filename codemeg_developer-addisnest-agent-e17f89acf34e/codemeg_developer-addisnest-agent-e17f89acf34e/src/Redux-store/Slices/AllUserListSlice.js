import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";
const initialState = {
    data: { pending: false, data: null, error: null },
};

export const GetAllUserList = createAsyncThunk(
    "user/AllUserList",
    async (state) => {
        try {
            const response = await Api.getWithtoken(`admin/allCustomers`);
            const { data, status, message } = response
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

const AllUserList = createSlice({
    name: "AllUserList",
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
            .addCase(GetAllUserList.pending, (state, action) => {
                state.data.pending = true;
            })
            .addCase(GetAllUserList.fulfilled, (state, action) => {
                state.data.pending = false;
                if (action.payload.data) {
                    state.data.data = action.payload.data;
                } else {
                    state.data.data = [];
                    state.data.error = action.payload.error;
                }
            })
            .addCase(GetAllUserList.rejected, (state, action) => {
                state.data.data = null;
                state.data.pending = false;
                state.data.error = null;
            })
    },
});

export const { clear } = AllUserList.actions;
export default AllUserList.reducer;
