import React from 'react';
import { BookOpen, Award, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const actions = [
  {
    icon: BookOpen,
    label: "Browse All Courses",
    desc: "Explore our full catalog",
    iconColor: "text-purple-400",
    bg: "bg-purple-600/15",
    border: "border-purple-500/20",
    action: (navigate) => navigate('/course'),
  },
  {
    icon: Award,
    label: "View Certificates",
    desc: "See your achievements",
    iconColor: "text-emerald-400",
    bg: "bg-emerald-600/12",
    border: "border-emerald-500/20",
    action: () => window.dispatchEvent(new CustomEvent("open-user-course")),
  },
];

const StudentDashboardQuickAction = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-full min-w-0 rounded-2xl bg-black border border-white/[0.08] overflow-hidden hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 group">
      {/* Header */}
      <div className="flex min-w-0 items-center gap-3 px-4 py-4 sm:px-5">
        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-amber-600/20 border border-amber-500/25 flex items-center justify-center">
          <Zap size={14} className="text-amber-400" />
        </div>
        <h2 className="truncate text-sm font-semibold text-white">Quick Actions</h2>
      </div>

      <div className="p-4 space-y-2">
        {actions.map(({ icon: Icon, label, desc, iconColor, bg, border, action }, i) => (
          <button
            key={i}
            onClick={() => action(navigate)}
            className={`group flex w-full min-w-0 items-center gap-3 rounded-lg p-3
              ${bg} border ${border}
              hover:brightness-110 transition-all duration-150 text-left cursor-pointer`}
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0">
              <Icon size={16} className={iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium leading-tight text-white">{label}</p>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-white/35">{desc}</p>
            </div>
            <ArrowRight size={14} className="text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboardQuickAction;
