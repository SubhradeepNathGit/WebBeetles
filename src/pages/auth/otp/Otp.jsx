import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { userLogin } from '../../../redux/slice/authSlice/authSlice'
import toastifyAlert from '../../../util/toastify'
import getSweetAlert from '../../../util/sweetAlert'

const Otp = () => {

    const form = useForm(),
        { register, handleSubmit, formState } = form,
        { errors } = formState,
        dispatch = useDispatch(),
        navigator = useNavigate(),
        [show, setShow] = useState(false),
        [otp, setOtp] = useState(new Array(6).fill('')),
        [counter, setCounter] = useState(30),
        [disabled, setDisabled] = useState(true);

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
        if (!disabled) {
            // console.log("Resend OTP clicked");
            setCounter(30);
        }
    }

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            document.getElementById(`otp-input-${index + 1}`).focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-input-${index - 1}`).focus();
        }
    }

    const otpHandler = (data) => {
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
            <Link to='/forget-password'
                className="absolute lg:top-15 lg:left-15 md:top-8 md:left-8 top-5 left-5 back-btn p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" >
                <FaArrowLeft className="text-gray-700 text-lg" />
            </Link>

            <div aria-hidden="true" className="absolute inset-0 -z-10"
                style={{
                    backgroundImage:
                        `linear-gradient(rgba(44,6,159,0.8), #25004D), url('/auth/otp/abbdbe1bb567f571cfb7e27f54c7a0ded17fc6d0.png')`,
                    backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'top'
                }} />
            <div className="container mx-auto px-4 lg:px-6 h-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="hidden md:flex w-full md:w-1/2 flex-col justify-center items-center md:items-start text-white text-center md:text-left">
                    <h1 className="font-display text-4xl lg:text-7xl xl:text-8xl leading-tight mb-4 select-none font-bold">
                        WebBeetles
                    </h1>
                    {/* <p className="max-w-[600px] font-normal text-sm lg:text-base xl:text-lg leading-relaxed">
                        By continuing, you agree to WebBeetles's Terms and Conditions and acknowledge you've read our privacy policy. WebBeetles's Terms and Conditions and acknowledge you've read our privacy policy. By continuing, you agree to WebBeetles's Terms and Conditions and acknowledge you've read our privacy policy.
                    </p> */}
                </div>

                <div className="w-full md:w-1/2 flex flex-col justify-center md:justify-end h-full items-center">
                    <div className="w-full max-w-[500px] lg:max-w-[500px] bg-white/10 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-2xl my-auto">
                        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-white text-center mb-6">
                            OTP Verification
                        </h2>

                        <form className="space-y-2" onSubmit={handleSubmit(otpHandler)}>
                            <p className="text-white text-[14px] lg:text-[18px] xl:text-[20px] text-center mb-2">
                                OTP has been sent via Email to
                            </p>

                            <p className="text-white text-[14px] lg:text-[18px] xl:text-[20px] text-center mb-6 font-bold">
                                abc@gmail.com
                            </p>
                            <div className="flex justify-center gap-2">
                                {otp.map((data, index) => (
                                    <input key={index} id={`otp-input-${index}`} type="text" inputMode="numeric" maxLength={1}
                                        value={data} onChange={(e) => handleChange(e, index)} onKeyDown={(e) => handleKeyDown(e, index)}
                                        className="md:w-12 md:h-12 w-9 h-9 text-center rounded-xl border border-gray-300 text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                ))}
                            </div>
                            <div className="flex flex-col items-center mt-4">
                                {disabled ? (
                                    <p className="text-white text-sm">Resend OTP in <span className={counter < 10 ? 'text-red-400' : null}> 00:{counter < 10 ? `0` + counter : counter}</span></p>
                                ) : (
                                    <button onClick={handleResend} type='button'
                                        className="text-white text-sm font-medium hover:text-blue-300 disabled:opacity-50"
                                        disabled={disabled}>
                                        Resend OTP
                                    </button>
                                )}
                            </div>
                            <button type="submit" as={Link} to='/'
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full text-base font-semibold mt-0">
                                Verify OTP
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Otp