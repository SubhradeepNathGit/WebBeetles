import React from 'react'
import TableRow from './TableRow';

const UserTable = ({ filtered, allStudentData }) => {

    return (
        <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            <div className="overflow-x-auto">
                {filtered?.length > 0 ? (
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-[#151515] text-center">
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Courses</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spent</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Verification</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filtered?.map(u => (
                            <TableRow key={u.id} u={u} />
                        ))}
                    </tbody>
                </table>
                ) : <p className='text-center py-2'>No Student available</p>}
            </div>
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-sm text-gray-500 bg-[#151515]">
                <div>Showing {filtered?.length ?? 0} of {allStudentData?.length ?? 0} users</div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors disabled:opacity-30 text-xs" disabled>Previous</button>
                    <span className="text-xs bg-purple-600 text-white px-2.5 py-1 rounded-lg">1</span>
                    <button className="px-3 py-1.5 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors text-xs">Next</button>
                </div>
            </div>
        </div>
    )
}

export default UserTable