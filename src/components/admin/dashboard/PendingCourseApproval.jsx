import React, { useEffect, useState } from 'react'
import SectionHeader from './common/sectionHeader'
import { Check, Loader2, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { allCourse, updateCourseApproveReject } from '../../../redux/slice/couseSlice';
import hotToast from '../../../util/alert/hot-toast';
import getSweetAlert from '../../../util/alert/sweetAlert';
import ConfirmStatusModal from '../common/modal/ConfirmStatusModal';
import { formatDateDDMMYY } from '../../../util/dateFormat/dateFormat';

const PendingCourseApproval = () => {

    const [openMarkModal, setOpenMarkModal] = useState(false);
    const [courseId, setCourseId] = useState(null);
    const [changeStatus, setChangeStatus] = useState(null);

    const dispatch = useDispatch(),
        { isCourseLoading, getCourseData, isCourseError } = useSelector(state => state?.course);

    useEffect(() => {
        dispatch(allCourse());
    }, [dispatch]);

    const handleUpdateStatus = () => {
        dispatch(updateCourseApproveReject({ id: courseId, status: changeStatus }))
            .then(res => {
                // console.log('Response for updating status', res);

                if (res.meta.requestStatus === "fulfilled") {
                    dispatch(allCourse());
                    hotToast(`Course ${changeStatus} successfully!`, "success");
                    setOpenMarkModal(false);
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert("Error", `Something went wrong while ${changeStatus} the course.`, "error");
            })
    }

    const pendingCourse = getCourseData?.filter(c => c?.status == 'pending');

    return (
        <>
            <div className="bg-[#111] p-5 rounded-2xl border border-white/5 shadow-xl lg:col-span-2 flex flex-col">
                <SectionHeader title="Courses Awaiting Approval" linkTo="/admin/approve-courses" />
                <div className="space-y-3 flex-1">
                    {isCourseLoading ? <Loader2 className='inline mx-auto animate-spin w-10 h-10' /> : pendingCourse?.length > 0 ?
                        pendingCourse?.slice(0, 4)?.map(course => (
                            <div key={course?.id} className="p-3 bg-[#161616] rounded-xl hover:bg-[#1a1a1a] transition-colors group">
                                <div className="flex items-start justify-between mb-1">
                                    <p className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors leading-tight">{course?.title ?? 'N/A'}</p>
                                    <div className="flex gap-1 flex-shrink-0 ml-2">
                                        <button className="p-1.5 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors cursor-pointer"
                                            onClick={() => { setOpenMarkModal(true); setChangeStatus("approved"); setCourseId(course?.id) }}><Check size={13} /></button>
                                        <button className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors cursor-pointer"
                                            onClick={() => { setOpenMarkModal(true); setChangeStatus("rejected"); setCourseId(course?.id) }}><X size={13} /></button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">{course?.instructor?.name??'N/A'} · {formatDateDDMMYY(course?.created_at)}</p>
                            </div>
                        )) : <p className='text-center'>No course request available</p>}
                </div>
            </div>

            {openMarkModal && (
                <ConfirmStatusModal setOpenMarkModal={setOpenMarkModal} handleMark={handleUpdateStatus} isLoading={isCourseLoading}
                    title={`${changeStatus == 'approved' ? 'Approve' : 'Reject'} Course`} subTitle={`Are you sure you want to ${changeStatus == 'approved' ? 'approve' : 'reject'} the course`} />
            )}
        </>
    )
}

export default PendingCourseApproval