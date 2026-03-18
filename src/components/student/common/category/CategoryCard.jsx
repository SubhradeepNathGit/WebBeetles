import React from 'react'
import { motion } from "framer-motion";
import { encodeBase64Url } from '../../../../util/encodeDecode/base64'
import { Laptop, Smartphone, Palette, BarChart, Database, Sparkles } from "lucide-react";
import { Link } from 'react-router-dom';

const CategoryCard = ({ cat, index }) => {

    const cardVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                damping: 20,
                stiffness: 100,
            },
        },
    };

    const categoriesIcon = [
        <Palette className="w-6 h-6" />,
        <Laptop className="w-6 h-6" />,
        <Smartphone className="w-6 h-6" />,
        <BarChart className="w-6 h-6" />,
        <Database className="w-6 h-6" />,
        <Sparkles className="w-6 h-6" />,
    ];

    return (
        <motion.div
            variants={cardVariants}
            className="max-w-sm mx-auto w-full mt-2">
            <div
                className="relative rounded-3xl p-6 sm:p-8 h-64 flex flex-col justify-between transition-all duration-300 hover:scale-105 bg-neutral-900 hover:bg-gradient-to-br hover:from-purple-600 hover:to-black/30 border border-neutral-900 hover:border-purple-500 group">

                <div
                    className="absolute -top-6 right-6 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full 
                    bg-purple-700 text-white transition-all duration-300
                    group-hover:bg-white/10 group-hover:backdrop-blur-md group-hover:border group-hover:border-white/20"
                >
                    {/* {categoriesIcon[index % categoriesIcon.length]} */}
                    {categoriesIcon[Math?.floor(Math?.random() * (categoriesIcon?.length))]}
                </div>

                {/* Content */}
                <div className="pt-4">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 group-hover:text-white transition-colors duration-300">
                        {cat?.name ?? 'N/A'}
                    </h3>
                    <p className="text-sm lg:text-base text-gray-400 group-hover:text-purple-100 transition-colors duration-300 leading-relaxed">
                        {(cat?.description?.length > 100 ? cat?.description?.slice(0, 100) + "..." : cat?.description) ?? 'N/A'}
                    </p>
                </div>

                <Link to={`/category/category-details/${encodeBase64Url(cat?.id)}`}
                    className="w-fit px-4 sm:px-6 py-2.5 rounded-full border border-gray-500 text-gray-300 
                      flex items-center gap-2 text-sm font-medium transition-all duration-300
                      hover:bg-white/20 hover:backdrop-blur-md hover:border-white/90 hover:text-white"
                >
                    Show More
                    <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                    </svg>
                </Link>

                {/* Number */}
                <span className="absolute bottom-4 right-6 text-5xl sm:text-6xl lg:text-7xl font-bold text-white/10">
                    {index + 1}
                </span>
            </div>
        </motion.div>
    )
}

export default CategoryCard