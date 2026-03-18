import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../util/supabase/supabase";

// save contact query
export const addQuery = createAsyncThunk("contactAuthSlice/addQuery",
    async (data, { rejectWithValue }) => {
        // console.log('Received data for contact', data);
        
        try {
            const res = await supabase.from("contacts").insert([data]).select().single();
            // console.log('Response for adding contact message', res);

            if (res?.error) throw res?.error;

            return res?.result;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


const initialState = {
    isContactLoading: false,
    getContactData: [],
    isContactError: null
}

export const contactAuthSlice = createSlice({
    name: 'contactAuthSlice',
    initialState,
    extraReducers: (builder) => {

        // save query reducer
        builder.addCase(addQuery.pending, (state, action) => {
            state.isContactLoading = true;
        })
        builder.addCase(addQuery.fulfilled, (state, action) => {
            state.isContactLoading = false;
            state.getContactData = action.payload;
            state.isContactError = null;
        })
        builder.addCase(addQuery.rejected, (state, action) => {
            state.isContactLoading = false;
            state.getContactData = [];
            state.isContactError = action.error?.message;
        })
    }
});

export default contactAuthSlice.reducer;