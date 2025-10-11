import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance/axiosInstance";
import { endPoint_addCourse, endPoint_allCourse, endPoint_categoryWiseCourse, endPoint_sepeficCourse } from "../../api/apiUrl/apiUrl";

// all course action
export const allCourse = createAsyncThunk('courseSlice/allCourse',
    async () => {
        const res = await axiosInstance.get(endPoint_allCourse);
        // console.log('Response for fetching all course', res);

        return res.data;
    }
)

// category wise course action
export const categoryWiseCourse = createAsyncThunk('courseSlice/categoryWiseCourse',
    async (cat_slag) => {
        // console.log('Receive data in category wise course slice', cat_slag);

        const res = await axiosInstance.get(`${endPoint_categoryWiseCourse}/${cat_slag}`);
        // console.log('Response for fetching category wise course', res);

        return res.data;
    }
)

// add course action
export const createCourse = createAsyncThunk('courseSlice/createCourse',
    async (data) => {
        // console.log('Receive data in add course slice', data);

        const res = await axiosInstance.post(endPoint_addCourse, data);
        // console.log('Response for adding course', res);

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

        // category wise course reducer
        builder.addCase(categoryWiseCourse.pending, (state, action) => {
            state.isCourseLoading = true;
        })
        builder.addCase(categoryWiseCourse.fulfilled, (state, action) => {
            state.isCourseLoading = false;
            state.getCourseData = action.payload;
            state.isCourseError = null;
        })
        builder.addCase(categoryWiseCourse.rejected, (state, action) => {
            state.isCourseLoading = false;
            state.getCourseData = [];
            state.isCourseError = action.error?.message;
        })
       
        // add course reducer
        builder.addCase(createCourse.pending, (state, action) => {
            state.isCourseLoading = true;
        })
        builder.addCase(createCourse.fulfilled, (state, action) => {
            state.isCourseLoading = false;
            state.getCourseData = action.payload;
            state.isCourseError = null;
        })
        builder.addCase(createCourse.rejected, (state, action) => {
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