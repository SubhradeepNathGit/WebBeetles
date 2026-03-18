import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../util/supabase/supabase";

// add review action 
export const addReviewRequest = createAsyncThunk("reviewSlice/addReviewRequest",
    async ({ review_obj }, { rejectWithValue }) => {
        // console.log('Review data for adding new review', review_obj);

        const res = await supabase.from("course_reviews").insert([review_obj]).select().single();
        // console.log('Response for adding review', res);

        if (res?.error) return rejectWithValue(res?.error.message);
        return res?.data;
    }
);


// Update review action
export const updateReviewRequest = createAsyncThunk("reviewSlice/updateReviewRequest",

    async ({ review_obj }, { rejectWithValue }) => {
        // console.log('Receive updated data for updating', review_obj);

        const { id: review_id, ...update_obj } = review_obj;

        const res = await supabase.from("course_reviews").update(update_obj).eq("id", review_id).select().single();
        // console.log('Response for updating review request', res);

        if (res?.error) return rejectWithValue(res?.error.message);

        return res?.data;
    }
);


// Fetch review action
export const fetchReviewsRequest = createAsyncThunk("reviewSlice/fetchReviewsRequest",

    async ({ course_id = null, student_id = null } = {}, { rejectWithValue }) => {
        // console.log('Received course review details data to fetch', course_id, student_id);

        let query = supabase.from("course_reviews").select("*").order("created_at", { ascending: false });

        if (course_id) {
            query = query.eq("course_id", course_id);
        }

        if (student_id) {
            query = query.eq("student_id", student_id).single();
        }

        const res = await query;
        // console.log('Response for fetching course review', res);

        if (res?.error && res?.error.code !== "PGRST116") {
            return rejectWithValue(res?.error.message);
        }

        return res?.data;
    }
);

// delete review action 
export const deleteReviewRequest = createAsyncThunk("reviewSlice/deleteReviewRequest",
    async ({ review_id }, { rejectWithValue }) => {
        // console.log('Received course id to delete', review_id);

        const res = await supabase.from("course_reviews").delete().eq("id", review_id);
        // console.log("Response for deleting review", res);

        if (res?.error) return rejectWithValue(res.error.message);

        return review_id;
    }
);

const initialState = {
    isReviewPending: false,
    getReviewData: [],
    isReviewError: null
}

export const reviewSlice = createSlice({
    name: 'reviewSlice',
    initialState,
    extraReducers: (builder) => {
        builder
            // add review slice 
            .addCase(addReviewRequest.pending, (state, action) => {
                state.isReviewPending = true;
            })
            .addCase(addReviewRequest.fulfilled, (state, action) => {
                state.isReviewPending = false;
                state.getReviewData = action.payload;
                state.isReviewError = null;
            })
            .addCase(addReviewRequest.rejected, (state, action) => {
                state.isReviewPending = false;
                state.getReviewData = [];
                state.isReviewError = action.error?.message;
            })

            // update review slice 
            .addCase(updateReviewRequest.pending, (state, action) => {
                state.isReviewPending = true;
            })
            .addCase(updateReviewRequest.fulfilled, (state, action) => {
                state.isReviewPending = false;
                state.getReviewData = action.payload;
                state.isReviewError = null;
            })
            .addCase(updateReviewRequest.rejected, (state, action) => {
                state.isReviewPending = false;
                state.getReviewData = [];
                state.isReviewError = action.error?.message;
            })

            // fetch review slice 
            .addCase(fetchReviewsRequest.pending, (state, action) => {
                state.isReviewPending = true;
            })
            .addCase(fetchReviewsRequest.fulfilled, (state, action) => {
                state.isReviewPending = false;
                state.getReviewData = action.payload;
                state.isReviewError = null;
            })
            .addCase(fetchReviewsRequest.rejected, (state, action) => {
                state.isReviewPending = false;
                state.getReviewData = [];
                state.isReviewError = action.error?.message;
            })

            // delete review slice 
            .addCase(deleteReviewRequest.pending, (state, action) => {
                state.isReviewPending = true;
            })
            .addCase(deleteReviewRequest.fulfilled, (state, action) => {
                state.isReviewPending = false;
                state.getReviewData = action.payload;
                state.isReviewError = null;
            })
            .addCase(deleteReviewRequest.rejected, (state, action) => {
                state.isReviewPending = false;
                state.getReviewData = [];
                state.isReviewError = action.error?.message;
            })
    }
})

export default reviewSlice.reducer;