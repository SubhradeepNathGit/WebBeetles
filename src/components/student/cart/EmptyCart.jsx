import React from 'react'
import { ShoppingCart, ArrowRight, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyCart = ({ navigateBack }) => {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full py-16 sm:py-24 flex flex-col items-center text-center"
        >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <ShoppingCart className="w-16 h-16 text-white/30" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Your cart is empty
            </h2>
            <p className="text-white/60 mb-6 max-w-md mx-auto leading-relaxed">
                Start your learning journey by exploring our premium courses and expert tutorials.
            </p>


            <button
                onClick={()=>navigateBack()}
                className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3.5 rounded-xl font-semibold transition-all inline-flex items-center gap-2 cursor-pointer"
            >
                Explore Courses
                <ArrowRight className="w-4 h-4" />
            </button>

            {/* Support Contact */}
            <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-sm text-white/60 mb-3">Need help choosing the right course?</p>
                <p className="text-purple-400 font-semibold text-sm inline-flex items-center gap-2 hover:text-purple-300 transition-colors cursor-pointer">
                    <Headphones className="w-4 h-4" />
                    Use our live chat in the bottom-right corner
                </p>
            </div>
        </motion.div>
    )
}

export default EmptyCart
