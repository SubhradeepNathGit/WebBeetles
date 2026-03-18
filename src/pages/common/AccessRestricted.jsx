import React from "react";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AccessRestricted = () => {
  return (
    <div className="relative flex items-center justify-center h-screen bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-40">
        <img
          src="/images/world-map.jpg"
          alt="World Map"
          className="w-full h-full object-cover"
        />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center md:px-8 px-0 py-12 rounded-3xl bg-white/5 backdrop-blur-lg shadow-lg border border-white/10 max-w-lg"
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >

        <motion.div
          className="mb-6"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 10,
            delay: 0.2,
          }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="p-6 rounded-full bg-gradient-to-b from-white/30 to-white/10"
          >
            <Lock strokeWidth={1.2} className="text-white w-10 h-10" />
          </motion.div>
        </motion.div>

        <h1 className="md:text-3xl text-2xl font-semibold text-white mb-2">
          Access Restricted
        </h1>

        <p className="text-white/70 mb-6 w-3/5">
          You have to login first to access this page
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 20px rgba(147, 51, 234, 0.6)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/"
            className="px-8 py-3 text-white font-medium bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-md transition">
            Go to Log in
          </Link>
        </motion.div>

        <p className="text-white/50 text-sm mt-8">
          &copy; 2025 WebBeetles. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default AccessRestricted;