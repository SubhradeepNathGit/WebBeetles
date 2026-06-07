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
    getPurchaseData?.flatMap(order => (order.purchase_items ?? []).map(item => item.courses)) || [],
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
      certificatesEarned: purchaseItems.filter(p => p?.is_exam_completed).length,
    };
  }, [purchaseItems, courseProgressMap]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statConfig.map(({ icon: Icon, label, key, iconColor, bg, border }) => (
        <div
          key={key}
          className={`rounded-xl bg-[#111] border ${border} px-5 py-5
            hover:bg-[#161616] transition-colors cursor-default`}
        >
          <div className={`w-9 h-9 rounded-lg ${bg} border ${border}
            flex items-center justify-center mb-4`}>
            <Icon size={17} className={iconColor} />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats[key] ?? 0}</p>
          <p className="text-xs text-white/40">{label}</p>
        </div>
      ))}
    </div>
  );
};

export default StudentDashboardStats;
