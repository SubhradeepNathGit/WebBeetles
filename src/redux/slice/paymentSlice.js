import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const addPaymentDetails = createAsyncThunk('paymentSlice/addPaymentDetails',
    async (paymentDetails) => {
        // console.log('Received data for adding in payment details', paymentDetails);

        const res = await supabase.from("payment_details").insert([paymentDetails]).select();
        // console.log("Response for adding payment details", res);

        if (res?.error) return res?.error;

        return res?.data;
    }
)

const initialState = {
    isPaymentDetailsLoading: false,
    paymentData: null,
    paymentError: null
}

export const paymentSlice = createSlice({
    name: "paymentSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addPaymentDetails.pending, (state, action) => {
                state.isPaymentDetailsLoading = true;
            })
            .addCase(addPaymentDetails.fulfilled, (state, action) => {
                state.isPaymentDetailsLoading = false;
                state.paymentData = action.payload;
            })
            .addCase(addPaymentDetails.rejected, (state, action) => {
                state.isPaymentDetailsLoading = false;
                state.paymentData = null;
                state.paymentError = action.error.message;
            })
    }
})

export default paymentSlice.reducer;