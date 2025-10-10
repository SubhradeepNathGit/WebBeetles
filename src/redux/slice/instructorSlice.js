import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance/axiosInstance";
import { endPoint_allInstructor, endPoint_requestInstructor, endPoint_requestInstructorStatus, endPoint_sepeficInstructor } from "../../api/apiUrl/apiUrl";

// request instructor action 
export const instructorRequest = createAsyncThunk('paymentSlice/instructorSlice',
    async (data) => {
        console.log('Received data in instructor request slice', data);

        const res = await axiosInstance.post(endPoint_requestInstructor, data);
        console.log('Response from instructor request slice', res);

        return res.data;
    });

// request status action 
export const instructorRequestStatus = createAsyncThunk('paymentSlice/instructorRequestStatus',
    async (data) => {
        console.log('Received data in instructor request status slice', data);

        const res = await axiosInstance.post(endPoint_requestInstructorStatus, data);
        console.log('Response from instructor request status slice', res);

        return res.data;
    });

// all instructor action 
export const allInstructor = createAsyncThunk('paymentSlice/allInstructor',
    async () => {
        const res = await axiosInstance.get(endPoint_allInstructor);
        // console.log('Response from all instructor slice', res);

        return res.data;
    });


const initialState = {
    isInstructorPending: false,
    getInstructorData: [],
    isInstructorError: null
}

export const instructorSlice = createSlice({
    name: 'instructorSlice',
    initialState,
    extraReducers: (builder) => {
        // request instructor slice 
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

        // instructor request status slice 
        builder.addCase(instructorRequestStatus.pending, (state, action) => {
            state.isInstructorPending = true;
        })
        builder.addCase(instructorRequestStatus.fulfilled, (state, action) => {
            state.isInstructorPending = false;
            state.getInstructorData = action.payload;
            state.isInstructorError = null;
        })
        builder.addCase(instructorRequestStatus.rejected, (state, action) => {
            state.isInstructorPending = false;
            state.getInstructorData = [];
            state.isInstructorError = action.error?.message;
        })
        
        // all instructor slice 
        builder.addCase(allInstructor.pending, (state, action) => {
            state.isInstructorPending = true;
        })
        builder.addCase(allInstructor.fulfilled, (state, action) => {
            state.isInstructorPending = false;
            state.getInstructorData = action.payload;
            state.isInstructorError = null;
        })
        builder.addCase(allInstructor.rejected, (state, action) => {
            state.isInstructorPending = false;
            state.getInstructorData = [];
            state.isInstructorError = action.error?.message;
        })

    }
})

export default instructorSlice.reducer;