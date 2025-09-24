/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Laptop, Smartphone, Palette, BarChart, Database, Sparkles } from "lucide-react";

const categories = [
  {
    id: 1,
    title: "UI/UX Design",
    desc: "Master the principles of user-centered design and create stunning interfaces",
    icon: <Palette className="w-6 h-6" />,
  },
  {
    id: 2,
    title: "Web Development",
    desc: "Build responsive websites and modern web applications",
    icon: <Laptop className="w-6 h-6" />,
    highlight: true,
  },
  {
    id: 3,
    title: "Mobile Development",
    desc: "Learn how to create stunning mobile apps with awesome UI",
    icon: <Smartphone className="w-6 h-6" />,
  },
  {
    id: 4,
    title: "Digital Marketing",
    desc: "Grow businesses with effective marketing strategies",
    icon: <BarChart className="w-6 h-6" />,
  },
  {
    id: 5,
    title: "Data & Artificial Intelligencies",
    desc: "Understand data analytics, machine learning, and AI",
    icon: <Database className="w-6 h-6" />,
  },
  {
    id: 6,
    title: "Creative & Multimedia",
    desc: "Unleash your creativity with courses in graphic design",
    icon: <Sparkles className="w-6 h-6" />,
  },
];

const CategoriesSection = () => {
  const [cols, setCols] = useState(1);

  // Update number of columns based on screen size
  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth >= 1024) {
        setCols(3); // Desktop
      } else if (window.innerWidth >= 768) {
        setCols(2); // Tablet
      } else {
        setCols(1); // Mobile
      }
    };
    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, []);

  // Group cards dynamically
  const getCardGroups = () => {
    const groups = [];
    for (let i = 0; i < categories.length; i += cols) {
      groups.push(categories.slice(i, i + cols));
    }
    return groups;
  };

  // Animation variants
  const rowVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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

  return (
    <section className="bg-black text-white py-16 px-4 lg:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={rowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-16 gap-8"
        >
          <motion.div variants={headerVariants} className="lg:max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Choose Your Favourite Course from Top{" "}
              <span className="text-purple-500">Categories</span>
            </h2>
          </motion.div>
          <motion.div
            variants={headerVariants}
            className="lg:max-w-md lg:text-right"
          >
            <p className="text-gray-400 mb-6 text-base lg:text-lg mt-6">
              Discover a variety of in-demand learning categories designed to
              elevate your skills and boost your career.
            </p>
          </motion.div>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={rowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-6"
        >
          {getCardGroups().map((group, groupIndex) => (
            <motion.div
              key={groupIndex}
              variants={cardVariants}
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-12 gap-6`}
            >
              {group.map((cat, index) => {
                const globalIndex = groupIndex * cols + index;
                return (
                  <div
                    key={cat.id}
                    className="relative rounded-3xl p-8 h-64 flex flex-col justify-between transition-all duration-300 hover:scale-105 bg-neutral-900 hover:bg-gradient-to-br hover:from-purple-600 hover:to-black/30 border border-neutral-900 hover:border-purple-500 group"
                  >
                    {/* Icon */}
                    <div
                      className="absolute -top-6 right-6 w-14 h-14 flex items-center justify-center rounded-full 
                      bg-purple-700 text-white transition-all duration-300
                      group-hover:bg-white/10 group-hover:backdrop-blur-md group-hover:border group-hover:border-white/20"
                    >
                      {cat.icon}
                    </div>

                    {/* Content */}
                    <div className="pt-4">
                      <h3 className="text-xl lg:text-2xl font-bold mb-3 group-hover:text-white transition-colors duration-300">
                        {cat.title}
                      </h3>
                      <p className="text-sm lg:text-base text-gray-400 group-hover:text-purple-100 transition-colors duration-300">
                        {cat.desc}
                      </p>
                    </div>

                    {/* Button */}
                    <button
                      className="w-fit px-6 py-2.5 rounded-full border border-gray-500 text-gray-300 
                        flex items-center gap-2 text-sm font-medium transition-all duration-300
                        hover:bg-white/20 hover:backdrop-blur-md hover:border-white/90 hover:text-white"
                    >
                      Show More
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
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
                    </button>

                    {/* Number */}
                    <span className="absolute bottom-4 right-6 text-6xl lg:text-7xl font-bold text-white/10">
                      {globalIndex + 1}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          ))}
        </motion.div>

        {/* Browse All */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex justify-end mt-12"
        >
          <button
            className="bg-purple-700 hover:bg-purple-600 transition-all duration-300 px-6 py-3 rounded-full 
              font-semibold flex items-center gap-2 transform hover:scale-105 active:scale-95"
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
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
