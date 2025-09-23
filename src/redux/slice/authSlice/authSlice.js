import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance/axiosInstance";
import { endPoint_userLogin, endPoint_userRegister } from "../../../api/apiUrl/apiUrl";

// register action
export const userRegister = createAsyncThunk('userAuthSlice/userRegister',
    async (data) => {
        // console.log('Data received for user registration', data);

        const res = await axiosInstance.post(endPoint_userRegister, data);
        console.log('Response for user registration', res);

        return res.data;
    }
)

// login action
export const userLogin = createAsyncThunk('userAuthSlice/userLogin',
    async (data) => {
        console.log('Data received for user login', data);

        const res = await axiosInstance.post(endPoint_userLogin, data);
        console.log('Response for user login', res);

        return res.data;
    }
)

const initialState = {
    isAuthLoading: false,
    getAuthData: [],
    isAuthError: null
}

export const userAuthSlice = createSlice({
    name: 'userAuthSlice',
    initialState,
    extraReducers: (builder) => {

        // register reducer
        builder.addCase(userRegister.pending, (state, action) => {
            state.isAuthLoading = true;
        })
        builder.addCase(userRegister.fulfilled, (state, action) => {
            state.isAuthLoading = false;
            state.getAuthData = action.payload;
            state.isAuthError = null;
        })
        builder.addCase(userRegister.rejected, (state, action) => {
            state.isAuthLoading = false;
            state.isAuthError = action.error?.message;
        })

        // login reducer
        builder.addCase(userLogin.pending, (state, action) => {
            state.isAuthLoading = true;
        })
        builder.addCase(userLogin.fulfilled, (state, action) => {
            state.isAuthLoading = false;
            state.getAuthData = action.payload;
            state.isAuthError = null;
        })
        builder.addCase(userLogin.rejected, (state, action) => {
            state.isAuthLoading = false;
            state.isAuthError = action.error?.message;
        })
    }
});

export default userAuthSlice.reducer;