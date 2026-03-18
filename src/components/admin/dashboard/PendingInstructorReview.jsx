import React, { useEffect, useState } from 'react'
import SectionHeader from './common/sectionHeader'
import { Check, Loader2, X } from 'lucide-react'
import { allInstructor, updateInstructorApproveRejectStatus } from '../../../redux/slice/instructorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { formatDateByHHAndDay } from '../../../util/timeFormat/timeFormat';
import ConfirmStatusModal from '../common/modal/ConfirmStatusModal';
import hotToast from '../../../util/alert/hot-toast';
import getSweetAlert from '../../../util/alert/sweetAlert';

const PendingInstructorReview = () => {

    const [openMarkModal, setOpenMarkModal] = useState(false);
    const [instructorId, setInstructorId] = useState(null);
    const [changeStatus, setChangeStatus] = useState(null);

    const dispatch = useDispatch(),
        { isInstructorLoading, getInstructorData, isInstructorError } = useSelector(state => state?.instructor);

    useEffect(() => {
        dispatch(allInstructor());
    }, [dispatch]);

    const pendingRequest = getInstructorData?.filter(inst => inst?.application_status == 'pending' && inst?.application_complete);

    const handleUpdateStatus = () => {
        dispatch(updateInstructorApproveRejectStatus({ id: instructorId, status: changeStatus }))
            .then(res => {
                // console.log('Response for updating status', res);

                if (res.meta.requestStatus === "fulfilled") {
                    dispatch(allInstructor());
                    hotToast(`Instructor ${changeStatus} successfully!`, "success");
                    setOpenMarkModal(false);
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert("Error", `Something went wrong while ${changeStatus} the instructor.`, "error");
            })
    }

    return (
        <>
            <div className="bg-[#111] p-5 rounded-2xl border border-white/5 lg:col-span-2 shadow-xl flex flex-col">
                <SectionHeader title="Pending Instructor Reviews" linkTo="/admin/instructor-reviews" />
                <div className="space-y-3 flex-1">
                    {isInstructorLoading ? <Loader2 className='inline mx-auto animate-spin w-10 h-10' /> : pendingRequest?.length > 0 ?
                    pendingRequest?.slice(0, 4)?.map(p => (
                        <div key={p?.id} className="flex items-center gap-3 p-3 bg-[#161616] rounded-xl hover:bg-[#1a1a1a] transition-colors">
                            <div className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 text-xs font-bold flex-shrink-0">
                                {p?.name?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{p?.name ?? 'N/A'}</p>
                                <p className="text-xs text-gray-500">{p?.email ?? 'N/A'} · {formatDateByHHAndDay(p?.created_at)}</p>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                                <button className="p-1.5 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors cursor-pointer"
                                    onClick={() => {
                                        if (p?.application_complete) {
                                            setOpenMarkModal(true);
                                            setInstructorId(p?.id);
                                            setChangeStatus("approved");
                                        }
                                    }}><Check size={13} /></button>
                                <button className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors cursor-pointer"
                                    onClick={() => {
                                        if (p?.application_complete) {
                                            setOpenMarkModal(true);
                                            setInstructorId(p?.id);
                                            setChangeStatus("rejected");
                                        }
                                    }}><X size={13} /></button>
                            </div>
                        </div>
                    )): <p className='text-center'>No instructor request available</p>}
                </div>
            </div>

            {openMarkModal && (
                <ConfirmStatusModal setOpenMarkModal={setOpenMarkModal} handleMark={handleUpdateStatus} isLoading={isInstructorLoading}
                    title={`${changeStatus == 'approved' ? 'Approve' : 'Reject'} instructor`} subTitle={`Are you sure you want to ${changeStatus == 'approved' ? 'approve' : 'reject'} the instructor`} />
            )}
        </>
    )
}

export default PendingInstructorReview