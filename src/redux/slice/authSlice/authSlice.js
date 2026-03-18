import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../../util/supabase/supabase";

// register action
export const registerSlice = createAsyncThunk('authSlice/registerSlice',
    async ({ data, userType }, { rejectWithValue }) => {
        try {
            // console.log('Data received for user registration', data);

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password
            });

            if (authError) throw authError;
            const userId = authData?.user?.id;

            // Upload profile image if present
            let imageUrl = null, imageId = null;
            const file = data.profile_image;
            if (file) {
                const fileName = `${userId}_${Date.now()}.${file.name.split(".").pop()}`;
                const { data: uploadData, error: uploadError } = await supabase.storage.from(userType == 'student' ? "student" : "instructor/image").upload(fileName, file, { upsert: true });
                // console.log('Uploading image data', uploadData, ' error', uploadError);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage.from(userType == 'student' ? "student" : "instructor/image").getPublicUrl(fileName);

                imageUrl = publicUrlData.publicUrl;
                imageId = uploadData.path;
            }

            // Insert into public.users table 
            let res;

            if (userType == 'admin') {
                res = await supabase.from("admins").insert([{
                    id: userId,
                    name: data.name,
                    email: data.email,
                    is_verified: "pending",
                    role: "admin",
                    is_blocked: false,
                    last_login: null,
                    created_at: new Date(),
                    updated_at: new Date(),
                }]);
            }
            else if (userType == 'student') {
                res = await supabase.from("students").insert([{
                    id: userId,
                    name: data.name,
                    email: data.email,
                    profile_image_url: imageUrl,
                    profile_image: imageId,
                    is_verified: "pending",
                    role: "student",
                    is_blocked: false,
                    last_login: null,
                    created_at: new Date(),
                    updated_at: new Date(),
                }]);
            }
            else {
                res = await supabase.from("instructors").insert([{
                    id: userId,
                    name: data.name,
                    email: data.email,
                    profile_image_url: imageUrl,
                    profile_image: imageId,
                    document: null,
                    application_status: "pending",
                    role: "instructor",
                    bio: null,
                    expertise: [],
                    application_complete: false,
                    social_links: null,
                    is_verified: "pending",
                    is_blocked: false,
                    last_login: null,
                    created_at: new Date(),
                    updated_at: new Date(),
                }]);
            }
            if (res.error) throw res.error;

            // console.log('Response for user registration', res.data);

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
export const emailVerifySlice = createAsyncThunk('authSlice/emailVerifySlice',
    async ({ data: verificationData, userType }, { rejectWithValue }) => {
        try {
            // Verify OTP with Supabase
            const { data, error } = await supabase.auth.verifyOtp({
                email: verificationData?.email,
                token: verificationData?.otp,
                type: 'email',
            });

            if (error) {
                // On failed OTP verification → mark rejected if still pending
                const { data: user } = await supabase.from(userType == 'student' ? "students" : userType == 'admin' ? "admins" : "instructors").select("is_verified").eq("email", verificationData?.email).single();

                if (user?.is_verified === "pending") {
                    await supabase.from(userType == 'student' ? "students" : userType == 'admin' ? "admins" : "instructors").update({ is_verified: "rejected" }).eq("email", verificationData?.email);
                }

                throw error;
            }

            // OTP success → mark fulfilled if still pending
            const { data: user } = await supabase.from(userType == 'student' ? "students" : userType == 'admin' ? "admins" : "instructors").select("is_verified").eq("email", verificationData?.email).single();

            if (user?.is_verified === "pending" || user?.is_verified === "rejected") {
                await supabase.from(userType == 'student' ? "students" : userType == 'admin' ? "admins" : "instructors").update({ is_verified: "fulfilled" }).eq("email", verificationData?.email);
            }

            return data;
        } catch (err) {
            return rejectWithValue({ message: err.message });
        }
    }
)

// login action
export const loginSlice = createAsyncThunk('authSlice/loginSlice',
    async ({ data, role }, { rejectWithValue }) => {
        try {
            // console.log('Data received for user login', data);

            const res = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });
            // console.log("Response for user login", res);

            if (res.error) throw res.error;

            const userId = res?.data.user.id;
            let userData = null, userError = null;

            if (role == 'student') {
                ({ data: userData, error: userError } = await supabase.from("students").select("*").eq("id", userId).single());
            }
            else if (role == 'instructor') {
                ({ data: userData, error: userError } = await supabase.from("instructors").select("*").eq("id", userId).single());
            }
            else if (role == 'admin') {
                ({ data: userData, error: userError } = await supabase.from("admins").select("*").eq("id", userId).single());
            }
            else {
                userData = null, userError = null;
            }
            // console.log('Response for user login', res);

            return { ...res.data, userData: userData };

        } catch (err) {
            if (err.response && err.response.data) {
                return rejectWithValue(err.response.data);
            } else {
                return rejectWithValue({ message: err.message });
            }
        }
    }
)

// update last login slice 
export const updateLastSignInAt = createAsyncThunk("authSlice/updateLastSignInAt",
    async ({ id, user_type }, { rejectWithValue }) => {
        // console.log('update login data', id,user_type);

        try {
            let res = null;
            if (user_type == 'admin') {
                res = await supabase.from("admins").update({ last_login: new Date().toISOString() }).eq("id", id).select();
            }
            else if (user_type == 'student') {
                res = await supabase.from("students").update({ last_login: new Date().toISOString() }).eq("id", id).select();
            }
            else {
                res = await supabase.from("instructors").update({ last_login: new Date().toISOString() }).eq("id", id).select();
            }
            // console.log('Response for updating sign-in time', res);

            if (res?.error) return rejectWithValue(res?.error);

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// forget password action
export const forgetPasswordSlice = createAsyncThunk('authSlice/forgetPasswordSlice',
    async ({ data, userType }, { rejectWithValue }) => {
        try {
            // console.log('Data received for forget password', data);

            // Check if user exists 
            const { data: existingUser, error: fetchError } = await supabase.from(userType == 'student' ? "students" : "instructors").select("email").eq("email", data.email).single();

            if (!existingUser) {
                return rejectWithValue({
                    message: "No account found with this email."
                });
            }

            const res = await supabase.auth.signInWithOtp({
                email: data.email,
                options: {
                    emailRedirectTo: undefined,
                }
            });
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
// export const studentResetPassword = createAsyncThunk('authSlice/studentResetPassword',
//     async (data, { rejectWithValue }) => {
//         try {
//             console.log('Data received for reset password', data);

//             // Verify OTP
//             const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
//                 type: "email",
//                 email: data.email,
//                 token: data.otp,
//             });

//             if (verifyError) throw verifyError;

//             // Update password
//             const res = await supabase.auth.updateUser({
//                 password: data.newPassword,
//             });

//             if (res.error) throw res.error;
//             console.log('Response for reset password', res);

//             return res.data;
//         } catch (err) {
//             if (err.response && err.response.data) {
//                 return rejectWithValue(err.response.data);
//             } else {
//                 return rejectWithValue({ message: err.message });
//             }
//         }
//     }
// )


// verify OTP action
export const verifyOtpForReset = createAsyncThunk("authSlice/verifyOtpForReset",
    async (data, { rejectWithValue }) => {
        // console.log('Received data for OTP verification in slice', data);

        const { data: verifyData, error } = await supabase.auth.verifyOtp({
            type: "email",
            email: data.email,
            token: data.otp,
        });

        if (error) {
            return rejectWithValue({ message: "Invalid or expired OTP" });
        }

        // Return session so frontend can store it
        return verifyData.session;
    }
);

// reset password action
export const resetPasswordSlice = createAsyncThunk("authSlice/resetPasswordSlice",
    async (data, { rejectWithValue, getState, dispatch }) => {
        try {
            let session = getState().auth.otpSession; // stored previously
            // console.log('session', session);

            // If session is missing → dispatch OTP verification
            if (!session) {
                const otpAction = await dispatch(verifyOtpForReset(data));

                if (otpAction.meta.requestStatus === "rejected") {
                    return rejectWithValue({ message: "Invalid or expired OTP" });
                }
                session = otpAction.payload;
            }

            if (!session) {
                return rejectWithValue({
                    message: "Session expired. Please request OTP again.",
                });
            }

            // Update user password
            const res = await supabase.auth.updateUser(
                { password: data.newPassword }
            );
            // console.log('Response for updating password', res);

            if (res.error) {
                if (res.error.message.includes("New password should be different from the old password.")) {
                    return rejectWithValue({
                        message: "New password cannot be the same as old password",
                    });
                }

                return rejectWithValue({
                    message: "An error occurred. Try again.",
                });
            }
            return res.data;
        } catch (err) {
            return rejectWithValue({ message: err.message });
        }
    }
);

// resend otp action
export const resendOTPSlice = createAsyncThunk('authSlice/resendOTPSlice',
    async (data, { rejectWithValue }) => {
        try {
            // console.log("Resending verification email for:", data.email);

            const { data: resendData, error } = await supabase.auth.resend({
                type: "signup",
                email: data.email,
            });

            if (error) throw error;

            // console.log("Resend email response:", resendData);

            return { message: "Verification email resent successfully." };
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
    isUserAuthLoading: false,
    getUserAuthData: [],
    otpSession: null,
    isUserAuthError: null
}

export const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    extraReducers: (builder) => {
        builder
            // register reducer
            .addCase(registerSlice.pending, (state, action) => {
                state.isUserAuthLoading = true;
            })
            .addCase(registerSlice.fulfilled, (state, action) => {
                state.isUserAuthLoading = false;
                state.getUserAuthData = action.payload;
                state.isUserAuthError = null;
            })
            .addCase(registerSlice.rejected, (state, action) => {
                state.isUserAuthLoading = false;
                state.getUserAuthData = [];
                state.isUserAuthError = action.error?.message;
            })

            // email verify reducer
            .addCase(emailVerifySlice.pending, (state, action) => {
                state.isUserAuthLoading = true;
            })
            .addCase(emailVerifySlice.fulfilled, (state, action) => {
                state.isUserAuthLoading = false;
                state.getUserAuthData = action.payload;
                state.isUserAuthError = null;
            })
            .addCase(emailVerifySlice.rejected, (state, action) => {
                state.isUserAuthLoading = false;
                state.getUserAuthData = [];
                state.isUserAuthError = action.error?.message;
            })

            // login reducer
            .addCase(loginSlice.pending, (state, action) => {
                state.isUserAuthLoading = true;
            })
            .addCase(loginSlice.fulfilled, (state, action) => {
                state.isUserAuthLoading = false;
                state.getUserAuthData = action.payload;
                state.isUserAuthError = null;
            })
            .addCase(loginSlice.rejected, (state, action) => {
                state.isUserAuthLoading = false;
                state.getUserAuthData = [];
                state.isUserAuthError = action.error?.message;
            })

            // update last-login reducer
            .addCase(updateLastSignInAt.pending, (state, action) => {
                state.isUserAuthLoading = true;
            })
            .addCase(updateLastSignInAt.fulfilled, (state, action) => {
                state.isUserAuthLoading = false;
                state.getUserAuthData = action.payload;
                state.isUserAuthError = null;
            })
            .addCase(updateLastSignInAt.rejected, (state, action) => {
                state.isUserAuthLoading = false;
                state.getUserAuthData = [];
                state.isUserAuthError = action.error?.message;
            })

            // forget password reducer
            .addCase(forgetPasswordSlice.pending, (state, action) => {
                state.isUserAuthLoading = true;
            })
            .addCase(forgetPasswordSlice.fulfilled, (state, action) => {
                state.isUserAuthLoading = false;
                state.getUserAuthData = action.payload;
                state.isUserAuthError = null;
            })
            .addCase(forgetPasswordSlice.rejected, (state, action) => {
                state.isUserAuthLoading = false;
                state.getUserAuthData = [];
                state.isUserAuthError = action.error?.message;
            })

            // reset password reducer
            .addCase(resetPasswordSlice.pending, (state, action) => {
                state.isUserAuthLoading = true;
            })
            .addCase(resetPasswordSlice.fulfilled, (state, action) => {
                state.isUserAuthLoading = false;
                state.getUserAuthData = action.payload;
                state.otpSession = null;
                state.isUserAuthError = null;
            })
            .addCase(resetPasswordSlice.rejected, (state, action) => {
                state.isUserAuthLoading = false;
                state.getUserAuthData = [];
                state.isUserAuthError = action.error?.message;
            })

            // verify OTP reducer
            .addCase(verifyOtpForReset.pending, (state, action) => {
                state.isUserAuthLoading = true;
            })
            .addCase(verifyOtpForReset.fulfilled, (state, action) => {
                state.isUserAuthLoading = false;
                state.otpSession = action.payload;
            })
            .addCase(verifyOtpForReset.rejected, (state, action) => {
                state.isUserAuthLoading = false;
                state.otpSession = null;
            })

            // resend OTP reducer
            .addCase(resendOTPSlice.pending, (state, action) => {
                state.isUserAuthLoading = true;
            })
            .addCase(resendOTPSlice.fulfilled, (state, action) => {
                state.isUserAuthLoading = false;
                state.getUserAuthData = action.payload;
                state.isUserAuthError = null;
            })
            .addCase(resendOTPSlice.rejected, (state, action) => {
                state.isUserAuthLoading = false;
                state.getUserAuthData = [];
                state.isUserAuthError = action.error?.message;
            })
    }
});

export default authSlice.reducer;