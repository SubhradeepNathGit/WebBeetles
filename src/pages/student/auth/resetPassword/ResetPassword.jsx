import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FaArrowLeft } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import toastifyAlert from '../../../../util/alert/toastify'
import getSweetAlert from '../../../../util/alert/sweetAlert'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import hotToast from '../../../../util/alert/hot-toast'
import supabase from '../../../../util/supabase/supabase'
import { forgetPasswordSlice, resendOTPSlice, resetPasswordSlice } from '../../../../redux/slice/authSlice/authSlice'
import { Loader2 } from 'lucide-react'

const ResetPassword = () => {

    const form = useForm(),
        { register, handleSubmit, formState, control, reset } = form,
        { errors } = formState,
        dispatch = useDispatch(),
        navigator = useNavigate(),
        [passShow, setPassShow] = useState(false),
        [conPassShow, setConPassShow] = useState(false),
        location = useLocation(),
        { isUserAuthLoading } = useSelector(state => state.auth);

    const [counter, setCounter] = useState(180);
    const [disabled, setDisabled] = useState(true);

    const [searchParams] = useSearchParams();
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');

    const email = urlEmail || location.state?.email;

    const showMail = (email) => {
        const first = email[0];
        const midStart = Math.floor(email.length / 2) - 1;
        const middle = email.slice(midStart, midStart + 3);
        const last = email[email.length - 1];
        return `${first}*****${middle}****${last}`;
    };

    useEffect(() => {
        let timer;
        if (counter > 0) {
            setDisabled(true);
            timer = setTimeout(() => setCounter(counter - 1), 1000);
        } else {
            setDisabled(false);
        }
        return () => clearTimeout(timer);
    }, [counter]);


    const handleResend = () => {
        const resend_obj = { email };

        dispatch(resendOTPSlice({ ...resend_obj, userType: 'student' }))
            .then(res => {
                // console.log('Reponse for resend otp',res);

                if (res.meta.requestStatus === "fulfilled") {

                    hotToast("OTP re-sent successfully!");

                    reset({
                        otpField: {
                            0: "", 1: "", 2: "", 3: "",
                            4: "", 5: "", 6: "", 7: ""
                        }
                    });

                    setTimeout(() => {
                        document.getElementById("otp-input-0")?.focus();
                    }, 100);

                    // Reset timer
                    setCounter(180);
                    setDisabled(false);
                }
                else {
                    getSweetAlert('Oops...', res.payload?.message || "Failed to send OTP", 'info');
                }
            })
            .catch(err => {
                console.error('Error occured in resending OTP', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    };

    const forgetPasswordDataHandler = (data) => {
        // console.log('Forget password form data', data);

        const otpCode = urlToken || Object.values(data.otpField || {}).join("");
        // console.log("Entered OTP:", otpCode);

        if (!urlToken && otpCode.length !== 8) {
            getSweetAlert("Oops...", "Please enter all 8 digits!", "error");
            return;
        }

        else if (data.pwd !== data.cpwd) {
            toastifyAlert.warn("Password and confirm password are not same");
        }

        else {
            const reset_pass_obj = {
                email: email,
                otp: otpCode,
                newPassword: data.pwd,
                userType: 'student'
            }

            const newPassword_obj = {
                newPassword: data.pwd
            }

            dispatch(resetPasswordSlice(reset_pass_obj))
                .then(async (res) => {
                    // console.log('Response in form after reset password', res);

                    if (res.meta.requestStatus === "fulfilled") {
                        await supabase.auth.signOut();

                        getSweetAlert('Congrates', 'Password reset successfully', 'success');
                        navigator('/signin');
                    }
                    else {
                        getSweetAlert('Oops...', res.payload.message, 'info');
                    }
                }).catch(err => {
                    console.error('Error occured in user registration', err);
                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                })
        }
    }

    return (
        <div className="flex flex-col md:flex-row h-screen w-full bg-gradient-to-b from-[#7A00FF] via-[#25004D] to-black">
            {/* Left Panel — Branding with Purple Gradient */}
            <div className="hidden md:flex w-1/2 h-screen relative overflow-hidden items-center justify-center">
                <div className="relative z-10 px-10 lg:px-16 xl:px-20 text-left">
                    <h1 className="text-5xl lg:text-7xl xl:text-8xl leading-tight mb-6 select-none font-bold text-white">
                        WebBeetles
                    </h1>
                    <p className="max-w-md font-normal text-sm lg:text-base xl:text-lg leading-relaxed text-white/80">
                        Crafted to provide you with the exact skills and expertise that employers are looking for in high-demand IT positions.
                    </p>
                </div>
            </div>

            {/* Right Panel — Reset Password Form (scrollable for longer content) */}
            <div className="w-full md:w-1/2 h-screen bg-transparent overflow-y-auto custom-scrollbar relative">
                {/* Subtle ambient glow */}
                <div aria-hidden="true" className="md:hidden absolute inset-0 bg-gradient-to-br from-purple-950/40 via-transparent to-black pointer-events-none" />
                <div aria-hidden="true" className="absolute top-0 right-0 w-72 h-72 bg-purple-600/10 rounded-full filter blur-[100px] pointer-events-none" />

                {/* Back button */}
                <Link to='/forget-password'
                    className="absolute z-20 top-5 left-5 md:top-8 md:left-8 p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-colors" >
                    <FaArrowLeft className="text-white text-lg" />
                </Link>

                <div className="relative z-10 w-full max-w-md mx-auto px-6 sm:px-10 py-10 lg:py-14 flex flex-col items-center justify-center min-h-full">
                    <div className="w-full">
                        <h2 className="text-2xl lg:text-3xl text-white text-center mb-6 font-light tracking-wide">
                            New Password
                        </h2>
                        <form className="space-y-4" onSubmit={handleSubmit(forgetPasswordDataHandler)}>
                            {!urlToken && (
                                <>
                                    <p className="text-white/80 text-sm lg:text-base text-center">
                                        OTP has been sent via Email to
                                    </p>
                                    <p className="text-white text-base lg:text-lg text-center font-bold mb-6">
                                        {showMail(email)}
                                    </p>

                                    <div className="flex justify-center gap-2">
                                        {[...Array(8)].map((_, index) => (
                                            <Controller
                                                key={index}
                                                name={`otpField.${index}`}
                                                control={control}
                                                defaultValue=""
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <input
                                                        {...field} id={`otp-input-${index}`} type="text" inputMode="numeric"
                                                        maxLength={1} autoComplete=''
                                                        className="md:w-12 md:h-12 w-9 h-9 text-center rounded-xl border border-white/20 text-lg font-bold text-white bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/[^0-9]/g, "");
                                                            if (value.length > 1) return;
                                                            field.onChange(value);

                                                            if (value && index < 7) {
                                                                document
                                                                    .getElementById(`otp-input-${index + 1}`)
                                                                    .focus();
                                                            }
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Backspace" && !field.value && index > 0) {
                                                                document
                                                                    .getElementById(`otp-input-${index - 1}`)
                                                                    .focus();
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                        ))}
                                    </div>

                                    {/* Resend */}
                                    <div className="flex flex-col items-center mt-4">
                                        {disabled ? (
                                            <p className="text-white text-sm">
                                                Resend OTP in{" "}
                                                <span className={counter < 20 ? "text-red-400" : ""}>
                                                    {String(Math.floor(counter / 60)).padStart(2, "0")}:
                                                    {String(counter % 60).padStart(2, "0")}
                                                </span>
                                            </p>

                                        ) : (
                                            <button type="button" onClick={() => handleResend(email)} className="text-white text-sm font-medium hover:text-blue-300 cursor-pointer">
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                            <div className="flex flex-col mt-2">
                                <label className="block text-sm lg:text-base text-purple-100/80 mb-2 font-medium">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input type={passShow ? "text" : "password"} autoComplete='new-password' placeholder="Enter password" {...register('pwd', {
                                        required: 'Password is required*',
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                                            message: 'Password must be 8+ chars with uppercase, lowercase, number, and special char'
                                        }
                                    })} className="w-full rounded-xl px-5 pr-12 py-3 text-sm text-white placeholder-gray-500 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
                                    <button type="button" className="absolute inset-y-0 right-4 flex items-center text-lg text-gray-400 hover:text-purple-400 transition-colors" onClick={() => setPassShow(!passShow)}>
                                        {passShow ? <FaRegEyeSlash /> : <FaRegEye />}
                                    </button>
                                </div>
                                <p className="text-xs text-red-400 mt-1">{errors.pwd?.message}</p>
                            </div>
                            <div className="flex flex-col mt-2">
                                <label className="block text-sm lg:text-base text-purple-100/80 mb-2 font-medium">
                                    Confirm Password
                                </label>
                                <input type="password" autoComplete='new-password' placeholder="Enter password" {...register('cpwd')} className="w-full rounded-xl px-5 py-3 text-sm text-white placeholder-gray-500 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
                            </div>

                            <button
                                type="submit" disabled={isUserAuthLoading}
                                className={`w-full py-3 rounded-xl text-base lg:text-lg font-semibold text-white transition-all duration-300 mt-4
                                ${isUserAuthLoading ? "bg-purple-500/50 cursor-not-allowed opacity-70" : "cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg hover:shadow-purple-500/25"}`}>
                                {isUserAuthLoading ? <Loader2 className='text-white animate-spin m-0 p-0 w-4 h-4 inline' /> : ''} {isUserAuthLoading ? "Processing..." : "Reset Password"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword