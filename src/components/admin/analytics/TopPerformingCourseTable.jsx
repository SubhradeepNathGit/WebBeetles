import React from 'react'
import TopPerformingCourseRow from './TopPerformingCourseRow'

const TopPerformingCourseTable = ({ topCourses }) => {
    return (
        <table className="w-full">
            <thead className="bg-[#151515]">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Students</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Completion</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {topCourses?.map((c, i) => (
                    <TopPerformingCourseRow key={c.id || i} c={{...c, cat: c.category, revenue: `₹${c.revenue.toLocaleString()}`, rating: c.rating || "4.7", comp: c.comp || "82%"}} i={i} />
                ))}
                {(!topCourses || topCourses.length === 0) && (
                    <tr>
                        <td colSpan={7} className="text-center py-6 text-gray-500 text-sm">No courses have generated revenue yet</td>
                    </tr>
                )}
            </tbody>
        </table>
    )
}

export default TopPerformingCourseTable
