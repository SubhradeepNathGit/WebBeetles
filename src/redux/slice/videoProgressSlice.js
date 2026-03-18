import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../util/supabase/supabase";

// ADD or UPDATE (UPSERT) video progress
export const upsertVideoProgress = createAsyncThunk("videoProgress/upsert",
    async (
        { student_id, course_id, lesson_id, watched_seconds = 0, total_seconds, completed = false, read_doc = false, type },
        { rejectWithValue }) => {
        try {
            const res = await supabase.from("video_progress").upsert(
                {
                    student_id, course_id, lesson_id, watched_seconds, total_seconds, completed, read_doc, type,
                    updated_at: new Date().toISOString(),
                }, {
                onConflict: "student_id,lesson_id",
            }).select().single();
            // console.log('Response for adding or updating video progress', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Update only watched seconds (video seek / timeupdate)
export const updateWatchedSeconds = createAsyncThunk("videoProgress/updateWatchedSeconds",
    async ({ student_id, lesson_id, watched_seconds, total_seconds }, { rejectWithValue }) => {
        // console.log('Receive data in slice to update video progress', student_id, lesson_id, watched_seconds, total_seconds);

        try {
            const isCompleted = watched_seconds >= total_seconds;

            const res = await supabase.from("video_progress").update({
                watched_seconds,
                completed: isCompleted,
                updated_at: new Date().toISOString(),
            }).eq("student_id", student_id).eq("lesson_id", lesson_id).select().single();
            // console.log('Response for updating video progress watched seconds', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Mark document as read
export const markDocAsRead = createAsyncThunk("videoProgress/markDocAsRead",
    async ({ student_id, lesson_id }, { rejectWithValue }) => {
        // console.log('Received data in slice for marking doc as read', student_id, lesson_id);

        try {
            const res = await supabase.from("video_progress").update({
                read_doc: true,
                updated_at: new Date().toISOString(),
            }).eq("student_id", student_id).eq("lesson_id", lesson_id).select().single();
            // console.log('Response for updating mark as read', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const initialState = {
    isVideoProgressLoading: false,
    videoProgressData: null,
    hasVideoProgressError: null,
};

export const videoProgressSlice = createSlice({
    name: "videoProgress",
    initialState,
    reducers: {
        resetVideoProgress: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // UPSERT
            .addCase(upsertVideoProgress.pending, (state) => {
                state.isVideoProgressLoading = true;
                state.hasVideoProgressError = null;
            })
            .addCase(upsertVideoProgress.fulfilled, (state, action) => {
                state.isVideoProgressLoading = false;
                state.videoProgressData = action.payload;
            })
            .addCase(upsertVideoProgress.rejected, (state, action) => {
                state.isVideoProgressLoading = false;
                state.hasVideoProgressError = action.payload;
            })

            // UPDATE WATCH TIME
            .addCase(updateWatchedSeconds.pending, (state) => {
                state.isVideoProgressLoading = true;
            })
            .addCase(updateWatchedSeconds.fulfilled, (state, action) => {
                state.isVideoProgressLoading = false;
                state.videoProgressData = action.payload;
            })
            .addCase(updateWatchedSeconds.rejected, (state, action) => {
                state.isVideoProgressLoading = false;
                state.hasVideoProgressError = action.payload;
            })

            // MARK DOC READ
            .addCase(markDocAsRead.pending, (state) => {
                state.isVideoProgressLoading = true;
            })
            .addCase(markDocAsRead.fulfilled, (state, action) => {
                state.isVideoProgressLoading = false;
                state.videoProgressData = action.payload;
            })
            .addCase(markDocAsRead.rejected, (state, action) => {
                state.isVideoProgressLoading = false;
                state.hasVideoProgressError = action.payload;
            });
    },
});

export const { resetVideoProgress } = videoProgressSlice.actions;
export default videoProgressSlice.reducer;