import React, { useEffect } from 'react'
import { BarChart3, CheckCircle2, Loader2, MessageSquare, Star, Users } from 'lucide-react'
import InstructorRecentActivityCard from './InstructorRecentActivityCard'
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivityRequest } from '../../../../redux/slice/activitySlice';
import getSweetAlert from '../../../../util/alert/sweetAlert';

const InstructorRecentActivity = ({ instructorDetails }) => {

    const dispatch = useDispatch();
    const { isActivityLoading, activityList, hasActivityError } = useSelector(state => state.activity);

    useEffect(() => {
        dispatch(fetchActivityRequest({ viewer_type: 'instructor', instructor_id: instructorDetails?.id }))
            .then(res => {
                // console.log('Response for fetching activity', res);
            })
            .catch(err => {
                // console.log('Error occured', res);
                getSweetAlert("Error", "Something went wrong!", "error");
            })
    }, [dispatch]);

    return (
        <div className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-5 lg:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6 flex items-center gap-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-purple-500/30 flex items-center justify-center border border-purple-400/30"><BarChart3 size={18} className="text-purple-300" /></div>
                Recent Activity
            </h2>
            <div className="space-y-2 sm:space-y-3">
                {isActivityLoading ? (
                    <Loader2 className='w-8 h-8 animate-spin' />
                ) : (
                    activityList?.length > 0 ? activityList?.slice(0, 8)?.map(activity => (
                        <InstructorRecentActivityCard key={activity?.id} activity={activity} />
                    )) : <p className='text-center'>No activity available</p>
                )}
            </div>
        </div>
    )
}

export default InstructorRecentActivity