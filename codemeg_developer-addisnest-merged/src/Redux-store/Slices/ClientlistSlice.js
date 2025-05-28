import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";
import { setToken } from "../../utils/tokenHandler";

const initialState = {
    Data: { pending: false, data: null, error: null },
};

export const GetClientlist = createAsyncThunk(
    "admin/Clientlist",
    async (state) => {
        try {
            let usertype = '';
            let searchData='';
            let pageData='';

            if(state.type){
                usertype = '&status='+state?.type;
            }
            if(state.search){
                searchData = '&search='+state.search
            }
            if(state.page){
                pageData = '&page='+state.page;
            }
            let url = `api/admin/users?uType=${state?.dataType}${usertype}${searchData}${pageData}`;
            const response = await Api.getWithtoken(url);
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

const Clientlist = createSlice({
    name: "Clientlist",
    initialState,
    reducers: {
        clear: (state) => {
        },
    },
    extraReducers: (builder) => {
        builder
            // for Get Home Data
            .addCase(GetClientlist.pending, (state, action) => {
                state.Data.pending = true;
            })
            .addCase(GetClientlist.fulfilled, (state, action) => {
                state.Data.pending = false;
                if (action.payload.data) {
                    state.Data.data = action.payload.data;
                } else {
                    state.Data.error = action.payload.error;
                }
            })
            .addCase(GetClientlist.rejected, (state, action) => {
                state.Data.pending = false;
                state.Data.error = action.payload.error;
            })
    },
});

export const { clear } = Clientlist.actions;
export default Clientlist.reducer;
