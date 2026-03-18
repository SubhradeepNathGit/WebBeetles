import { Star } from 'lucide-react'
import React from 'react'

const TopPerformingCourseRow = ({ c,i }) => {
    return (
        <tr className="hover:bg-white/[0.02] transition-colors group">
            <td className="px-6 py-3 text-sm text-gray-600 font-semibold">#{i + 1}</td>
            <td className="px-6 py-3">
                <p className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors">{c.title}</p>
                <p className="text-xs text-gray-500">{c.instructor}</p>
            </td>
            <td className="px-6 py-3"><span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-md">{c.cat}</span></td>
            <td className="px-6 py-3 text-sm text-gray-300 font-medium">{c.students.toLocaleString()}</td>
            <td className="px-6 py-3 text-sm text-yellow-500 font-semibold">{c.revenue}</td>
            <td className="px-6 py-3 text-sm text-gray-300 flex items-center gap-1 mt-3"><Star size={12} className="fill-yellow-400 text-yellow-400" /> {c.rating}</td>
            <td className="px-6 py-3 text-sm text-yellow-400 font-semibold">{c.comp}</td>
        </tr>
    )
}

export default TopPerformingCourseRow