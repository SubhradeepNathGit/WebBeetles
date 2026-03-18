import React from 'react'
import { ArrowRight } from "lucide-react";

const StudentDashboardQuickAction = () => {
    return (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
                {[
                    { label: "Browse All Courses", color: "purple", func: () => navigate('/course') },
                    // { label: "Request Instructor", color: "blue", func: () => window.dispatchEvent(new CustomEvent("open-request-instructor")) },
                    { label: "View Certificates", color: "green", func: () => console.log("View Certificates clicked") }
                ].map((action, i) => (
                    <button key={i} onClick={action.func}
                        className={`w-full text-left px-5 py-4 bg-${action.color}-500/30 hover:bg-${action.color}-500/50 backdrop-blur-sm rounded-2xl text-white font-semibold text-sm transition-all border border-${action.color}-400/30 hover:scale-105 hover:shadow-xl flex items-center justify-between group`}>
                        <span>{action.label}</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                ))}
            </div>
        </div>
    )
}

export default StudentDashboardQuickAction