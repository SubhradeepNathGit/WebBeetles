import React from 'react'
import { motion } from "framer-motion";
import { useCourseReviews } from '../../../tanstack/query/fetchSpecificCourseReview';
import { formatDateDDMMYYYY } from '../../../util/dateFormat/dateFormat';
import { useStudentDetails } from '../../../tanstack/query/fetchSpecificStudentDetails';

const ReviewCourse = ({ getSpecificCourseData }) => {

    const { data: reviews, isLoading: isReviewLoading } = useCourseReviews(getSpecificCourseData?.id);
    // console.log('All available reviews',reviews);

    const TestimonialCard = ({ testimonial }) => {
        const { isLoading, data, error } = useStudentDetails(testimonial?.student_id);

        return (
            <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-2xl p-6 mb-4 min-h-[200px] flex flex-col justify-between relative">
                {/* Stars at the top */}
                <div className="flex mb-4">
                    {[...Array(testimonial?.rating_count)]?.map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-orange-400 fill-current mr-1" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                    ))}
                </div>

                {/* Quote text */}
                <div className="flex-grow mb-6">
                    <p className="text-gray-200 text-sm leading-relaxed">
                        "{testimonial?.review ?? 'N/A'}"
                    </p>
                </div>

                {/* User info at the bottom */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {data?.name?.split(" ")?.map(name => name?.charAt(0)?.toUpperCase())?.join("") ?? 'U'}
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-base">
                                {data?.name ?? 'User'} <p className="text-purple-400 text-sm font-normal">{formatDateDDMMYYYY(testimonial?.created_at)}</p>
                            </h4>
                        </div>
                    </div>

                    {/* Quote icon */}
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                    </div>
                </div>
            </div>
        )
    };

    // Animation properties
    const animation = {
        y: ["0%", "-50%"],
        transition: {
            y: {
                repeat: Infinity,
                repeatType: "loop",
                duration: reviews?.length * 3,
                ease: "linear",
            },
        },
    };

    return (
        <div className="relative h-[400px] sm:h-[500px] lg:h-[700px] overflow-hidden  max-w-xs mx-auto lg:max-w-xl lg:mx-0 ">
            {/* Gradient overlays */}
            <div className="absolute top-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-t from-black to-transparent z-40 pointer-events-none"></div>

            {reviews?.length > 0 ? (
                <motion.div className="flex flex-col" animate={animation}>
                    {reviews.map(testimonial => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                    ))}
                </motion.div>
            ) : (
                <p className="my-5 text-center">No review available</p>
            )}

        </div>
    )
}

export default ReviewCourse