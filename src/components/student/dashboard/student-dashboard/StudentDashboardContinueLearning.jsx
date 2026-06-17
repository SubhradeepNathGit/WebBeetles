import React, { useEffect } from 'react';
import { Play, ArrowRight, BookOpen } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserPurchase } from '../../../../redux/slice/purchaseSlice';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import StudentDashboardCourseContinueCard from './StudentDashboardCourseContinueCard';

const StudentDashboardContinueLearning = () => {
  const dispatch = useDispatch();
  const { userAuthData } = useSelector(state => state.checkAuth);
  const { isPurchaseLoading, getPurchaseData } = useSelector(state => state.purchase);

  const purchaseItems = getPurchaseData?.flatMap(order =>
    order.purchase_items.map(item => item?.courses)
  ) || [];

  useEffect(() => {
    if (userAuthData) {
      dispatch(fetchUserPurchase({ userId: userAuthData?.id, status: 'paid' })).catch(() =>
        getSweetAlert('Oops...', 'Something went wrong!', 'error')
      );
    }
  }, [userAuthData]);

  return (
    <div className="relative w-full max-w-full min-w-0 rounded-2xl bg-black border border-white/[0.08] overflow-hidden hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 group">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-purple-600/20 border border-purple-500/25 flex items-center justify-center">
            <Play size={14} className="text-purple-400" fill="currentColor" />
          </div>
          <h2 className="truncate text-sm font-semibold text-white">Continue Learning</h2>
        </div>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-user-course"))}
          className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer"
        >
          View All <ArrowRight size={12} />
        </button>
      </div>

      {/* Course List */}
      <div className="space-y-3 p-4 sm:p-5">
        {isPurchaseLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2].map((n) => (
              <div key={n} className="flex min-w-0 flex-col gap-4 p-3 sm:flex-row sm:p-4 border border-white/5 rounded-lg bg-transparent">
                {/* Thumbnail skeleton */}
                <div className="w-full sm:w-36 h-28 sm:h-24 rounded-md bg-white/5 flex-shrink-0" />
                {/* Text lines skeletons */}
                <div className="flex-1 min-w-0 flex flex-col justify-center space-y-3">
                  <div className="h-4 w-3/4 rounded bg-white/5" />
                  <div className="h-3 w-1/3 rounded bg-white/5" />
                  <div className="flex gap-2">
                    <div className="h-5 w-12 rounded bg-white/5" />
                    <div className="h-5 w-10 rounded bg-white/5" />
                    <div className="h-5 w-16 rounded bg-white/5" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <div className="h-3 w-16 rounded bg-white/5" />
                      <div className="h-3 w-8 rounded bg-white/5" />
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : purchaseItems?.length > 0 ? (
          purchaseItems.slice(0, 3).map(course => (
            <StudentDashboardCourseContinueCard key={course?.id} course={course} userAuthData={userAuthData} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center">
              <BookOpen size={20} className="text-white/20" />
            </div>
            <div className="text-center">
              <p className="text-sm text-white/60 font-medium mb-1">No courses enrolled yet</p>
              <p className="text-xs text-white/30">Browse courses to start your learning journey</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboardContinueLearning;
