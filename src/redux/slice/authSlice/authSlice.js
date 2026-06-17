import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../../util/supabase/supabase";
import supabaseAdmin from "../../../util/supabase/supabaseAdmin";
import { generateOTP, sendOTPEmail, sendForgetPasswordEmail } from "../../../util/email/emailService";
import { createNotification } from "../../../util/notification/notificationHelper";

// register action
export const registerSlice = createAsyncThunk('authSlice/registerSlice',
    async ({ data, userType }, { rejectWithValue }) => {
        try {
            // console.log('Data received for user registration', data);

            // Create user via admin API with email pre-confirmed (bypasses Supabase SMTP)
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: data.email,
                password: data.password,
                email_confirm: true,
            });

            if (authError) throw authError;
            const userId = authData?.user?.id;

            // Upload profile image if present
            let imageUrl = null, imageId = null;
            const file = data.profile_image;
            if (file) {
                const fileName = `${userId}_${Date.now()}.${file.name.split(".").pop()}`;
                const { data: uploadData, error: uploadError } = await supabaseAdmin.storage.from(userType == 'student' ? "student" : "instructor/image").upload(fileName, file, { upsert: true });
                // console.log('Uploading image data', uploadData, ' error', uploadError);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabaseAdmin.storage.from(userType == 'student' ? "student" : "instructor/image").getPublicUrl(fileName);

                imageUrl = publicUrlData.publicUrl;
                imageId = uploadData.path;
            }

            // Insert into public.users table using admin client to bypass RLS
            let res;

            if (userType == 'admin') {
                res = await supabaseAdmin.from("admins").insert([{
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
                res = await supabaseAdmin.from("students").insert([{
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
                res = await supabaseAdmin.from("instructors").insert([{
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

            // Generate a 6-digit OTP, store in otp_tokens, send via EmailJS
            const otp = generateOTP();

            // Delete any existing OTPs for this email to keep it clean
            await supabaseAdmin.from('otp_tokens').delete().eq('email', data.email);

            const { error: otpInsertError } = await supabaseAdmin.from('otp_tokens').insert([{
                email: data.email,
                otp,
                user_type: userType,
                expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
            }]);

            if (otpInsertError) throw otpInsertError;

            // Send OTP email via EmailJS
            await sendOTPEmail(data.email, data.name, otp);
            console.log(`[DEV ONLY] OTP for ${data.email} is: ${otp}`);

            return { userId, email: data.email };
        } catch (err) {
            if (err.response && err.response.data) {
                return rejectWithValue(err.response.data);
            } else {
                return rejectWithValue({ message: err.message });
            }
        }
    }
)

// verify-email action — checks OTP against our own otp_tokens table
export const emailVerifySlice = createAsyncThunk('authSlice/emailVerifySlice',
    async ({ data: verificationData, userType }, { rejectWithValue }) => {
        try {
            const table = userType === 'student' ? 'students' : userType === 'admin' ? 'admins' : 'instructors';

            // Fetch stored OTP row for this email
            const { data: tokenRow, error: fetchError } = await supabaseAdmin
                .from('otp_tokens')
                .select('*')
                .eq('email', verificationData?.email)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (fetchError || !tokenRow) {
                return rejectWithValue({ message: 'OTP not found. Please request a new one.' });
            }

            // Check expiry
            if (new Date(tokenRow.expires_at) < new Date()) {
                await supabaseAdmin.from('otp_tokens').delete().eq('email', verificationData?.email);
                return rejectWithValue({ message: 'OTP has expired. Please request a new one.' });
            }

            // Check OTP match
            if (tokenRow.otp !== verificationData?.otp) {
                return rejectWithValue({ message: 'Incorrect OTP. Please try again.' });
            }

            // OTP correct — clean up token row
            await supabaseAdmin.from('otp_tokens').delete().eq('email', verificationData?.email);

            // Mark user as verified
            await supabaseAdmin.from(table).update({ is_verified: 'fulfilled' }).eq('email', verificationData?.email);

            // Notify Admin
            if (userType === 'student' || userType === 'instructor') {
                await createNotification({
                    title: userType === 'student' ? 'New Student Registration' : 'New Instructor Application',
                    message: `A new ${userType} (${verificationData?.email}) has verified their email and joined WebBeetles.`,
                    type: 'success',
                    user_type: 'admin',
                    user_id: null,
                    link: userType === 'student' ? '/admin/students' : '/admin/instructors',
                });
            }

            return { email: verificationData?.email };
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
                userData = null;
                userError = null;
            }

            // If no record found in the expected role's table, this user doesn't belong here
            if (!userData) {
                await supabase.auth.signOut();
                return rejectWithValue({ message: "Invalid login credentials" });
            }

            if (userData.is_verified !== 'fulfilled' && userData.is_verified !== 'verified') {
                await supabase.auth.signOut();
                return rejectWithValue({ message: "Please verify your email first" });
            }

            // Notification for new sign in
            await createNotification({
                title: 'New Sign In',
                message: `You recently signed in to your account.`,
                type: 'info',
                user_type: role,
                user_id: userData.id,
                link: role === 'student' ? '/student/dashboard' : '/instructor/dashboard',
            });

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
            // Check if user exists
            const table = userType === 'student' ? "students" : "instructors";
            const normalizedEmail = data.email.trim().toLowerCase();
            const { data: existingUser, error: fetchError } = await supabaseAdmin.from(table).select("email, name").eq("email", normalizedEmail).single();

            if (fetchError || !existingUser) {
                return rejectWithValue({
                    message: "No account found with this email."
                });
            }

            // Generate a 6-digit OTP, store in otp_tokens, send via EmailJS
            const otp = generateOTP();

            await supabaseAdmin.from('otp_tokens').delete().eq('email', data.email);

            const { data: otpInsertData, error: otpInsertError } = await supabaseAdmin.from('otp_tokens').insert([{
                email: data.email,
                otp,
                user_type: userType,
                expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 mins expiry
            }]).select('id').single();

            if (otpInsertError) throw otpInsertError;

            // Construct secure confirm/reset link
            const resetLink = `${window.location.origin}${userType === 'student' ? '' : '/instructor'}/reset-password?token=${otpInsertData.id}&email=${encodeURIComponent(normalizedEmail)}`;

            // Send password reset link email via EmailJS
            await sendForgetPasswordEmail(normalizedEmail, existingUser.name, resetLink);
            console.log(`[DEV ONLY] Forget Password reset link for ${normalizedEmail} is: ${resetLink}`);

            return { email: normalizedEmail };
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


// reset password action
export const resetPasswordSlice = createAsyncThunk("authSlice/resetPasswordSlice",
    async (data, { rejectWithValue }) => {
        try {
            // data contains: email, otp, newPassword, userType
            const table = data.userType === 'student' ? 'students' : 'instructors';
            const normalizedEmail = data.email?.trim().toLowerCase();

            if (!normalizedEmail || !data.otp) {
                return rejectWithValue({ message: 'Reset link is invalid. Please request a new one.' });
            }

            // Fetch stored OTP row for this email
            const { data: tokenRow, error: fetchError } = await supabaseAdmin
                .from('otp_tokens')
                .select('*')
                .eq('email', normalizedEmail)
                .eq('user_type', data.userType)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (fetchError || !tokenRow) {
                return rejectWithValue({ message: 'Reset link not found. Please request a new one.' });
            }

            // Check expiry
            if (new Date(tokenRow.expires_at) < new Date()) {
                await supabaseAdmin.from('otp_tokens').delete().eq('email', normalizedEmail).eq('user_type', data.userType);
                return rejectWithValue({ message: 'Reset link has expired. Please request a new one.' });
            }

            // Check OTP or Link Token (UUID) match
            const isMatch = tokenRow.id === data.otp;
            if (!isMatch) {
                return rejectWithValue({ message: 'Reset link is invalid or expired.' });
            }

            // OTP correct — clean up token row
            await supabaseAdmin.from('otp_tokens').delete().eq('email', normalizedEmail).eq('user_type', data.userType);

            // Fetch user id from our table
            const { data: userData, error: userError } = await supabaseAdmin
                .from(table)
                .select('id')
                .eq('email', normalizedEmail)
                .single();

            if (userError || !userData) {
                return rejectWithValue({ message: "User not found." });
            }

            // Update user password via admin API
            const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                userData.id,
                { password: data.newPassword }
            );

            if (updateError) {
                if (updateError.message.includes("New password should be different from the old password.")) {
                    return rejectWithValue({
                        message: "New password cannot be the same as old password",
                    });
                }
                return rejectWithValue({
                    message: "An error occurred. Try again.",
                });
            }
            return updateData;
        } catch (err) {
            return rejectWithValue({ message: err.message });
        }
    }
);

// resend otp action — generates a fresh OTP and resends via EmailJS
export const resendOTPSlice = createAsyncThunk('authSlice/resendOTPSlice',
    async (data, { rejectWithValue }) => {
        try {
            // console.log("Resending OTP for:", data.email);

            const otp = generateOTP();

            // Upsert OTP (delete old, insert new)
            await supabaseAdmin.from('otp_tokens').delete().eq('email', data.email);

            const { error: insertError } = await supabaseAdmin.from('otp_tokens').insert([{
                email: data.email,
                otp,
                user_type: data.userType || 'student',
                expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
            }]);

            if (insertError) throw insertError;

            await sendOTPEmail(data.email, data.name || '', otp);
            console.log(`[DEV ONLY] Resent OTP for ${data.email} is: ${otp}`);

            return { message: 'OTP resent successfully.' };
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
                state.isUserAuthError = action.payload?.message || action.error?.message;
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
                state.isUserAuthError = action.payload?.message || action.error?.message;
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
                state.isUserAuthError = action.payload?.message || action.error?.message;
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
                state.isUserAuthError = action.payload?.message || action.error?.message;
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
                state.isUserAuthError = action.payload?.message || action.error?.message;
            })

            // reset password reducer
            .addCase(resetPasswordSlice.pending, (state, action) => {
                state.isUserAuthLoading = true;
            })
            .addCase(resetPasswordSlice.fulfilled, (state, action) => {
                state.isUserAuthLoading = false;
                state.getUserAuthData = action.payload;
                state.isUserAuthError = null;
            })
            .addCase(resetPasswordSlice.rejected, (state, action) => {
                state.isUserAuthLoading = false;
                state.getUserAuthData = [];
                state.isUserAuthError = action.payload?.message || action.error?.message;
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
                state.isUserAuthError = action.payload?.message || action.error?.message;
            })
    }
});

export default authSlice.reducer;
