import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

const initialState = {
    Details: { pending: false, data: null, error: null },
};

export const AuthUserDetails = createAsyncThunk("userdataupdate",
    async (state) => {
        try {
            const response = await Api.getWithtoken(`auth/profile`);
            const {result} = response
            return { data: result.data}
        } catch (error) {
            const { status, data } = error.response;
            return {
                error: {
                    type: "server",
                    message: "Something went wrong",
                },
            };
        }
    }
);

const Authentication = createSlice({
    name: "Authentication",
    initialState,
    reducers: {
        UserAuthLogin: (state , action) => {
            state.Details = { pending: false, data:action.payload, error: null }
        },
        clearUserAuthLogin: (state) => {
            state.Details = { pending: false, data: null, error: null }
        },
        logout: (state) => {
            state.Details = { pending: false, data: null, error: null }
        }
    }, extraReducers: (builder) => {
        builder
            .addCase(AuthUserDetails.pending, (state, action) => {
                state.Details.pending = true;
            })
            .addCase(AuthUserDetails.fulfilled, (state, action) => {
                state.Details.pending = false;
                if (action.payload.data) {
                    state.Details.data = action.payload.data;
                } else {
                    state.Details.error = action.payload.error;
                }
            })
            .addCase(AuthUserDetails.rejected, (state, action) => {
                state.Details.pending = false;
                if (action?.payload?.error) {
                    state.Details.error = action?.payload?.error;
                } else {
                    state.Details.error = {
                        type: "server",
                        message: "Internal server Error",
                    }
                }
            })
    },
});


export const { clearUserAuthLogin,UserAuthLogin, logout } = Authentication.actions;
export default Authentication.reducer;


