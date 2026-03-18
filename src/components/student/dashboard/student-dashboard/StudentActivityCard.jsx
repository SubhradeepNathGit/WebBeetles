import React from 'react'
import { formatDateByHHAndDay } from '../../../../util/timeFormat/timeFormat';
import { Award, Play, Target, Trophy, Loader2, Star, AlarmClock } from "lucide-react";
import { useCourseDetails } from '../../../../tanstack/query/fetchSpecificCourseDetails';

const StudentActivityCard = ({ activity }) => {

    const { isLoading, data, error } = useCourseDetails(activity?.course_id);

    const activityIcons = (title) => {
        if (title.includes('completed')) return <Award size={16} className="text-green-400" />
        else if (title.includes('Enrollment')) return <Play size={16} className="text-blue-400" />
        else if (title.includes('certificate')) return <Trophy size={16} className="text-yellow-600" />
        else if (title.includes('review')) return <Star size={16} className="text-yellow-400" />
        else if (title.includes('question')) return <Target size={16} className="text-red-400" />
        else return <AlarmClock size={16} className="text-blue-700" />
    };

    return (
        <div key={activity?.id} className="flex items-start gap-4 pb-4 border-b border-white/10 last:border-0 last:pb-0 hover:bg-white/5 p-3 rounded-xl transition-all">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
                {activityIcons(activity?.title)}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white mb-1">{activity?.message ?? 'N/A'}</p>
                <p className="text-xs text-purple-200">{data?.title ?? 'N/A'}</p>
            </div>
            <span className="text-xs text-purple-300 whitespace-nowrap">{formatDateByHHAndDay(activity?.created_at)}</span>
        </div>
    )
}

export default StudentActivityCard