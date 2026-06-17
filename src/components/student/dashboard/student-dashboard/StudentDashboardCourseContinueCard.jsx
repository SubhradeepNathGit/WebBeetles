import React from 'react';
import { Clock, Play, Star, Users, ChevronRight } from "lucide-react";
import { useCourseDetails } from '../../../../tanstack/query/fetchSpecificCourseDetails';
import { useCourseVideos } from '../../../../tanstack/query/fetchLectureVideo';
import { formatToHHMMSS } from '../../../../util/timeFormat/timeFormat';
import CourseRating from '../student-myCourse/rating-review/CourseRating';
import { useCoursePurchases } from '../../../../tanstack/query/fetchCoursePurchase';
import { useLectureProgress } from '../../../../tanstack/query/fetchVideoProgressDetails';

const StudentDashboardCourseContinueCard = ({ course, userAuthData }) => {
  const { data: courseDetails } = useCourseDetails(course?.id);
  const { data: lectureData } = useCourseVideos({ courseId: course?.id });
  const { data: students } = useCoursePurchases(course?.id);
  const { data: progressData } = useLectureProgress({ student_id: userAuthData?.id, course_id: course?.id });

  const totalSeconds = lectureData?.reduce((acc, v) => acc + Number(v?.duration || 0), 0) || 0;
  const totalLectureTiming = formatToHHMMSS(totalSeconds);

  const completedLectures = progressData?.filter(p => p?.completed)?.length ?? 0;

  const progressPercent = lectureData?.length
    ? (() => {
        const percent = Math.floor((completedLectures / lectureData.length) * 100);
        return percent > 100 ? 100 : percent;
      })()
    : 0;

  const progressColor = progressPercent === 100 ? "bg-emerald-500" : progressPercent >= 50 ? "bg-purple-500" : "bg-blue-500";
  const progressTextColor = progressPercent === 100 ? "text-emerald-500" : progressPercent >= 50 ? "text-purple-500" : "text-blue-500";

  const handleOpenCourse = () => {
    sessionStorage.setItem('openSpecificCourse', JSON.stringify(course));
    window.dispatchEvent(new CustomEvent("open-user-course"));
  };

  return (
    <div 
      onClick={handleOpenCourse}
      className="group relative flex w-full max-w-full min-w-0 cursor-pointer flex-col gap-3 overflow-hidden rounded-lg border border-white/8 bg-transparent p-3 transition-all duration-200 hover:bg-white/4 sm:flex-row sm:gap-4 sm:p-4"
    >
      
      {/* Thumbnail */}
      <div className="relative w-full flex-shrink-0 overflow-hidden rounded-md border border-white/10 aspect-video sm:w-36 sm:aspect-none sm:h-24">
        <img
          src={course?.thumbnail}
          alt={course?.title}
          className="w-full h-full object-cover"
        />
        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
            <Play size={14} className="text-white ml-0.5" fill="white" />
          </div>
        </div>
        {/* Progress pill on thumbnail */}
        <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded border border-black/20 bg-black/80 ${progressTextColor} backdrop-blur-sm`}>
          {progressPercent}%
        </div>
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <h3 className="mb-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-white transition-colors group-hover:text-purple-300">
          {course?.title ?? 'N/A'}
        </h3>
        <p className="mb-3 truncate text-xs text-white/40">
          by {courseDetails?.instructor?.name ?? 'N/A'}
        </p>

        {/* Meta row */}
        <div className="mb-3 flex max-w-full flex-wrap items-center gap-2 text-xs">
          <span className="flex min-w-0 items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-1 text-white/60">
            <Star size={12} className="text-amber-400" fill="#fbbf24" />
            <CourseRating courseId={courseDetails?.id} />
          </span>
          <span className="flex min-w-0 items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-1 text-white/60">
            <Users size={12} className="text-purple-400" />
            {students?.length ?? 0}
          </span>
          <span className="flex min-w-0 items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-1 text-white/60">
            <Clock size={12} className="text-blue-400" />
            {totalLectureTiming}
          </span>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-white/40">
              {completedLectures}/{lectureData?.length ?? 0} lessons
            </span>
            <span className={`font-bold ${progressTextColor}`}>{progressPercent}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-black/60 border border-white/10 overflow-hidden backdrop-blur-md shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{ 
                width: `${progressPercent}%`,
                boxShadow: progressColor.includes('emerald') ? '0 0 10px rgba(16,185,129,0.5)' : progressColor.includes('purple') ? '0 0 10px rgba(168,85,247,0.5)' : '0 0 10px rgba(59,130,246,0.5)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Arrow indicator */}
      <div className="hidden sm:flex items-center self-center opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight size={18} className="text-white/30 group-hover:text-white/60" />
      </div>
    </div>
  );
};

export default StudentDashboardCourseContinueCard;
