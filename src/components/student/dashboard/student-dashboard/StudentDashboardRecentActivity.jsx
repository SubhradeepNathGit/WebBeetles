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
    <div className="relative rounded-2xl bg-black border border-white/[0.08] overflow-hidden hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/25 flex items-center justify-center">
          <BarChart3 size={14} className="text-blue-400" />
        </div>
        <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
      </div>

      <div className="p-5">
        {isActivityLoading ? (
          <div className="space-y-2.5 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center gap-3 p-2.5 rounded-lg border border-transparent bg-transparent">
                {/* Icon skeleton */}
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex-shrink-0" />
                {/* Text lines skeletons */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="h-3.5 w-2/3 rounded bg-white/5" />
                  <div className="h-2.5 w-1/2 rounded bg-white/5" />
                </div>
                {/* Time skeleton */}
                <div className="h-3 w-10 rounded bg-white/5 flex-shrink-0" />
              </div>
            ))}
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