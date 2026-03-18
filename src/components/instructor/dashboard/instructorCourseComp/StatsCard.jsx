import React from 'react'
import { BookOpen, IndianRupee, Star, Users } from 'lucide-react';

const StatsCard = ({ courses, getCourseData, studentCount, totalRevenue, avgRating }) => {

    const StatCard = ({ icon: Icon, value, label, gradient }) => (
        <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 border border-opacity-30`}>
            <Icon className="w-8 h-8 mb-2" />
            <h3 className="text-3xl font-bold mb-1">{value}</h3>
            <p className="text-sm text-gray-400">{label}</p>
        </div>
    );

    return (
        <>
            <StatCard icon={BookOpen} value={getCourseData?.length} label="Total Courses" gradient="from-purple-600/20 to-purple-800/20 border-purple-700/30" />
            <StatCard icon={Users} value={studentCount?.toLocaleString() ?? 0} label="Total Students" gradient="from-blue-600/20 to-blue-800/20 border-blue-700/30" />
            <StatCard icon={IndianRupee} value={totalRevenue.toLocaleString() ?? 0} label="Total Revenue" gradient="from-green-600/20 to-green-800/20 border-green-700/30" />
            <StatCard icon={Star} value={avgRating ?? 0.0} label="Avg Rating" gradient="from-yellow-600/20 to-yellow-800/20 border-yellow-700/30" />
        </>
    )
}

export default StatsCard