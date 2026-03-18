import React from 'react'
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
                ) : <p className='text-center py-2'>No Application available</p>}
            </div>
        </div>
    )
}

export default ApplicationTable