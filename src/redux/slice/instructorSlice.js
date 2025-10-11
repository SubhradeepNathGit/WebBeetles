import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance/axiosInstance";
import { endPoint_allInstructor, endPoint_editInstructorProfile, endPoint_requestInstructor, endPoint_requestInstructorStatus, endPoint_sepeficInstructor } from "../../api/apiUrl/apiUrl";

// request instructor action 
export const instructorRequest = createAsyncThunk('instructorSlice/instructorSlice',
    async (data) => {
        // console.log('Received data in instructor request slice', data);

        const res = await axiosInstance.post(endPoint_requestInstructor, data);
        // console.log('Response from instructor request slice', res);

        return res.data;
    });

// request status action 
export const instructorRequestStatus = createAsyncThunk('instructorSlice/instructorRequestStatus',
    async (data) => {
        console.log('Received data in instructor request status slice', data);

        const res = await axiosInstance.post(endPoint_requestInstructorStatus, data);
        console.log('Response from instructor request status slice', res);

        return res.data;
    });

// all instructor action 
export const allInstructor = createAsyncThunk('instructorSlice/allInstructor',
    async () => {
        const res = await axiosInstance.get(endPoint_allInstructor);
        // console.log('Response from all instructor slice', res);

        return res.data;
    });

// specific instructor action 
export const specificInstructor = createAsyncThunk('instructorSlice/specificInstructor',
    async (id) => {
        // console.log('Received data in specific instructor details slice', id);

        const res = await axiosInstance.get(`${endPoint_sepeficInstructor}/${id}`);
        // console.log('Response from specific instructor slice', res);

        return res.data;
    });

// Update instructor action 
export const updateInstructor = createAsyncThunk('updateInstructor/specificInstructor',
    async (data) => {
        // console.log('Update instructor details slice', id);

        const res = await axiosInstance.post(endPoint_editInstructorProfile, data);
        // console.log('Response from Update instructor slice', res);

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

        // specific instructor slice 
        builder.addCase(specificInstructor.pending, (state, action) => {
            state.isInstructorPending = true;
        })
        builder.addCase(specificInstructor.fulfilled, (state, action) => {
            state.isInstructorPending = false;
            state.getInstructorData = action.payload;
            state.isInstructorError = null;
        })
        builder.addCase(specificInstructor.rejected, (state, action) => {
            state.isInstructorPending = false;
            state.getInstructorData = [];
            state.isInstructorError = action.error?.message;
        })

        // update instructor slice 
        builder.addCase(updateInstructor.pending, (state, action) => {
            state.isInstructorPending = true;
        })
        builder.addCase(updateInstructor.fulfilled, (state, action) => {
            state.isInstructorPending = false;
            state.getInstructorData = action.payload;
            state.isInstructorError = null;
        })
        builder.addCase(updateInstructor.rejected, (state, action) => {
            state.isInstructorPending = false;
            state.getInstructorData = [];
            state.isInstructorError = action.error?.message;
        })

    }
})

export default instructorSlice.reducer;