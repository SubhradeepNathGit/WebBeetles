/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const ContactBanner = () => {
    return (
        <div className="relative min-h-screen bg-gradient-to-b from-[#7A00FF] via-[#25004D] to-black text-white overflow-hidden">

            {/* Main content wrapper with AboutBanner spacing */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-12 sm:pb-16 md:pb-20">

                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 md:gap-12 lg:gap-16 w-full min-h-[calc(100vh-8rem)] lg:min-h-0">

                    {/* Left Content */}
                    <motion.div
                        className="flex-1 text-center lg:text-left space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 w-full"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Heading */}
                        <motion.h1
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Have questions or need{" "}
                            <span className="bg-gradient-to-r from-purple-700 to-purple-800 bg-clip-text text-transparent">
                                support?
                            </span>
                            <br className="hidden sm:block" />
                            Reach out to Us
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            We're here to help you succeed. Get in touch with our team anytime for assistance or inquiries about our courses and services – we're just a message away!
                        </motion.p>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div
                        className="flex-1 flex justify-center lg:justify-end w-full"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[450px] lg:max-w-[500px] xl:max-w-[550px]">
                            <img
                                src="/images/contact-banner.png"
                                alt="Happy Learner"
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Decorative blobs */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-4 sm:left-10 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-blue-500/10 rounded-full blur-2xl sm:blur-3xl"
            ></motion.div>

            <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 right-4 sm:right-10 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-purple-500/10 rounded-full blur-2xl sm:blur-3xl"
            ></motion.div>
        </div>
    );
};

export default ContactBanner;