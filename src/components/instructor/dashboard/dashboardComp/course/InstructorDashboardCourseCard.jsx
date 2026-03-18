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

    return (
        <div className="group bg-white/5 rounded-xl p-3 sm:p-4 hover:bg-white/15 transition-all border border-white/10 hover:border-white/30 hover:shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="relative flex-shrink-0">
                    <img src={course?.thumbnail} alt={course?.title} className="w-full sm:w-32 lg:w-40 h-24 sm:h-24 lg:h-28 rounded-lg object-cover ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
                    <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-md shadow-lg ${statusColor}`}>{status}</div>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm sm:text-base lg:text-lg mb-2 group-hover:text-blue-200 transition-colors line-clamp-2">{course?.title?.length > 30 ? course?.title?.slice(0, 30)?.toUpperCase() + '...' : course?.title?.toUpperCase() ?? 'N/A'}</h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 bg-blue-500/20 px-2 py-1 rounded-md text-xs text-purple-200 font-medium border border-white/10"><Users size={12} />{students?.length?.toLocaleString() ?? 0}</span>
                        <span className="inline-flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-md text-xs text-purple-200 font-medium border border-white/10"><IndianRupee size={12} />{course?.price?.toLocaleString() ?? 0}</span>
                        <span className="inline-flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-md text-xs text-purple-200 font-medium border border-white/10"><Star size={12} className="text-yellow-400 fill-yellow-400" /><CourseRating courseId={course?.id} /></span>
                        {/* <span className="inline-flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-md border border-green-400/30 text-green-300 text-xs font-bold"><TrendingUp size={12} />{course?.trend??0}</span> */}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/10 rounded-lg p-2 sm:p-2.5 border border-white/20">
                            <div className="flex items-center gap-1.5 mb-1"><Eye size={12} className="text-blue-400" /><span className="text-xs text-purple-200 font-medium">Views</span></div>
                            <p className="text-base sm:text-lg font-bold text-white">{totalViews?.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2 sm:p-2.5 border border-white/20">
                            <div className="flex items-center gap-1.5 mb-1"><Target size={12} className="text-green-400" /><span className="text-xs text-purple-200 font-medium">Lecture</span></div>
                            <p className="text-base sm:text-lg font-bold text-white">{lectureData?.length?.toLocaleString() ?? 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InstructorDashboardCourseCard