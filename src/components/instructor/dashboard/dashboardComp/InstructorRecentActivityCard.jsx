import React from 'react'
import { AlarmClock, CheckCircle2, MessageSquare, Star, Users } from 'lucide-react'
import { useCourseDetails } from '../../../../tanstack/query/fetchSpecificCourseDetails';
import { formatDateByHHAndDay } from '../../../../util/timeFormat/timeFormat';
import { useStudentDetails } from '../../../../tanstack/query/fetchSpecificStudentDetails';

const InstructorRecentActivityCard = ({ activity }) => {

    const { data: courseData } = useCourseDetails(activity?.course_id);
    const { data: studentData } = useStudentDetails(activity?.student_id);

    const activityIcons = (title) => {
        if (title.includes('completed')) return <CheckCircle2 size={16} className="text-green-400" />
        else if (title.includes('Enrollment')) return <Users size={16} className="text-blue-400" />
        else if (title.includes('review')) return <Star size={16} className="text-yellow-400" />
        else if (title.includes('question')) return <MessageSquare size={16} className="text-red-400" />
        else return <AlarmClock size={16} className="text-blue-700" />
    };

    return (
        <div className="flex items-center gap-2 sm:gap-3 pb-2 sm:pb-3 border-b border-white/10 last:border-0 last:pb-0 hover:bg-white/5 p-2 sm:p-3 rounded-lg transition-all group">
            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform flex-shrink-0">{activityIcons(activity?.title)}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-bold text-white mb-0.5 truncate">{studentData?.name ?? 'N/A'}</p>
                <p className="text-xs text-purple-200 truncate">{activity?.message ?? 'N/A'} • {courseData?.title ?? 'N/A'}</p>
            </div>
            <span className="text-xs text-purple-300 whitespace-nowrap">{formatDateByHHAndDay(activity?.created_at)}</span>
        </div>
    )
}

export default InstructorRecentActivityCard