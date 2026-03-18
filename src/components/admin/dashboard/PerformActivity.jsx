import React, { useEffect } from 'react'
import { Activity, BookOpenCheck, ClipboardCheck, DollarSign, Users } from 'lucide-react'
import SectionHeader from './common/sectionHeader'
import { useDispatch, useSelector } from 'react-redux'
import { fetchActivityRequest } from '../../../redux/slice/activitySlice'
import { formatDateByHHAndDay } from '../../../util/timeFormat/timeFormat'

const PerformActivity = () => {

    const dispatch = useDispatch()
    const { isActivityLoading, activityList } = useSelector(state => state?.activity)

    useEffect(() => {
        dispatch(fetchActivityRequest())
    }, [dispatch])

    const getActivityIcon = (title) => {
        switch (title) {
            case "New Enrollment":
                return <Users size={14} className="text-purple-400" />;
            case "Submit review":
                return <ClipboardCheck size={14} className="text-yellow-400" />;
            case "Course Approved":
                return <BookOpenCheck size={14} className="text-green-400" />;
            case "Payment Success":
                return <DollarSign size={14} className="text-yellow-500" />;
            default:
                return <Activity size={14} className="text-gray-500" />;
        }
    };

    return (
        <div className="bg-[#111] p-5 rounded-2xl border border-white/5 shadow-xl">
            <SectionHeader title="Platform Activity" />

            <div className="space-y-3">
                {isActivityLoading ? (
                    <p className="text-xs text-gray-500">Loading activity...</p>
                ) : activityList?.length === 0 ? (
                    <p className="text-xs text-gray-500">No recent activity</p>
                ) : (
                    activityList?.filter(item => item.viewer_type == 'all')?.map(item => (
                        <div
                            key={item?.id}
                            className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0"
                        >
                            {/* Icon */}
                            <div className="mt-0.5 flex-shrink-0">
                                {getActivityIcon(item?.title)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-300 leading-snug">
                                    {item.message}
                                </p>
                                <p className="text-xs text-gray-600 mt-0.5">
                                    {formatDateByHHAndDay(item?.created_at)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default PerformActivity