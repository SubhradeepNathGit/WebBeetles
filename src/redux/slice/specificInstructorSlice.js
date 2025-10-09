import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance/axiosInstance";
import { endPoint_sepeficInstructor } from "../../api/apiUrl/apiUrl";

// specific instructor action 
export const specificInstructorRequest = createAsyncThunk('paymentSlice/specificInstructorRequest',
    async (id) => {
        console.log('Data received in specific instructor slice', id);

        const res = await axiosInstance.get(`${endPoint_sepeficInstructor}/${id}`);
        console.log('Response from specific instructor slice', res);

        return res.data;
    });

const initialState = {
    isSpecificInstructorLoading: false,
    getSpecificInstructorData: {},
    isSpecificInstructorError: null
}

export const specificInstructorSlice = createSlice({
    name: 'specificCourseSlice',
    initialState,
    extraReducers: (builder) => {

        // specific course reducer
        builder.addCase(specificInstructorRequest.pending, (state, action) => {
            state.isSpecificInstructorLoading = true;
        })
        builder.addCase(specificInstructorRequest.fulfilled, (state, action) => {
            state.isSpecificInstructorLoading = false;
            state.getSpecificInstructorData = action.payload;
            state.isSpecificInstructorError = null;
        })
        builder.addCase(specificInstructorRequest.rejected, (state, action) => {
            state.isSpecificInstructorLoading = false;
            state.getSpecificInstructorData = [];
            state.isSpecificInstructorError = action.error?.message;
        })
    }
});

export default specificInstructorSlice.reducer;