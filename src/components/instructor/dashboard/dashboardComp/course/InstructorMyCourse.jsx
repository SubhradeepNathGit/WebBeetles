import React from 'react'
import { ChevronRight, Video } from 'lucide-react'
import InstructorDashboardCourseCard from './InstructorDashboardCourseCard';

const InstructorMyCourse = ({ courses }) => {

    return (
        <div className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 gap-2">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-blue-500/30 flex items-center justify-center border border-blue-400/30"><Video className="text-blue-300" size={18} /></div>
                    My Courses
                </h2>
                <button onClick={() => window.dispatchEvent(new CustomEvent("open-instructor-course"))} className="inline-flex items-center gap-1 text-purple-200 hover:text-white font-semibold text-xs sm:text-sm bg-white/10 hover:bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all border border-white/20 active:scale-95 cursor-pointer">
                    View All<ChevronRight size={14} />
                </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
                {courses?.slice(0, 3)?.map(course => (
                    <InstructorDashboardCourseCard key={course?.id} course={course} />
                ))}
            </div>
        </div>
    )
}

export default InstructorMyCourse