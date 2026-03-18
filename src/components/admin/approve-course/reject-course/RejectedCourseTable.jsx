import React from 'react'
import RejectCourseRow from './RejectCourseRow'

const RejectedCourseTable = ({ rejected }) => {
    return (
        <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#151515]">
                <h2 className="text-sm font-semibold text-white">Reject from Platform</h2>
                <span className="text-xs text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">{rejected.length} Rejected</span>
            </div>
            <div className="divide-y divide-white/5 max-h-[205px] overflow-y-auto">
                {rejected?.map(c => (
                    <RejectCourseRow key={c.id} c={c} />))
                }
                {rejected?.length === 0 && (
                            <p colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">No rejected courses available</p>
                        )}
            </div>
        </div>
    )
}

export default RejectedCourseTable