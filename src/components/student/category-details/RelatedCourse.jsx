import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CourseCard from "../common/course/CourseCard";

const RelatedCourse = ({ categoryDetails }) => {
    const MotionDiv = motion.div;
    
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        if (categoryDetails?.courses?.length > 0) {
            setIsVisible(true);
        }
    }, [categoryDetails]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    const approvedCourses = categoryDetails?.courses?.filter(course => course?.status === "approved") || [];
    const availableCourses = approvedCourses?.filter(course => course?.is_active == true) || [];

    return (
        <section ref={sectionRef} className="bg-black text-white py-16 px-6 lg:px-20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start md:items-center gap-6 mb-14">
                    <div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white">
                            Category related{" "}
                            <span className="text-purple-500">Course</span>
                        </h2>
                    </div>
                    <div className="flex flex-col items-start lg:items-end">
                        <p className="text-gray-300 max-w-md mb-4">
                            Discover a variety of in-demand learning courses designed to
                            elevate your skills and boost your career.
                        </p>
                    </div>
                </div>

                {/* Course Cards */}
                <MotionDiv
                    variants={containerVariants}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8"
                >
                    {availableCourses.length > 0 ? (
                        availableCourses.map(course => (
                            <MotionDiv key={course.id} variants={cardVariants}>
                                <CourseCard course={course} />
                            </MotionDiv>
                        ))
                    ) : (
                        <MotionDiv
                            className="col-span-full flex flex-col items-center justify-center text-center py-12 px-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl max-w-md mx-auto mt-8 w-full backdrop-blur-sm"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-1.5">No Courses Found</h3>
                            <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
                                We couldn't find any courses matching your search or filters at the moment.
                            </p>
                        </MotionDiv>
                    )}
                </MotionDiv>
            </div>
        </section>
    );
};

export default RelatedCourse;
