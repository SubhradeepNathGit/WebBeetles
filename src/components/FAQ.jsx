/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Plus, Minus, ExternalLink } from 'lucide-react';

const FAQSection = () => {
  const [openAccordion, setOpenAccordion] = useState(0); // First item open by default
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const faqData = [
    {
      id: 0,
      question: 'What is WebBeetles?',
      answer:
        'WebBeetles is an online learning platform that lets you take courses anytime, anywhere. Learn new skills, level up your career, or explore new interests on your schedule.',
    },
    {
      id: 1,
      question: 'Who can use WebBeetles?',
      answer:
        'WebBeetles is designed for learners of all backgrounds and skill levels. Whether you are a student, professional, or lifelong learner, our platform offers courses suitable for everyone from beginners to advanced practitioners.',
    },
    {
      id: 2,
      question: 'What types of courses are available?',
      answer:
        'We offer a wide variety of courses across multiple disciplines including technology, business, design, marketing, data science, programming, and personal development. Our catalog is constantly expanding with new content.',
    },
    {
      id: 3,
      question: 'Are the courses beginner-friendly?',
      answer:
        'Yes! Many of our courses are specifically designed for beginners with no prior experience. Each course clearly indicates its difficulty level, and we provide step-by-step guidance to help you learn at your own pace.',
    },
    {
      id: 4,
      question: 'Can I control my smart home when I\'m away?',
      answer:
        'This appears to be a sample question that doesn\'t match our learning platform context. Our courses focus on educational content and skill development rather than smart home automation.',
    },
    
  ];

  const handleAccordionClick = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const leftSectionVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section className="bg-black text-white py-12 sm:py-16 lg:py-0 px-4 sm:px-6 lg:px-12">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-start"
      >
        {/* Left Section */}
        <motion.div 
          variants={leftSectionVariants}
          className="lg:sticky lg:top-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 lg:mb-10 leading-tight">
            Frequently Asked{' '}
            <span className="text-purple-600">Questions</span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg md:text-lg leading-relaxed mb-6 sm:mb-8 lg:mb-12 max-w-md">
            We're here to make learning easy. Explore our FAQs to quickly find
            the information you need about features, courses, access, and more.
          </p>

          {/* Still have a question card */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-md">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">
              Still have a question?
            </h3>
            <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              We're here to help you. If you have any questions or need more
              information, feel free to reach out!
            </p>
            <button className="inline-flex items-center gap-2 sm:gap-3 bg-transparent border border-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-200 group text-sm sm:text-base">
              Ask a Question 
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </button>
          </div>
        </motion.div>

        {/* Right Section (FAQ Accordion) */}
        <motion.div variants={containerVariants} className="space-y-4 sm:space-y-5">
          {faqData.map((faq, index) => {
            const isOpen = openAccordion === faq.id;
            return (
              <motion.div
                key={faq.id}
                variants={itemVariants}
                layout
                className={`overflow-hidden rounded-3xl border cursor-pointer transition-all duration-300 ${
                  isOpen 
                    ? 'bg-purple-600/70 border-purple-950' 
                    : 'bg-gray-900 border-gray-800 hover:border-white'
                }`}
              >
                <button
                  className="w-full p-4 sm:p-6 md:p-6 text-left flex items-center justify-between group"
                  onClick={() => handleAccordionClick(faq.id)}
                >
                  <span className={`text-base sm:text-lg md:text-xl font-semibold transition-colors duration-200 ${
                    isOpen ? 'text-white' : 'text-white group-hover:text-gray-200'
                  }`}>
                    {faq.question}
                  </span>
                  <motion.div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isOpen 
                        ? 'bg-white/20 border-white/30' 
                        : 'bg-gray-800 border-gray-700 group-hover:bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isOpen ? (
                      <Minus className="w-5 h-5 text-white" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-400 group-hover:text-gray-300" />
                    )}
                  </motion.div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? 'auto' : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ 
                    duration: 0.3,
                    ease: [0.04, 0.62, 0.23, 0.98],
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-4 sm:px-6 md:px-6 pb-4 sm:pb-6">
                    <p className="leading-relaxed text-white/90 text-sm sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FAQSection;