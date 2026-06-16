import React, { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from "react-redux";
import { allCourse } from "../../../redux/slice/couseSlice";
import Lottie from "lottie-react";
import loaderAnimation from '../../../assets/animations/loader.json';
import CourseCard from "../common/course/CourseCard";


const CourseList = () => {
    const [isVisible, setIsVisible] = useState(false),
        [searchTerm, setSearchTerm] = useState(''),
        sectionRef = useRef(null),
        dispatch = useDispatch(),
        { isCourseLoading, getCourseData = [], isCourseError } = useSelector(state => state.course);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isCourseLoading) {
            dispatch(allCourse({ status: 'approved', is_active: true, is_admin_block: false }))
                .then((res) => {
                    // console.log("Course fetching response", res);
                })
                .catch((err) => {
                    alert("Oops... Something went wrong!");
                    console.log("Error occurred", err);
                });
        }
    }, [dispatch]);

    // console.log('Course Data', getCourseData);

    const headerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    }

    const filteredCourses = getCourseData?.filter(course =>
        course?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        course?.category?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    return (
        <section ref={sectionRef} className="bg-black text-white py-16 px-6 lg:px-20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start md:items-center gap-6 mb-14">
                    <div>
                        {/* <span className="inline-flex items-center border border-purple-400 rounded-full px-4 py-1 text-sm tracking-wide mb-4">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
              COURSES
            </span> */}
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white">
                            Choose Your Favourite {" "}
                            <span className="text-purple-500">Course</span>
                        </h2>
                    </div>
                    <div className="flex flex-col items-start lg:items-end">
                        <p className="text-gray-300 max-w-md mb-4">
                            Discover a variety of in-demand learning courses designed to
                            elevate your skills and boost your career.
                        </p>
                        {/* <Link
              to="/categories"
              className="bg-purple-700 hover:bg-purple-600 px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300"
            >
              Browse All Categories <FiArrowRight />
            </Link> */}
                        <div className="flex w-full lg:w-auto max-w-md justify-center lg:justify-end">
                            <div className="relative flex-1 lg:w-72">
                                <input
                                    type="text"
                                    placeholder="Search course..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-800 text-white rounded-full border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conditional Rendering */}
                {isCourseLoading ? (
                    <div className="flex justify-center items-center min-h-[70vh]">
                        <Lottie
                            animationData={loaderAnimation}
                            loop={true}
                            className="w-40 h-40 sm:w-52 sm:h-52"
                        />
                    </div>
                ) : isCourseError ? (
                    <h2 className="text-center text-red-500 text-lg">
                        Failed to load Course!
                    </h2>
                ) : (
                    <>
                        {/* Course Cards */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate={isVisible ? "visible" : "hidden"}
                            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8`}
                        >
                            {filteredCourses?.length > 0 ? (
                                filteredCourses.map(course => (
                                    <CourseCard key={course?.id} course={course} />
                                ))
                            ) : (
                                <motion.div
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
                                </motion.div>
                            )}
                        </motion.div>
                    </>
                )}
            </div>
        </section >
    );
};

export default CourseList;