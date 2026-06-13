import React from 'react'
import { TrendingUp, Users, DollarSign, BookOpen, ShoppingCart, Star } from "lucide-react";

function KpiCard({ icon: Icon, label, value, trend, up = true }) {
    return (
        <div className="bg-[#111] p-5 rounded-2xl border border-white/5 shadow-xl hover:border-emerald-500/20 transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-[#1a1a1a] rounded-xl border border-white/5 text-emerald-400"><Icon size={20} /></div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${up ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"}`}>{trend}</span>
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
        </div>
    );
}

const AnalyticsStats = ({ stats }) => {

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <KpiCard icon={DollarSign} label="Total Revenue" value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`} trend="+18.4%" />
            <KpiCard icon={Users} label="Total Students" value={stats?.totalStudents?.toLocaleString() || "0"} trend="+15.5%" />
            <KpiCard icon={BookOpen} label="Active Courses" value={stats?.activeCourseCount || "0"} trend="+5.3%" />
            <KpiCard icon={TrendingUp} label="Avg Completion" value={`${stats?.avgCompletion || 0}%`} trend="+4.1%" />
            <KpiCard icon={ShoppingCart} label="Cart Sessions" value={stats?.cartSessions?.toLocaleString() || "0"} trend="-3.1%" up={false} />
            <KpiCard icon={Star} label="Avg Rating" value={`${stats?.avgRating || "0.0"}★`} trend="+0.2" />
        </div>
    )
}

export default AnalyticsStats
