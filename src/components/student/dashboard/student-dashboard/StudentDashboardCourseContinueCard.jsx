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
  const watchedSeconds = progressData?.reduce((acc, v) => acc + Math.min(v.watched_seconds || 0, v.total_seconds || 0), 0) || 0;

  const progressPercent = totalSeconds
    ? (() => {
        const raw = (watchedSeconds / totalSeconds) * 100;
        if (raw >= 100) return courseDetails?.is_completed ? 100 : 99;
        return Math.floor(raw);
      })()
    : 0;

  const progressColor = progressPercent === 100 ? "bg-emerald-500" : progressPercent >= 50 ? "bg-purple-500" : "bg-blue-500";
  const progressTextColor = progressPercent === 100 ? "text-emerald-500" : progressPercent >= 50 ? "text-purple-500" : "text-blue-500";

  return (
    <div className="group relative rounded-lg bg-transparent border border-white/8 hover:bg-white/4 p-4 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col sm:flex-row gap-4">
      
      {/* Thumbnail */}
      <div className="relative flex-shrink-0">
        <img
          src={course?.thumbnail}
          alt={course?.title}
          className="w-full sm:w-36 h-28 sm:h-24 rounded-md object-cover border border-white/10"
        />
        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-black/60 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="font-semibold text-white text-sm mb-1 line-clamp-1 group-hover:text-purple-300 transition-colors">
          {course?.title ?? 'N/A'}
        </h3>
        <p className="text-xs text-white/40 mb-3">
          by {courseDetails?.instructor?.name ?? 'N/A'}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
          <span className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white/60">
            <Star size={12} className="text-amber-400" fill="#fbbf24" />
            <CourseRating courseId={courseDetails?.id} />
          </span>
          <span className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white/60">
            <Users size={12} className="text-purple-400" />
            {students?.length ?? 0}
          </span>
          <span className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white/60">
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
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${progressPercent}%` }}
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