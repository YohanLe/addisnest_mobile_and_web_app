import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../Apis/Api';

// Async thunk for fetching user payment history
export const GetUserPayments = createAsyncThunk(
  'payments/getUserPayments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/payments/history');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch payment history');
    }
  }
);

const initialState = {
  userPayments: {
    data: null,
    pending: false,
    error: null
  }
};

const PaymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    resetPayments: (state) => {
      state.userPayments = {
        data: null,
        pending: false,
        error: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetUserPayments.pending, (state) => {
        state.userPayments.pending = true;
        state.userPayments.error = null;
      })
      .addCase(GetUserPayments.fulfilled, (state, action) => {
        state.userPayments.pending = false;
        state.userPayments.data = action.payload;
      })
      .addCase(GetUserPayments.rejected, (state, action) => {
        state.userPayments.pending = false;
        state.userPayments.error = action.payload;
      });
  }
});

export const { resetPayments } = PaymentSlice.actions;
export default PaymentSlice.reducer;
