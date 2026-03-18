import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import Lottie from "lottie-react";
import loaderAnimation from "../../../assets/animations/loader.json";
import { motion } from "framer-motion";
import { useCourseVideos } from "../../../tanstack/query/fetchLectureVideo";

const AboutCourseDetails = ({ courseData: getSpecificCourseData }) => {
    const [activeLesson, setActiveLesson] = useState(0);

    const { isLoading, data: lectureData, error } = useCourseVideos({ courseId: getSpecificCourseData?.id });
    // console.log(getSpecificCourseData, lectureData);

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

                        <motion.img
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
                        {lectureData?.map(lesson => (
                            <button
                                key={lesson?.id}
                                onClick={() =>
                                    setActiveLesson(lesson?.isPreview)
                                }
                                className={`flex items-center justify-between w-full px-5 py-3 rounded-xl border transition ${lesson?.isPreview
                                    ? "bg-purple-600 text-white border-purple-600"
                                    : "bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800" }`}
                            >
                                <span>{lesson?.video_title ?? 'N/A'}</span>
                                {lesson?.isPreview ? (
                                    <FiChevronUp className="text-xl" />
                                ) : (
                                    <FiChevronDown className="text-xl" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default AboutCourseDetails;