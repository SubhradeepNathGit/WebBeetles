import React from 'react'
import TableRow from './TableRow'

const InstructorTable = ({ filtered, setOpenMarkModal, setInstructorId, setChangeStatus }) => {
    return (
        <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            <div className="overflow-x-auto">
                {filtered?.length > 0 ? (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#151515] text-center">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-8"></th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Instructor</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Courses</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Students</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Approval</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filtered.map(inst => (
                                <TableRow key={inst.id} inst={inst} setOpenMarkModal={setOpenMarkModal} setInstructorId={setInstructorId}
                                    setChangeStatus={setChangeStatus} />
                            ))}
                        </tbody>
                    </table>
                ) : <p className='text-center py-2'>No Instructor available</p>}
            </div>
        </div>
    )
}

export default InstructorTable