import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../util/supabase/supabase";
import { checkLoggedInUser } from "./authSlice/checkUserAuthSlice";

// update student profile action 
export const updateStudentProfile = createAsyncThunk("studentProfileSlice/updateStudentProfile",
    async ({ data, id }, { rejectWithValue, dispatch }) => {
        // console.log('update data', data, ' student Id', id);

        try {
            const file = data.profile_image;
            if (!file) return rejectWithValue("No file provided");

            // Fetch existing student profile
            const { data: student, error: fetchErr } = await supabase.from("students").select("profile_image").eq("id", id).single();
            // console.log('Fetched profile image', student);

            if (fetchErr) throw fetchErr;

            // delete old image from bucket
            if (student?.profile_image) {
                await supabase.storage.from("student").remove(student?.profile_image);
            }

            // Create new filename
            const ext = file.name.split(".").pop();
            const newFileName = `${id}_${Date.now()}.${file.name.split(".").pop()}.${ext}`;

            // Upload new file
            const res = await supabase.storage.from("student").upload(newFileName, file, { upsert: true });

            if (res.error) throw res.error;
            // console.log('upload data', res.data);

            const image_name = res?.data?.path;

            // Get public URL
            const { data: publicUrlData } = supabase.storage.from("student").getPublicUrl(newFileName);

            const publicUrl = publicUrlData.publicUrl;

            // Update DB with PUBLIC URL again
            const { data: updatedUser, error: updateErr } = await supabase.from("students").update({
                profile_image_url: publicUrl,
                profile_image: image_name,
            }).eq("id", id).select().single();

            if (updateErr) throw updateErr;
            dispatch(checkLoggedInUser());

            return updatedUser;
        } catch (err) {
            console.error("Error updating profile:", err);
            return rejectWithValue(err.message);
        }
    }
);

// updates `course purchase or not`
export const updateCoursePurchaseStatus = createAsyncThunk("userProfileSlice/updateCoursePurchaseStatus",
    async ({ id }, { rejectWithValue }) => {
        // console.log('update purchase course data', id);

        try {
            const res = await supabase.from("students").update({ course_purchased: true }).eq("id", id).select();

            // console.log('Response for updating purchase status', res);

            if (res?.error) return rejectWithValue(res?.error);

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// updates `blocked or not`
export const updateBlockUnblockStudentStatus = createAsyncThunk("userProfileSlice/updateBlockUnblockStudentStatus",
    async ({ id, status }, { rejectWithValue }) => {
        // console.log('update block-unblock status data', id);

        try {
            const res = await supabase.from("students").update({ is_blocked: status }).eq("id", id).select();

            // console.log('Response for updating status', res);

            if (res?.error) return rejectWithValue(res?.error);

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const initialState = {
    isStudentLoading: false,
    getStudentData: {},
    isStudentError: null,
};

export const studentProfileSlice = createSlice({
    name: "studentProfileSlice",
    initialState,
    extraReducers: (builder) => {
        builder

            // update user profile reducer 
            .addCase(updateStudentProfile.pending, (state) => {
                state.isStudentLoading = true;
            })
            .addCase(updateStudentProfile.fulfilled, (state, action) => {
                state.isStudentLoading = false;
                state.getStudentData = action.payload;
                state.isStudentError = null;
            })
            .addCase(updateStudentProfile.rejected, (state, action) => {
                state.isStudentLoading = false;
                state.getStudentData = {};
                state.isStudentError = action.error?.message;
            })

            // updates `course purchase ststus` reducer 
            .addCase(updateCoursePurchaseStatus.pending, (state) => {
                state.isStudentLoading = true;
            })
            .addCase(updateCoursePurchaseStatus.fulfilled, (state, action) => {
                state.isStudentLoading = false;
                state.getStudentData = action.payload;
                state.isStudentError = null;
            })
            .addCase(updateCoursePurchaseStatus.rejected, (state, action) => {
                state.isStudentLoading = false;
                state.getStudentData = {};
                state.isStudentError = action.error?.message;
            })

            // updates `course ststus` reducer 
            .addCase(updateBlockUnblockStudentStatus.pending, (state) => {
                state.isStudentLoading = true;
            })
            .addCase(updateBlockUnblockStudentStatus.fulfilled, (state, action) => {
                state.isStudentLoading = false;
                state.getStudentData = action.payload;
                state.isStudentError = null;
            })
            .addCase(updateBlockUnblockStudentStatus.rejected, (state, action) => {
                state.isStudentLoading = false;
                state.getStudentData = {};
                state.isStudentError = action.error?.message;
            });
    },
});

export default studentProfileSlice.reducer;