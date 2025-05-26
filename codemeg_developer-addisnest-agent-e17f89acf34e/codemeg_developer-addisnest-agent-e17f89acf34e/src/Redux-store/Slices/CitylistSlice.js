import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

const initialState = {
    Data: { pending: false, data: null, error: null },
};

export const GetCitylistData = createAsyncThunk(
    "user/Citylist",
    async (state) => {
        const id=state.id
        try {
            let newid = '';
            if(id){
                newid=`/${id}`;
            }
            let url = `api/crc/state/cities${newid}`;
            console.log(url)
            const response = await Api.getWithtoken(url);
            const { data } = response
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

const Citylist = createSlice({
    name: "Citylist",
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
            // for Get Citylist Data
            .addCase(GetCitylistData.pending, (state, action) => {
                state.Data.pending = true;
            })
            .addCase(GetCitylistData.fulfilled, (state, action) => {
                state.Data.pending = false;
                if (action.payload.data) {
                    state.Data.data = action.payload.data;
                } else {
                    state.Data.data = [];
                    state.Data.error = action.payload.error;
                }
            })
            .addCase(GetCitylistData.rejected, (state, action) => {
                state.Data.data = null;
                state.Data.pending = false;
                state.Data.error = null;
            })
    },
});

export const { clear } = Citylist.actions;
export default Citylist.reducer;
