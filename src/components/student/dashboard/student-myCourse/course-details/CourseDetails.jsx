import React from 'react'
import { formatToHHMMSS } from '../../../../../util/timeFormat/timeFormat';
import { Award, BookOpen, Clock } from 'lucide-react';
import CourseRating from '../rating-review/CourseRating';
import { useLectureProgress } from '../../../../../tanstack/query/fetchVideoProgressDetails';

const CourseDetails = ({ selectedCourse, lectureData, userAuthData, isCompleted, onViewCertificate }) => {

    const { isLoading, data: progressData, error } = useLectureProgress({ student_id: userAuthData?.id, course_id: selectedCourse?.id });

    const totalSeconds = lectureData?.reduce((acc, value) => acc + Number(value?.duration || 0), 0) || 0;
    const totalLectureTiming = formatToHHMMSS(totalSeconds);
    const completedCourse = progressData?.filter(course => course?.completed);

    const calculateCourseProgress = () => {
        if (!lectureData?.length) return 0;
        const percent = Math.floor(((completedCourse?.length || 0) / lectureData.length) * 100);
        return percent > 100 ? 100 : percent;
    };

    const progressPercent = calculateCourseProgress();

    return (
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-6 w-full">
            <div className="flex-1 w-full">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 break-words">{selectedCourse?.title ?? 'N/A'}</h1>
                <p className="text-base sm:text-lg text-gray-400 mb-4">by {selectedCourse?.instructor?.name ?? 'N/A'}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                    {[
                        { icon: Clock, text: totalLectureTiming, color: 'text-purple-400' },
                        { icon: BookOpen, text: `${lectureData?.length} Lesson${lectureData?.length > 1 ? 's' : ''}`, color: 'text-indigo-400' },
                        { icon: Award, text: 'Certificate Available', color: 'text-pink-400' }
                    ]?.map((item, i) => (
                        <span key={i} className="flex items-center gap-2 bg-[#0d0d10] border border-[#1c1c1f] py-1.5 px-3 rounded-full shadow-sm">
                            <item.icon className={`w-3.5 h-3.5 flex-shrink-0 ${item.color}`} />
                            <span className="font-medium">{item?.text ?? 0}</span>
                        </span>
                    ))}
                </div>
            </div>

            <div className="w-full lg:w-auto bg-[#0a0a0c] rounded-xl p-6 border border-[#1c1c1f] lg:min-w-[320px]">
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Course Progress</span>
                        <span className="font-semibold text-purple-400">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-[#141416] rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-[#141416] border border-[#1c1c1f] rounded-lg p-3">
                        <div className="text-gray-400 mb-1 text-xs">Completed</div>
                        <div className="font-semibold text-base sm:text-lg">{completedCourse?.length ?? 0}/{lectureData?.length ?? 0}</div>
                    </div>
                    <div className="bg-[#141416] border border-[#1c1c1f] rounded-lg p-3">
                        <div className="text-gray-400 mb-1 text-xs">Rating</div>
                        <div className="font-semibold text-base sm:text-lg flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <CourseRating courseId={selectedCourse?.id} />
                        </div>
                    </div>
                </div>

                {isCompleted && (
                    <button
                        onClick={onViewCertificate}
                        className="w-full mt-4 py-3 bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40 hover:text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] rounded-xl font-semibold tracking-wide text-sm transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Award className="w-4.5 h-4.5 text-purple-400" />
                        <span>View Certificate</span>
                    </button>
                )}
            </div>
        </div>
    )
}

export default CourseDetails