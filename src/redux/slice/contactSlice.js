import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance/axiosInstance";
import { endPoint_contact } from "../../api/apiUrl/apiUrl";

// save query action
export const addQuery = createAsyncThunk('contactAuthSlice/addQuery',
    async (data, { rejectWithValue }) => {
        try {
            console.log('Data received for save query', data);

            const res = await axiosInstance.post(endPoint_contact, data);
            console.log('Response for save query', res);

            return res.data;
        } catch (err) {
            if (err.response && err.response.data) {
                return rejectWithValue(err.response.data);
            } else {
                return rejectWithValue({ message: err.message });
            }
        }
    }
)

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