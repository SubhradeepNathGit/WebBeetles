import React from 'react'
import PendingTableRow from './PendingTableRow';

const PendingTable = ({ pending, setPreview, setCourseId, setChangeStatus, setOpenMarkModal }) => {
    return (
        <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#151515]">
                <h2 className="text-sm font-semibold text-white">Pending Review</h2>
                <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-md border border-yellow-500/20">{pending?.length ?? 0} Awaiting</span>
            </div>
            <div className="overflow-x-auto max-h-[330px] overflow-y-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 text-center">
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Instructor</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Content</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {pending?.map(course => (
                            <PendingTableRow key={course?.id} course={course} setPreview={setPreview} setCourseId={setCourseId} setChangeStatus={setChangeStatus}
                                setOpenMarkModal={setOpenMarkModal} />
                        ))}
                        {pending?.length === 0 && (
                            <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">No pending courses — all caught up!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PendingTable