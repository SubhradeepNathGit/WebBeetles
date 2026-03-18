import React from 'react'
import { Link } from 'react-router-dom'
import { HiCurrencyRupee } from "react-icons/hi";
import { motion } from 'framer-motion';
import { useCourseVideos } from '../../../../tanstack/query/fetchLectureVideo';
import { encodeBase64Url } from '../../../../util/encodeDecode/base64';

const CourseCard = ({ course }) => {

    const { isLoading, data: courseVideo, error } = useCourseVideos({ courseId: course?.id });

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <motion.div variants={cardVariants} className="group relative max-w-sm mx-auto w-full">
            <div className="
                        relative rounded-xl overflow-hidden transition-all duration-500 
                        bg-gradient-to-br from-gray-900 to-gray-800
                        hover:from-purple-00 hover:to-purple-800
                        hover:scale-105
                        shadow-2xl hover:shadow-purple-500/20
                        h-[420px] flex flex-col">
                <div className="relative h-60 overflow-hidden m-3 mb-0 rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
                    <img
                        src={course?.thumbnail}
                        alt={course?.title ?? 'N/A'}
                        className="w-full h-full object-cover transition-transform duration-700 scale-130 group-hover:scale-100 rounded-lg"
                    />
                </div>

                <div className="flex-1 flex flex-col p-5 pt-3">
                    <div className="mb-3">
                        <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase">
                            {course?.category?.name ?? 'N/A'}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-4 leading-tight line-clamp-2">
                        {course?.title ?? 'N/A'}
                    </h3>

                    <div className="mt-auto">
                        <div className="flex items-center mb-4">
                            <div className="w-7 h-7 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mr-2">
                                <span className="text-white text-xs font-bold">
                                    {course?.instructor?.name?.charAt(0) ?? 'N/A'}
                                </span>
                            </div>
                            <span className="text-gray-300 font-bold text-xs">{course?.instructor?.name ?? 'N/A'}</span>
                            <span className="text-gray-500 text-xs font-bold ml-auto group-hover:text-white/80 transition-colors duration-300">{courseVideo?.length} {courseVideo?.length > 1 ? `Sessions` : `Session`}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-white"><HiCurrencyRupee className='inline mb-1' /> {course?.price ?? 'N/A'}</span>
                                {/* <span className="text-gray-400 font-bold line-through text-xs">{course.price}</span> */}
                            </div>

                            <Link to={`/course/course-details/${encodeBase64Url(course?.id)}`} className="
                                         px-4 py-2.5 rounded-full font-bold text-xs
                                         bg-purple-700 text-white border border-transparent
                                         transition-transform transition-colors duration-300 ease-out
                                         hover:scale-105 active:scale-95 group-hover:scale-105
                                         hover:bg-white/10 group-hover:bg-white/10
                                         hover:backdrop-blur-md group-hover:backdrop-blur-md
                                         hover:border-white group-hover:border-white
                                         hover:text-white group-hover:text-white
                                       ">
                                Join Course
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-purple-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
            </div>
        </motion.div>
    )
}

export default CourseCard