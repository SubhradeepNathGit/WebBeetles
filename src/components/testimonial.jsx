/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

const TestimonialSection = () => {
  const testimonials = [
    { id: 1, name: "Sophia Thompson", title: "UI/UX Designer", rating: 5, text: "I never thought online learning could feel this personal. Relearn helped me switch careers with confidence!", avatar: "ST" },
    { id: 2, name: "Liam Garcia", title: "UI/UX Designer", rating: 5, text: "I never thought online learning could feel this personal. Relearn helped me switch careers with confidence!", avatar: "LG" },
    { id: 3, name: "Emma Wilson", title: "Frontend Developer", rating: 5, text: "The personalized learning path made all the difference. I gained practical skills that landed me my dream job!", avatar: "EW" },
    { id: 4, name: "Marcus Johnson", title: "Product Manager", rating: 5, text: "Relearn's approach to education is revolutionary. The mentorship and community support exceeded my expectations.", avatar: "MJ" },
    { id: 5, name: "Sarah Chen", title: "Data Scientist", rating: 5, text: "From zero to hero in data science. The structured curriculum and hands-on projects were game-changers for my career.", avatar: "SC" },
    { id: 6, name: "Alex Rodriguez", title: "Web Developer", rating: 5, text: "The quality of instruction and real-world applications helped me transition into tech seamlessly.", avatar: "AR" },
  ];

  // Duplicate testimonials for seamless infinite loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  const TestimonialCard = ({ testimonial }) => (
    <div className="bg-white/10 backdrop-blur-lg border border-gray-700 rounded-3xl p-4 sm:p-6 mb-4 min-h-[160px] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-blue-900 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
            {testimonial.avatar}
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm sm:text-base">{testimonial.name}</h4>
            <p className="text-gray-300 text-xs sm:text-sm">{testimonial.title}</p>
          </div>
        </div>
        <div className="flex">
          {[...Array(testimonial.rating)].map((_, i) => (
            <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
      </div>
      <p className="text-gray-200 text-xs sm:text-sm leading-relaxed flex-grow">{testimonial.text}</p>
    </div>
  );

  // Animation properties
  const animation = {
    y: ["0%", "-50%"], 
    transition: {
      y: {
        repeat: Infinity,
        repeatType: "loop",
        duration: testimonials.length * 3, 
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
    <div className="bg-black px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          variants={rowVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8"
        >
          {/* Left Heading */}
          <motion.div variants={headerVariants} className="lg:max-w-2xl text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-white">What Learners </span>
              {/* <span className="text-purple-700">Learners </span> */}
              <span className="text-white">say </span>
              <br />
              <span className="text-purple-700 text-4xl sm:text-5xl lg:text-6xl">About Us</span>
            </h2>
          </motion.div>

          {/* Right Supporting Text */}
          <motion.div variants={headerVariants} className="lg:max-w-md text-center lg:text-right">
            <p className="text-gray-500 mt-4 sm:mt-6 lg:mt-5 text-sm sm:text-base lg:text-lg font-semibold">
              Know directly from those who choose us over thousands of platforms
            </p>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mt-10 sm:mt-16 lg:mt-20">
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
                className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[650px] object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-black to-transparent rounded-b-2xl pointer-events-none"></div>
            </div>
          </motion.div>

          {/* Right Side - Animated Testimonials */}
          <div className="order-1 lg:order-2 relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
            {/* Gradient overlays */}
            <div className="absolute top-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-t from-black to-transparent z-40 pointer-events-none"></div>

            <motion.div className="flex flex-col" animate={animation}>
              {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
