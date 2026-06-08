import React from 'react'

const InstructorDashboardStats = ({ s }) => {
    return (
        <div className="group rounded-xl bg-[#111] border border-white/8 p-4 sm:p-5 lg:p-6 shadow-xl hover:bg-[#161616] transition-colors">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center border ${s.color === 'rose' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-blue-500/10 border-blue-500/20'} shadow-lg`}>
                        <s.icon className={s.color === 'rose' ? "text-emerald-400" : "text-blue-400"} size={20} />
                    </div>
                    <div>
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-0.5">{s.value}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm font-medium">{s.label}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InstructorDashboardStats
