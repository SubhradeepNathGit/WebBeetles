/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

const PreFooterCTA = () => {
  return (
    <section className="relative py-12 sm:py-16 lg:py-25 bg-black overflow-hidden">
      {/* World Map Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/world-map.jpg"
          alt="World Map Background"
          className="w-full h-full object-cover opacity-100"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-4 sm:mb-6"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
              Ready to Transform
            </h2>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mt-2">
              <span className="text-white">Your Skills</span>
              <span className="text-purple-700"> into Career?</span>
            </h2>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl mx-auto mb-6 sm:mb-10"
          >
            <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed">
              Join thousands of learners who are building better futures with
              flexible learning
            </p>
            <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed mt-2">
              Take your first step today and unlock real growth through
              knowledge
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center"
          >
            {/* Start Learning Button */}
            <motion.button
              whileHover={{
                scale: 1.02,
                
              }}
              whileTap={{ scale: 0.98 }}
              className="group w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 bg-purple-700 rounded-full text-black font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 hover:bg-purple-500 "
            >
              <span className="flex items-center justify-center text-white">
                Start Learning Now
                <svg
                  className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
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
              </span>
            </motion.button>

            {/* View Package Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 bg-transparent border-2 border-white rounded-full text-white font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
            >
              <span className="flex items-center justify-center">
                View Package
                <svg
                  className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
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
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default PreFooterCTA;
