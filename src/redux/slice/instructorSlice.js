import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance/axiosInstance";
import { endPoint_requestInstructor } from "../../api/apiUrl/apiUrl";

export const instructorRequest = createAsyncThunk('paymentSlice/instructorSlice',
    async (data) => {
        console.log('Received data in instructor slice', data);

        const res = await axiosInstance.post(endPoint_requestInstructor, data);
        console.log('Response from instructor slice', res);

        return res.data;
    });

const initialState = {
    isInstructorPending: false,
    getInstructorData: {},
    isInstructorError: null
}

export const instructorSlice = createSlice({
    name: 'instructorSlice',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(instructorRequest.pending, (state, action) => {
            state.isInstructorPending = true;
        })
        builder.addCase(instructorRequest.fulfilled, (state, action) => {
            state.isInstructorPending = false;
            state.getInstructorData = action.payload;
            state.isInstructorError = null;
        })
        builder.addCase(instructorRequest.rejected, (state, action) => {
            state.isInstructorPending = false;
            state.getInstructorData = [];
            state.isInstructorError = action.error?.message;
        })
    }
})

export default instructorSlice.reducer;