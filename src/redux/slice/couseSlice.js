import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance/axiosInstance";
import { endPoint_allCourse, endPoint_sepeficCourse } from "../../api/apiUrl/apiUrl";

// all course action
export const allCourse = createAsyncThunk('courseSlice/allCourse',
    async () => {
        const res = await axiosInstance.get(endPoint_allCourse);
        // console.log('Response for fetching all course', res);

        return res.data;
    }
)

// // specific course action
// export const specificCourse = createAsyncThunk('courseSlice/specificCourse',
//     async (data) => {
//         console.log('Receive data for specific course',data);
        
//         const res = await axiosInstance.get(`${endPoint_sepeficCourse}/${data}`);
//         console.log('Response for fetching specific course', res);

//         return res.data;
//     }
// )

const initialState = {
    isCourseLoading: false,
    getCourseData: [],
    isCourseError: null
}

export const courseSlice = createSlice({
    name: 'courseSlice',
    initialState,
    extraReducers: (builder) => {

        // all course reducer
        builder.addCase(allCourse.pending, (state, action) => {
            state.isCourseLoading = true;
        })
        builder.addCase(allCourse.fulfilled, (state, action) => {
            state.isCourseLoading = false;
            state.getCourseData = action.payload;
            state.isCourseError = null;
        })
        builder.addCase(allCourse.rejected, (state, action) => {
            state.isCourseLoading = false;
            state.getCourseData = [];
            state.isCourseError = action.error?.message;
        })

        // // specific course reducer
        // builder.addCase(specificCourse.pending, (state, action) => {
        //     state.isCourseLoading = true;
        // })
        // builder.addCase(specificCourse.fulfilled, (state, action) => {
        //     state.isCourseLoading = false;
        //     state.getCourseData = action.payload;
        //     state.isCourseError = null;
        // })
        // builder.addCase(specificCourse.rejected, (state, action) => {
        //     state.isCourseLoading = false;
        //     state.getCourseData = [];
        //     state.isCourseError = action.error?.message;
        // })

    }
});

export default courseSlice.reducer;