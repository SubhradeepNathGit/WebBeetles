import React, { useState } from 'react'
import { Eye, Check, X, FileText } from "lucide-react";
import { allInstructor, updateInstructorApproveRejectStatus } from '../../../../redux/slice/instructorSlice';
import ConfirmStatusModal from '../../common/modal/ConfirmStatusModal';
import { useDispatch, useSelector } from 'react-redux';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import hotToast from '../../../../util/alert/hot-toast';

const ProfileModal = ({ setModal, modal, setDocViewer }) => {

    const [openMarkModal, setOpenMarkModal] = useState(false);
    const [instructorId, setInstructor] = useState(null);
    const [changeStatus, setChangeStatus] = useState(null);

    const dispatch = useDispatch(),
        { isInstructorLoading, getInstructorData, isInstructorError } = useSelector(state => state?.instructor);

    const links = Object.entries(modal?.social_links || {}).filter(([, url]) => url);

    const handleUpdateStatus = () => {
        dispatch(updateInstructorApproveRejectStatus({ id: instructorId, status: changeStatus }))
            .then(res => {
                // console.log('Response for updating status', res);

                if (res.meta.requestStatus === "fulfilled") {
                    dispatch(allInstructor());
                    hotToast(`Instructor ${changeStatus} successfully!`, "success");
                    setOpenMarkModal(false);
                    setModal(null);
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert("Error", `Something went wrong while ${changeStatus} the instructor.`, "error");
            })
    }

    return (
        <>
            <div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={() => setModal(null)}>
                <div
                    className="bg-[#111] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl"
                    onClick={(e) => e.stopPropagation()}>
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white font-bold text-2xl border border-white/10">
                                {modal?.name?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{modal?.name ?? 'N/A'}</h3>
                                <p className="text-sm text-gray-400">{modal?.email ?? 'N/A'}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setModal(null)} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-5">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bio</p>
                            <p className="text-sm text-gray-300 leading-relaxed">{modal?.bio ?? 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Skills</p>
                            <div className="flex flex-wrap gap-2">
                                {modal?.expertise?.map((e, i) => (
                                    <span key={i} className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-md font-medium">
                                        {e}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Social Media Links
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {links.length > 0 ? (
                                    links.map(([platform, url], i) => (
                                        <span
                                            key={i}
                                            className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-md font-medium"
                                        >
                                            {platform} - {url}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-700">No Links available</span>
                                )}
                            </div>
                        </div>

                        {/* Document preview card */}
                        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <FileText size={28} className="text-purple-500/60 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-white">{modal?.documentName || `${modal?.name} — Qualification Documents`}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Certificates, gov ID, and portfolio submitted via onboarding form.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setModal(null);
                                    setDocViewer(modal);
                                }}
                                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-xs font-semibold shadow-lg shadow-purple-500/20 cursor-pointer"
                            >
                                <Eye size={13} /> View Document
                            </button>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="p-5 border-t border-white/5 flex items-center justify-end gap-3 bg-[#0d0d0d] rounded-b-2xl">
                        <button
                            onClick={() => setModal(null)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors text-sm font-medium cursor-pointer"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => {
                                if (modal?.application_complete) {
                                    setOpenMarkModal(true);
                                    setInstructor(modal?.id);
                                    setChangeStatus("rejected");
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl transition-colors text-sm font-semibold cursor-pointer"
                        >
                            <X size={16} /> Reject Application
                        </button>
                        <button
                            onClick={() => {
                                if (modal?.application_complete) {
                                    setOpenMarkModal(true);
                                    setInstructor(modal?.id);
                                    setChangeStatus("approved");
                                }
                            }}
                            className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors text-sm font-semibold shadow-lg shadow-purple-500/20 cursor-pointer"
                        >
                            <Check size={16} /> Approve Instructor
                        </button>
                    </div>
                </div>
            </div>

            {openMarkModal && (
                <ConfirmStatusModal setOpenMarkModal={setOpenMarkModal} handleMark={handleUpdateStatus} isLoading={isInstructorLoading}
                    title={`${changeStatus == 'approved' ? 'Approve' : 'Reject'} instructor`} subTitle={`Are you sure you want to ${changeStatus == 'approved' ? 'approve' : 'reject'} the instructor`} />
            )}
        </>
    )
}

export default ProfileModal