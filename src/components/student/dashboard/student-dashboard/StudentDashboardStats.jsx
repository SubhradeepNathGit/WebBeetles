import React, { useEffect, useMemo } from 'react';
import { BookOpen, Award, Clock, Target } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserPurchase } from '../../../../redux/slice/purchaseSlice';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import { useLectureProgress } from '../../../../tanstack/query/fetchVideoProgressDetails';

const statConfig = [
  { icon: BookOpen, label: "Courses Enrolled",   key: "coursesEnrolled",  iconColor: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { icon: Award,    label: "Courses Completed",  key: "coursesCompleted", iconColor: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { icon: Clock,    label: "In-Progress",        key: "coursePending",    iconColor: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { icon: Target,   label: "Certificates Earned",key: "certificatesEarned",iconColor: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
];

const StudentDashboardStats = () => {
  const dispatch = useDispatch();
  const { userAuthData }   = useSelector(state => state.checkAuth);
  const { getPurchaseData } = useSelector(state => state.purchase);

  useEffect(() => {
    if (!userAuthData?.id) return;
    dispatch(fetchUserPurchase({ userId: userAuthData.id })).catch(() =>
      getSweetAlert('Oops...', 'Something went wrong!', 'error')
    );
  }, [userAuthData?.id, dispatch]);

  const purchaseItems = useMemo(() =>
    getPurchaseData?.flatMap(order => (order.purchase_items ?? []).map(item => ({
      ...item.courses,
      purchase_item_id: item.id
    }))) || [],
    [getPurchaseData]
  );

  const { data: progressData = [] } = useLectureProgress({ student_id: userAuthData?.id });

  const courseProgressMap = useMemo(() => {
    const map = {};
    progressData.forEach(p => {
      if (!p.course_id) return;
      if (!map[p.course_id]) map[p.course_id] = { watched: 0, total: 0 };
      map[p.course_id].watched += Math.min(p.watched_seconds || 0, p.total_seconds || 0);
      map[p.course_id].total  += p.total_seconds || 0;
    });
    return map;
  }, [progressData]);

  const stats = useMemo(() => {
    let completed = 0;
    purchaseItems.forEach(course => {
      const prog = courseProgressMap[course.id];
      if (prog?.total && Math.floor((prog.watched / prog.total) * 100) >= 100) completed++;
    });
    return {
      coursesEnrolled:   purchaseItems.length,
      coursesCompleted:  completed,
      coursePending:     purchaseItems.length - completed,
      certificatesEarned: completed,
    };
  }, [purchaseItems, courseProgressMap]);

  return (
    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
      {statConfig.map(({ icon: Icon, label, key, iconColor, bg, border }) => (
        <div
          key={key}
          className={`relative rounded-2xl bg-black border border-white/[0.08] p-4 sm:p-6 
            hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 cursor-default group`}
        >
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${bg} border ${border}
            flex items-center justify-center mb-3 sm:mb-5 shadow-inner`}>
            <Icon size={20} className={iconColor} />
          </div>
          <p className="text-4xl font-black text-white mb-1 tracking-tight">{stats[key] ?? 0}</p>
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default StudentDashboardStats;
