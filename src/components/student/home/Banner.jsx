import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Banner = () => {

  const MotionLink = motion(Link);

  return (
    <section className="relative bg-gradient-to-b from-[#7A00FF] via-[#25004D] to-black text-white overflow-hidden">
      {/* Responsive padding and height */}
      <div className="pt-16 sm:pt-18 lg:pt-20 pb-12 sm:pb-16 lg:pb-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 xl:px-20 relative z-10">

          {/* Mobile/Tablet Layout (flex-col) - Desktop Layout (flex-row) */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

            {/* Left Content - Desktop Order 1, Mobile/Tablet shows first */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 50, damping: 14, mass: 0.8 }}
              style={{ willChange: "transform, opacity" }}
              className="flex-1 text-center lg:text-left order-1 lg:order-1 mt-12 -mb-10 lg:mt-0">
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
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                  <Link
                    to="/course"
                    className="w-full sm:w-auto bg-gradient-to-r from-[#7A00FF] to-[#b300ff] px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg border border-white/10 text-sm sm:text-base relative overflow-hidden group">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    Start Learning
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.6} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Image Section - Shows after subtitle on mobile/tablet */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 50, damping: 14, mass: 0.8 }}
              style={{ willChange: "transform, opacity" }}
              className="flex-1 flex justify-center items-end relative order-2 lg:order-2 w-full mt-20 lg:mt-0">
              {/* Student Image & Circles Wrapper */}
              <div className="relative flex justify-center items-end">
                {/* Background Circles */}
                <div className="absolute z-10 bottom-0 left-1/2 -translate-x-1/2 w-[23rem] sm:w-[28rem] lg:w-[34rem] flex justify-center items-end">
                  <img src="/images/circle.png" alt="Background Circle"
                    className="w-full object-contain pointer-events-none select-none" />
                </div>

                {/* Student Image with Bottom Blur Effect */}
                <div className="relative z-20">
                  <img
                    src="/images/banner-img.jpg" alt="Student"
                    fetchPriority="high"
                    loading="eager"
                    className="relative z-20 w-72 sm:w-96 lg:w-[28rem] xl:w-[32rem] object-contain" />

                  {/* Bottom Blur Gradient Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 lg:h-10 bg-gradient-to-t from-black via-black/60 to-transparent z-30 pointer-events-none"></div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Buttons Section - Shows after image on mobile/tablet */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ type: "spring", stiffness: 50, damping: 14, mass: 0.8, delay: 0.25 }}
            style={{ willChange: "transform, opacity" }}
            className="flex lg:hidden flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6">
            <MotionLink
              to="/course"
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-full sm:w-auto bg-gradient-to-r from-[#7A00FF] to-[#b300ff] px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg border border-white/10 text-sm sm:text-base relative overflow-hidden group">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              Start Learning
              <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.6} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </MotionLink>
          </motion.div>

        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-20 md:h-28 lg:h-10 xl:h-34 bg-gradient-to-t from-black to-transparent z-0"></div>

    </section>
  )
}

export default Banner;
