import React from 'react';
import { Clock, Calendar } from "lucide-react";

const priorityConfig = {
  high:   { bar: "bg-red-500",    badge: "bg-red-500/12 border-red-500/25 text-red-400"   },
  medium: { bar: "bg-orange-500", badge: "bg-orange-500/12 border-orange-500/25 text-orange-400" },
  low:    { bar: "bg-emerald-500",badge: "bg-emerald-500/12 border-emerald-500/25 text-emerald-400" },
};

const DEADLINES = [
  { id: 1, course: "Advanced React",  task: "Final Project Submission", date: "Oct 15, 2025", priority: "high" },
  { id: 2, course: "Full Stack Dev",  task: "Module 4 Quiz",            date: "Oct 18, 2025", priority: "medium" },
  { id: 3, course: "UI/UX Design",    task: "Design Challenge",         date: "Oct 22, 2025", priority: "low" },
];

const StudentDashboardDeadlines = () => (
  <div className="rounded-xl bg-[#111] border border-white/8 overflow-hidden">
    {/* Header */}
    <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
      <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/25 flex items-center justify-center">
        <Calendar size={14} className="text-orange-400" />
      </div>
      <h2 className="text-sm font-semibold text-white">Upcoming Deadlines</h2>
    </div>

    <div className="p-4 space-y-2">
      {DEADLINES.map(({ id, course, task, date, priority }) => {
        const cfg = priorityConfig[priority];
        return (
          <div key={id} className="relative flex items-start gap-3 bg-[#161616] border border-white/6 rounded-lg px-4 py-3 overflow-hidden">
            {/* Priority bar */}
            <span className={`absolute left-0 top-0 bottom-0 w-0.5 ${cfg.bar} rounded-r`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <p className="text-sm font-medium text-white leading-snug">{task}</p>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide flex-shrink-0 ${cfg.badge}`}>
                  {priority}
                </span>
              </div>
              <p className="text-xs text-white/35 mb-1.5">{course}</p>
              <div className="flex items-center gap-1 text-[10px] text-white/40">
                <Clock size={10} />
                {date}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default StudentDashboardDeadlines;