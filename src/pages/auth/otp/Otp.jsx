import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { emailVerify, userResendOTP } from "../../../redux/slice/authSlice/authSlice";
import getSweetAlert from "../../../util/sweetAlert";
import toastifyAlert from "../../../util/toastify";

const Otp = () => {
    const { handleSubmit, control } = useForm(),
        dispatch = useDispatch(),
        navigator = useNavigate(),
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

    const handleResend = (resend_email) => {

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

    const otpHandler = (data) => {
        const otpCode = Object.values(data.otpField).join("");
        // console.log("Entered OTP:", otpCode);

        if (otpCode.length !== 6) {
            getSweetAlert("Oops...", "Please enter all 6 digits!", "error");
            return;
        }

        const verify_data = {
            email: email,
            otp: otpCode
        }
        console.log('verify data', verify_data);

        dispatch(emailVerify(verify_data))
            .then(res => {
                console.log('Response from form', res);

                if (res.meta.requestStatus === "fulfilled") {
                    getSweetAlert('Congrates', res.payload.message, 'success');
                    navigator('/signin');
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
        <div className="relative h-screen overflow-hidden">
            <button onClick={() => navigator(-1)}
                className="absolute top-5 left-5 md:top-8 md:left-8 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
                <FaArrowLeft className="text-gray-700 text-lg" />
            </button>

            {/* Background */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10"
                style={{
                    backgroundImage: `linear-gradient(rgba(44,6,159,0.8), #25004D), url('/auth/otp/abbdbe1bb567f571cfb7e27f54c7a0ded17fc6d0.png')`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top",
                }}
            />

            <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="hidden md:flex w-full md:w-1/2 flex-col justify-center items-start text-white">
                    <h1 className="font-display text-4xl lg:text-7xl xl:text-8xl leading-tight mb-4 font-bold">
                        WebBeetles
                    </h1>
                    <p className="max-w-xl font-normal text-base lg:text-lg opacity-90">
                        Take your IT skills to new heights and give your career a fantastic boost!
                    </p>
                </div>

                <div className="w-full md:w-1/2 flex justify-center">
                    <div className="w-full max-w-[500px] bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-2xl">
                        <h2 className="text-2xl lg:text-3xl font-semibold text-white text-center mb-6">
                            OTP Verification
                        </h2>

                        <form onSubmit={handleSubmit(otpHandler)} className="space-y-4">
                            <p className="text-white text-sm lg:text-base text-center">
                                OTP has been sent via Email to
                            </p>
                            <p className="text-white text-base lg:text-lg text-center font-bold mb-4">
                                {showMail(email)}
                            </p>

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

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full text-base font-semibold"
                            >
                                {isAuthLoading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Otp;