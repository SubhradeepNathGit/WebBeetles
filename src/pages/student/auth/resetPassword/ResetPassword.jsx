import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft } from 'react-icons/fa'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toastifyAlert from '../../../../util/alert/toastify'
import getSweetAlert from '../../../../util/alert/sweetAlert'
import supabase from '../../../../util/supabase/supabase'
import { resetPasswordSlice } from '../../../../redux/slice/authSlice/authSlice'

const ResetPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isUserAuthLoading } = useSelector(state => state.auth);
    const [passShow, setPassShow] = useState(false);
    const [conPassShow, setConPassShow] = useState(false);
    const [searchParams] = useSearchParams();

    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');
    const hasValidLinkShape = Boolean(urlToken && urlEmail);

    const resetPasswordHandler = (data) => {
        if (!hasValidLinkShape) {
            getSweetAlert('Oops...', 'This reset link is invalid. Please request a new one.', 'info');
            return;
        }

        if (data.pwd !== data.cpwd) {
            toastifyAlert.warn("Password and confirm password are not same");
            return;
        }

        dispatch(resetPasswordSlice({
            email: urlEmail,
            otp: urlToken,
            newPassword: data.pwd,
            userType: 'student'
        })).then(async (res) => {
            if (res.meta.requestStatus === "fulfilled") {
                await supabase.auth.signOut();
                getSweetAlert('Success', 'Password reset successfully', 'success');
                navigate('/signin');
            } else {
                getSweetAlert('Oops...', res.payload?.message || 'Password reset failed.', 'info');
            }
        }).catch(err => {
            console.error('Error occurred in password reset', err);
            getSweetAlert('Oops...', 'Something went wrong!', 'error');
        })
    }

    return (
        <div className="flex flex-col md:flex-row h-screen w-full bg-gradient-to-b from-[#7A00FF] via-[#25004D] to-black">
            <div className="hidden md:flex w-1/2 h-screen relative overflow-hidden items-center justify-center">
                <div className="relative z-10 px-10 lg:px-16 xl:px-20 text-left">
                    <h1 className="text-5xl lg:text-7xl xl:text-8xl leading-tight mb-6 select-none font-bold text-white">
                        WebBeetles
                    </h1>
                    <p className="max-w-md font-normal text-sm lg:text-base xl:text-lg leading-relaxed text-white/80">
                        Create a strong new password to keep your account protected.
                    </p>
                </div>
            </div>

            <div className="w-full md:w-1/2 h-screen bg-transparent overflow-y-auto custom-scrollbar relative">
                <div aria-hidden="true" className="md:hidden absolute inset-0 bg-gradient-to-br from-purple-950/40 via-transparent to-black pointer-events-none" />
                <div aria-hidden="true" className="absolute top-0 right-0 w-72 h-72 bg-purple-600/10 rounded-full filter blur-[100px] pointer-events-none" />

                <Link to='/forget-password'
                    className="absolute z-20 top-5 left-5 md:top-8 md:left-8 p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-colors" >
                    <FaArrowLeft className="text-white text-lg" />
                </Link>

                <div className="relative z-10 w-full max-w-md mx-auto px-6 sm:px-10 py-10 lg:py-14 flex flex-col items-center justify-center min-h-full">
                    <div className="w-full">
                        <h2 className="text-2xl lg:text-3xl text-white text-center mb-4 font-light tracking-wide">
                            New Password
                        </h2>

                        {!hasValidLinkShape && (
                            <div className="mb-6 rounded-xl border border-yellow-400/20 bg-yellow-400/10 p-4 text-sm text-yellow-100">
                                This reset link is missing required details. Please request a fresh password reset email.
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit(resetPasswordHandler)}>
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
                                <div className="relative">
                                    <input type={conPassShow ? "text" : "password"} autoComplete='new-password' placeholder="Confirm password" {...register('cpwd', {
                                        required: 'Confirm password is required*'
                                    })} className="w-full rounded-xl px-5 pr-12 py-3 text-sm text-white placeholder-gray-500 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
                                    <button type="button" className="absolute inset-y-0 right-4 flex items-center text-lg text-gray-400 hover:text-purple-400 transition-colors" onClick={() => setConPassShow(!conPassShow)}>
                                        {conPassShow ? <FaRegEyeSlash /> : <FaRegEye />}
                                    </button>
                                </div>
                                <p className="text-xs text-red-400 mt-1">{errors.cpwd?.message}</p>
                            </div>

                            <button
                                type="submit" disabled={isUserAuthLoading || !hasValidLinkShape}
                                className={`w-full py-3 rounded-xl text-base lg:text-lg font-semibold text-white transition-all duration-300 mt-4
                                ${isUserAuthLoading || !hasValidLinkShape ? "bg-purple-500/50 cursor-not-allowed opacity-70" : "cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg hover:shadow-purple-500/25"}`}>
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
