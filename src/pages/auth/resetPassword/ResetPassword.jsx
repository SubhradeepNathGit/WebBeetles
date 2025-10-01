import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { userLogin } from '../../../redux/slice/authSlice/authSlice'
import toastifyAlert from '../../../util/toastify'
import getSweetAlert from '../../../util/sweetAlert'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'

const ResetPassword = () => {

    const form = useForm(),
        { register, handleSubmit, formState } = form,
        { errors } = formState,
        dispatch = useDispatch(),
        navigator = useNavigate(),
        [passShow, setPassShow] = useState(false),
        [conPassShow, setConPassShow] = useState(false);

    const forgetPasswordDataHandler = (data) => {
        console.log('Forget password form data', data);

        const login_obj = {
            email: data.email
        }

        navigator('/');


        // dispatch(userLogin(login_obj))
        //     .then(res => {
        //         console.log('Response in form after user login', res);
        //         if (res.payload) {
        //             toastifyAlert.success("Login successful");
        //             sessionStorage.setItem('user_token', res.payload.token);
        //             // navigator('');
        //         }
        //         else {
        //             getSweetAlert('Oops...', 'Something went wrong!', 'error');
        //         }
        //     })
        //     .catch(err => {
        //         console.error('Error occured in user login', err);
        //         getSweetAlert('Oops...', 'Something went wrong!', 'error');
        //     })
    }

    return (
        <div className="relative h-screen overflow-hidden">
            {/* Background layer that replaces .background::after */}
            <Link to='/'
                className="absolute lg:top-15 lg:left-15 md:top-8 md:left-8 top-5 left-5 back-btn p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" >
                <FaArrowLeft className="text-gray-700 text-lg" />
            </Link>

            <div aria-hidden="true" className="absolute inset-0 -z-10"
                style={{
                    backgroundImage:
                        `linear-gradient(rgba(44,6,159,0.8), #25004D), url('/auth/resetPassword/new-password-img.png')`,
                    backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'top', transform: 'scaleX(1)'
                }} />
            <div className="container mx-auto px-4 lg:px-6 h-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="w-full md:w-1/2 flex flex-col justify-center md:justify-end h-full items-center">
                    <div className="w-full max-w-[500px] lg:max-w-[500px] bg-white/10 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-2xl my-auto">
                        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-white text-center mb-6">
                            New Password
                        </h2>
                        <p className="text-white text-[14px] lg:text-[18px] xl:text-[20px] text-center mb-5">
                            please enter your new password
                        </p>

                        <form className="space-y-2" onSubmit={handleSubmit(forgetPasswordDataHandler)}>
                            <div className="flex flex-col">
                                <label className="block text-sm lg:text-base text-white mb-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input type={passShow ? "text" : "password"} placeholder="Enter password" {...register('pwd', {
                                        // required: 'Required*',
                                        // pattern: {
                                        // value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                                        // message: 'Password must be 8+ chars with uppercase, lowercase, number, and special char'
                                        // }
                                    })} className="w-full rounded-full px-6 py-2 lg:py-3 text-sm text-gray-800 bg-white outline-0 mb-0" />
                                    <button type="button" className="absolute inset-y-0 right-4 flex items-center text-lg text-gray-600 hover:text-[rgba(44,6,159,0.8)]" onClick={() => setPassShow(!passShow)}>
                                        {passShow ? <FaRegEyeSlash className='text-[#8200db]' /> : <FaRegEye className='text-[#8200db]' />}
                                    </button>
                                </div>
                                <p className="text-xs text-red-400 mb-2 mt-1">{errors.pwd?.message}</p>
                            </div>
                            <div className="flex flex-col mb-5">
                                <label className="block text-sm lg:text-base text-white mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input type={conPassShow ? "text" : "password"} placeholder="Enter password" className="w-full rounded-full px-6 py-2 lg:py-3 text-sm text-gray-800 bg-white outline-0 mb-0" />
                                    <button type="button" className="absolute inset-y-0 right-4 flex items-center text-lg text-gray-600 hover:text-[rgba(44,6,159,0.8)]" onClick={() => setConPassShow(!conPassShow)}>
                                        {conPassShow ? <FaRegEyeSlash className='text-[#8200db]' /> : <FaRegEye className='text-[#8200db]' />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" as={Link} to='/'
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full text-base font-semibold mt-0">
                                Reset Password
                            </button>
                        </form>
                    </div>
                </div>

                <div className="hidden md:flex w-full md:w-1/2 flex-col justify-center items-center md:items-start text-white text-center md:text-left">
                    <h1 className="font-display text-4xl lg:text-7xl xl:text-8xl leading-tight mb-4 select-none font-bold">
                        WebBeetles
                    </h1>
                    {/* <p className="max-w-[600px] font-normal text-sm lg:text-base xl:text-lg leading-relaxed">
                        By continuing, you agree to WebBeetles's Terms and Conditions and acknowledge you've read our privacy policy. WebBeetles's Terms and Conditions and acknowledge you've read our privacy policy. By continuing, you agree to WebBeetles's Terms and Conditions and acknowledge you've read our privacy policy.
                    </p> */}
                </div>

            </div>
        </div>
    )
}

export default ResetPassword