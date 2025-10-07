import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance/axiosInstance";
import { endPoint_allCategory, endPoint_categoryWiseCourse } from "../../api/apiUrl/apiUrl";

// all category action
export const allCategory = createAsyncThunk('categorySlice/allCategory',
    async () => {
        const res = await axiosInstance.get(endPoint_allCategory);
        // console.log('Response for fetching all category', res);

        return res.data;
    }
)

// category wise course action
export const categoryWiseCourse = createAsyncThunk('categorySlice/categoryWiseCourse',
    async (cat_id) => {
        console.log('Receive data in category wise course slice', cat_id);

        const res = await axiosInstance.get(`${endPoint_categoryWiseCourse}/${cat_id}`);
        console.log('Response for fetching category wise course', res);

        return res.data;
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

        // category wise course reducer
        builder.addCase(categoryWiseCourse.pending, (state, action) => {
            state.isCategoryLoading = true;
        })
        builder.addCase(categoryWiseCourse.fulfilled, (state, action) => {
            state.isCategoryLoading = false;
            state.getCategoryData = action.payload;
            state.isCategoryError = null;
        })
        builder.addCase(categoryWiseCourse.rejected, (state, action) => {
            state.isCategoryLoading = false;
            state.getCategoryData = [];
            state.isCategoryError = action.error?.message;
        })

    }
});

export default categorySlice.reducer;