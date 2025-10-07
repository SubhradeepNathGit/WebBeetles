/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance/axiosInstance";
import { endPoint_userProfile } from "../../api/apiUrl/apiUrl";


// fetch profile action
export const userProfile = createAsyncThunk('userProfileSlice/userProfile',
    async () => {
        const res = await axiosInstance.get(endPoint_userProfile);
        // console.log('Response for fetching profile in slice', res);

        return res.data;
    }
)

const initialState = {
    isUserLoading: false,
    getUserData: [],
    isUserError: null
}

export const userProfileSlice = createSlice({
    name: 'userProfileSlice',
    initialState,
    extraReducers: (builder) => {

        // fetch profile reducer
        builder.addCase(userProfile.pending, (state, action) => {
            state.isUserLoading = true;
        })
        builder.addCase(userProfile.fulfilled, (state, action) => {
            state.isUserLoading = false;
            state.getUserData = action.payload;
            state.isUserError = null;
        })
        builder.addCase(userProfile.rejected, (state, action) => {
            state.isUserLoading = false;
            state.getUserData = [];
            state.isUserError = action.error?.message;
        })
    }
});

export default userProfileSlice.reducer;