import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { allCourse } from '../redux/slice/couseSlice';
import { HiCurrencyRupee } from 'react-icons/hi';
import getSweetAlert from '../util/sweetAlert';
import Lottie from "lottie-react";
import loaderAnimation from '../assets/animations/loader.json'; 

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

  // const courses = [
  //   {
  //     id: 1,
  //     category: "UI/UX DESIGN",
  //     title: "User Experience Design Fundamentals",
  //     instructor: "Sarah Mitchell",
  //     sessions: 16,
  //     price: "₹1,599",
  //     originalPrice: "₹2,199",
  //     image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=250&fit=crop&crop=center"
  //   },
  //   {
  //     id: 2,
  //     category: "GRAPHIC DESIGN",
  //     title: "Introduction to Graphic Design",
  //     instructor: "Liam Garcia",
  //     sessions: 12,
  //     price: "₹2,499",
  //     originalPrice: "₹2,999",
  //     image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&h=250&fit=crop&crop=center"
  //   },
  //   {
  //     id: 3,
  //     category: "WEB DEVELOPMENT",
  //     title: "Frontend Web Development",
  //     instructor: "Emma Wilson",
  //     sessions: 20,
  //     price: "₹2,499",
  //     originalPrice: "₹3,799",
  //     image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=400&h=250&fit=crop&crop=center"
  //   },
  //   {
  //     id: 4,
  //     category: "DATA SCIENCE",
  //     title: "Data Analysis with Python",
  //     instructor: "Michael Chen",
  //     sessions: 18,
  //     price: "₹2,099",
  //     originalPrice: "₹3,399",
  //     image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center"
  //   },
  //   {
  //     id: 5,
  //     category: "MOBILE DEVELOPMENT",
  //     title: "React Native Mobile Apps",
  //     instructor: "Jessica Park",
  //     sessions: 14,
  //     price: "₹2,299",
  //     originalPrice: "₹3,199",
  //     image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop&crop=center"
  //   },
  //   {
  //     id: 6,
  //     category: "DIGITAL MARKETING",
  //     title: "Social Media Marketing Strategy",
  //     instructor: "David Rodriguez",
  //     sessions: 10,
  //     price: "₹1,899",
  //     originalPrice: "₹2,699",
  //     image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&crop=center"
  //   }
  // ]

  const headerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  useEffect(() => {
    if (!isCourseLoading) {
      dispatch(allCourse())
        .then((res) => {
          // console.log("Course fetching response", res);
        })
        .catch((err) => {
          getSweetAlert('Oops...', 'Something went wrong!', 'error');
          console.log("Error occurred", err);
        });
    }
  }, [dispatch]);

  // console.log('Course Data', getCourseData);

  // Filter courses based on search term
  const filteredCourses = getCourseData.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              {filteredCourses.length > 0 ? (
                filteredCourses.slice(0,6).map((course) => (
                  <motion.div key={course._id} variants={cardVariants} className="group relative max-w-sm mx-auto w-full">
                    <div className="
                  relative rounded-xl overflow-hidden transition-all duration-500 
                  bg-gradient-to-br from-gray-900 to-gray-800
                  hover:from-purple-00 hover:to-purple-800
                  hover:scale-105
                  shadow-2xl hover:shadow-purple-500/20
                  h-[420px] flex flex-col
                ">
                      <div className="relative h-60 overflow-hidden m-3 mb-0 rounded-lg">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
                        <img
                          src={`http://localhost:3005${course.thumbnail}`}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-700 scale-130 group-hover:scale-100 rounded-lg"
                        />
                      </div>

                      <div className="flex-1 flex flex-col p-5 pt-3">
                        <div className="mb-3">
                          <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase">
                            {course.category.name}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-4 leading-tight line-clamp-2">
                          {course.title}
                        </h3>

                        <div className="mt-auto">
                          <div className="flex items-center mb-4">
                            <div className="w-7 h-7 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mr-2">
                              <span className="text-white text-xs font-bold">
                                {course.instructor.name.charAt(0)}
                              </span>
                            </div>
                            <span className="text-gray-300 font-bold text-xs">{course.instructor.name}</span>
                            <span className="text-gray-500 text-xs font-bold ml-auto group-hover:text-white/80 transition-colors duration-300">{course.sections.length} {course.sections.length > 1 ? `Sessions` : `Session`}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-white"><HiCurrencyRupee className='inline mb-1' /> {course.price}</span>
                              {/* <span className="text-gray-400 font-bold line-through text-xs">{course.price}</span> */}
                            </div>

                            <Link to={`course/course-details/${course._id}`} className="
                          px-4 py-2.5 rounded-full font-bold text-xs
                          bg-purple-700 text-white border border-transparent
                          transition-transform transition-colors duration-300 ease-out
                          hover:scale-105 active:scale-95 group-hover:scale-105
                          hover:bg-white/10 group-hover:bg-white/10
                          hover:backdrop-blur-md group-hover:backdrop-blur-md
                          hover:border-white group-hover:border-white
                          hover:text-white group-hover:text-white
                        ">
                              Join Course
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-purple-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
                    </div>
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
