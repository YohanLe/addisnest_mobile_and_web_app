import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Api from "../../Apis/Api";

const initialState = {
    Details: { pending: false, data: null, error: null },
};

export const AuthUserDetails = createAsyncThunk("userdataupdate",
    async (state) => {
        try {
            // Check if this is a test mode with mock token
            if (localStorage.getItem('addisnest_token') === 'test-token-123456') {
                console.log('Using mock user data for test mode');
                // Return mock user data directly
                return { 
                    data: {
                        _id: localStorage.getItem('userId') || 'test-user-id',
                        firstName: 'Test',
                        lastName: 'User',
                        email: 'test@example.com',
                        isVerified: true,
                        userType: 'customer'
                    }
                };
            }
            
            // Normal API call for real token
            const response = await Api.get(`auth/profile`);
            console.log('AuthUserDetails response:', response);
            
            if (response && response.data && response.data.result) {
                const { result } = response.data;
                return { data: result };
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            return {
                error: {
                    type: "server",
                    message: "Failed to fetch user data",
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
        },
        login: (state, action) => {
            state.Details = { pending: false, data: action.payload, error: null }
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


export const { clearUserAuthLogin, UserAuthLogin, logout, login } = Authentication.actions;
export default Authentication.reducer;
