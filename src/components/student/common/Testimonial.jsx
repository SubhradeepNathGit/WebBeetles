/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewsRequest } from "../../../redux/slice/reviewSlice";
import getSweetAlert from '../../../util/alert/sweetAlert';
import loaderAnimation from '../../../assets/animations/loader.json';
import Lottie from "lottie-react";
import { useStudentDetails } from "../../../tanstack/query/fetchSpecificStudentDetails";
import { useCourseDetails } from "../../../tanstack/query/fetchSpecificCourseDetails";

const fallbackReviews = [
    {
        id: 'fb1',
        student_id: null,
        course_id: null,
        mockName: 'John Doe',
        rating_count: 5,
        review: 'This platform completely changed my perspective. The concepts were explained clearly and the hands-on projects were incredible!',
        created_at: new Date().toISOString(),
    },
    {
        id: 'fb2',
        student_id: null,
        course_id: null,
        mockName: 'Sarah Smith',
        rating_count: 5,
        review: 'Amazing experience! The instructors were very knowledgeable and the materials provided were top-notch. Highly recommended.',
        created_at: new Date().toISOString(),
    },
    {
        id: 'fb3',
        student_id: null,
        course_id: null,
        mockName: 'Michael Johnson',
        rating_count: 4,
        review: 'Great courses overall. I learned a lot of practical skills that I can apply immediately to my job. The pace was just right.',
        created_at: new Date().toISOString(),
    },
    {
        id: 'fb4',
        student_id: null,
        course_id: null,
        mockName: 'Emily Davis',
        rating_count: 5,
        review: 'Absolutely loved it. The community support and the interactive sessions made it so much better than standard online learning.',
        created_at: new Date().toISOString(),
    },
    {
        id: 'fb5',
        student_id: null,
        course_id: null,
        mockName: 'David Wilson',
        rating_count: 4,
        review: 'Very informative and well structured. I just wish there were more advanced topics covered at the end. Still worth every penny.',
        created_at: new Date().toISOString(),
    }
];

const TestimonialSection = () => {

  const dispatch = useDispatch();
  const { isReviewPending, getReviewData, isReviewError } = useSelector(state => state.review);
  
  const displayReviews = getReviewData?.length > 0 ? getReviewData : fallbackReviews;

  useEffect(() => {
    dispatch(fetchReviewsRequest())
      .then(res => {
        // console.log('Response for updating review', res);
      })
      .catch(err => {
        // console.log("Error occurred", err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      });
  }, []);

  const TestimonialCard = ({ testimonial }) => {
    const { isLoading, data, error } = useStudentDetails(testimonial?.student_id || null);
    const { isLoading: isCourseLoading, data: courseData, error: hasCourseError } = useCourseDetails(testimonial?.course_id || null);

    const studentName = testimonial?.mockName || data?.name || 'User';
    const initials = studentName.split(" ").map(n => n.charAt(0).toUpperCase()).join("");

    return (
      <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-2xl p-6 mb-4 min-h-[200px] flex flex-col justify-between relative">
        {/* Stars at the top */}
        <div className="flex mb-4">
          {[...Array(testimonial?.rating_count)].map((_, i) => (
            <svg key={i} className="w-5 h-5 text-orange-400 fill-current mr-1" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>

        {/* Quote text */}
        <div className="flex-grow mb-6">
          <p className="text-gray-200 text-sm leading-relaxed">
            "{testimonial?.review ?? 'N/A'}"
          </p>
        </div>

        {/* User info at the bottom */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {initials}
            </div>
            <div>
              <h4 className="text-white font-semibold text-base">
                {studentName} <span className="text-purple-400 text-sm font-normal">({data?.role ? (data.role.charAt(0).toUpperCase() + data.role.slice(1)) : 'User'})</span>
              </h4>
              <p className="text-gray-400 text-sm">{courseData?.title ?? 'N/A'}</p>
            </div>
          </div>

          {/* Quote icon */}
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Animation properties
  const animation = {
    y: ["0%", "-50%"],
    transition: {
      y: {
        repeat: Infinity,
        repeatType: "loop",
        duration: displayReviews?.length * 3,
        ease: "linear",
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.2 } },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="bg-black py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          variants={rowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 lg:gap-6"
        >
          {/* Left Heading */}
          <motion.div variants={headerVariants} className="lg:max-w-2xl text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-white">What Learners </span>
              <span className="text-white">say </span>
              <br />
              <span className="text-purple-700 text-4xl sm:text-5xl lg:text-6xl">About Us</span>
            </h2>
          </motion.div>

          {/* Right Supporting Text */}
          <motion.div variants={headerVariants} className="lg:max-w-md text-center lg:text-right">
            <p className="text-gray-500 mt-2 sm:mt-3 lg:mt-4 text-sm sm:text-base lg:text-lg font-semibold">
              Know directly from those who choose us over thousands of platforms
            </p>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center mt-8 sm:mt-10 lg:mt-12">
          {/* Left Side - Hero Image */}
          <motion.div
            className="order-2 lg:order-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1 }}
          >
            <div className="relative w-full sm:w-[85%] lg:w-full mx-auto lg:mx-0">
              <img
                src="/images/bannerimg2.jpg"
                alt="Happy learner with laptop"
                className="w-full h-[350px] sm:h-[400px] md:h-[500px] lg:h-[650px] object-cover object-top rounded-2xl shadow-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-black to-transparent rounded-b-2xl pointer-events-none"></div>
            </div>
          </motion.div>

          {/* Right Side - Animated Testimonials */}
          <div className="order-1 lg:order-2 relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden  max-w-xs mx-auto lg:max-w-xl lg:mx-0 ">
            {/* Gradient overlays */}
            <div className="absolute top-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-t from-black to-transparent z-40 pointer-events-none"></div>

            {isReviewPending ? (
              <div className="flex justify-center items-center min-h-[70vh]">
                <Lottie
                  animationData={loaderAnimation} loop={true} className="w-40 h-40 sm:w-52 sm:h-52" />
              </div>
            ) : (
              <motion.div className="flex flex-col" animate={animation}>
                {[...displayReviews, ...displayReviews].map((testimonial, index) => (
                  <TestimonialCard key={`${testimonial?.id}-${index}`} testimonial={testimonial} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
