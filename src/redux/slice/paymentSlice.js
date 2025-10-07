 import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance/axiosInstance";
import { endPoint_payment_create } from "../../api/apiUrl/apiUrl";

export const makePayment = createAsyncThunk('paymentSlice/makePayment',
    async (id) => {
        console.log('Received data in payment slice', id);

        const res = await axiosInstance.post(`${endPoint_payment_create}/${id}`);
        console.log('Response from payment slice', res);

        return res.data;
    });


const initialState = {
    isPaymentPending: false,
    getPaymentData: {},
    isPaymentError: null
}

export const paymentSlice = createSlice({
    name: 'paymentSlice',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(makePayment.pending, (state, action) => {
            state.isPaymentPending = true;
        })
        builder.addCase(makePayment.fulfilled, (state, action) => {
            state.isPaymentPending = false;
            state.getPaymentData = action.payload;
            state.isPaymentError = null;
        })
        builder.addCase(makePayment.rejected, (state, action) => {
            state.isPaymentPending = false;
            state.getPaymentData = [];
            state.isPaymentError = action.error?.message;
        })
    }
})

export default paymentSlice.reducer;