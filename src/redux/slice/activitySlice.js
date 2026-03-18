import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../util/supabase/supabase";

// add activity 
export const addActivityRequest = createAsyncThunk("activitySlice/addActivity",
    async ({ activity }, { rejectWithValue }) => {
        // console.log('Received data to add in activity table in slice', activity);

        try {
            const res = await supabase.from("activity").insert(activity).select().single();
            // console.log('Response for adding activity', res);

            if (res?.error) throw res?.error;
            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// fetch activity 
export const fetchActivityRequest = createAsyncThunk("activitySlice/fetchActivity",

    async ({ viewer_type, instructor_id, student_id } = {}, { rejectWithValue }) => {

        try {
            let query = supabase.from("activity").select("*").order("created_at", { ascending: false });

            if (viewer_type && viewer_type !== "all") {
                query = query.eq("viewer_type", viewer_type);
            }

            if (instructor_id) {
                query = query.eq("instructor_id", instructor_id);
            }

            if (student_id) {
                query = query.eq("student_id", student_id);
            }

            const res = await query;
            // console.log('Response for fetching activity details', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);


const initialState = {
    isActivityLoading: false,
    activityList: [],
    hasActivityError: null
}

export const activitySlice = createSlice({
    name: "activitySlice",
    initialState,
    reducers: {
        clearActivityState: (state) => {
            state.activityList = [];
            state.hasActivityError = null;
        }
    },
    extraReducers: (builder) => {
        builder

            /* ADD */
            .addCase(addActivityRequest.pending, (state) => {
                state.isActivityLoading = true;
            })
            .addCase(addActivityRequest.fulfilled, (state, action) => {
                state.isActivityLoading = false;
                state.activityList.unshift(action.payload);
            })
            .addCase(addActivityRequest.rejected, (state, action) => {
                state.isActivityLoading = false;
                state.hasActivityError = action.payload;
            })

            /* FETCH */
            .addCase(fetchActivityRequest.pending, (state) => {
                state.isActivityLoading = true;
            })
            .addCase(fetchActivityRequest.fulfilled, (state, action) => {
                state.isActivityLoading = false;
                state.activityList = action.payload;
            })
            .addCase(fetchActivityRequest.rejected, (state, action) => {
                state.isActivityLoading = false;
                state.hasActivityError = action.payload;
            });
    }
});

export const { clearActivityState } = activitySlice.actions;
export default activitySlice.reducer;