import React from 'react'
import { ClipboardX } from 'lucide-react'
import ApplicationRow from './ApplicationRow'

const ApplicationTable = ({ filtered, setModal, setDocViewer, setOpenMarkModal, setInstructor, setChangeStatus }) => {

    return (
        <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
            <div className="overflow-x-auto">
                {filtered?.length > 0 ? (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#151515] text-center">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Verification</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Application Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Documents</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5">
                            {filtered?.map(app => (
                                <ApplicationRow key={app?.id} app={app} setModal={setModal} setDocViewer={setDocViewer} setOpenMarkModal={setOpenMarkModal} setInstructor={setInstructor}
                                    setChangeStatus={setChangeStatus} />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 px-6">
                        {/* Decorative icon with glow ring */}
                        <div className="relative mb-6">
                            <div className="relative w-20 h-20 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                                <ClipboardX className="w-9 h-9 text-gray-600" strokeWidth={1.5} />
                            </div>
                        </div>

                        {/* Text */}
                        <h3 className="text-white/80 text-lg font-semibold mb-2 tracking-tight">No applications yet</h3>
                        <p className="text-gray-500 text-sm text-center max-w-xs leading-relaxed">
                            New instructor applications will appear here once applicants submit their credentials for review.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ApplicationTable