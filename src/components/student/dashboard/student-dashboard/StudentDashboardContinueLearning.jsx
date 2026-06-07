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
    <div className="rounded-xl bg-[#111] border border-white/8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/25 flex items-center justify-center">
            <Play size={14} className="text-purple-400" fill="currentColor" />
          </div>
          <h2 className="text-sm font-semibold text-white">Continue Learning</h2>
        </div>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-user-course"))}
          className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer"
        >
          View All <ArrowRight size={12} />
        </button>
      </div>

      {/* Course List */}
      <div className="p-5 space-y-3">
        {isPurchaseLoading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-purple-500 animate-spin" />
            <p className="text-xs text-white/30">Loading your courses...</p>
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