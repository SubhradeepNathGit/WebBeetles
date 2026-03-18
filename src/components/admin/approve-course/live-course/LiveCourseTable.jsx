import React from 'react'
import LiveCourseRow from './LiveCourseRow'

const LiveCourseTable = ({ approved, setOpenBlockUnblockModal, setBlockUnblockCourseId, setBlockUnblockChangeStatus }) => {
    return (
        <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#151515]">
                <h2 className="text-sm font-semibold text-white">Live on Platform</h2>
                <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md border border-green-500/20">{approved.length} Published</span>
            </div>
            <div className="divide-y divide-white/5 max-h-[205px] overflow-y-auto">
                {approved.map(c => (
                    <LiveCourseRow key={c.id} c={c} setOpenBlockUnblockModal={setOpenBlockUnblockModal} setBlockUnblockCourseId={setBlockUnblockCourseId}
                        setBlockUnblockChangeStatus={setBlockUnblockChangeStatus} />))
                }
                {approved?.length === 0 && (
                    <p colSpan={12} className="px-6 py-12 text-center text-gray-500 text-sm">No live courses available</p>
                )}
            </div>
        </div>
    )
}

export default LiveCourseTable