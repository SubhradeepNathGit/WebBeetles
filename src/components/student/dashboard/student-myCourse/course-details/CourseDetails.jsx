import React from 'react'
import { formatToHHMMSS } from '../../../../../util/timeFormat/timeFormat';
import { Award, BookOpen, Clock } from 'lucide-react';
import CourseRating from '../rating-review/CourseRating';
import { useLectureProgress } from '../../../../../tanstack/query/fetchVideoProgressDetails';

const CourseDetails = ({ selectedCourse, lectureData, userAuthData }) => {

    const { isLoading, data: progressData, error } = useLectureProgress({ student_id: userAuthData?.id, course_id: selectedCourse?.id });

    const totalSeconds = lectureData?.reduce((acc, value) => acc + Number(value?.duration || 0), 0) || 0;
    const totalLectureTiming = formatToHHMMSS(totalSeconds);
    const completedCourse = progressData?.filter(course => course?.completed);

    const watchedSeconds = progressData?.reduce((acc, v) => acc + Math.min(v.watched_seconds || 0, v.total_seconds || 0), 0) || 0;

    const calculateCourseProgress = () => {
        if (!totalSeconds) return 0;

        const raw = (watchedSeconds / totalSeconds) * 100;
        if (raw >= 100) {
            if (!selectedCourse?.is_completed) return 99;
            return 100;
        }
        return Math.floor(raw);
    };

    const progressPercent = calculateCourseProgress();

    return (
        <div className="flex items-start justify-between mb-6">
            <div>
                <h1 className="text-4xl font-bold mb-3">{selectedCourse?.title ?? 'N/A'}</h1>
                <p className="text-lg text-gray-400 mb-4">by {selectedCourse?.instructor?.name ?? 'N/A'}</p>
                <div className="flex items-center gap-6 text-sm text-gray-400">
                    {[
                        { icon: Clock, text: totalLectureTiming },
                        { icon: BookOpen, text: `${lectureData?.length} Lesson${lectureData?.length > 1 ? 's' : ''}` },
                        { icon: Award, text: 'Certificate Available' }
                    ]?.map((item, i) => (
                        <span key={i} className="flex items-center gap-2">
                            <item.icon className="w-4 h-4" />
                            {item?.text ?? 0}
                        </span>
                    ))}
                </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 min-w-[280px]">
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Course Progress</span>
                        <span className="font-semibold text-purple-400">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-gray-400 mb-1">Completed</div>
                        <div className="font-semibold text-lg">{completedCourse?.length ?? 0}/{lectureData?.length ?? 0}</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-gray-400 mb-1">Rating</div>
                        <div className="font-semibold text-lg flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <CourseRating courseId={selectedCourse?.id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseDetails