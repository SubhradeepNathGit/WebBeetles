import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../util/supabase/supabase";

// request instructor action 
export const instructorRequest = createAsyncThunk('instructorSlice/instructorRequest',
    async ({ payload, id }, { rejectWithValue }) => {
        // console.log('Received data in instructor request slice', payload,id);

        // Upload document if present
        let docUrl = null, docId = null;
        const document = payload.document;

        if (document) {
            const fileName = `doc_${id}_${Date.now()}.${document.name.split(".").pop()}`;
            const { data: uploadData, error: uploadError } = await supabase.storage.from("instructor/document").upload(fileName, document, { upsert: true });
            // console.log('Uploading document data', uploadData, ' error', uploadError);

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage.from("instructor/document").getPublicUrl(fileName);

            docUrl = publicUrlData.publicUrl;
            docId = uploadData.path;
        }

        const instructorData = {
            document: docUrl,
            bio: payload?.bio,
            expertise: payload?.expertise,
            social_links: payload?.social_links,
            application_complete: true
        }
        const res = await supabase.from("instructors").update(instructorData).eq('id', id).select().single();
        // console.log('Response from instructor request slice', res);

        if (res?.error) {
            return rejectWithValue(res?.error.message);
        }
        return res.data;
    });

// all instructor action 
export const allInstructor = createAsyncThunk('instructorSlice/allInstructor',
    async ({ application_status, application_complete, is_blocked } = {}, { rejectWithValue }) => {
        try {
            let query = supabase.from("instructors").select("*").order("created_at", { ascending: false });;

            if (application_status) {
                query = query.eq("application_status", application_status);
            }

            if (application_complete !== undefined) {
                query = query.eq("application_complete", application_complete);
            }

            if (is_blocked !== undefined) {
                query = query.eq("is_blocked", is_blocked);
            }

            const res = await query;
            // console.log('Response for fetching instructors', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    });

// Update instructor action 
export const updateInstructor = createAsyncThunk('instructorSlice/updateInstructor',
    async ({ data, id }, { rejectWithValue, dispatch }) => {
        // console.log('update data', data, ' instructor Id', id);

        try {
            // Fetch existing instructor profile
            const { data: instructor, error: fetchErr } = await supabase.from("instructors").select("profile_image").eq("id", id).single();
            // console.log('Fetched profile image', instructor);

            if (fetchErr) throw fetchErr;

            // Create new filename
            let image_name, publicUrl;
            if (data?.profileImage) {

                const file = data.profileImage;
                const newFileName = `${id}_${Date.now()}.${file.name.split(".").pop()}`;

                // delete old image from bucket
                const res1 = await supabase.storage.from("instructor").remove([`image/${instructor.profile_image}`]);

                // Upload new file
                const res = await supabase.storage.from("instructor/image").upload(newFileName, file, { upsert: true });

                if (res.error) throw res.error;
                // console.log('upload data', res.data);

                image_name = res?.data?.path;

                // Get public URL
                const { data: publicUrlData } = supabase.storage.from("instructor/image").getPublicUrl(newFileName);

                publicUrl = publicUrlData.publicUrl;
            }

            // Update DB with PUBLIC URL again
            const res = await supabase.from("instructors").update({
                profile_image_url: data?.profileImage ? publicUrl : data.profile_image_url,
                profile_image: data?.profileImage ? image_name : data.profile_image,
                bio: data?.bio,
                expertise: data?.expertise,
                social_links: data?.social_links
            }).eq("id", id).select().single();
            // console.log('Response after updating instructor data', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (err) {
            console.error("Error updating profile:", err);
            return rejectWithValue(err.message);
        }
    }
);

// updates `blocked or not`
export const updateInstructorBlockUnblockStatus = createAsyncThunk("instructorSlice/updateInstructorBlockUnblockStatus",
    async ({ id, status }, { rejectWithValue }) => {
        // console.log('update block-unblock status data', id);

        try {
            const res = await supabase.from("instructors").update({ is_blocked: status }).eq("id", id).select();

            // console.log('Response for updating status', res);

            if (res?.error) return rejectWithValue(res?.error);

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// updates `approve status`
export const updateInstructorApproveRejectStatus = createAsyncThunk("instructorSlice/updateInstructorApproveRejectStatus",
    async ({ id, status }, { rejectWithValue }) => {
        // console.log('update block-unblock status data', id);

        try {
            const res = await supabase.from("instructors").update({ application_status: status }).eq("id", id).select();

            // console.log('Response for updating status', res);

            if (res?.error) return rejectWithValue(res?.error);

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const initialState = {
    isInstructorLoading: false,
    getInstructorData: [],
    isInstructorError: null
}

export const instructorSlice = createSlice({
    name: 'instructorSlice',
    initialState,
    extraReducers: (builder) => {
        // request instructor slice 
        builder.addCase(instructorRequest.pending, (state, action) => {
            state.isInstructorLoading = true;
        })
        builder.addCase(instructorRequest.fulfilled, (state, action) => {
            state.isInstructorLoading = false;
            state.getInstructorData = action.payload;
            state.isInstructorError = null;
        })
        builder.addCase(instructorRequest.rejected, (state, action) => {
            state.isInstructorLoading = false;
            state.getInstructorData = [];
            state.isInstructorError = action.error?.message;
        })

        // all instructor slice 
        builder.addCase(allInstructor.pending, (state, action) => {
            state.isInstructorLoading = true;
        })
        builder.addCase(allInstructor.fulfilled, (state, action) => {
            state.isInstructorLoading = false;
            state.getInstructorData = action.payload;
            state.isInstructorError = null;
        })
        builder.addCase(allInstructor.rejected, (state, action) => {
            state.isInstructorLoading = false;
            state.getInstructorData = [];
            state.isInstructorError = action.error?.message;
        })

        // update instructor slice 
        builder.addCase(updateInstructor.pending, (state, action) => {
            state.isInstructorLoading = true;
        })
        builder.addCase(updateInstructor.fulfilled, (state, action) => {
            state.isInstructorLoading = false;
            state.getInstructorData = { ...state.getInstructorData, ...action.payload };
            state.isInstructorError = null;
        })
        builder.addCase(updateInstructor.rejected, (state, action) => {
            state.isInstructorLoading = false;
            state.getInstructorData = [];
            state.isInstructorError = action.error?.message;
        })

        // update instructor status slice 
        builder.addCase(updateInstructorBlockUnblockStatus.pending, (state, action) => {
            state.isInstructorLoading = true;
        })
        builder.addCase(updateInstructorBlockUnblockStatus.fulfilled, (state, action) => {
            state.isInstructorLoading = false;
            state.getInstructorData = action.payload;
            state.isInstructorError = null;
        })
        builder.addCase(updateInstructorBlockUnblockStatus.rejected, (state, action) => {
            state.isInstructorLoading = false;
            state.getInstructorData = [];
            state.isInstructorError = action.error?.message;
        })

        // update instructor access status slice 
        builder.addCase(updateInstructorApproveRejectStatus.pending, (state, action) => {
            state.isInstructorLoading = true;
        })
        builder.addCase(updateInstructorApproveRejectStatus.fulfilled, (state, action) => {
            state.isInstructorLoading = false;
            state.getInstructorData = action.payload;
            state.isInstructorError = null;
        })
        builder.addCase(updateInstructorApproveRejectStatus.rejected, (state, action) => {
            state.isInstructorLoading = false;
            state.getInstructorData = [];
            state.isInstructorError = action.error?.message;
        });

    }
})

export default instructorSlice.reducer;