import React from 'react'
import { motion } from "framer-motion";
import { useCourseReviews } from '../../../tanstack/query/fetchSpecificCourseReview';
import { formatDateDDMMYYYY } from '../../../util/dateFormat/dateFormat';
import { useStudentDetails } from '../../../tanstack/query/fetchSpecificStudentDetails';

const fallbackReviews = [
    {
        id: 'fb1',
        student_id: null,
        mockName: 'John Doe',
        rating_count: 5,
        review: 'This course completely changed my perspective. The concepts were explained clearly and the hands-on projects were incredible!',
        created_at: new Date().toISOString(),
    },
    {
        id: 'fb2',
        student_id: null,
        mockName: 'Sarah Smith',
        rating_count: 5,
        review: 'Amazing experience! The instructor was very knowledgeable and the materials provided were top-notch. Highly recommended.',
        created_at: new Date().toISOString(),
    },
    {
        id: 'fb3',
        student_id: null,
        mockName: 'Michael Johnson',
        rating_count: 4,
        review: 'Great course overall. I learned a lot of practical skills that I can apply immediately to my job. The pace was just right.',
        created_at: new Date().toISOString(),
    },
    {
        id: 'fb4',
        student_id: null,
        mockName: 'Emily Davis',
        rating_count: 5,
        review: 'Absolutely loved it. The community support and the interactive sessions made it so much better than standard online courses.',
        created_at: new Date().toISOString(),
    },
    {
        id: 'fb5',
        student_id: null,
        mockName: 'David Wilson',
        rating_count: 4,
        review: 'Very informative and well structured. I just wish there were more advanced topics covered at the end. Still worth every penny.',
        created_at: new Date().toISOString(),
    }
];

const ReviewCourse = ({ getSpecificCourseData }) => {

    const { data: reviews, isLoading: isReviewLoading } = useCourseReviews(getSpecificCourseData?.id);
    // console.log('All available reviews',reviews);

    const displayReviews = reviews?.length > 0 ? reviews : fallbackReviews;

    const TestimonialCard = ({ testimonial }) => {
        const { isLoading, data, error } = useStudentDetails(testimonial?.student_id || null);
        
        const studentName = testimonial?.mockName || data?.name || 'User';
        const initials = studentName.split(" ").map(n => n.charAt(0).toUpperCase()).join("");

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
                            {initials}
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-base">
                                {studentName} <p className="text-purple-400 text-sm font-normal">{formatDateDDMMYYYY(testimonial?.created_at)}</p>
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
                duration: displayReviews?.length * 3,
                ease: "linear",
            },
        },
    };

    return (
        <div className="relative h-[400px] sm:h-[500px] lg:h-[700px] overflow-hidden  max-w-xs mx-auto lg:max-w-xl lg:mx-0 ">
            {/* Gradient overlays */}
            <div className="absolute top-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-t from-black to-transparent z-40 pointer-events-none"></div>

            <motion.div className="flex flex-col" animate={animation}>
                {/* Duplicating the array so the continuous scroll doesn't snap abruptly */}
                {[...displayReviews, ...displayReviews].map((testimonial, index) => (
                    <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
                ))}
            </motion.div>

        </div>
    )
}

export default ReviewCourse