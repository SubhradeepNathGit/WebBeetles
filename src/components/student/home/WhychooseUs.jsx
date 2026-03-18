/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const WhyChooseUsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const features = [
    {
      image: '/images/expart1.png',
      title: 'Personal Guidance from Experts',
      description:
        'Learn directly from skilled professionals who guide you step by step, making complex topics easy to understand.',
    },
    {
      image: '/images/expart2.png',
      title: 'Curated Courses by Experts',
      description:
        'Every program is designed or reviewed by industry experts, ensuring you always get practical, job-ready knowledge.',
    },
    {
      image: '/images/expart3.png',
      title: 'Learn from Real Professionals',
      description:
        "Our experienced instructors guide you with real-world knowledge and insights, so you're never learning alone.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative bg-black text-white overflow-hidden py-12 lg:py-20"
    >
      {/* Top Blur Gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 sm:h-40 lg:h-48 bg-gradient-to-b from-black via-black/60 to-transparent z-10 pointer-events-none"></div>

      {/* Background blurred circles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-20 -translate-x-48 -translate-y-24"></div>
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-violet-500 rounded-full filter blur-3xl opacity-15 -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-700 rounded-full filter blur-3xl opacity-10 -translate-x-36 translate-y-24"></div>
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10 translate-x-32"></div>
        <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-violet-500 rounded-full filter blur-3xl opacity-5 translate-x-24"></div>
      </div>

      {/* Main content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left side - Image with review pill */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative flex flex-col justify-start"
          >
            <div className="relative flex-1 flex items-start justify-center">
              <div className="relative rounded-3xl overflow-hidden max-w-full lg:max-w-lg mx-auto shadow-2xl">
                <img
                  src="/images/Subtract.png"
                  alt="Student with books and headphones"
                  className="w-full h-[450px] sm:h-[400px] md:h-[420px] lg:h-[550px] object-cover"
                  style={{ aspectRatio: '500/500' }}
                />

                {/* Review pill */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 2 } : {}}
                  transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                  className="absolute bottom-1 left-17"
                >
                  <img
                    src="/images/review-pill.png"
                    alt="5.0K rating with 700+ reviews"
                    className="h-10 sm:h-13 md:h-13 lg:h-13 w-auto"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Features */}
          <div className="flex flex-col justify-start h-full space-y-6 lg:space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white">
                Why <span className="text-purple-700">WebBeetles</span> is best for <br />
                Learners Like You
              </h2>
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-start">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 100 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.8,
                    delay: 0.4 + index * 0.3,
                    ease: 'easeOut',
                  }}
                  className="bg-gray-900 bg-opacity-50 border border-gray-800 rounded-xl p-4 lg:p-5 backdrop-blur-sm"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={feature.image}
                        alt={`${feature.title} expert`}
                        className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg lg:text-xl font-bold mb-2 text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 text-sm lg:text-base leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-20 md:h-28 lg:h-10 xl:h-34 bg-gradient-to-t from-black to-transparent z-0"></div>
    </section>
    
  );
};

export default WhyChooseUsSection;
