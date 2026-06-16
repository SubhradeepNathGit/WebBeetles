import React from 'react'
import { ChevronRight, Video } from 'lucide-react'
import InstructorDashboardCourseCard from './InstructorDashboardCourseCard';

const InstructorMyCourse = ({ courses }) => {

    return (
        <div className="relative overflow-hidden rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-5 sm:p-6 lg:p-8 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 gap-3">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white flex items-center gap-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner"><Video className="text-blue-400" size={20} /></div>
                    My Courses
                </h2>
                <button onClick={() => window.dispatchEvent(new CustomEvent("open-instructor-course"))} className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white font-bold text-xs sm:text-sm bg-zinc-800/50 hover:bg-zinc-800 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all border border-zinc-700/50 hover:border-zinc-600 shadow-sm hover:shadow-md active:scale-95 cursor-pointer">
                    View All<ChevronRight size={16} className="text-zinc-400" />
                </button>
            </div>
            <div className="space-y-4 sm:space-y-5">
                {courses?.slice(0, 5)?.map(course => (
                    <InstructorDashboardCourseCard key={course?.id} course={course} />
                ))}
            </div>
        </div>
    )
}

export default InstructorMyCourse
