import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance/axiosInstance";
import { endPoint_userProfile } from "../../api/apiUrl/apiUrl";

export const userProfile = createAsyncThunk("userProfileSlice/userProfile", 
    async () => {
    const res = await axiosInstance.get(endPoint_userProfile);
    // console.log('Response for user profile slice', res);

    return res.data;
});

const initialState = {
    isUserLoading: false,
    getUserData: {},
    isUserError: null,
};

export const userProfileSlice = createSlice({
    name: "userProfileSlice",
    initialState,
    // reducers: {
    //     clearUserData: (state) => {
    //         state.getUserData = {};
    //         state.isUserLoading = false;
    //         state.isUserError = null;
    //     },
    // },
    extraReducers: (builder) => {
        builder.addCase(userProfile.pending, (state) => {
            state.isUserLoading = true;
        })
        builder.addCase(userProfile.fulfilled, (state, action) => {
            state.isUserLoading = false;
            state.getUserData = action.payload;
            state.isUserError = null;
        })
        builder.addCase(userProfile.rejected, (state, action) => {
            state.isUserLoading = false;
            state.getUserData = {};
            state.isUserError = action.error?.message;
        });
    },
});

// export const { clearUserData } = userProfileSlice.actions;
export default userProfileSlice.reducer;