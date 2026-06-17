import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../util/supabase/supabase";
import { createNotification } from "../../util/notification/notificationHelper";

// Helper to handle safe upsert without relying on unique constraints and preventing un-completing
const safeUpsert = async ({ student_id, course_id, lesson_id, watched_seconds, total_seconds, completed, read_doc, type, forceComplete = false }) => {
    // 1. Check if record already exists
    const { data: existing, error: fetchError } = await supabase
        .from("video_progress")
        .select("id, completed, watched_seconds")
        .eq("student_id", student_id)
        .eq("lesson_id", lesson_id);

    if (fetchError) throw fetchError;

    // 2. Determine final 'completed' state (never revert true to false)
    const isCompletedNow = completed || (total_seconds > 0 && watched_seconds >= total_seconds - 1);
    const wasCompleted = existing?.[0]?.completed === true;
    const finalCompleted = forceComplete || wasCompleted || isCompletedNow;

    const payload = {
        student_id,
        course_id,
        lesson_id,
        watched_seconds: watched_seconds ?? existing?.[0]?.watched_seconds ?? 0,
        total_seconds,
        completed: finalCompleted,
        type,
        updated_at: new Date().toISOString()
    };

    if (read_doc !== undefined) {
        payload.read_doc = read_doc;
    }

    // 3. Update if exists, Insert if not
    let res;
    if (existing && existing.length > 0) {
        res = await supabase.from("video_progress")
            .update(payload)
            .eq("id", existing[0].id)
            .select();
    } else {
        res = await supabase.from("video_progress")
            .insert(payload)
            .select();
    }

    if (res?.error) throw res.error;

    // Check if it just became completed
    const justCompleted = finalCompleted && !wasCompleted;
    if (justCompleted) {
        await createNotification({
            title: 'Lesson Completed',
            message: `You successfully completed a lesson. Keep up the great work!`,
            type: 'success',
            user_type: 'student',
            user_id: student_id,
            link: '/student/dashboard',
        });
    }

    return res?.data?.[0];
};

// ADD or UPDATE (UPSERT) video progress
export const upsertVideoProgress = createAsyncThunk("videoProgress/upsert",
    async ({ student_id, course_id, lesson_id, watched_seconds = 0, total_seconds, completed = false, read_doc = false, type }, { rejectWithValue }) => {
        try {
            return await safeUpsert({ student_id, course_id, lesson_id, watched_seconds, total_seconds, completed, read_doc, type });
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Update watched seconds
export const updateWatchedSeconds = createAsyncThunk("videoProgress/updateWatchedSeconds",
    async ({ student_id, course_id, lesson_id, watched_seconds, total_seconds, type }, { rejectWithValue }) => {
        try {
            return await safeUpsert({ student_id, course_id, lesson_id, watched_seconds, total_seconds, type });
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Mark video as completed explicitly
export const markVideoCompleted = createAsyncThunk("videoProgress/markCompleted",
    async ({ student_id, course_id, lesson_id, total_seconds, type }, { rejectWithValue }) => {
        try {
            return await safeUpsert({ student_id, course_id, lesson_id, watched_seconds: total_seconds, total_seconds, type, forceComplete: true });
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Mark document as read
export const markDocAsRead = createAsyncThunk("videoProgress/markDocAsRead",
    async ({ student_id, lesson_id }, { rejectWithValue }) => {
        try {
            const res = await supabase.from("video_progress").update({
                read_doc: true,
                completed: true,
                updated_at: new Date().toISOString(),
            }).eq("student_id", student_id).eq("lesson_id", lesson_id).select();

            if (res?.error) throw res?.error;
            return res?.data?.[0];
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

            // MARK COMPLETED
            .addCase(markVideoCompleted.pending, (state) => {
                state.isVideoProgressLoading = true;
            })
            .addCase(markVideoCompleted.fulfilled, (state, action) => {
                state.isVideoProgressLoading = false;
                state.videoProgressData = action.payload;
            })
            .addCase(markVideoCompleted.rejected, (state, action) => {
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