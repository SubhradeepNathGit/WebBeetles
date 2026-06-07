import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { emailVerifySlice, resendOTPSlice } from "../../../../redux/slice/authSlice/authSlice";
import getSweetAlert from "../../../../util/alert/sweetAlert";
import toastifyAlert from "../../../../util/alert/toastify";
import { Loader2 } from "lucide-react";

const InstructorOtp = () => {
    const { handleSubmit, control, reset, setValue } = useForm(),
        dispatch = useDispatch(),
        navigate = useNavigate(),
        location = useLocation(),
        { isUserAuthLoading } = useSelector(state => state.auth);

    const [counter, setCounter] = useState(180);
    const [disabled, setDisabled] = useState(true);

    const email = location.state?.email || sessionStorage.getItem('signup_email');

    const showMail = (email) => {
        if (!email) return "";
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

    const handleResend = (resend_email) => {
        if (!resend_email) {
            toastifyAlert.warn("Email address is missing. Please sign up again.");
            return;
        }

        const resend_obj = {
            email: resend_email
        }

        dispatch(resendOTPSlice(resend_obj))
            .then(res => {
                toastifyAlert.success(res.payload.message);

                reset({
                    otpField: {
                        0: "", 1: "", 2: "", 3: "",
                        4: "", 5: "", 6: "", 7: ""
                    }
                });

                setTimeout(() => {
                    document.getElementById("otp-input-0")?.focus();
                }, 100);

                if (!disabled) setCounter(180);
            })
            .catch(err => {
                console.error('Error occured in email verification', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    }

    const otpHandler = (data) => {
        const otpCode = Object.values(data.otpField).join("");

        if (otpCode.length !== 8) {
            getSweetAlert("Oops...", "Please enter all 8 digits!", "error");
            return;
        }

        if (!email) {
            getSweetAlert("Oops...", "Email address is missing. Please sign up again.", "error");
            return;
        }

        const verify_data = {
            email: email,
            otp: otpCode
        }

        dispatch(emailVerifySlice({ data: verify_data, userType: 'instructor' }))
            .then(res => {
                if (res.meta.requestStatus === "fulfilled") {
                    getSweetAlert('Congrates', 'OTP Verified Successfully', 'success');
                    sessionStorage.removeItem('signup_email');
                    navigate('/instructor/signin');
                }
                else {
                    getSweetAlert('Oops...', res.payload.message, 'error');
                }
            })
            .catch(err => {
                console.error('Error occured in email verification', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    }

    return (
        <div className="flex flex-col md:flex-row h-screen w-full relative bg-gradient-to-b from-rose-900 to-black">
            {/* Back Button */}
            <button onClick={() => navigate(-1)}
                className="absolute z-20 top-5 left-5 md:top-8 md:left-8 p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-colors"
            >
                <FaArrowLeft className="text-white text-lg" />
            </button>

            {/* Left Panel — Branding with Crimson/Rose Gradient */}
            <div className="hidden md:flex w-1/2 h-screen relative overflow-hidden items-center justify-center">
                <div className="relative z-10 px-10 lg:px-16 xl:px-20 text-left">
                    <h1 className="text-5xl lg:text-7xl xl:text-8xl leading-tight mb-6 select-none font-bold text-white">
                        WebBeetles
                    </h1>
                    <p className="max-w-md font-normal text-sm lg:text-base xl:text-lg leading-relaxed text-white/80">
                        Take your IT skills to new heights and give your career a fantastic boost!
                    </p>
                </div>
            </div>

            {/* Right Panel — OTP Verification Form */}
            <div className="w-full md:w-1/2 h-screen bg-transparent flex items-center justify-center relative overflow-hidden">
                {/* Subtle ambient glow */}
                <div aria-hidden="true" className="md:hidden absolute inset-0 bg-gradient-to-br from-rose-950/40 via-transparent to-black pointer-events-none" />
                <div aria-hidden="true" className="absolute top-0 right-0 w-72 h-72 bg-rose-600/10 rounded-full filter blur-[100px] pointer-events-none" />

                <div className="relative z-10 w-full max-w-md mx-auto px-6 sm:px-10 py-10 lg:py-14">
                    <h2 className="text-2xl lg:text-3xl text-white text-center mb-4 font-light tracking-wide">
                        OTP Verification
                    </h2>
                    <p className="text-white/70 text-sm text-center mb-1">
                        OTP has been sent via Email to
                    </p>
                    <p className="text-white text-base lg:text-lg text-center font-bold mb-6">
                        {showMail(email)}
                    </p>

                    <form onSubmit={handleSubmit(otpHandler)} className="space-y-6">
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
                                            {...field}
                                            id={`otp-input-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            autoComplete='off'
                                            className="md:w-12 md:h-12 w-9 h-9 text-center rounded-xl border border-white/20 text-lg font-bold text-white bg-white/5 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
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
                                <p className="text-white/60 text-sm">
                                    Resend OTP in{" "}
                                    <span className={counter < 20 ? "text-red-400" : "text-white"}>
                                        {String(Math.floor(counter / 60)).padStart(2, "0")}:
                                        {String(counter % 60).padStart(2, "0")}
                                    </span>
                                </p>

                            ) : (
                                <button type="button" disabled={isUserAuthLoading} onClick={() => handleResend(email)} className="text-rose-300 text-sm font-medium hover:text-rose-100 cursor-pointer transition-colors">
                                    Resend OTP
                                </button>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className={`w-full mt-6 py-3 rounded-xl text-base font-semibold text-white transition-all duration-300 ${isUserAuthLoading ? 'bg-rose-500/50 cursor-not-allowed opacity-70' : 'cursor-pointer bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-lg hover:shadow-rose-500/25'}`}
                        >
                            {isUserAuthLoading ? <Loader2 className='text-white animate-spin m-0 p-0 w-4 h-4 inline mr-2' /> : ''} {isUserAuthLoading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InstructorOtp;