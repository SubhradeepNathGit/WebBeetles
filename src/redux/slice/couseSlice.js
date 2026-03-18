import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../util/supabase/supabase";

// all course action
export const allCourse = createAsyncThunk('courseSlice/allCourse',
    async ({ category_id, instructor_id, is_active, status, is_admin_block, is_deleted = false }= {}, { rejectWithValue }) => {

        let query = supabase.from("courses").select(`id,title,description,price,status,feature,thumbnail,created_at,updated_at,is_active,is_completed,is_admin_block,
                    is_exam_scheduled,category:categories (id,name,description,category_image,status),
                    instructor:instructors (id,name,email,profile_image_url,bio,expertise,social_links,is_verified,application_status)
                    `).eq("is_deleted", is_deleted).order("created_at", { ascending: false });

        if (category_id) {
            query = query.eq('category_id', category_id);
        }

        if (instructor_id) {
            query = query.eq('instructor_id', instructor_id);
        }

        if (is_active) {
            query = query.eq('is_active', is_active);
        }

        if (is_admin_block) {
            query = query.eq('is_admin_block', false);
        }

        if (status) {
            query = query.eq('status', status);
        }

        const res = await query;
        // console.log('Response for fetching all course', res);

        if (res?.error) return rejectWithValue(res?.error.message);
        return res.data;
    }
)

// add course action
export const createCourse = createAsyncThunk('courseSlice/createCourse',
    async (data) => {
        // console.log('Receive data in add course slice', data);

        let imageUrl = null, imageId = null;
        const file = data?.thumbnail?.[0];
        if (file) {
            const fileName = `${data?.title}_${Date.now()}.${file.name.split(".").pop()}`;
            const { data: uploadData, error: uploadError } = await supabase.storage.from("course").upload(fileName, file, { upsert: true });
            // console.log('Uploading image data', uploadData, ' error', uploadError);

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage.from("course").getPublicUrl(fileName);

            imageUrl = publicUrlData.publicUrl;
            imageId = uploadData.path;
        }

        const res = await supabase.from("courses").insert([{ ...data, thumbnail: imageUrl }]).select();
        // console.log('Response for adding course', res);

        if (res.error) return res?.error;

        const courseId = res?.data?.[0]?.id;

        return {
            course: res?.data?.[0],
            course_id: courseId,
        };
    }
)

// update course
export const updateCourse = createAsyncThunk('courseSlice/updateCourse',
    async ({ id, data }, { rejectWithValue }) => {
        // console.log('Update course slice data', id, data);

        try {
            const updatePayload = {
                title: data.title,
                price: data.price,
                is_active: data.is_active,
                feature: data.feature,
                updated_at: new Date().toISOString()
            };

            const res = await supabase.from('courses').update(updatePayload).eq('id', id).select().single();
            // console.log('Response for updating course', res);

            if (res.error) throw res.error;

            return res.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// mark as complete course 
export const updateCourseCompletion = createAsyncThunk('courseSlice/updateCourseCompletion',
    async ({ id, is_completed }, { rejectWithValue }) => {
        // console.log('Received data for completing course', id, is_completed);

        try {
            const res = await supabase.from('courses').update({
                is_completed,
                updated_at: new Date().toISOString()
            }).eq('id', id).select().single();
            // console.log('Response after mark as read in slice', res);

            if (res.error) throw res.error;

            return res.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// block/unblock course 
export const updateCourseBlockUnblock = createAsyncThunk('courseSlice/updateCourseBlockUnblock',
    async ({ id, status }, { rejectWithValue }) => {
        // console.log('Received data for block-unblock course', id, status);

        try {
            const res = await supabase.from('courses').update({
                is_active: status,
                updated_at: new Date().toISOString()
            }).eq('id', id).select().single();
            // console.log('Response after block-unblock course in slice', res);

            if (res.error) throw res.error;

            return res.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// admin-block/unblock course 
export const updateCourseBlockUnblockByAdmin = createAsyncThunk('courseSlice/updateCourseBlockUnblockByAdmin',
    async ({ id, status }, { rejectWithValue }) => {
        // console.log('Received data for block-unblock by admin course', id, status);

        try {
            const res = await supabase.from('courses').update({
                is_admin_block: status,
                updated_at: new Date().toISOString()
            }).eq('id', id).select().single();
            // console.log('Response after block-unblock by admin course in slice', res);

            if (res.error) throw res.error;

            return res.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// approve/reject course 
export const updateCourseApproveReject = createAsyncThunk('courseSlice/updateCourseApproveReject',
    async ({ id, status }, { rejectWithValue }) => {
        // console.log('Received data for approve-reject course', id, is_completed);

        try {
            const res = await supabase.from('courses').update({
                status: status,
                updated_at: new Date().toISOString()
            }).eq('id', id).select().single();
            // console.log('Response after approve-reject course in slice', res);

            if (res.error) throw res.error;

            return res.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// delete course 
export const deleteCourse = createAsyncThunk('courseSlice/deleteCourse',
    async ({ id }, { rejectWithValue }) => {
        // console.log('Received data for delete course', id);

        try {
            const res = await supabase.from('courses').update({
                is_deleted: true,
                updated_at: new Date().toISOString()
            }).eq('id', id).select().single();
            // console.log('Response after deleting course in slice', res);

            if (res.error) throw res.error;

            return id;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);


const initialState = {
    isCourseLoading: false,
    getCourseData: [],
    isCourseError: null
}

export const courseSlice = createSlice({
    name: 'courseSlice',
    initialState,
    reducers: {
        resetCourseState: () => initialState
    },
    extraReducers: (builder) => {
        builder
            // all course reducer
            .addCase(allCourse.pending, (state, action) => {
                state.isCourseLoading = true;
            })
            .addCase(allCourse.fulfilled, (state, action) => {
                state.isCourseLoading = false;
                state.getCourseData = action.payload;
                state.isCourseError = null;
            })
            .addCase(allCourse.rejected, (state, action) => {
                state.isCourseLoading = false;
                state.getCourseData = [];
                state.isCourseError = action.error?.message;
            })

            // add course reducer
            .addCase(createCourse.pending, (state, action) => {
                state.isCourseLoading = true;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.isCourseLoading = false;
                state.getCourseData?.push(action.payload);
                state.isCourseError = null;
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.isCourseLoading = false;
                state.getCourseData = [];
                state.isCourseError = action.error?.message;
            })

            // update course
            .addCase(updateCourse.pending, (state) => {
                state.isCourseLoading = true;
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.isCourseLoading = false;

                const updatedCourse = action.payload;

                state.getCourseData = state.getCourseData.map(course =>
                    course.id === updatedCourse.id ? updatedCourse : course
                );

                state.isCourseError = null;
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.isCourseLoading = false;
                state.isCourseError = action.payload;
            })

            // mark as complete 
            .addCase(updateCourseCompletion.pending, (state) => {
                state.isCourseLoading = true;
            })
            .addCase(updateCourseCompletion.fulfilled, (state, action) => {
                state.isCourseLoading = false;

                const updatedCourse = action.payload;

                state.getCourseData = state.getCourseData.map(course =>
                    course.id === updatedCourse.id
                        ? { ...course, is_completed: updatedCourse.is_completed }
                        : course
                );

                state.isCourseError = null;
            })
            .addCase(updateCourseCompletion.rejected, (state, action) => {
                state.isCourseLoading = false;
                state.isCourseError = action.payload;
            })

            // block/unblock
            .addCase(updateCourseBlockUnblock.pending, (state) => {
                state.isCourseLoading = true;
            })
            .addCase(updateCourseBlockUnblock.fulfilled, (state, action) => {
                state.isCourseLoading = false;

                const updatedCourse = action.payload;

                state.getCourseData = state.getCourseData.map(course =>
                    course.id === updatedCourse.id ? { ...course, is_completed: updatedCourse.is_completed } : course
                );

                state.isCourseError = null;
            })
            .addCase(updateCourseBlockUnblock.rejected, (state, action) => {
                state.isCourseLoading = false;
                state.isCourseError = action.payload;
            })
           
            // block/unblock-admin
            .addCase(updateCourseBlockUnblockByAdmin.pending, (state) => {
                state.isCourseLoading = true;
            })
            .addCase(updateCourseBlockUnblockByAdmin.fulfilled, (state, action) => {
                state.isCourseLoading = false;

                const updatedCourse = action.payload;

                state.getCourseData = state.getCourseData.map(course =>
                    course.id === updatedCourse.id ? { ...course, is_completed: updatedCourse.is_completed } : course
                );

                state.isCourseError = null;
            })
            .addCase(updateCourseBlockUnblockByAdmin.rejected, (state, action) => {
                state.isCourseLoading = false;
                state.isCourseError = action.payload;
            })
           
            // approve/reject
            .addCase(updateCourseApproveReject.pending, (state) => {
                state.isCourseLoading = true;
            })
            .addCase(updateCourseApproveReject.fulfilled, (state, action) => {
                state.isCourseLoading = false;

                const updatedCourse = action.payload;

                state.getCourseData = state.getCourseData.map(course =>
                    course.id === updatedCourse.id ? { ...course, is_completed: updatedCourse.is_completed } : course
                );

                state.isCourseError = null;
            })
            .addCase(updateCourseApproveReject.rejected, (state, action) => {
                state.isCourseLoading = false;
                state.isCourseError = action.payload;
            })

            // delete course
            .addCase(deleteCourse.pending, (state) => {
                state.isCourseLoading = true;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.isCourseLoading = false;
                state.getCourseData = state.getCourseData.filter(
                    course => course.id !== action.payload
                );
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.isCourseLoading = false;
                state.isCourseError = action.payload;
            });
    }
});

export default courseSlice.reducer;