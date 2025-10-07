import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance/axiosInstance";
import { endPoint_sepeficCourse } from "../../api/apiUrl/apiUrl";

// specific course action
export const specificCourse = createAsyncThunk('specificCourseSlice/specificCourse',
    async (data) => {
        // console.log('Receive data for specific course', data);

        const res = await axiosInstance.get(`${endPoint_sepeficCourse}/${data}`);
        // console.log('Response for fetching specific course', res);

        return res.data;
    }
)

const initialState = {
    isSpecificCourseLoading: false,
    getSpecificCourseData: {},
    isSpecificCourseError: null
}

export const specificCourseSlice = createSlice({
    name: 'specificCourseSlice',
    initialState,
    extraReducers: (builder) => {

        // specific course reducer
        builder.addCase(specificCourse.pending, (state, action) => {
            state.isSpecificCourseLoading = true;
        })
        builder.addCase(specificCourse.fulfilled, (state, action) => {
            state.isSpecificCourseLoading = false;
            state.getSpecificCourseData = action.payload;
            state.isSpecificCourseError = null;
        })
        builder.addCase(specificCourse.rejected, (state, action) => {
            state.isSpecificCourseLoading = false;
            state.getSpecificCourseData = [];
            state.isSpecificCourseError = action.error?.message;
        })
    }
});

export default specificCourseSlice.reducer;