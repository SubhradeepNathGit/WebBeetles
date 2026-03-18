import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../util/supabase/supabase";

// add video alice 
export const addVideo = createAsyncThunk('videoSlice/addVideo',
    async ({ data, doc_type }, { rejectWithValue }) => {
        // console.log('Receive data in add video slice', data, doc_type);

        let videoUrl = null, imageId = null, fileName = null, docName = null;
        const file = data.video_url;
        const { old_path, id, ...newPayload } = data;

        if (file) {

            docName = `${newPayload?.course_id}_${Date.now()}.${file.name.split(".").pop()}`;
            fileName = `${doc_type == 'video' ? 'video' : 'document'}/${docName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage.from("lecture").upload(fileName, file, { upsert: true });
            // console.log('Uploading image data', uploadData, ' error', uploadError);

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage.from("lecture").getPublicUrl(fileName);

            videoUrl = publicUrlData.publicUrl;
            imageId = uploadData.path;
        }

        const res = await supabase.from("lectures").insert([{ ...newPayload, lecture_name: docName, video_url: videoUrl }]);
        // console.log('Response for adding video', res);

        if (res.error) return rejectWithValue(res?.error?.message);

        return res.data;
    }
)

// fetch video slice 
export const fetchVideo = createAsyncThunk("videoSlice/fetchVideo",
    async ({ course_id, status }, { rejectWithValue }) => {
        try {
            // console.log('Fetching video details', course_id, status);
            let query = supabase.from("lectures").select("*").eq("course_id", course_id).order("created_at", { ascending: true });

            if (status) {
                query = query.eq("status", status);
            }

            const res = await query;
            // console.log('Response for fetching lecture videos', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// edit video slice 
export const editLecture = createAsyncThunk("videoSlice/editLecture",
    async ({ data, doc_type }, { rejectWithValue }) => {
        // console.log('Received edited data in slice', data, doc_type);

        let videoUrl = data.video_url;
        let docName = data.lecture_name;

        if (data.video_url instanceof File) {
            if (data.old_path) {
                const deletedLectureName = `${doc_type}/${data.old_path}`;
                await supabase.storage.from("lecture").remove([deletedLectureName]);
            }

            const file = data.video_url;
            docName = `${data.course_id}_${Date.now()}.${file.name.split(".").pop()}`;
            const path = `${doc_type}/${docName}`;

            const { error } = await supabase.storage.from("lecture").upload(path, file, { upsert: true });
            if (error) throw error;

            const { data: urlData } = supabase.storage.from("lecture").getPublicUrl(path);
            videoUrl = urlData.publicUrl;
        }

        const res = await supabase.from("lectures").update({
            video_title: data.video_title,
            video_url: videoUrl,
            lecture_name: docName,
            duration: data.duration
        }).eq("id", data.id);
        // console.log('Response for editing lecture video in slice', res);

        if (res.error) return rejectWithValue(res.error.message);
        return res.data;
    }
);

// delete video slice 
export const deleteLecture = createAsyncThunk("videoSlice/deleteLecture",
    async ({ lectureId, lectureName, doc_type }, { rejectWithValue }) => {
        // console.log('Received data for deleting video', lectureId, lectureName, doc_type);

        try {
            if (lectureName) {
               await supabase.storage.from("lecture").remove([`${doc_type}/${lectureName}`]);
            }

            const res = await supabase.from("lectures").delete().eq("id", lectureId);
            // console.log('Response for deleting video in slice', res);

            if (res?.error) throw res?.error;

            return lectureId;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);


const initialState = {
    isVideoLoading: false,
    videoData: [],
    hasVideoError: null
}

export const videoSlice = createSlice({
    name: 'videoSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // ADD
            .addCase(addVideo.pending, (state) => {
                state.isVideoLoading = true;
            })
            .addCase(addVideo.fulfilled, (state, action) => {
                state.isVideoLoading = false;
                state.videoData = action.payload;
            })
            .addCase(addVideo.rejected, (state, action) => {
                state.isVideoLoading = false;
                state.hasVideoError = action.payload;
            })

            // FETCH
            .addCase(fetchVideo.pending, (state) => {
                state.isVideoLoading = true;
            })
            .addCase(fetchVideo.fulfilled, (state, action) => {
                state.isVideoLoading = false;
                state.videoData = action.payload;
            })
            .addCase(fetchVideo.rejected, (state, action) => {
                state.isVideoLoading = false;
                state.hasVideoError = action.payload;
            })

            // EDIT
            .addCase(editLecture.pending, (state) => {
                state.isVideoLoading = true;
            })
            .addCase(editLecture.fulfilled, (state, action) => {
                state.isVideoLoading = false;
                state.videoData = action.payload;
            })
            .addCase(editLecture.rejected, (state, action) => {
                state.isVideoLoading = false;
                state.hasVideoError = action.payload;
            })

            // DELETE
            .addCase(deleteLecture.pending, (state) => {
                state.isVideoLoading = true;
            })
            .addCase(deleteLecture.fulfilled, (state, action) => {
                state.isVideoLoading = false;
                state.videoData =  action.payload;
            })
            .addCase(deleteLecture.rejected, (state, action) => {
                state.isVideoLoading = false;
                state.hasVideoError = action.payload;
            });
    }
})

export default videoSlice.reducer;