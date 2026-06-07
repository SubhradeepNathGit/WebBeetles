import React from 'react';
import { formatDateByHHAndDay } from '../../../../util/timeFormat/timeFormat';
import { Award, Play, Target, Trophy, Star, AlarmClock } from "lucide-react";
import { useCourseDetails } from '../../../../tanstack/query/fetchSpecificCourseDetails';

const activityConfig = {
  completed:   { icon: Award,      text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  Enrollment:  { icon: Play,       text: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20" },
  certificate: { icon: Trophy,     text: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20" },
  review:      { icon: Star,       text: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/20" },
  question:    { icon: Target,     text: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20" },
  default:     { icon: AlarmClock, text: "text-purple-400",  bg: "bg-purple-500/10",  border: "border-purple-500/20" },
};

const getActivityConfig = (title = '') => {
  if (title.includes('completed')) return activityConfig.completed;
  if (title.includes('Enrollment')) return activityConfig.Enrollment;
  if (title.includes('certificate')) return activityConfig.certificate;
  if (title.includes('review')) return activityConfig.review;
  if (title.includes('question')) return activityConfig.question;
  return activityConfig.default;
};

const StudentActivityCard = ({ activity }) => {
  const { data } = useCourseDetails(activity?.course_id);
  const cfg = getActivityConfig(activity?.title);
  const Icon = cfg.icon;

  return (
    <div className="group flex items-center gap-3 p-2.5 rounded-lg border border-transparent hover:bg-white/4 hover:border-white/8 transition-all duration-200 cursor-default">
      {/* Icon */}
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border transition-transform group-hover:scale-105 ${cfg.bg} ${cfg.border}`}>
        <Icon size={15} className={cfg.text} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white truncate mb-0.5">{activity?.message ?? 'N/A'}</p>
        <p className="text-[10px] text-white/40 truncate">{data?.title ?? ''}</p>
      </div>

      {/* Timestamp */}
      <span className="text-[10px] text-white/30 whitespace-nowrap flex-shrink-0">
        {formatDateByHHAndDay(activity?.created_at)}
      </span>
    </div>
  );
};

export default StudentActivityCard;