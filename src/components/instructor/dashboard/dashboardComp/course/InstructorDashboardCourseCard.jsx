import React from 'react'
import { IndianRupee, Eye, Star, Target, TrendingUp, Users } from 'lucide-react'
import { useCourseVideos } from '../../../../../tanstack/query/fetchLectureVideo';
import CourseRating from '../../../../student/dashboard/student-myCourse/rating-review/CourseRating';
import { useCoursePurchases } from '../../../../../tanstack/query/fetchCoursePurchase';

const InstructorDashboardCourseCard = ({ course }) => {

    const { isLoading, data: lectureData, error } = useCourseVideos({ courseId: course?.id });
    const { data: students, isLoading: isStudentLoading } = useCoursePurchases(course?.id);

    const totalViews = lectureData?.reduce((acc, cur) => acc + Number(cur?.views || 0), 0);
    const status = (course?.status == 'approved' && course?.is_active) ? 'Published' : (course?.status == 'approved' && !course?.is_active) ? 'Draft' : course?.status == 'pending' ? 'Pending' : 'Rejected';
    const statusColor = (course?.status == 'approved' && course?.is_active) ? 'bg-green-500 text-white' : (course?.status == 'approved' && !course?.is_active) ? 'bg-yellow-500 text-black' : course?.status == 'pending' ? 'bg-orange-500 text-white' : 'bg-red-500 text-white';

    const handleCourseClick = () => {
        // Dispatch event to switch to instructor courses page with the selected course
        window.dispatchEvent(new CustomEvent("open-instructor-course-details", { detail: { course } }));
    };

    return (
        <div onClick={handleCourseClick} className="group bg-zinc-900/30 rounded-2xl p-3.5 sm:p-5 hover:bg-zinc-800/40 transition-all duration-300 border border-zinc-800/60 hover:border-zinc-700/80 shadow-lg hover:shadow-2xl overflow-hidden relative cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-colors duration-500 pointer-events-none"></div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 relative z-10">
                <div className="relative flex-shrink-0">
                    <img src={course?.thumbnail} alt={course?.title} className="w-full sm:w-36 lg:w-48 aspect-video sm:aspect-auto sm:h-28 lg:h-32 rounded-xl object-cover border border-zinc-800/80 group-hover:border-zinc-700 transition-all shadow-md group-hover:shadow-xl group-hover:scale-[1.02] duration-300" />
                    <div className={`absolute top-2 right-2 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-lg backdrop-blur-md border ${
                        (course?.status == 'approved' && course?.is_active) ? 'bg-emerald-500/90 text-white border-emerald-400/50' : 
                        (course?.status == 'approved' && !course?.is_active) ? 'bg-yellow-500/90 text-white border-yellow-400/50' : 
                        course?.status == 'pending' ? 'bg-orange-500/90 text-white border-orange-400/50' : 
                        'bg-red-500/90 text-white border-red-400/50'
                    }`}>{status}</div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-extrabold text-zinc-100 text-sm sm:text-base lg:text-lg mb-2.5 group-hover:text-white transition-colors line-clamp-2 leading-tight">{course?.title?.length > 30 ? course?.title?.slice(0, 30)?.toUpperCase() + '...' : course?.title?.toUpperCase() ?? 'N/A'}</h3>
                    <div className="flex flex-wrap gap-2 mb-3.5 lg:mb-4">
                        <span className="inline-flex items-center gap-1.5 bg-zinc-900/60 px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 font-semibold border border-zinc-800 hover:border-zinc-700 transition-colors"><Users size={12} className="text-blue-400" />{students?.length?.toLocaleString() ?? 0}</span>
                        <span className="inline-flex items-center gap-1.5 bg-zinc-900/60 px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 font-semibold border border-zinc-800 hover:border-zinc-700 transition-colors"><IndianRupee size={12} className="text-emerald-400" />{course?.price?.toLocaleString() ?? 0}</span>
                        <span className="inline-flex items-center gap-1.5 bg-zinc-900/60 px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 font-semibold border border-zinc-800 hover:border-zinc-700 transition-colors"><Star size={12} className="text-yellow-400 fill-yellow-400" /><CourseRating courseId={course?.id} /></span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-zinc-900/40 rounded-xl p-3 border border-zinc-800/80 group-hover:border-zinc-700/80 transition-colors relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-1.5 relative z-10"><Eye size={14} className="text-blue-400" /><span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Views</span></div>
                            <p className="text-lg sm:text-xl font-extrabold text-white relative z-10 leading-none">{totalViews?.toLocaleString()}</p>
                            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-1/4 translate-y-1/4"><Eye size={48} /></div>
                        </div>
                        <div className="bg-zinc-900/40 rounded-xl p-3 border border-zinc-800/80 group-hover:border-zinc-700/80 transition-colors relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-1.5 relative z-10"><Target size={14} className="text-emerald-400" /><span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Lecture</span></div>
                            <p className="text-lg sm:text-xl font-extrabold text-white relative z-10 leading-none">{lectureData?.length?.toLocaleString() ?? 0}</p>
                            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-1/4 translate-y-1/4"><Target size={48} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InstructorDashboardCourseCard