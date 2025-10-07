import React, { useEffect } from 'react';
import { HiArrowRight } from "react-icons/hi";
import { RiBookOpenLine } from "react-icons/ri";
import { FaRegClock, FaMobileAlt, FaCertificate } from "react-icons/fa";
import { MdCurrencyRupee } from "react-icons/md";
import Lottie from "lottie-react";
import loaderAnimation from '../../assets/animations/loader.json';
import ReviewCourse from './ReviewCourse';
import { useDispatch, useSelector } from 'react-redux';
import { specificCourse } from "../../redux/slice/specificCourseSlice";
import getSweetAlert from '../../util/sweetAlert';
import { useNavigate } from "react-router-dom";
import { makePayment } from '../../redux/slice/paymentSlice';

const InstructorCourseDetails = ({ courseId }) => {
    const dispatch = useDispatch(),
        navigate = useNavigate(),
        { getSpecificCourseData } = useSelector(state => state.specificCourse),
        { isAuth } = useSelector(state => state.checkAuth);

    // Fetch specific course data
    useEffect(() => {
        dispatch(specificCourse(courseId));
    }, [dispatch, courseId]);

    // Load Razorpay SDK dynamically
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // Handle payment process
    const handlePayment = async () => {
        if (!getSpecificCourseData?._id) return;

        const sdkLoaded = await loadRazorpay();
        if (!sdkLoaded) {
            getSweetAlert("Error", "Razorpay SDK failed to load. Please check your internet.", "error");
            return;
        }

        try {
            const paymentRes = await dispatch(makePayment(getSpecificCourseData._id)).unwrap();
            console.log("Payment init response:", paymentRes);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,

                amount: paymentRes.amount,
                currency: paymentRes.currency,
                name: "WebBeetles",
                description: "Course Purchase",
                order_id: paymentRes.orderId,
                prefill: {
                    name: paymentRes.user?.name || "User",
                    email: paymentRes.user?.email || "user@example.com",
                },
                theme: {
                    color: "#7C3AED",
                },
                handler: async function (response) {
                    console.log("Payment successful:", response);

                    const token = sessionStorage.getItem('user_token');
                    const verifyRes = await fetch("http://localhost:3005/api/payments/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                        body: JSON.stringify({
                            ...response,
                            courseId: paymentRes.courseId,
                        }),
                    });

                    const result = await verifyRes.json();

                    if (verifyRes.ok) {
                        getSweetAlert("Success!", "Payment completed successfully!", "success");
                        setTimeout(() => navigate("/dashboard"), 1500);
                    } else {
                        console.error("Payment verification failed:", result);
                        getSweetAlert("Oops...", "Payment verification failed!", "error");
                    }
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", (err) => {
                console.error("Payment failed:", err);
                getSweetAlert("Failed", "Payment was not completed.", "error");
            });
            rzp.open();

        } catch (err) {
            console.error("Payment error:", err);
            getSweetAlert("Error", "Failed to create payment session.", "error");
        }
    }

    return (
        <div className="bg-gray-900 p-6 rounded-3xl shadow-lg text-white">
            {!getSpecificCourseData?.instructor ? (
                <div className="flex justify-center items-center min-h-[70vh]">
                    <Lottie
                        animationData={loaderAnimation}
                        loop={true}
                        className="w-40 h-40 sm:w-52 sm:h-52"
                    />
                </div>
            ) : (
                <>
                    <h3 className="text-lg font-semibold mb-4">Instructor</h3>
                    <div className="flex items-center gap-3 mb-6">
                        <img
                            src={`http://localhost:3005${getSpecificCourseData.instructor.profileImage}`}
                            alt="Instructor"
                            className="w-12 h-12 rounded-full"
                        />
                        <div>
                            <p className="font-semibold">{getSpecificCourseData.instructor.name}</p>
                            <p className="text-sm text-gray-400">{getSpecificCourseData.instructor.role}</p>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-3">This course includes:</h3>
                    <ul className="divide-y divide-gray-700 text-gray-300 mb-6">
                        <li className="flex items-center gap-3 py-3">
                            <FaRegClock className="text-purple-500" />
                            54 Hours of Learn-Anywhere Videos
                        </li>
                        <li className="flex items-center gap-3 py-3">
                            <RiBookOpenLine className="text-purple-500" />
                            Lifetime Learning Access
                        </li>
                        <li className="flex items-center gap-3 py-3">
                            <FaMobileAlt className="text-purple-500" />
                            Compatible with All Devices
                        </li>
                        <li className="flex items-center gap-3 py-3">
                            <FaCertificate className="text-purple-500" />
                            Certified Learning Achievement
                        </li>
                    </ul>

                    <div className="flex flex-col items-start mb-5">
                        <p className="text-purple-500 text-2xl font-bold mb-4 flex items-center">
                            <MdCurrencyRupee className="inline mr-1" />
                            {getSpecificCourseData.price}
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                if (isAuth) handlePayment();
                                else navigate('/signin');
                            }}
                            className="flex items-center justify-center gap-2 w-full 
                bg-purple-600 text-white 
                backdrop-blur-md border border-white/30 
                px-5 py-3 rounded-full transition 
                hover:bg-purple-800 hover:border-purple-600 hover:opacity-90 
                disabled:bg-gray-500 disabled:border-gray-400 disabled:opacity-60 disabled:cursor-not-allowed 
                disabled:hover:bg-gray-500 disabled:hover:border-gray-400"
                        >
                            Buy Now <HiArrowRight className="text-lg" />
                        </button>
                    </div>
                </>
            )}
            <ReviewCourse />
        </div>
    );
};

export default InstructorCourseDetails;
