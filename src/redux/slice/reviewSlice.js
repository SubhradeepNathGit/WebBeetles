import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance/axiosInstance";
import { endPoint_courseReview1, endPoint_courseReview2 } from "../../api/apiUrl/apiUrl";

// add review action 
export const addReviewRequest = createAsyncThunk('reviewSlice/addReviewRequest',
    async ({ reviewObj, id }) => {
        // console.log('Received data in add review slice', reviewObj, id);

        const res = await axiosInstance.post(`${endPoint_courseReview1}${id}${endPoint_courseReview2}`, reviewObj);
        // console.log('Response from add review slice', res);

        return res.data;
    });

const initialState = {
    isReviewPending: false,
    getReviewData: [],
    isReviewError: null
}

export const reviewSlice = createSlice({
    name: 'reviewSlice',
    initialState,
    extraReducers: (builder) => {
        // add review slice 
        builder.addCase(addReviewRequest.pending, (state, action) => {
            state.isReviewPending = true;
        })
        builder.addCase(addReviewRequest.fulfilled, (state, action) => {
            state.isReviewPending = false;
            state.getReviewData = action.payload;
            state.isReviewError = null;
        })
        builder.addCase(addReviewRequest.rejected, (state, action) => {
            state.isReviewPending = false;
            state.getReviewData = [];
            state.isReviewError = action.error?.message;
        })
    }
})

export default reviewSlice.reducer;