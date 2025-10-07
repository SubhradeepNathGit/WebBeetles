import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../api/axiosInstance/axiosInstance";
import { endPoint_userForgotPassword, endPoint_userLogin, endPoint_userRegister, endPoint_userResendOTP, endPoint_userResetPassword, endPoint_userVerifyEmail } from "../../../api/apiUrl/apiUrl";

// register action
export const userRegister = createAsyncThunk('userAuthSlice/userRegister',
    async (data, { rejectWithValue }) => {
        try {
            // console.log('Data received for user registration', data);

            const res = await axiosInstance.post(endPoint_userRegister, data);
            // console.log('Response for user registration', res);

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

// verify-email action
export const emailVerify = createAsyncThunk('userAuthSlice/emailVerify',
    async (data, { rejectWithValue }) => {
        try {
            // console.log('Data received for email verification', data);

            const res = await axiosInstance.post(endPoint_userVerifyEmail, data);
            // console.log('Response for email verification', res);

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

// login action
export const userLogin = createAsyncThunk('userAuthSlice/userLogin',
    async (data, { rejectWithValue }) => {
        try {
            // console.log('Data received for user login', data);

            const res = await axiosInstance.post(endPoint_userLogin, data);
            // console.log('Response for user login', res);

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

// forget password action
export const userForgetPassword = createAsyncThunk('userAuthSlice/userForgetPassword',
    async (data, { rejectWithValue }) => {
        try {
            // console.log('Data received for forget password', data);

            const res = await axiosInstance.post(endPoint_userForgotPassword, data);
            // console.log('Response for forget password', res);

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

// reset password action
export const userResetPassword = createAsyncThunk('userAuthSlice/userResetPassword',
    async (data, { rejectWithValue }) => {
        try {
            // console.log('Data received for reset password', data);

            const res = await axiosInstance.post(endPoint_userResetPassword, data);
            // console.log('Response for reset password', res);

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

// resend otp action
export const userResendOTP = createAsyncThunk('userAuthSlice/userResendOTP',
    async (data, { rejectWithValue }) => {
        try {
            console.log('Data received for resend otp', data);

            const res = await axiosInstance.post(endPoint_userResendOTP, data);
            console.log('Response for resend otp', res);

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
            state.getAuthData = [];
            state.isAuthError = action.error?.message;
        })

        // email verify reducer
        builder.addCase(emailVerify.pending, (state, action) => {
            state.isAuthLoading = true;
        })
        builder.addCase(emailVerify.fulfilled, (state, action) => {
            state.isAuthLoading = false;
            state.getAuthData = action.payload;
            state.isAuthError = null;
        })
        builder.addCase(emailVerify.rejected, (state, action) => {
            state.isAuthLoading = false;
            state.getAuthData = [];
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
            state.getAuthData = [];
            state.isAuthError = action.error?.message;
        })

        // forget password reducer
        builder.addCase(userForgetPassword.pending, (state, action) => {
            state.isAuthLoading = true;
        })
        builder.addCase(userForgetPassword.fulfilled, (state, action) => {
            state.isAuthLoading = false;
            state.getAuthData = action.payload;
            state.isAuthError = null;
        })
        builder.addCase(userForgetPassword.rejected, (state, action) => {
            state.isAuthLoading = false;
            state.getAuthData = [];
            state.isAuthError = action.error?.message;
        })

        // reset password reducer
        builder.addCase(userResetPassword.pending, (state, action) => {
            state.isAuthLoading = true;
        })
        builder.addCase(userResetPassword.fulfilled, (state, action) => {
            state.isAuthLoading = false;
            state.getAuthData = action.payload;
            state.isAuthError = null;
        })
        builder.addCase(userResetPassword.rejected, (state, action) => {
            state.isAuthLoading = false;
            state.getAuthData = [];
            state.isAuthError = action.error?.message;
        })
        
        // resend OTP reducer
        builder.addCase(userResendOTP.pending, (state, action) => {
            state.isAuthLoading = true;
        })
        builder.addCase(userResendOTP.fulfilled, (state, action) => {
            state.isAuthLoading = false;
            state.getAuthData = action.payload;
            state.isAuthError = null;
        })
        builder.addCase(userResendOTP.rejected, (state, action) => {
            state.isAuthLoading = false;
            state.getAuthData = [];
            state.isAuthError = action.error?.message;
        })
    }
});

export default userAuthSlice.reducer;