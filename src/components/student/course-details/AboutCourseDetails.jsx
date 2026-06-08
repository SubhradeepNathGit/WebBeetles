import React, { useEffect, useMemo, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import Lottie from "lottie-react";
import loaderAnimation from "../../../assets/animations/loader.json";
import { motion } from "framer-motion";
import { useCourseVideos } from "../../../tanstack/query/fetchLectureVideo";
import { Lock, PlayCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { checkLoggedInUser } from "../../../redux/slice/authSlice/checkUserAuthSlice";
import { fetchUserPurchase } from "../../../redux/slice/purchaseSlice";

const AboutCourseDetails = ({ courseData: getSpecificCourseData }) => {
    const dispatch = useDispatch();
    const [activeLesson, setActiveLesson] = useState(null);
    const { userAuthData } = useSelector(state => state.checkAuth);
    const { getPurchaseData } = useSelector(state => state.purchase);
    const MotionImg = motion.img;

    const { isLoading, data: lectureData } = useCourseVideos({ courseId: getSpecificCourseData?.id });
    const courseVideoLessons = useMemo(
        () => lectureData?.filter(lesson => lesson?.type === "video") || [],
        [lectureData]
    );
    const hasPurchasedCourse = getPurchaseData?.some(order =>
        order?.payment_status === "paid" &&
        order?.purchase_items?.some(item => item?.course_id === getSpecificCourseData?.id)
    );

    useEffect(() => {
        dispatch(checkLoggedInUser()).catch(err => {
            console.error("Error occurred", err);
        });
    }, [dispatch]);

    useEffect(() => {
        if (!userAuthData?.id) return;

        dispatch(fetchUserPurchase({ userId: userAuthData.id, status: "paid" })).catch(err => {
            console.error("Error occurred", err);
        });
    }, [dispatch, userAuthData?.id]);

    useEffect(() => {
        const firstPreview = courseVideoLessons?.find(lesson => lesson?.isPreview);

        if (firstPreview?.id) {
            setActiveLesson(firstPreview.id);
        }
    }, [courseVideoLessons]);

    const handleLessonToggle = (lesson) => {
        const canOpen = lesson?.isPreview || hasPurchasedCourse;

        if (!canOpen) return;

        setActiveLesson(current => current === lesson?.id ? null : lesson?.id);
    };

    return (
        <>
            {(!getSpecificCourseData || !getSpecificCourseData.instructor || isLoading) ? (
                <div className="flex justify-center items-center min-h-[70vh]">
                    <Lottie
                        animationData={loaderAnimation}
                        loop={true}
                        className="w-40 h-40 sm:w-52 sm:h-52"
                    />
                </div>
            ) : (
                <div className="lg:col-span-2 relative">
                    <div className="relative mb-6">
                        <img src="/course-details/course-details.png" alt="Course Laptop" className="w-full object-cover" />

                        <MotionImg
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 120,
                                damping: 10,
                                delay: 0.3,
                            }}
                            whileHover={{ scale: 1.1 }}
                            src={getSpecificCourseData?.thumbnail}
                            alt="Overlay Illustration"
                            className="absolute md:bottom-4 lg:bottom-3 bottom-1 md:right-6 lg:right-5 right-3 
                            w-15 md:w-35 lg:w-30 xl:w-45 h-15 md:h-35 lg:h-30 xl:h-45 cursor-pointer
                            rounded-full shadow-lg object-cover border-4 border-white/10" />
                    </div>

                    {/* Course Description */}
                    <div className="flex flex-col">
                        <h2 className="text-4xl font-bold mb-4">
                            {getSpecificCourseData?.title ?? 'N/A'}{" "}
                            <span className="block text-sm font-semibold text-purple-500  ">
                                {getSpecificCourseData?.category?.name ?? 'N/A'}
                            </span>
                        </h2>
                        <h2 className="text-xl font-semibold mb-3">About The Course</h2>
                        <p className="text-gray-300 mb-6">
                            {getSpecificCourseData?.description ?? 'N/A'}
                        </p>
                    </div>

                    {/* Key Points */}
                    <h3 className="text-xl font-semibold mb-3">Key Points</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        {
                            getSpecificCourseData?.feature?.map((point, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <FaCheckCircle className="text-purple-500" /> {point}
                                </li>
                            ))}
                    </ul>

                    {/* Lessons Accordion */}
                    <h3 className="text-xl font-semibold mb-3">Lessons of the Course</h3>
                    <div className="space-y-3">
                        {courseVideoLessons?.length > 0 ? courseVideoLessons?.map(lesson => (
                            <div key={lesson?.id} className="overflow-hidden rounded-xl border border-gray-700 bg-gray-900">
                                <button
                                    type="button"
                                    onClick={() => handleLessonToggle(lesson)}
                                    className={`flex items-center justify-between w-full px-5 py-4 text-left transition ${lesson?.isPreview
                                        ? "bg-purple-600 text-white border-purple-600"
                                        : hasPurchasedCourse
                                            ? "bg-gray-900 text-gray-300 hover:bg-gray-800"
                                            : "bg-gray-900/80 text-gray-500 cursor-not-allowed"}`}
                                >
                                    <span className="flex items-center gap-3">
                                        {lesson?.isPreview || hasPurchasedCourse ? (
                                            <PlayCircle className="h-5 w-5 text-white/80" />
                                        ) : (
                                            <Lock className="h-5 w-5 text-gray-500" />
                                        )}
                                        <span>{lesson?.video_title ?? 'N/A'}</span>
                                        {lesson?.isPreview && (
                                            <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold text-white">
                                                Demo
                                            </span>
                                        )}
                                    </span>
                                    {activeLesson === lesson?.id ? (
                                        <FiChevronUp className="text-xl" />
                                    ) : (
                                        <FiChevronDown className="text-xl" />
                                    )}
                                </button>

                                {activeLesson === lesson?.id && (lesson?.isPreview || hasPurchasedCourse) && (
                                    <div className="border-t border-white/10 bg-black p-4">
                                        {lesson?.video_url ? (
                                            <video
                                                src={lesson.video_url}
                                                controls
                                                preload="metadata"
                                                className="aspect-video w-full rounded-lg bg-black object-contain"
                                            />
                                        ) : (
                                            <p className="py-8 text-center text-sm text-gray-500">
                                                Video is not available.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )) : (
                            <p className="rounded-xl border border-gray-700 bg-gray-900 px-5 py-4 text-center text-gray-500">
                                No lecture available
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default AboutCourseDetails;
