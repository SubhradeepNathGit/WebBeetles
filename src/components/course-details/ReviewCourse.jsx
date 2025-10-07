import React from 'react'
import { motion } from "framer-motion";

const ReviewCourse = () => {

    const testimonials = [
        { id: 1, name: "Sophia Thompson", role: "Verified Learner", title: "UI/UX Designer", rating: 5, text: "I never thought online learning could feel this personal. Relearn helped me switch careers with confidence!", avatar: "ST" },
        { id: 2, name: "Liam Garcia", role: "Verified Learner", title: "UI/UX Designer", rating: 5, text: "I never thought online learning could feel this personal. Relearn helped me switch careers with confidence!", avatar: "LG" },
        { id: 3, name: "Emma Wilson", role: "Instructor", title: "Frontend Developer", rating: 5, text: "The personalized learning path made all the difference. I gained practical skills that landed me my dream job!", avatar: "EW" },
        { id: 4, name: "Marcus Johnson", role: "Instructor", title: "Product Manager", rating: 5, text: "Relearn's approach to education is revolutionary. The mentorship and community support exceeded my expectations.", avatar: "MJ" },
        { id: 5, name: "Sarah Chen", role: "Verified Learner", title: "Data Scientist", rating: 5, text: "From zero to hero in data science. The structured curriculum and hands-on projects were game-changers for my career.", avatar: "SC" },
        { id: 6, name: "Alex Rodriguez", role: "Instructor", title: "Web Developer", rating: 5, text: "The quality of instruction and real-world applications helped me transition into tech seamlessly.", avatar: "AR" },
    ];

    // Duplicate testimonials for seamless infinite loop
    const duplicatedTestimonials = [...testimonials, ...testimonials];

    const TestimonialCard = ({ testimonial }) => (
        <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-2xl p-6 mb-4 min-h-[200px] flex flex-col justify-between relative">
            {/* Stars at the top */}
            <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-orange-400 fill-current mr-1" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                ))}
            </div>

            {/* Quote text */}
            <div className="flex-grow mb-6">
                <p className="text-gray-200 text-sm leading-relaxed">
                    "{testimonial.text}"
                </p>
            </div>

            {/* User info at the bottom */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {testimonial.avatar}
                    </div>
                    <div>
                        <h4 className="text-white font-semibold text-base">
                            {testimonial.name} <p className="text-purple-400 text-sm font-normal">10/10/2025</p>
                        </h4>
                    </div>
                </div>

                {/* Quote icon */}
                {/* <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                </div> */}
            </div>
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
        <div className="relative h-[400px] sm:h-[500px] lg:h-[700px] overflow-hidden  max-w-xs mx-auto lg:max-w-xl lg:mx-0 ">
            {/* Gradient overlays */}
            <div className="absolute top-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-t from-black to-transparent z-40 pointer-events-none"></div>

            <motion.div className="flex flex-col" animate={animation}>
                {duplicatedTestimonials.map((testimonial, index) => (
                    <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
            </motion.div>
        </div>
    )
}

export default ReviewCourse