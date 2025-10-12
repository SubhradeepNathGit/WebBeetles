import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance/axiosInstance";
import { endPoint_userProfile, endPoint_userUpdateProfile } from "../../api/apiUrl/apiUrl";

// user profile action 
export const userProfile = createAsyncThunk("userProfileSlice/userProfile",
    async () => {
        const res = await axiosInstance.get(endPoint_userProfile);
        // console.log('Response for user profile slice', res);

        return res.data;
    });

// update user profile action 
export const updateUserProfile = createAsyncThunk("updateUserProfile/userProfile",
    async (data) => {
        console.log('Update user details slice', data);

        const res = await axiosInstance.post(endPoint_userUpdateProfile, data);
        console.log('Response for user profile slice', res);

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
        // user profile reducer 
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
        })

        // update user profile reducer 
        builder.addCase(updateUserProfile.pending, (state) => {
            state.isUserLoading = true;
        })
        builder.addCase(updateUserProfile.fulfilled, (state, action) => {
            state.isUserLoading = false;
            state.getUserData = action.payload;
            state.isUserError = null;
        })
        builder.addCase(updateUserProfile.rejected, (state, action) => {
            state.isUserLoading = false;
            state.getUserData = {};
            state.isUserError = action.error?.message;
        })
    },
});

// export const { clearUserData } = userProfileSlice.actions;
export default userProfileSlice.reducer;