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

// create category action
export const createCategory = createAsyncThunk('categorySlice/createCategory',
    async (categoryName, { rejectWithValue }) => {
        const res = await supabase
            .from('categories')
            .insert([{ name: categoryName, status: 'pending' }])
            .select()
            .single();

        if (res?.error) {
            console.error('Error creating category:', res?.error);
            return rejectWithValue(res?.error?.message || 'Failed to create category');
        }

        return res?.data;
    }
)

// update category status (approve/reject)
export const updateCategoryApproveReject = createAsyncThunk('categorySlice/updateCategoryApproveReject',
    async ({ id, status }, { rejectWithValue }) => {
        const res = await supabase
            .from('categories')
            .update({ status: status })
            .eq('id', id)
            .select()
            .single();

        if (res?.error) {
            console.error(`Error updating category to ${status}:`, res?.error);
            return rejectWithValue(res?.error?.message || `Failed to ${status} category`);
        }

        return res?.data;
    }
)

const initialState = {
    isCategoryLoading: false,
    isCreatingCategory: false,
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

        // create category reducer
        builder.addCase(createCategory.pending, (state) => {
            state.isCreatingCategory = true;
        })
        builder.addCase(createCategory.fulfilled, (state, action) => {
            state.isCreatingCategory = false;
            state.getCategoryData = [...state.getCategoryData, action.payload];
            state.isCategoryError = null;
        })
        builder.addCase(createCategory.rejected, (state, action) => {
            state.isCreatingCategory = false;
            state.isCategoryError = action.payload || action.error?.message;
        })

    }
});

export default categorySlice.reducer;