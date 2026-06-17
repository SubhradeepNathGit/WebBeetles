import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { emailVerifySlice, resendOTPSlice } from "../../../../redux/slice/authSlice/authSlice";
import getSweetAlert from "../../../../util/alert/sweetAlert";
import toastifyAlert from "../../../../util/alert/toastify";
import { Loader2 } from "lucide-react";

const Otp = () => {
    const { handleSubmit, control, reset, setValue } = useForm(),
        dispatch = useDispatch(),
        navigator = useNavigate(),
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
                // console.log('Response from form', res);

                toastifyAlert.success(res.payload.message);

                reset({
                    otpField: {
                        0: "", 1: "", 2: "",
                        3: "", 4: "", 5: ""
                    }
                });

                setTimeout(() => {
                    document.getElementById("otp-input-0")?.focus();
                }, 100);

                // Reset timer
                setCounter(180);
                setDisabled(false);
            })
            .catch(err => {
                console.error('Error occured in resending OTP', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    }

    const otpHandler = (data) => {
        // console.log('data in otp registration form', data);

        const otpCode = Object.values(data.otpField).join("");
        // console.log("Entered OTP:", otpCode);

        if (otpCode.length !== 6) {
            getSweetAlert("Oops...", "Please enter all 6 digits!", "error");
            return;
        }

        const verify_obj = {
            email: email,
            otp: otpCode
        }

        dispatch(emailVerifySlice({ data: verify_obj, userType: 'student' }))
            .then(res => {
                // console.log('Response in form after otp verification', res);

                if (res.meta.requestStatus === "fulfilled") {
                    getSweetAlert('Congratulations', 'Email verified successfully', 'success');
                    sessionStorage.removeItem('signup_email');
                    navigator('/signin');
                }
                else {
                    getSweetAlert('Oops...', res.payload.message, 'info');
                }
            })
            .catch(err => {
                console.error('Error occured in user registration', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
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

            {/* Right Panel — OTP Form */}
            <div className="w-full md:w-1/2 h-screen bg-transparent flex items-center justify-center relative overflow-hidden">
                {/* Subtle ambient glow */}
                <div aria-hidden="true" className="md:hidden absolute inset-0 bg-gradient-to-br from-purple-950/40 via-transparent to-black" />
                <div aria-hidden="true" className="absolute top-0 right-0 w-72 h-72 bg-purple-600/10 rounded-full filter blur-[100px]" />

                {/* Back button */}
                <button onClick={() => navigator(-1)}
                    className="absolute z-20 top-5 left-5 md:top-8 md:left-8 p-3 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 transition-colors"
                >
                    <FaArrowLeft className="text-white text-lg" />
                </button>

                <div className="relative z-10 w-full max-w-md mx-auto px-6 sm:px-10 py-10 lg:py-14">
                    <h2 className="text-2xl lg:text-3xl text-white text-center mb-6 font-light tracking-wide">
                        OTP Verification
                    </h2>

                    <form onSubmit={handleSubmit(otpHandler)} className="space-y-4">
                        <p className="text-white/80 text-sm lg:text-base text-center">
                            OTP has been sent via Email to
                        </p>
                        <p className="text-white text-base lg:text-lg text-center font-bold mb-4">
                            {showMail(email)}
                        </p>

                        <div className="w-fit mx-auto flex flex-col items-center">
                            <div className="flex justify-center gap-3">
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
                                                className="w-11 h-12 sm:w-13 sm:h-14 md:w-14 md:h-16 text-center rounded-xl border border-white/20 text-xl font-bold text-white bg-white/5 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white/10 transition-all duration-200 shadow-inner"
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
                                                onPaste={(e) => {
                                                    e.preventDefault();
                                                    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
                                                    if (pastedData) {
                                                        const otpArray = pastedData.split("");
                                                        otpArray.forEach((char, idx) => {
                                                            setValue(`otpField.${idx}`, char);
                                                        });
                                                        const focusIndex = Math.min(otpArray.length - 1, 5);
                                                        document.getElementById(`otp-input-${focusIndex}`)?.focus();
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                ))}
                            </div>

                            {/* Resend */}
                            <div className="flex flex-col items-center mt-5">
                                {disabled ? (
                                    <p className="text-white/70 text-sm tracking-wide">
                                        Resend OTP in{" "}
                                        <span className={counter < 20 ? "text-red-400 font-semibold" : "text-white font-semibold"}>
                                            {String(Math.floor(counter / 60)).padStart(2, "0")}:
                                            {String(counter % 60).padStart(2, "0")}
                                        </span>
                                    </p>
                                ) : (
                                    <button type="button" disabled={isUserAuthLoading} onClick={() => handleResend(email)} className="text-purple-300 text-sm font-medium hover:text-white cursor-pointer transition-colors duration-200">
                                        Resend OTP
                                    </button>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isUserAuthLoading}
                                className={`w-full mt-6 py-3.5 rounded-xl text-base font-semibold text-white tracking-wide transition-all duration-300 ${isUserAuthLoading ? 'bg-purple-500/40 cursor-not-allowed opacity-70' : 'cursor-pointer bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:via-purple-400 hover:to-indigo-500 shadow-lg shadow-purple-600/20 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]'}`}
                            >
                                {isUserAuthLoading ? <Loader2 className='text-white animate-spin w-4 h-4 inline mr-2' /> : ''}{isUserAuthLoading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Otp;