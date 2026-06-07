import React, { useEffect } from 'react';
import { BarChart3, ActivityIcon } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivityRequest } from '../../../../redux/slice/activitySlice';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import StudentActivityCard from './StudentActivityCard';

const StudentDashboardRecentActivity = ({ studentDetails }) => {
  const dispatch = useDispatch();
  const { isActivityLoading, activityList } = useSelector(state => state.activity);

  useEffect(() => {
    dispatch(fetchActivityRequest({ student_id: studentDetails?.id })).catch(() =>
      getSweetAlert("Error", "Something went wrong!", "error")
    );
  }, [dispatch]);

  return (
    <div className="rounded-xl bg-[#111] border border-white/8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
        <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/25 flex items-center justify-center">
          <BarChart3 size={14} className="text-blue-400" />
        </div>
        <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
      </div>

      <div className="p-5">
        {isActivityLoading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin" />
            <p className="text-xs text-white/30">Loading activity...</p>
          </div>
        ) : activityList?.length > 0 ? (
          <div className="space-y-1">
            {activityList.slice(0, 6).map(activity => (
              <StudentActivityCard key={activity?.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center">
              <ActivityIcon size={20} className="text-white/20" />
            </div>
            <div className="text-center">
              <p className="text-sm text-white/60 font-medium mb-1">No recent activity</p>
              <p className="text-xs text-white/30">Start learning to see your activity here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboardRecentActivity;