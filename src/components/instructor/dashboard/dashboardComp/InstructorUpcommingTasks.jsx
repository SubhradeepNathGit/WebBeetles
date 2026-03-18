import React from 'react'
import { Calendar, Clock } from 'lucide-react'

const InstructorUpcommingTasks = ({ tasks }) => {

  const priorities = {
    high: 'bg-red-500/20 border-red-400/30 text-red-200',
    medium: 'bg-orange-500/20 border-orange-400/30 text-orange-200',
    low: 'bg-green-500/20 border-green-400/30 text-green-200'
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-5 lg:p-6">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6 flex items-center gap-2">
        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-orange-500/30 flex items-center justify-center border border-orange-400/30"><Calendar size={18} className="text-orange-400" /></div>
        Upcoming Tasks
      </h2>
      <div className="space-y-3">
        {tasks.map((t) => (
          <div key={t.id} className={`${priorities[t.priority]} border rounded-lg p-3 sm:p-4 hover:scale-[1.02] transition-all group`}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="font-bold text-white text-xs sm:text-sm flex-1 line-clamp-2">{t.task}</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.priority === 'high' ? 'bg-red-500/40' : t.priority === 'medium' ? 'bg-orange-500/40' : 'bg-green-500/40'}`}>{t.priority.toUpperCase()}</span>
            </div>
            <p className="text-xs mb-3 opacity-90 font-medium truncate">{t.course}</p>
            <div className="flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-1.5"><Clock size={12} />{t.date}</div>
              <span className="bg-white/30 px-2 py-1 rounded-md">{t.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InstructorUpcommingTasks