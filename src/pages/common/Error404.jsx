import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Error404 = () => {
    const containerRef = useRef(null),
        errorNumberRef = useRef(null),
        homeButtonRef = useRef(null),
        navigate = useNavigate();

    useEffect(() => {
        // Create floating particles inside container
        const createParticle = () => {
            const particle = document.createElement("div");
            particle.className ="particle absolute bg-white rounded-full opacity-70";
            particle.style.left = Math.random() * 100 + "vw";
            particle.style.width = particle.style.height = Math.random() * 4 + 2 + "px";
            particle.style.animationDuration = Math.random() * 6 + 4 + "s";
            particle.style.animationDelay = Math.random() * 2 + "s";
            containerRef.current.appendChild(particle);
            setTimeout(() => particle.remove(), 10000);
        };

        const interval = setInterval(createParticle, 300);

        // Random glitch effect
        const errorNumber = errorNumberRef.current;
        const glitchInterval = setInterval(() => {
            if (Math.random() < 0.1) {
                errorNumber.style.animation = "none";
                setTimeout(() => {
                    errorNumber.style.animation = "bounce 2s ease-in-out infinite";
                }, 100);
            }
        }, 2000);

        return () => {
            clearInterval(interval);
            clearInterval(glitchInterval);
        };
    }, []);

    const handleRedirect = (e) => {
        e.preventDefault();
        const btn = homeButtonRef.current;
        btn.textContent = "Redirecting...";
        setTimeout(() => {
            navigate("/");
        }, 1500);
    };

    const MotionLink = motion.create(Link);

    return (
        <div ref={containerRef}
            className="fixed inset-0 h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#7A00FF] to-[#25004D] text-white overflow-hidden"
        >
            {/* Error content */}
            <div className="relative z-10 max-w-lg px-6 text-center">
                <div ref={errorNumberRef}
                    className="error-number text-[6rem] sm:text-[8rem] md:text-[12rem] font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-tr from-white to-slate-100 glitch animate-bounce"
                >
                    404
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 animate-fadeInUp">
                    Page Not Found!
                </h1>
                <p className="text-base sm:text-lg opacity-90 mb-8 animate-fadeInUp delay-200">
                    Oops! The page you're looking for can't be found. Let's get you back on
                    track.
                </p>
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 text-center lg:text-left order-2 lg:order-1"
                >
                    {/* Buttons */}
                    <div className="flex items-center justify-center">
                        <MotionLink to="/" ref={homeButtonRef} onClick={handleRedirect}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base">
                            Go Back To Home
                        </MotionLink>
                    </div>
                </motion.div>
            </div>

            <style>
                {`
          .particle {
            animation: particles 8s linear infinite;
          }
          @keyframes particles {
            0% { transform: translateY(100vh) rotate(0deg); opacity:1; }
            100% { transform: translateY(-100px) rotate(360deg); opacity:0; }
          }
        `}
            </style>
        </div>
    )
}

export default Error404;
