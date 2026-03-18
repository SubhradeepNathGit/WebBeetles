/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Laptop, Smartphone, Palette, BarChart, Database, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { allCategory } from "../../../redux/slice/categorySlice";
import getSweetAlert from "../../../util/alert/sweetAlert";
import Lottie from "lottie-react";
import loaderAnimation from '../../../assets/animations/loader.json';
import CategoryCard from "../common/category/CategoryCard";

const CategoryList = () => {

  const dispatch = useDispatch(),
    { isCategoryLoading, getCategoryData, isCategoryError } = useSelector(state => state.category);

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

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        damping: 20,
        stiffness: 100,
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
      .then(res => {
        // console.log('Category fetching response', res);
      })
      .catch(err => {
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
        console.log('Errror occured', err);
      })
  }, []);

  // console.log(getCategoryData);

  return (
    <section className="bg-black text-white px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto">
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
            {/* Cards Grid  */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
            >
              {getCategoryData?.map((cat, index) => (
                 <CategoryCard key={cat._id || index} cat={cat} index={index} />
              ))}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default CategoryList;