import React, { useEffect, useState } from 'react'
import SectionHeader from './common/sectionHeader'
import { Check, Loader2, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { allCategory, updateCategoryApproveReject } from '../../../redux/slice/categorySlice';
import hotToast from '../../../util/alert/hot-toast';
import getSweetAlert from '../../../util/alert/sweetAlert';
import ConfirmStatusModal from '../common/modal/ConfirmStatusModal';
import { formatDateDDMMYY } from '../../../util/dateFormat/dateFormat';

const PendingCategoryApproval = () => {

    const [openMarkModal, setOpenMarkModal] = useState(false);
    const [categoryId, setCategoryId] = useState(null);
    const [changeStatus, setChangeStatus] = useState(null);

    const dispatch = useDispatch(),
        { isCategoryLoading, getCategoryData, isCategoryError } = useSelector(state => state?.category);

    useEffect(() => {
        dispatch(allCategory());
    }, [dispatch]);

    const handleUpdateStatus = () => {
        dispatch(updateCategoryApproveReject({ id: categoryId, status: changeStatus }))
            .then(res => {
                if (res.meta.requestStatus === "fulfilled") {
                    dispatch(allCategory());
                    hotToast(`Category ${changeStatus} successfully!`, "success");
                    setOpenMarkModal(false);
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert("Error", `Something went wrong while ${changeStatus} the category.`, "error");
            })
    }

    const pendingCategory = getCategoryData?.filter(c => c?.status == 'pending');

    return (
        <>
            <div className="bg-[#111] p-5 rounded-2xl border border-white/5 shadow-xl flex flex-col h-full">
                <SectionHeader title="Categories Awaiting Approval" />
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {isCategoryLoading ? (
                        <div className="space-y-3 mt-5 animate-pulse">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="p-3 bg-[#161616] rounded-xl space-y-2">
                                    <div className="h-4 bg-white/5 rounded w-3/4"></div>
                                    <div className="h-3 bg-white/5 rounded w-1/4"></div>
                                </div>
                            ))}
                        </div>
                    ) : pendingCategory?.length > 0 ?
                        pendingCategory?.map(category => (
                            <div key={category?.id} className="p-3 bg-[#161616] rounded-xl hover:bg-[#1a1a1a] transition-colors group">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-semibold text-white group-hover:text-rose-400 transition-colors leading-tight">{category?.name ?? 'N/A'}</p>
                                    <div className="flex gap-1 flex-shrink-0 ml-2">
                                        <button className="p-1.5 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors cursor-pointer"
                                            onClick={() => { setOpenMarkModal(true); setChangeStatus("active"); setCategoryId(category?.id) }}><Check size={13} /></button>
                                        <button className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors cursor-pointer"
                                            onClick={() => { setOpenMarkModal(true); setChangeStatus("rejected"); setCategoryId(category?.id) }}><X size={13} /></button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">{formatDateDDMMYY(category?.created_at)}</p>
                            </div>
                        )) : <p className='text-center text-gray-500 mt-5 text-sm'>No category request available</p>}
                </div>
            </div>

            {openMarkModal && (
                <ConfirmStatusModal setOpenMarkModal={setOpenMarkModal} handleMark={handleUpdateStatus} isLoading={isCategoryLoading}
                    title={`${changeStatus == 'active' ? 'Approve' : 'Reject'} Category`} subTitle={`Are you sure you want to ${changeStatus == 'active' ? 'approve' : 'reject'} the category?`} />
            )}
        </>
    )
}

export default PendingCategoryApproval
