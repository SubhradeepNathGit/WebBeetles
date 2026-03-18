/* eslint-disable no-unused-vars */
import React from 'react'
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { Facebook, Linkedin, Instagram } from "lucide-react";

 const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
    },
    viewport: { once: true, margin: "-100px" }
  };

const ContactInfo = () => {
    return (
        <motion.div
            variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-100px" }} className="w-full">
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight text-white mb-5 text-center md:text-left" variants={fadeInUp} >
              Contact Us
            </motion.h2>
            <motion.p
              className="text-gray-400 mb-8 md:mb-10 text-base md:text-lg leading-relaxed" variants={fadeInUp}>
              Have questions, suggestions, or need help? Reach out and our team
              will get back to you as soon as possible.
            </motion.p>

            <div className="space-y-5 md:space-y-10">
              {[
                {
                  icon: <FaMapMarkerAlt />,
                  title: "Office Location",
                  content: "Newtown Ecospace, Kolkata"
                },
                {
                  icon: <FaPhoneAlt />,
                  title: "Telephone Number",
                  content: "+91-9098909890"
                },
                {
                  icon: <FaEnvelope />,
                  title: "Email Address",
                  content: "webeetles@yopmail.com"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 md:gap-4 group"
                  variants={fadeInUp}
                >
                  <motion.div
                    className="backdrop-blur-md bg-gradient-to-br from-purple-700/30 to-black/30 border border-purple-500/40 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow duration-300 flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-xl md:text-2xl">{item.icon}</span>
                  </motion.div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base md:text-lg text-white">{item.title}</h3>
                    <p className="text-gray-400 text-sm md:text-base break-words">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Media - Realistic Icons */}
            <motion.div
              className="flex gap-4 md:gap-3 sm:gap-5 mt-8 sm:mt-10 flex-wrap" variants={fadeInUp}> 

              <motion.a
                href="https://www.facebook.com/login/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 sm:p-3.5 rounded-full bg-[#1877F2] text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.a>
              
              <motion.a
                href="https://x.com/i/flow/login/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 sm:p-3.5 rounded-full bg-black border border-white/20 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                aria-label="X (formerly Twitter)"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </motion.a>
              
              <motion.a
                href="https://www.linkedin.com/login"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 sm:p-3.5 rounded-full bg-[#0A66C2] text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.a>
              
              <motion.a
                href="https://www.instagram.com/accounts/login/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 sm:p-3.5 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.a>
            </motion.div>
          </motion.div>
    )
}

export default ContactInfo