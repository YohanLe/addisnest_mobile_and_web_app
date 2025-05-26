import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    location: { pending: false, data: null, error: null },
};

const Locationadd = createSlice({
    name: "Locationadd",
    initialState,
    reducers: {
        UserLocationadd: (state , action) => {
            state.location = { pending: false, data:action.payload, error: null }
        },
        clearLocationadd: (state) => {
            state.location = { pending: false, data: null, error: null }
        }
    }
});


export const { clearLocationadd,UserLocationadd } = Locationadd.actions;
export default Locationadd.reducer;
