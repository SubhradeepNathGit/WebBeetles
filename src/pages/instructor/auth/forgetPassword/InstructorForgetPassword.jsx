import React from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { forgetPasswordSlice } from '../../../../redux/slice/authSlice/authSlice'
import getSweetAlert from '../../../../util/alert/sweetAlert'
import hotToast from '../../../../util/alert/hot-toast'
import { Loader2 } from 'lucide-react'

const InstructorForgetPassword = () => {

    const form = useForm(),
        { register, handleSubmit, formState } = form,
        { errors } = formState,
        dispatch = useDispatch(),
        navigate = useNavigate(),
        { isUserAuthLoading } = useSelector(state => state.auth);

    const forgetPasswordDataHandler = (data) => {
        // console.log('Forget password form data', data);

        const login_obj = {
            email: data.email
        }

        dispatch(forgetPasswordSlice({ data: login_obj, userType: 'instructor' }))
            .then(res => {
                // console.log('Response in form after forget password', res);

                if (res.meta.requestStatus === "fulfilled") {
                    hotToast('Password reset link sent. Please check your email.');
                    navigate('/instructor/password-reset-email-sent', {
                        state: { email: data.email }
                    });
                }
                else {
                    getSweetAlert('Oops...', res.payload.message, 'info');
                }
            })
            .catch(err => {
                console.error('Error occured in user forget password', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    }

    return (
        <div className="flex flex-col md:flex-row h-screen w-full relative bg-gradient-to-b from-rose-900 to-black">
            {/* Back Button */}
            <Link to='/instructor/signin'
                className="absolute z-20 top-5 left-5 md:top-8 md:left-8 p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-colors" >
                <FaArrowLeft className="text-white text-lg" />
            </Link>

            {/* Left Panel — Branding with Crimson/Rose Gradient */}
            <div className="hidden md:flex w-1/2 h-screen relative overflow-hidden items-center justify-center">
                <div className="relative z-10 px-10 lg:px-16 xl:px-20 text-left">
                    <h1 className="text-5xl lg:text-7xl xl:text-8xl leading-tight mb-6 select-none font-bold text-white">
                        WebBeetles
                    </h1>
                    <p className="max-w-md font-normal text-sm lg:text-base xl:text-lg leading-relaxed text-white/80">
                        Taking the first step towards building a great career is such an exciting journey!
                    </p>
                </div>
            </div>

            {/* Right Panel — Forget Password Form */}
            <div className="w-full md:w-1/2 h-screen bg-transparent flex items-center justify-center relative overflow-hidden">
                {/* Subtle ambient glow */}
                <div aria-hidden="true" className="md:hidden absolute inset-0 bg-gradient-to-br from-rose-950/40 via-transparent to-black pointer-events-none" />
                <div aria-hidden="true" className="absolute top-0 right-0 w-72 h-72 bg-rose-600/10 rounded-full filter blur-[100px] pointer-events-none" />

                <div className="relative z-10 w-full max-w-md mx-auto px-6 sm:px-10 py-10 lg:py-14">
                    <h2 className="text-2xl lg:text-3xl text-white text-center mb-6 font-light tracking-wide">
                        Forgot Password
                    </h2>

                    <p className="text-white/60 text-[14px] lg:text-[16px] text-center mb-8">
                        Please enter your email address and we will send you a confirmation link to set a new password.
                    </p>

                    <form className="space-y-4" onSubmit={handleSubmit(forgetPasswordDataHandler)}>
                        <div className="flex flex-col">
                            <label htmlFor="emailId" className="block text-sm lg:text-base text-rose-100/80 mb-2 font-medium">
                                Email Address
                            </label>
                            <input type="email" id="emailId" autoComplete='email' placeholder="Enter email address" {...register('email', {
                                required: 'Required*',
                                pattern: {
                                    value: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-zA-Z.]{2,}$/,
                                    message: 'Invalid email'
                                }
                            })} className="w-full rounded-xl px-5 py-3 text-sm lg:text-base text-white placeholder-gray-500 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all mb-0" />
                            <p className="text-xs text-red-400 mt-1">{errors.email?.message}</p>
                        </div>

                        <button type="submit" disabled={isUserAuthLoading} className={`w-full mt-6 py-3 rounded-xl text-base lg:text-lg font-semibold text-white transition-all duration-300
                            ${isUserAuthLoading ? "bg-rose-500/50 cursor-not-allowed opacity-70" : "cursor-pointer bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-lg hover:shadow-rose-500/25"}`}>
                            {isUserAuthLoading ? <Loader2 className='text-white animate-spin m-0 p-0 w-4 h-4 inline mr-2' /> : ''} {isUserAuthLoading ? "Processing..." : "Send Reset Link"}
                        </button>
                    </form>

                    <div className="text-center text-rose-200/60 mt-8 text-sm">
                        Don&apos;t have an account?{" "}
                        <Link to="/instructor/signup" className="text-rose-300 hover:text-rose-100 font-semibold transition-colors">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InstructorForgetPassword
