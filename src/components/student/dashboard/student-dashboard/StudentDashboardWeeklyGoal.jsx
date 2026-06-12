import React, { useMemo } from 'react';
import { Target, Flame } from "lucide-react";
import { useSelector } from 'react-redux';
import { useLectureProgress } from '../../../../tanstack/query/fetchVideoProgressDetails';

const StudentDashboardWeeklyGoal = () => {
  const { userAuthData } = useSelector(state => state.checkAuth);
  const { data: progressData } = useLectureProgress({ student_id: userAuthData?.id });

  const weeklyGoal = useMemo(() => {
    if (!progressData || !Array.isArray(progressData)) return { current: 0, target: 15 };

    const now = new Date();
    const day = now.getDay();
    // Calculate Monday of the current week
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); 
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);

    let watchedThisWeek = 0;

    progressData.forEach(p => {
      // Supabase rows should have updated_at, but we fallback to created_at just in case
      const dateStr = p.updated_at || p.created_at;
      if (dateStr) {
        const updatedDate = new Date(dateStr);
        if (updatedDate >= startOfWeek) {
          watchedThisWeek += Math.min(p.watched_seconds || 0, p.total_seconds || 0);
        }
      }
    });

    // Convert seconds to hours, rounded to 1 decimal
    const currentHours = Math.round((watchedThisWeek / 3600) * 10) / 10;
    
    return { current: currentHours, target: 15 };
  }, [progressData]);

  const pct       = Math.min((weeklyGoal.current / weeklyGoal.target) * 100, 100);
  const isDone    = pct >= 100;
  // Use Math.max to ensure remaining is not negative, format to 1 decimal place
  const remaining = Math.max(0, Math.round((weeklyGoal.target - weeklyGoal.current) * 10) / 10);

  const r  = 36;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - pct / 100);

  return (
    <div className="relative rounded-2xl bg-black border border-white/[0.08] overflow-hidden hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/25 flex items-center justify-center">
          <Target size={14} className="text-purple-400" />
        </div>
        <h2 className="text-sm font-semibold text-white">Weekly Goal</h2>
      </div>

      <div className="p-5">
        {/* Circular progress + stats */}
        <div className="flex items-center gap-5 mb-4">
          <div className="relative flex-shrink-0">
            <svg width="88" height="88" viewBox="0 0 88 88">
              {/* Track */}
              <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
              {/* Progress */}
              <circle
                cx="44" cy="44" r={r}
                fill="none"
                stroke={isDone ? "#34d399" : "#a78bfa"}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={dash}
                transform="rotate(-90 44 44)"
                style={{ transition: "stroke-dashoffset 0.9s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white">{Math.round(pct)}%</span>
            </div>
          </div>

          <div>
            <p className="text-xs text-white/40 mb-0.5">Learning Time</p>
            <p className="text-2xl font-bold text-white">
              {weeklyGoal.current}
              <span className="text-sm font-normal text-white/30">/{weeklyGoal.target}h</span>
            </p>
            <p className="text-xs text-white/35 mt-0.5">
              {isDone ? "Goal achieved this week! 🎉" : `${remaining}h to go`}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-white/6 overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${pct}%`,
              background: isDone ? "#34d399" : "#a78bfa",
              boxShadow: isDone ? "0 0 10px rgba(52,211,153,0.5)" : "0 0 10px rgba(167,139,250,0.5)"
            }}
          />
        </div>

        {/* Message */}
        <div className="flex items-center gap-2 bg-white/3 border border-white/6 rounded-lg px-3 py-2">
          <Flame size={13} className={isDone ? "text-emerald-400" : "text-orange-400"} />
          <p className="text-xs text-white/50">
            {isDone
              ? "Congratulations! You've hit your weekly goal!"
              : `You're doing great! Just ${remaining} more hour${remaining !== 1 ? "s" : ""} to go!`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardWeeklyGoal;