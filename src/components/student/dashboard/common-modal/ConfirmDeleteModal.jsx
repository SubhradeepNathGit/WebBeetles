import React from 'react'
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import hotToast from '../../../../util/alert/hot-toast';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import { deleteReviewRequest } from '../../../../redux/slice/reviewSlice';

const ConfirmDeleteModal = ({ setOpenDeleteModal, setDeleteReviewId, setShowReviewForm, deleteReviewId, courseId, setUserReview }) => {

    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { isReviewPending, getReviewData, isReviewError } = useSelector(state => state.review);

    const handleDeleteReview = (review_id) => {

        dispatch(deleteReviewRequest({ review_id }))
            .then(res => {
                // console.log('Response for deleting review', res);

                if (res.meta.requestStatus == "fulfilled") {
                    queryClient.invalidateQueries(['course-reviews', courseId]);
                    setDeleteReviewId(null);
                    setOpenDeleteModal(false);
                    setShowReviewForm(false);
                    setUserReview(null);
                    hotToast("Review deleted successfully", "success");

                } else {
                    getSweetAlert("Oops...", "Something went wrong!", "error");
                }
            })
            .catch(err => {
                // console.log("Error occurred", err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full border border-gray-800">
                <h2 className="text-2xl font-bold mb-4">Delete Review?</h2>
                <p className="text-gray-400 mb-6">Are you sure you want to delete the review? This action cannot be undone.</p>
                <div className="flex gap-3">
                    <button disabled={isReviewPending} onClick={() => handleDeleteReview(deleteReviewId)} className={`flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors ${isReviewPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        {isReviewPending ? <Loader2 className="w-4 h-4 animate-spin inline" /> : ''} Delete
                    </button>
                    <button disabled={isReviewPending} onClick={() => setOpenDeleteModal(false)} className={`flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors ${isReviewPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDeleteModal