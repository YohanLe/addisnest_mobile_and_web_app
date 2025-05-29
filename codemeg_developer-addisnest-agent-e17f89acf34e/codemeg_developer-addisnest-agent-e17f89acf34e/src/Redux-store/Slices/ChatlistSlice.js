import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";
import { setToken } from "../../utils/tokenHandler";

const initialState = {
    Data: { pending: false, data: null,page:null, error: null },
};

export const GetChatlistData = createAsyncThunk(
    "user/Chatlist",
    async (state) => {
        try {
            
            let url = `chat/users`;
            const response = await Api.getWithtoken(url);
            const { connectedUsers } = response
            return { data :  connectedUsers};
        } catch (error) {
            console.log("catch", error);
            
            // If the chat API endpoint doesn't exist (404), return empty data
            if (error?.response?.status === 404) {
                console.log("Chat API endpoint not available, returning empty conversations");
                return { data: [] };
            }
            
            const { status, data } = error.response || {};
            return {
                error: {
                    type: "server",
                    message: data?.detail || "Failed to load conversations",
                },
            };
        }
    }
);

const Chatlist = createSlice({
    name: "Chatlist",
    initialState,
    reducers: {
        changeStatus: (state, action) => {
           
        },
        clear: (state) => {
        },
    },
    extraReducers: (builder) => {
        builder
            // for Get Featurelist Data
            .addCase(GetChatlistData.pending, (state, action) => {
                state.Data.pending = true;
            })
            .addCase(GetChatlistData.fulfilled, (state, action) => {
                state.Data.pending = false;
                if (action.payload.data) {
                    state.Data.data = action.payload.data;
                } else {
                    state.Data.data = [];
                    state.Data.error = action.payload.error;
                }
            })
            .addCase(GetChatlistData.rejected, (state, action) => {
                state.Data.data = null;
                state.Data.pending = false;
                state.Data.error = null;
            })
    },
});

export const { clear,changeStatus } = Chatlist.actions;
export default Chatlist.reducer;
