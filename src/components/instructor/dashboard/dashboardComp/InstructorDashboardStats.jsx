import React from 'react'

const InstructorDashboardStats = ({ s }) => {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-5 sm:p-6 shadow-2xl backdrop-blur-md group hover:border-zinc-700/50 transition-all duration-300">
            {/* Ambient hover glow */}
            <div className={`absolute top-0 right-0 -translate-x-1/4 -translate-y-1/4 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none ${s.color === 'rose' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
            
            <div className="flex items-center gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 ${s.color === 'rose' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                    <s.icon size={20} className="transition-transform duration-300 group-hover:rotate-6" />
                </div>
                <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none mb-1">{s.value}</h3>
                    <p className="text-zinc-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider">{s.label}</p>
                </div>
            </div>
        </div>
    )
}

export default InstructorDashboardStats
