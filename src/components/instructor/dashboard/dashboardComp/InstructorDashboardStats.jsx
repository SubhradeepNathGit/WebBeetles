import React from 'react'
import { TrendingUp } from 'lucide-react'

const InstructorDashboardStats = ({ s }) => {
    return (
        <div className="group bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xl border border-white/20 hover:bg-white/15 hover:scale-[1.02] transition-all">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl lg:rounded-2xl bg-gradient-to-br ${s.color === 'purple' ? 'from-purple-500/40 to-purple-600/40' : 'from-blue-500/40 to-blue-600/40'} flex items-center justify-center border ${s.color === 'purple' ? 'border-purple-400/30' : 'border-blue-400/30'} shadow-lg group-hover:scale-110 transition-transform`}>
                        <s.icon className="text-white" size={20} />
                    </div>
                    <div>
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-0.5">{s.value}</h3>
                        <p className="text-purple-100 text-xs sm:text-sm font-medium">{s.label}</p>
                    </div>
                </div>
                {/* <span className="text-green-400 text-xs font-bold flex items-center gap-1 bg-green-500/20 px-2 sm:px-2.5 py-1.5 rounded-lg border border-green-400/30"><TrendingUp size={12} />{s.trend}</span> */}
            </div>
        </div>
    )
}

export default InstructorDashboardStats