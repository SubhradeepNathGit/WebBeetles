import React, { useEffect, useState } from 'react';
import { Target, Flame } from "lucide-react";

const StudentDashboardWeeklyGoal = () => {
  const [weeklyGoal, setWeeklyGoal] = useState({ current: 0, target: 15 });

  useEffect(() => {
    setWeeklyGoal({ current: 12, target: 15 });
  }, []);

  const pct       = Math.min((weeklyGoal.current / weeklyGoal.target) * 100, 100);
  const isDone    = pct >= 100;
  const remaining = weeklyGoal.target - weeklyGoal.current;

  const r  = 36;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - pct / 100);

  return (
    <div className="rounded-xl bg-[#111] border border-white/8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
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