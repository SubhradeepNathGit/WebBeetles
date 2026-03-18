import React, { useEffect, useState } from 'react'
import { BarChart3, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivityRequest } from '../../../../redux/slice/activitySlice';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import StudentActivityCard from './StudentActivityCard';

const StudentDashboardRecentActivity = ({ studentDetails }) => {

    const dispatch = useDispatch();
    const { isActivityLoading, activityList, hasActivityError } = useSelector(state => state.activity);

    useEffect(() => {
        dispatch(fetchActivityRequest({ student_id: studentDetails?.id }))
            .then(res => {
                // console.log('Response for fetching activity', res);
            })
            .catch(err => {
                // console.log('Error occured', res);
                getSweetAlert("Error", "Something went wrong!", "error");
            })
    }, [dispatch]);

    return (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><BarChart3 size={28} className="text-purple-300" />Recent Activity</h2>
            <div className="space-y-4">
                {isActivityLoading ? (
                    <Loader2 className='w-8 h-8 animate-spin' />
                ) : (
                    activityList?.length > 0 ? activityList?.slice(0, 6)?.map(activity => (
                        <StudentActivityCard key={activity?.id} activity={activity} />
                    )) : <p className='text-center'>No activity available</p>
                )}
            </div>
        </div>
    )
}

export default StudentDashboardRecentActivity