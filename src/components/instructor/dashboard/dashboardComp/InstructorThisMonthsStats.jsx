import React, { useEffect, useState } from 'react'
import { IndianRupee, TrendingUp, Users, Zap } from 'lucide-react'
import { getInstructorMonthlyStats } from '../../../../function/getInstructorMonthlyStats'

const InstructorThisMonthsStats = ({ instructorDetails }) => {

    const [stats, setStats] = useState({ totalRevenue: 0, totalEnrollments: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!instructorDetails?.id) return

        const fetchStats = async () => {
            try {
                setLoading(true)
                const res = await getInstructorMonthlyStats({
                    instructorId: instructorDetails.id
                })
                setStats(res)
            } catch (err) {
                console.error("Failed to load monthly stats", err)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [instructorDetails?.id])

    if (loading) {
        return (
            <div className="bg-white/10 rounded-xl p-6 text-white text-center">
                Loading this month stats...
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-pink-500/40 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-2xl p-4 sm:p-5 lg:p-6 border border-white/30">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6 flex items-center gap-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white/20 flex items-center justify-center border border-white/30">
                    <TrendingUp size={18} />
                </div>
                This Month
            </h2>

            <div className="space-y-3">
                {[
                    {
                        label: "New Enrollments",
                        value: stats.totalEnrollments,
                        icon: Users,
                        change: `${stats.enrollmentChange >= 0 ? "+" : ""}${stats.enrollmentChange}%`
                    },
                    {
                        label: "Total Revenue",
                        value: `₹${stats.totalRevenue.toLocaleString()}`,
                        icon: IndianRupee,
                        change: `${stats.revenueChange >= 0 ? "+" : ""}${stats.revenueChange}%`
                    }
                ].map((m, i) => (
                    <div key={i}
                        className="bg-white/20 rounded-lg p-3 sm:p-4 border border-white/40 hover:scale-[1.02] transition-transform"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs sm:text-sm text-white font-semibold">
                                {m.label}
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center border border-white/30">
                                <m.icon size={16} className="text-white" />
                            </div>
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-white mb-1">
                            {m.value}
                        </p>
                        <p className="text-xs text-white/90 font-medium flex items-center gap-1">
                            <Zap size={12} className="text-green-300" />
                            {m.change}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default InstructorThisMonthsStats
