/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance/axiosInstance";
import { endPoint_categoryDetails } from "../../api/apiUrl/apiUrl";

// specific category action
export const specificCategory = createAsyncThunk('specificCategorySlice/specificCategory',
    async (data) => {
        // console.log('Receive data for specific category', data);

        const res = await axiosInstance.get(`${endPoint_categoryDetails}/${data}`);
        // console.log('Response for fetching specific category', res);

        return res.data;
    }
)

const initialState = {
    isSpecificCategoryLoading: false,
    getSpecificCategoryData: {},
    isSpecificCategoryError: null
}

export const specificCategorySlice = createSlice({
    name: 'specificCategorySlice',
    initialState,
    extraReducers: (builder) => {

        // specific category reducer
        builder.addCase(specificCategory.pending, (state, action) => {
            state.isSpecificCategoryLoading = true;
        })
        builder.addCase(specificCategory.fulfilled, (state, action) => {
            state.isSpecificCategoryLoading = false;
            state.getSpecificCategoryData = action.payload;
            state.isSpecificCategoryError = null;
        })
        builder.addCase(specificCategory.rejected, (state, action) => {
            state.isSpecificCategoryLoading = false;
            state.getSpecificCategoryData = [];
            state.isSpecificCategoryError = action.error?.message;
        })
    }
});

export default specificCategorySlice.reducer;