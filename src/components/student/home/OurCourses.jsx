import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { allCourse } from '../../../redux/slice/couseSlice';
import getSweetAlert from '../../../util/alert/sweetAlert';
import Lottie from "lottie-react";
import loaderAnimation from '../../../assets/animations/loader.json';
import CourseCard from '../common/course/CourseCard';

const CoursesSection = () => {
  const [isVisible, setIsVisible] = useState(false),
    [searchTerm, setSearchTerm] = useState(''),
    sectionRef = useRef(null),
    dispatch = useDispatch(),
    { isCourseLoading, getCourseData, isCourseError } = useSelector(state => state.course);

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

  const headerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  useEffect(() => {
    // if (!getCourseData.length || getCourseData.length === 0) {
    dispatch(allCourse({ status: 'approved', is_active: true, is_admin_block: false }))
      .then(res => {
        // console.error("response from course section", res);
      })
      .catch((err) => {
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
        console.error("Error occurred", err);
      });
    // }
  }, [dispatch]);


  // console.log('Course Data', getCourseData);

  // Filter courses based on search term
  const filteredCourses = getCourseData?.filter(course =>
    course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course?.category?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div ref={sectionRef} className="bg-black min-h-screen px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-center mb-10 lg:mb-12 gap-6">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white text-center lg:text-left">
            Explore our Best{' '}
            <span className="bg-gradient-to-r from-purple-700 to-purple-800 bg-clip-text text-transparent">
              Courses
            </span>
          </h1>

          {/* Search Bar */}
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
            {/* <button className="px-5 py-2.5 ml-2 bg-purple-700 text-white rounded-full hover:bg-purple-600 transition-colors flex items-center gap-2">
              <Search size={18} />
              <span className="hidden font-semibold sm:inline text-sm">Search</span>
            </button> */}
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
                filteredCourses.slice(0, 6).map(course => (
                   <CourseCard key={course?.id} course={course}/>
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
            {/* Browse All */}
            <motion.div
              variants={headerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="flex justify-center lg:justify-end mt-10 lg:mt-12">
              <Link to='/course'
                className="bg-purple-700 hover:bg-purple-600 transition-all duration-300 px-6 py-3 rounded-full 
                      font-semibold flex items-center gap-2 transform hover:scale-105 active:scale-95 text-sm sm:text-base text-white">
                Browse All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default CoursesSection;
