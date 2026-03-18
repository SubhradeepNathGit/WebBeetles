import React from 'react'
import { Clock, Play, Star, Users } from "lucide-react";
import { useCourseDetails } from '../../../../tanstack/query/fetchSpecificCourseDetails';
import { useCourseVideos } from '../../../../tanstack/query/fetchLectureVideo';
import { formatToHHMMSS } from '../../../../util/timeFormat/timeFormat';
import CourseRating from '../student-myCourse/rating-review/CourseRating';
import { useCoursePurchases } from '../../../../tanstack/query/fetchCoursePurchase';
import { useLectureProgress } from '../../../../tanstack/query/fetchVideoProgressDetails';

const StudentDashboardCourseContinueCard = ({ course, userAuthData }) => {

    const { isLoading: isCourseDetailsLoading, data: courseDetails, error: hasCourseDetailsError } = useCourseDetails(course?.id);
    const { isLoading, data: lectureData, error } = useCourseVideos({ courseId: course?.id });
    const { data: students, isLoading: isStudentLoading } = useCoursePurchases(course?.id);
    const { isLoading: isCourseProgressLoading, data: progressData, error: hasCourseProgressError } = useLectureProgress({ student_id: userAuthData?.id, course_id: course?.id });

    const totalSeconds = lectureData?.reduce((acc, value) => acc + Number(value?.duration || 0), 0) || 0;
    const totalLectureTiming = formatToHHMMSS(totalSeconds);

    const completedCourse = progressData?.filter(course => course?.completed);

    const watchedSeconds = progressData?.reduce((acc, v) => acc + Math.min(v.watched_seconds || 0, v.total_seconds || 0), 0) || 0;

    const calculateCourseProgress = () => {
        if (!totalSeconds) return 0;

        const raw = (watchedSeconds / totalSeconds) * 100;
        if (raw >= 100) {
            if (!courseDetails?.is_completed) return 99;
            return 100;
        }
        return Math.floor(raw);
    };

    const progressPercent = calculateCourseProgress();

    // console.log('Course details',courseDetails);

    return (
        <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/15 transition-all duration-300 border border-white/10 hover:border-white/30 hover:shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-shrink-0">
                    <img src={course?.thumbnail} alt={course?.title} className="w-full sm:w-40 h-32 sm:h-28 rounded-xl object-cover ring-2 ring-white/20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
                            <Play size={20} className="text-purple-600 ml-1" fill="currentColor" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg mb-2 group-hover:text-purple-200 transition-colors line-clamp-1">{course?.title ?? 'N/A'}</h3>
                    <p className="text-sm text-purple-200 mb-3">by {courseDetails?.instructor?.name ?? 'N/A'}</p>
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs text-purple-200 mb-4">
                        <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg"><Star size={14} className="text-yellow-400" fill="currentColor" /><CourseRating courseId={courseDetails?.id} /></span>
                        <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg"><Users size={14} />{students?.length ?? 0}</span>
                        <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg"><Clock size={14} />{totalLectureTiming}</span>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-purple-200">Progress: {completedCourse?.length ?? 0}/{lectureData?.length ?? 0} lessons</span>
                            <span className="font-bold text-white bg-white/20 px-3 py-1 rounded-lg">{progressPercent}%</span>
                        </div>
                        <div className="h-3 bg-white/20 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-purple-400 via-pink-500 to-purple-500 rounded-full transition-all duration-500 shadow-lg" style={{ width: `${progressPercent}%` }} />
                        </div>
                        <p className="text-xs text-purple-200 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>Category: <span className="font-semibold text-white">{courseDetails?.category?.name ?? 'N/A'}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentDashboardCourseContinueCard