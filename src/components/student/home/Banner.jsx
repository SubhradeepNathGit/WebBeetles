import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

// Use motion.create() instead of deprecated motion(Link)
const MotionLink = motion.create(Link);

const HERO_ASSETS = ["/images/banner-img.jpg", "/images/circle.png"];

const containerVariants = {
  hidden: { opacity: 0 },
  ready: {
    opacity: 1,
    transition: {
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  ready: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
  },
};

const visualVariants = {
  hidden: { opacity: 0, scale: 0.985, y: 16, filter: "blur(8px)" },
  ready: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.82, ease: [0.22, 1, 0.36, 1] },
  },
};

const useHeroAssetsReady = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fallback = window.setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 900);

    const preloadImage = async (src) => {
      const img = new Image();
      img.decoding = "async";
      img.fetchPriority = "high";
      img.src = src;

      if (img.decode) {
        await img.decode();
        return;
      }

      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    };

    Promise.all(HERO_ASSETS.map(preloadImage))
      .catch(() => null)
      .finally(() => {
        if (!cancelled) {
          window.clearTimeout(fallback);
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, []);

  return ready;
};

const Banner = () => {
  const assetsReady = useHeroAssetsReady();
  const reduceMotion = useReducedMotion();
  const animationState = assetsReady || reduceMotion ? "ready" : "hidden";

  return (
    <section className="relative bg-gradient-to-b from-[#7A00FF] via-[#25004D] to-black text-white overflow-hidden">
      <div className="pt-16 sm:pt-18 lg:pt-20 pb-12 sm:pb-16 lg:pb-20 min-h-screen flex items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={animationState}
          className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 xl:px-20 relative z-10"
          style={{ willChange: assetsReady ? "auto" : "opacity" }}
        >
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <motion.div
              variants={itemVariants}
              className="flex-1 text-center lg:text-left order-1 lg:order-1 mt-12 -mb-10 lg:mt-0"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 sm:mb-6">
                Learn,
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Create, Conquer
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 lg:mb-6 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Get in-demand skills and hands-on experience with Us-Unlock your entire potential
              </p>

              <div className="hidden lg:flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Link
                    to="/course"
                    className="w-full sm:w-auto bg-gradient-to-r from-[#7A00FF] to-[#b300ff] px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg border border-white/10 text-sm sm:text-base relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    Start Learning
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.6} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              variants={visualVariants}
              className="flex-1 flex justify-center items-end relative order-2 lg:order-2 w-full mt-20 lg:mt-0"
            >
              <div className="relative flex justify-center items-end">
                <div className="absolute z-10 bottom-0 left-1/2 -translate-x-1/2 w-[23rem] sm:w-[28rem] lg:w-[34rem] flex justify-center items-end">
                  <img
                    src="/images/circle.png"
                    alt=""
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    aria-hidden="true"
                    className="w-full object-contain pointer-events-none select-none"
                  />
                </div>

                <div className="relative z-20">
                  <img
                    src="/images/banner-img.jpg"
                    alt="Student"
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    className="relative z-20 w-72 sm:w-96 lg:w-[28rem] xl:w-[32rem] object-contain"
                  />

                  <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 lg:h-10 bg-gradient-to-t from-black via-black/60 to-transparent z-30 pointer-events-none"></div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="flex lg:hidden flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6"
          >
            <MotionLink
              to="/course"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-full sm:w-auto bg-gradient-to-r from-[#7A00FF] to-[#b300ff] px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg border border-white/10 text-sm sm:text-base relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              Start Learning
              <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.6} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </MotionLink>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-20 md:h-28 lg:h-10 xl:h-34 bg-gradient-to-t from-black to-transparent z-0"></div>
    </section>
  )
}

export default Banner;
