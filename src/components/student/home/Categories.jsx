import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { allCategory } from "../../../redux/slice/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import getSweetAlert from "../../../util/alert/sweetAlert";
import Lottie from "lottie-react";
import loaderAnimation from '../../../assets/animations/loader.json';
import CategoryCard from "../common/category/CategoryCard";

const CategoriesSection = () => {
  const dispatch = useDispatch();
  const { isCategoryLoading, getCategoryData = [], isCategoryError } = useSelector(state => state.category);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  useEffect(() => {
    dispatch(allCategory('active'))
      .then((res) => {
        // console.log("Category fetching response", res);
      })
      .catch((err) => {
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
        console.log("Error occurred", err);
      });
  }, [dispatch]);

  return (
    <section className="bg-black text-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-10 lg:mb-12 gap-6 lg:gap-8"
        >
          <motion.div variants={headerVariants} className="flex-1 lg:max-w-2xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-center lg:text-left">
              Choose Your Favourite Course from Top{" "}
              <span className="text-purple-500">Categories</span>
            </h2>
          </motion.div>
          <motion.div
            variants={headerVariants}
            className="flex-1 lg:max-w-md text-center lg:text-right"
          >
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-2 lg:mt-6">
              Discover a variety of in-demand learning categories designed to
              elevate your skills and boost your career.
            </p>
          </motion.div>
        </motion.div>

        {/* Conditional Rendering */}
        {isCategoryLoading ? (
          <div className="flex justify-center items-center min-h-[70vh]">
            <Lottie
              animationData={loaderAnimation}
              loop={true}
              className="w-40 h-40 sm:w-52 sm:h-52"
            />
          </div>
        ) : isCategoryError ? (
          <h2 className="text-center text-red-500 text-lg">
            Failed to load categories!
          </h2>
        ) : (
          <>
            {/* Cards Grid */}
            <motion.div variants={containerVariants}
              initial="hidden" whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">

              {getCategoryData?.slice(0, 6)?.map((cat, index) => (
                <CategoryCard key={cat._id || index} cat={cat} index={index} />
              ))}
            </motion.div>

            {/* Browse All */}
            <motion.div
              variants={headerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="flex justify-center lg:justify-end mt-10 lg:mt-12"
            >
              <Link
                to="/category"
                className="bg-purple-700 hover:bg-purple-600 transition-all duration-300 px-6 py-3 rounded-full 
                font-semibold flex items-center gap-2 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                Browse All
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;