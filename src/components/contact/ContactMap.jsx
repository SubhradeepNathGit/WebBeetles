/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactMap = () => {
    const [loading, setLoading] = useState(true);

    return (
        <motion.section
            className="w-full h-[450px] sm:h-[350px] md:h-[500px] lg:h-[700px] xl:h-[700px] relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
        >
            {/* Map Wrapper */}
            <div className="relative w-full h-full">
                {/* Loader Spinner */}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Google Map */}
                <iframe
                    title="Google Map - Newtown Ecospace Kolkata"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.0977359286847!2d88.48969931495822!3d22.57596998517472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0275474e4a8673%3A0x4f8e741c3b6e4e4e!2sEcospace%20Business%20Park%2C%20New%20Town%2C%20Kolkata!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                    className="w-full h-full border-0 grayscale-[60%] brightness-90 contrast-100"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    onLoad={() => setLoading(false)}
                />

                {/* Custom Center Info Box */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/30 text-white p-4 rounded-lg backdrop-blur-sm shadow-lg text-center w-[80%] sm:w-[60%] md:w-[30%] z-10">
                    <h3 className="text-lg font-bold">Ecospace Business Park</h3>
                    <p className="text-sm mt-1 opacity-90">Newtown, Kolkata, West Bengal 700160</p>
                </div>
            </div>

            {/* Top blur overlay */}
            <div
                className="absolute top-0 left-0 right-0 h-20 sm:h-32 md:h-25 z-10 pointer-events-none"
                style={{
                    background:
                        'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 15%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 70%, transparent 100%)',
                    backdropFilter: 'blur(2px)',
                    WebkitBackdropFilter: 'blur(2px)',
                }}
            ></div>

            {/* Bottom blur overlay */}
            <div
                className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 md:h-25 z-10 pointer-events-none"
                style={{
                    background:
                        'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 15%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 70%, transparent 100%)',
                    backdropFilter: 'blur(2px)',
                    WebkitBackdropFilter: 'blur(2px)',
                }}
            ></div>
        </motion.section>
    );
};

export default ContactMap;
