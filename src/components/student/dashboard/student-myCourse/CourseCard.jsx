import React from 'react'
import { Play, Clock } from 'lucide-react';
import { useCourseDetails } from '../../../../tanstack/query/fetchSpecificCourseDetails';
import CourseRating from './rating-review/CourseRating';
import { useCourseVideos } from '../../../../tanstack/query/fetchLectureVideo';
import { formatToHHMMSS } from '../../../../util/timeFormat/timeFormat';
import { useLectureProgress } from '../../../../tanstack/query/fetchVideoProgressDetails';

const CourseCard = ({ course, setSelectedCourse, userData }) => {

    const { isLoading: isCourseDetailsLoading, data: courseDetails, error: hasCourseDetailsError } = useCourseDetails(course?.id);
    const { isLoading, data: lectureData, error } = useCourseVideos({ courseId: course?.id });
    const { isLoading: isCourseProgressLoading, data: progressData, error: hasCourseProgressError } = useLectureProgress({ student_id: userData?.id, course_id: course?.id });

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

    // console.log('Course details', course, courseDetails);
    // console.log('Course progress details', progressData);

    return (
        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-600 transition-all group">
            <div className="relative h-48 overflow-hidden">
                <img src={courseDetails?.thumbnail} alt={courseDetails?.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-sm text-white/80">
                    <Clock className="w-4 h-4" />
                    <span>{totalLectureTiming}</span>
                    <span>•</span>
                    <span>{courseDetails?.category?.name ?? 'N/A'}</span>
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{courseDetails?.title ?? 'N/A'}</h3>
                <p className="text-gray-400 text-sm mb-4">by {courseDetails?.instructor?.name ?? 'N/A'}</p>
                <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span><CourseRating courseId={course?.id} /></span>
                    </div>
                    <span className="text-gray-600">|</span>
                    <span className="text-gray-400">{completedCourse?.length ?? 0}/{lectureData?.length ?? 0} completed</span>
                </div>
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="font-semibold text-purple-400">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>
                <button onClick={() => setSelectedCourse(course)} className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <Play className="w-4 h-4" />
                    Continue Learning
                </button>
            </div>
        </div>
    )
}

export default CourseCard