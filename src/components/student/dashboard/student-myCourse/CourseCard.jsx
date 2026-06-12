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

    const calculateCourseProgress = () => {
        if (!lectureData?.length) return 0;
        const percent = Math.floor(((completedCourse?.length || 0) / lectureData.length) * 100);
        return percent > 100 ? 100 : percent;
    };

    const progressPercent = calculateCourseProgress();

    // console.log('Course details', course, courseDetails);
    // console.log('Course progress details', progressData);

    return (
        <div className="h-full bg-[#0a0a0c] rounded-2xl overflow-hidden border border-[#1c1c1f] hover:border-purple-500/30 shadow-lg hover:shadow-[0_8px_30px_rgb(168,85,247,0.1)] transition-all duration-300 group hover:-translate-y-1 flex flex-col">
            <div className="relative h-48 overflow-hidden">
                <img src={courseDetails?.thumbnail} alt={courseDetails?.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-xs font-medium text-white/90">
                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        <span>{totalLectureTiming}</span>
                    </div>
                    <div className="bg-purple-500/20 text-purple-200 backdrop-blur-md px-2.5 py-1 rounded-full border border-purple-500/20">
                        {courseDetails?.category?.name ?? 'N/A'}
                    </div>
                </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">{courseDetails?.title ?? 'N/A'}</h3>
                <p className="text-gray-400 text-sm mb-5 font-medium">by <span className="text-gray-300">{courseDetails?.instructor?.name ?? 'N/A'}</span></p>
                
                <div className="flex items-center gap-3 mb-6 text-sm mt-auto">
                    <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-md border border-[#1c1c1f] font-semibold text-gray-200">
                        <span className="text-purple-400 font-medium">Rating:</span>
                        <CourseRating courseId={course?.id} />
                    </div>
                    <span className="text-gray-700">•</span>
                    <span className="text-gray-400 font-medium bg-black/40 px-2.5 py-1 rounded-md border border-[#1c1c1f]">
                        <span className="text-white">{completedCourse?.length ?? 0}</span> / {lectureData?.length ?? 0} modules
                    </span>
                </div>
                
                <div className="mb-6">
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-400 font-medium">Progress</span>
                        <span className="font-bold text-purple-400">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-black/60 border border-white/10 rounded-full h-1.5 overflow-hidden backdrop-blur-md shadow-inner">
                        <div 
                            className="bg-purple-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(168,85,247,0.6)]" 
                            style={{ width: `${progressPercent}%` }} 
                        />
                    </div>
                </div>
                
                <button onClick={() => setSelectedCourse(course)} className="w-full py-3.5 bg-[#0d0d10] text-[#eaeaea] border border-[#2e2e35] hover:bg-[#15151a] hover:border-[#42424c] hover:text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer group/btn shadow-sm">
                    <Play className="w-4 h-4 fill-current relative z-10 group-hover/btn:scale-110 transition-transform group-hover/btn:text-purple-400" />
                    <span className="relative z-10 tracking-wide">Continue Learning</span>
                </button>
            </div>
        </div>
    )
}

export default CourseCard