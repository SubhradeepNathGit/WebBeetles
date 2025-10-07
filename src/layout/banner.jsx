import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Banner = () => {

  const MotionLink = motion(Link);

  return (
    <section className="relative bg-gradient-to-b from-[#7A00FF] via-[#25004D] to-black text-white overflow-hidden">
      {/* Responsive padding and height */}
      <div className="pt-16 sm:pt-18 lg:pt-20 pb-8 sm:pb-12 lg:pb-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 xl:px-20 relative z-10">

          {/* Mobile/Tablet Layout (flex-col) - Desktop Layout (flex-row) */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

            {/* Left Content - Desktop Order 1, Mobile/Tablet shows first */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left order-1 lg:order-1"
            >
              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 sm:mb-6">
                Learn,
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Create, Conquer
                </span>
              </h1>

              {/* Description - Shows after headline on mobile/tablet */}
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 lg:mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Get in-demand skills and hands-on experience with Us-Unlock your entire potential
              </p>

              {/* Buttons - Hidden on mobile/tablet, shown on desktop */}
              <div className="hidden lg:flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/course"
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
                  >
                    Start Learning
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.div>

                <motion.a
                  href="#"
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 sm:gap-3 text-white hover:text-purple-300 transition-colors"
                >
                  <div className="bg-gradient-to-r from-purple-600 to-purple-600 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full shadow-lg">
                    <svg className="w-7 h-7 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span className="font-medium text-sm sm:text-base">See More</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Right Image Section - Shows after subtitle on mobile/tablet */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 flex justify-center relative order-2 lg:order-2 w-full"
            >
              {/* Student Image with Bottom Blur Effect */}
              <div className="relative">
                <img
                  src="/images/banner-img.jpg"
                  alt="Student"
                  className="relative z-20 w-72 sm:w-96 lg:w-[28rem] xl:w-[32rem] object-contain"
                />

                {/* Bottom Blur Gradient Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 lg:h-10 bg-gradient-to-t from-black via-black/60 to-transparent z-30 pointer-events-none"></div>
              </div>

              {/* Floating Circle Icons */}
              {/* <motion.img
                src="/images/Immersive-logo.png"  
                alt="Video Icon"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-12 sm:top-16 lg:top-20 right-4 sm:right-8 lg:right-14 w-12 sm:w-14 lg:w-16 z-30"
              />
              <motion.img
                src="/images/Advance-logo.png" 
                alt="Code Icon"
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute bottom-12 sm:bottom-16 lg:bottom-20 right-6 sm:right-10 lg:right-16 w-10 sm:w-12 lg:w-14 z-30"
              /> */}

              {/* Background Circles */}
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <img src="/images/circle.png" alt="Background Circle"
                  className="w-[28rem] lg:w-[34rem] object-contain pointer-events-none select-none"
                />
              </div>
            </motion.div>
          </div>

          {/* Buttons Section - Shows after image on mobile/tablet */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="flex lg:hidden flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8">
            <MotionLink
              to="/course"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base"
            >
              Start Learning
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </MotionLink>

            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 sm:gap-3 text-white hover:text-purple-300 transition-colors"
            >
              <div className="bg-gradient-to-r from-purple-600 to-purple-600 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full shadow-lg">
                <svg className="w-7 h-7 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="font-medium text-sm sm:text-base">See More</span>
            </motion.a>
          </motion.div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-20 md:h-28 lg:h-10 xl:h-34 bg-gradient-to-t from-black to-transparent z-0"></div>

    </section>
  )
}

export default Banner;
