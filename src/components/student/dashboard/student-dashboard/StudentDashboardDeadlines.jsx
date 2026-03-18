import React, { useEffect, useState } from 'react'
import { Clock, Calendar } from "lucide-react";

const StudentDashboardDeadlines = () => {

    const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

    const priorityColors = {
        high: 'bg-red-500/20 border-red-400/30 text-red-200',
        medium: 'bg-orange-500/20 border-orange-400/30 text-orange-200',
        low: 'bg-green-500/20 border-green-400/30 text-green-200'
    };

    const fetchDashboardData = async () => {
        try {
            setUpcomingDeadlines([
                { id: 1, course: "Advanced React", task: "Final Project Submission", date: "Oct 15, 2025", priority: "high" },
                { id: 2, course: "Full Stack Dev", task: "Module 4 Quiz", date: "Oct 18, 2025", priority: "medium" },
                { id: 3, course: "UI/UX Design", task: "Design Challenge", date: "Oct 22, 2025", priority: "low" }
            ]);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Calendar size={28} className="text-orange-400" />Upcoming Deadlines</h2>
            <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                    <div key={deadline.id} className={`${priorityColors[deadline.priority]} backdrop-blur-sm border rounded-2xl p-4 hover:scale-105 transition-transform`}>
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-bold text-white text-sm flex-1">{deadline.task}</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${deadline.priority === 'high' ? 'bg-red-500/30 text-red-200' : deadline.priority === 'medium' ? 'bg-orange-500/30 text-orange-200' : 'bg-green-500/30 text-green-200'}`}>
                                {deadline.priority.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-xs mb-3 opacity-90">{deadline.course}</p>
                        <div className="flex items-center gap-2 text-xs font-medium"><Clock size={14} />{deadline.date}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StudentDashboardDeadlines