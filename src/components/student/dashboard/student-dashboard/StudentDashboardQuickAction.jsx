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
    action: () => console.log("View Certificates clicked"),
  },
];

const StudentDashboardQuickAction = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl bg-[#111] border border-white/8 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
        <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/25 flex items-center justify-center">
          <Zap size={14} className="text-amber-400" />
        </div>
        <h2 className="text-sm font-semibold text-white">Quick Actions</h2>
      </div>

      <div className="p-4 space-y-2">
        {actions.map(({ icon: Icon, label, desc, iconColor, bg, border, action }, i) => (
          <button
            key={i}
            onClick={() => action(navigate)}
            className={`group w-full flex items-center gap-3 p-3 rounded-lg
              ${bg} border ${border}
              hover:brightness-110 transition-all duration-150 text-left cursor-pointer`}
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0">
              <Icon size={16} className={iconColor} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white leading-none mb-0.5">{label}</p>
              <p className="text-xs text-white/35">{desc}</p>
            </div>
            <ArrowRight size={14} className="text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboardQuickAction;