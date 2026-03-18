import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../util/supabase/supabase";

// all category action
export const allCategory = createAsyncThunk('categorySlice/allCategory',
    async (status) => {
        let query = supabase.from('categories').select('*');

        if (status) {
            query = query.eq('status', status);
        }

        const res = await query;
        // console.log('Response for fetching all category', res);

        if (res?.error) {
            console.error('Error fetching categories:', res?.error);
            return [];
        }

        return res?.data;
    }
)

const initialState = {
    isCategoryLoading: false,
    getCategoryData: [],
    isCategoryError: null
}

export const categorySlice = createSlice({
    name: 'categorySlice',
    initialState,
    extraReducers: (builder) => {

        // all category reducer
        builder.addCase(allCategory.pending, (state, action) => {
            state.isCategoryLoading = true;
        })
        builder.addCase(allCategory.fulfilled, (state, action) => {
            state.isCategoryLoading = false;
            state.getCategoryData = action.payload;
            state.isCategoryError = null;
        })
        builder.addCase(allCategory.rejected, (state, action) => {
            state.isCategoryLoading = false;
            state.getCategoryData = [];
            state.isCategoryError = action.error?.message;
        })

    }
});

export default categorySlice.reducer;