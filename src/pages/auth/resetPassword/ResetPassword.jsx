import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FaArrowLeft } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { userResetPassword } from '../../../redux/slice/authSlice/authSlice'
import toastifyAlert from '../../../util/toastify'
import getSweetAlert from '../../../util/sweetAlert'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'

const ResetPassword = () => {

    const form = useForm(),
        { register, handleSubmit, formState, control } = form,
        { errors } = formState,
        dispatch = useDispatch(),
        navigator = useNavigate(),
        [passShow, setPassShow] = useState(false),
        [conPassShow, setConPassShow] = useState(false),
        location = useLocation(),
        { isAuthLoading } = useSelector(state => state.userAuth);

    const [counter, setCounter] = useState(180);
    const [disabled, setDisabled] = useState(true);

    const email = location.state?.email;

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
        const resend_obj = {
            email: resend_email
        }

        dispatch(userResendOTP(resend_obj))
            .then(res => {
                // console.log('Response from form', res);

                toastifyAlert.success(res.payload.message);
                if (!disabled) setCounter(180);
            })
            .catch(err => {
                console.error('Error occured in email verification', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    }

    const forgetPasswordDataHandler = (data) => {
        console.log('Forget password form data', data);

        const otpCode = Object.values(data.otpField).join("");
        // console.log("Entered OTP:", otpCode);

        if (otpCode.length !== 6) {
            getSweetAlert("Oops...", "Please enter all 6 digits!", "error");
            return;
        }

        else if (data.pwd !== data.cpwd) {
            toastifyAlert.warn("Password and confirm password are not same");
        }

        else {
            const reset_pass_obj = {
                email: email,
                otp: otpCode,
                newPassword: data.pwd
            }

            dispatch(userResetPassword(reset_pass_obj))
                .then(res => {
                    console.log('Response in form after reset password', res);
                    if (res.meta.requestStatus === "fulfilled") {
                        getSweetAlert('Congrates', res.payload.message, 'success');
                        navigator('/signin');
                    }
                    else {
                        getSweetAlert('Oops...', res.payload.message, 'info');
                    }
                })
                .catch(err => {
                    console.error('Error occured in user registration', err);
                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                })
        }
    }

    return (
        <div className="relative h-screen overflow-hidden">
            {/* Background layer that replaces .background::after */}
            <Link to='/forget-password'
                className="absolute lg:top-15 lg:left-15 md:top-8 md:left-8 top-5 left-5 back-btn p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" >
                <FaArrowLeft className="text-gray-700 text-lg" />
            </Link>

            <div aria-hidden="true" className="absolute inset-0 -z-10"
                style={{
                    backgroundImage:
                        `linear-gradient(rgba(44,6,159,0.8), #25004D), url('/auth/resetPassword/new-password-img.png')`,
                    backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'top', transform: 'scaleX(-1)'
                }} />
            <div className="container mx-auto px-4 lg:px-6 h-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="hidden md:flex w-full md:w-1/2 flex-col justify-center items-center md:items-start text-white text-center md:text-left">
                    <h1 className="font-display text-4xl lg:text-7xl xl:text-8xl leading-tight mb-4 select-none font-bold">
                        WebBeetles
                    </h1>
                    <p className="max-w-[600px] font-normal text-sm lg:text-base xl:text-lg leading-relaxed">
                        Crafted to provide you with the exact skills and expertise that employers are looking for in high-demand IT positions.
                    </p>
                </div>

                <div className="w-full md:w-1/2 flex flex-col justify-center md:justify-end h-full items-center">
                    <div className="w-full max-w-[500px] lg:max-w-[500px] bg-white/10 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-2xl my-auto">
                        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-white text-center mb-6">
                            New Password
                        </h2>
                        <p className="text-white text-sm lg:text-base text-center">
                            OTP has been sent via Email to
                        </p>
                        <p className="text-white text-base lg:text-lg text-center font-bold mb-4">
                            {showMail(email)}
                        </p>

                        <form className="space-y-2" onSubmit={handleSubmit(forgetPasswordDataHandler)}>

                            <div className="flex justify-center gap-2">
                                {[...Array(6)].map((_, index) => (
                                    <Controller
                                        key={index}
                                        name={`otpField.${index}`}
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                id={`otp-input-${index}`}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                className="md:w-12 md:h-12 w-9 h-9 text-center rounded-xl border border-gray-300 text-lg font-bold text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/[^0-9]/g, "");
                                                    if (value.length > 1) return;
                                                    field.onChange(value);

                                                    if (value && index < 5) {
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
                                    <button type="button" onClick={() => handleResend(email)} className="text-white text-sm font-medium hover:text-blue-300">
                                        Resend OTP
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label className="block text-sm lg:text-base text-white mb-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input type={passShow ? "text" : "password"} placeholder="Enter password" {...register('pwd', {
                                        required: 'Required*',
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                                            message: 'Password must be 8+ chars with uppercase, lowercase, number, and special char'
                                        }
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
                                    <input type={conPassShow ? "text" : "password"} placeholder="Enter password" {...register('cpwd')} className="w-full rounded-full px-6 py-2 lg:py-3 text-sm text-gray-800 bg-white outline-0 mb-0" />
                                    <button type="button" className="absolute inset-y-0 right-4 flex items-center text-lg text-gray-600 hover:text-[rgba(44,6,159,0.8)]" onClick={() => setConPassShow(!conPassShow)}>
                                        {conPassShow ? <FaRegEyeSlash className='text-[#8200db]' /> : <FaRegEye className='text-[#8200db]' />}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" as={Link} to='/'
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full text-base font-semibold mt-0">
                                {isAuthLoading ? 'Processing...' : 'Reset Password'}
                            </button>
                        </form>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default ResetPassword