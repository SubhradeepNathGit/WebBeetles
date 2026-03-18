import React from 'react'
import { ArrowRight } from 'lucide-react'

const InstructorQuickLinks = ({quickActions}) => {
    return (
        <div className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-5 lg:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6">Quick Actions</h2>
            <div className="space-y-2 sm:space-y-3">
                {quickActions.map((a, i) => (
                    <button key={i} onClick={a.func} className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r ${a.gradient} hover:opacity-90 rounded-lg text-white font-semibold text-xs sm:text-sm transition-all hover:scale-[1.02] hover:shadow-xl flex items-center justify-between group active:scale-95 cursor-pointer`}>
                        <span className="flex items-center gap-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 flex items-center justify-center border border-white/30"><a.icon size={16} /></div>
                            {a.label}
                        </span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                ))}
            </div>
        </div>
    )
}

export default InstructorQuickLinks