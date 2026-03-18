import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CourseCard from "../common/course/CourseCard";

const RelatedCourse = ({ categoryDetails }) => {
    
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        if (categoryDetails?.courses?.length > 0) {
            setIsVisible(true);
        }
    }, [categoryDetails]);

    const headerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

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
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8"
                >
                    {availableCourses.length > 0 ? (
                        availableCourses.map(course => (
                            <motion.div key={course.id} variants={cardVariants}>
                                <CourseCard course={course} />
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            className="col-span-full font-semibold text-center py-20 mt-50 text-gray-600 text-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            No results found
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default RelatedCourse;