import React from 'react'
import TopPerformingCourseRow from './TopPerformingCourseRow'

const TopPerformingCourseTable = () => {
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
                {[
                    { title: "Advanced React Patterns", instructor: "Dr. Sarah Jenkins", cat: "Development", students: 2840, revenue: "₹1,42,000", rating: 4.9, comp: "88%" },
                    { title: "Python for Data Science", instructor: "Michael Chang", cat: "Data", students: 2190, revenue: "₹1,09,500", rating: 4.8, comp: "91%" },
                    { title: "UI/UX Bootcamp 2024", instructor: "Jessica Wong", cat: "Design", students: 1875, revenue: "₹93,750", rating: 4.7, comp: "84%" },
                    { title: "Node.js Mastery", instructor: "Prof. Arthur P.", cat: "Development", students: 1460, revenue: "₹73,000", rating: 4.6, comp: "79%" },
                    { title: "Digital Marketing Pro", instructor: "Anita Desai", cat: "Marketing", students: 1280, revenue: "₹64,000", rating: 4.5, comp: "76%" },
                ].map((c, i) => (
                    <TopPerformingCourseRow key={i} c={c} i={i} />
                ))}
            </tbody>
        </table>
    )
}

export default TopPerformingCourseTable