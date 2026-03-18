import React, { useEffect, useState } from 'react'
import { Play, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserPurchase } from '../../../../redux/slice/purchaseSlice';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import StudentDashboardCourseContinueCard from './StudentDashboardCourseContinueCard';

const StudentDashboardContinueLearning = () => {

    const dispatch = useDispatch(),
        { userAuthData } = useSelector(state => state.checkAuth),
        { isPurchaseLoading, getPurchaseData, hasPurchaseError } = useSelector(state => state.purchase);

    const purchaseItems = getPurchaseData?.flatMap(order => order.purchase_items.map(item => item?.courses)) || [];

    useEffect(() => {
        if (userAuthData) {
            dispatch(fetchUserPurchase({ userId: userAuthData?.id, status: 'paid' }))
                .then(res => {
                    // console.log('Response for fetching user profile', res);
                })
                .catch((err) => {
                    console.log("Error occurred", err);
                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                });
        }
    }, [userAuthData]);

    // console.log('Purchased course list', purchaseItems);

    return (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Play className="text-purple-300" size={28} />Continue Learning</h2>
                <button onClick={() => window.dispatchEvent(new CustomEvent("open-user-course"))} className="text-purple-200 hover:text-white font-semibold cursor-pointer
                text-sm flex items-center gap-1 bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all border border-white/20">View All<ArrowRight size={16} /></button>
            </div>
            <div className="space-y-5">
                {purchaseItems?.length > 0 ?
                    purchaseItems?.slice(0, 3)?.map(course => (
                        <StudentDashboardCourseContinueCard key={course?.id} course={course} userAuthData={userAuthData} />
                    )
                    ) : 'No course available'}
            </div>
        </div>
    )
}

export default StudentDashboardContinueLearning