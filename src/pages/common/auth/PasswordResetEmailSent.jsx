import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

const PasswordResetEmailSent = ({ userType = 'student' }) => {
    const location = useLocation();
    const email = location.state?.email;
    const isInstructor = userType === 'instructor';
    const signinPath = isInstructor ? '/instructor/signin' : '/signin';
    const forgotPath = isInstructor ? '/instructor/forget-password' : '/forget-password';

    return (
        <div className={`flex flex-col md:flex-row h-screen w-full ${isInstructor ? 'bg-gradient-to-b from-rose-900 to-black' : 'bg-gradient-to-b from-[#7A00FF] via-[#25004D] to-black'}`}>
            <div className="hidden md:flex w-1/2 h-screen relative overflow-hidden items-center justify-center">
                <div className="relative z-10 px-10 lg:px-16 xl:px-20 text-left">
                    <h1 className="text-5xl lg:text-7xl xl:text-8xl leading-tight mb-6 select-none font-bold text-white">
                        WebBeetles
                    </h1>
                    <p className="max-w-md font-normal text-sm lg:text-base xl:text-lg leading-relaxed text-white/80">
                        Check your inbox for a secure link to create a new password.
                    </p>
                </div>
            </div>

            <div className="w-full md:w-1/2 h-screen bg-transparent flex items-center justify-center relative overflow-hidden">
                <div aria-hidden="true" className={`absolute top-0 right-0 w-72 h-72 ${isInstructor ? 'bg-rose-600/10' : 'bg-purple-600/10'} rounded-full filter blur-[100px]`} />

                <Link to={signinPath}
                    className="absolute z-20 top-5 left-5 md:top-8 md:left-8 p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-colors" >
                    <FaArrowLeft className="text-white text-lg" />
                </Link>

                <div className="relative z-10 w-full max-w-md mx-auto px-6 sm:px-10 py-10 lg:py-14 text-center">
                    <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 border border-white/10">
                        <span className="text-3xl text-white">@</span>
                    </div>

                    <h2 className="text-2xl lg:text-3xl text-white mb-4 font-light tracking-wide">
                        Check Your Email
                    </h2>

                    <p className="text-white/80 text-sm lg:text-base leading-relaxed mb-6">
                        If an account exists for {email ? <span className="font-semibold text-white">{email}</span> : 'that email'}, we sent a password reset confirmation link. Open the link in your email to set a new password.
                    </p>

                    <p className="text-white/60 text-xs lg:text-sm mb-8">
                        The link expires in 15 minutes. For security, this page does not confirm whether an email is registered.
                    </p>

                    <div className="space-y-3">
                        <Link to={signinPath} className={`block w-full rounded-xl py-3 text-base font-semibold text-white transition-all bg-gradient-to-r ${isInstructor ? 'from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500' : 'from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'}`}>
                            Back to Sign In
                        </Link>
                        <Link to={forgotPath} className="block text-sm font-medium text-white/70 hover:text-white transition-colors">
                            Use a different email
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PasswordResetEmailSent
