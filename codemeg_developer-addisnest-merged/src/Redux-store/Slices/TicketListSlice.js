import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";
import { setToken } from "../../utils/tokenHandler";

const initialState = {
    Data: { pending: false, data: null, error: null },
};

export const GetTicketList = createAsyncThunk(
    "user/TicketList",
    async (body) => {
        let page=body.page
        let timeFilter=body.timeFilter;
        let sts=body.status;
        let search=body.search
        try {
            const url=`api/ticket/list?search=${search}&timeFilter=${timeFilter}&status=${sts}&page=${page}`
            const response = await Api.getWithtoken(url);
            const { data, status, message } = response
            return { data };
        } catch (error) {
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

const TicketList = createSlice({
    name: "TicketList",
    initialState,
    reducers: {
        clear: (state) => {
        },
    },
    extraReducers: (builder) => {
        builder
            // for Get TicketList Data
            .addCase(GetTicketList.pending, (state, action) => {
                state.Data.pending = true;
            })
            .addCase(GetTicketList.fulfilled, (state, action) => {
                state.Data.pending = false;
                if (action.payload.data) {
                    state.Data.data = action.payload.data;
                } else {
                    state.Data.error = action.payload.error;
                }
            })
            .addCase(GetTicketList.rejected, (state, action) => {
                state.Data.pending = false;
                state.Data.error = action.payload.error;
            })
    },
});

export const { clear } = TicketList.actions;
export default TicketList.reducer;
