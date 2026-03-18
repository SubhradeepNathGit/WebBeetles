import React, { useState } from 'react'
import { Eye, Check, X, FileText, Mail, Calendar } from "lucide-react";
import { formatDateDDMMYYYY } from '../../../util/dateFormat/dateFormat';

const ApplicationRow = ({ app, setModal, setDocViewer, setOpenMarkModal, setInstructor, setChangeStatus }) => {

    const EMAIL_VERIFICATION_COLOR = {
        Verified: "bg-green-500/10 text-green-400 border-green-500/20",
        Failed: "bg-red-500/10 text-red-400 border-red-500/20",
        pending: "bg-purple-500/10 text-purple-400 border-purple-500/20"
    }

    return (
        <>
            <tr className="hover:bg-white/[0.02] transition-colors group text-center">
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white font-bold text-sm border border-white/10 flex-shrink-0">
                            {app?.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors text-left">{app?.name ?? 'N/A'}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 text-left">
                                <Mail size={11} />
                                {app?.email ?? 'N/A'}
                            </p>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-md font-medium border ${EMAIL_VERIFICATION_COLOR[app?.is_verified == "fulfilled" ? 'Verified' : app?.is_verified == "rejected" ? 'Failed' : app?.is_verified]}`}>
                        {app?.is_verified == "fulfilled" ? 'Verified' : app?.is_verified == "rejected" ? 'Failed' : app?.is_verified?.charAt(0)?.toUpperCase() + app?.is_verified?.slice(1)?.toLowerCase()}
                    </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-1 mt-4">
                    <Calendar size={13} />
                    {formatDateDDMMYYYY(app?.created_at)}
                </td>
                <td className="px-6 py-4">
                    <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${app?.application_complete
                            ? "bg-green-500/10 text-green-500 border-green-500/20 px-4.5"
                            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            }`}
                    >
                        {app?.application_complete ? "Complete" : "In-complete"}
                    </span>
                </td>

                {/* Documents Column — View Document button */}
                <td className="px-6 py-4">
                    <button
                        onClick={() => app?.application_complete ? setDocViewer(app) : ''}
                        className={`flex items-center gap-2 px-3 py-1.5 border ${app?.application_complete ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/20 cursor-pointer' :
                            'bg-purple-300/20 text-purple-300 border-purple-300/20 cursor-not-allowed'} rounded-lg transition-colors text-xs font-semibold`}
                    >
                        <FileText size={13} /> View Document
                    </button>
                </td>

                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        {/* View Profile */}
                        <button
                            onClick={() => app?.application_complete ? setModal(app) : ''}
                            className={`flex items-center gap-1.5 px-3 py-1.5 border ${app?.application_complete ? 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10 cursor-pointer' :
                                'bg-gray/10 text-gray-500 border-gray/10 cursor-not-allowed'} rounded-lg transition-colors text-xs font-medium`}
                        >
                            <Eye size={13} /> Profile
                        </button>
                        <>
                            <button
                                onClick={() => {
                                    if (app?.application_complete) {
                                        setOpenMarkModal(true);
                                        setInstructor(app?.id);
                                        setChangeStatus("approved");
                                    }
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 border ${app?.application_complete ? 'bg-green-500/10 hover:bg-green-500/20 text-green-500 border-green-500/20 cursor-pointer' :
                                    'bg-green-400/20 text-green-400 border-green-400/20 cursor-not-allowed'} rounded-lg transition-colors text-xs font-semibold`}
                            >
                                <Check size={14} /> Approve
                            </button>
                            <button
                                onClick={() => {
                                    if (app?.application_complete) {
                                        setOpenMarkModal(true);
                                        setInstructor(app?.id);
                                        setChangeStatus("rejected");
                                    }
                                }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 border ${app?.application_complete ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20 cursor-pointer' :
                                    'bg-red-400/20 text-red-400 border-red-400/20 cursor-not-allowed'} rounded-lg transition-colors text-xs font-semibold`}
                            >
                                <X size={14} /> Reject
                            </button>
                        </>
                    </div>
                </td>
            </tr>

        </>
    )
}

export default ApplicationRow