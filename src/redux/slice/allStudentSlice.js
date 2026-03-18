import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../util/supabase/supabase";

// fetch all students
export const fetchAllStudents = createAsyncThunk("userSlice/fetchAllStudents",
    async (_, { rejectWithValue }) => {
        try {
            const res = await supabase.from("students").select("*").order("created_at", { ascending: false });

            // console.log('Response for fetching all students', res);

            if (res?.error) return rejectWithValue(res?.error);

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const initialState = {
    isAllStudentLoading: false,
    getAllStudentData: [],
    isAllStudentError: null,
};

export const studentSlice = createSlice({
    name: "studentSlice",
    initialState,
    extraReducers: (builder) => {
        builder

            // fetching all students reducer 
            .addCase(fetchAllStudents.pending, (state) => {
                state.isAllStudentLoading = true;
            })
            .addCase(fetchAllStudents.fulfilled, (state, action) => {
                state.isAllStudentLoading = false;
                state.getAllStudentData = action.payload;
                state.isAllStudentError = null;
            })
            .addCase(fetchAllStudents.rejected, (state, action) => {
                state.isAllStudentLoading = false;
                state.getAllStudentData = {};
                state.isAllStudentError = action.error?.message;
            });
    },
});

export default studentSlice.reducer;