import React, { useEffect, useState } from 'react'
import { Target } from "lucide-react";

const StudentDashboardWeeklyGoal = () => {

  const [weeklyGoal, setWeeklyGoal] = useState({ current: 0, target: 15 });

  const fetchDashboardData = async () => {
    try {
      setWeeklyGoal({ current: 12, target: 15 });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const goalPercentage = (weeklyGoal.current / weeklyGoal.target) * 100;

  return (
    <div className="bg-gradient-to-br from-purple-500/40 to-pink-500/40 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/30">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Target size={28} />Weekly Goal</h2>
      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white font-medium">Learning Time</span>
            <span className="font-bold text-white text-lg">{weeklyGoal.current} / {weeklyGoal.target} hours</span>
          </div>
          <div className="h-4 bg-white/20 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-white to-purple-200 rounded-full shadow-lg" style={{ width: `${goalPercentage}%` }} />
          </div>
        </div>
        <div className="bg-white/20 rounded-2xl p-4 border border-white/30">
          <p className="text-sm text-white font-medium">🎯 {goalPercentage >= 100 ? "Congratulations! You've achieved your weekly goal!" : `You're doing great! Just ${weeklyGoal.target - weeklyGoal.current} more hours to reach your weekly goal.`}</p>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboardWeeklyGoal