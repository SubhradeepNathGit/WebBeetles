import React, { useEffect, useState } from 'react';
import { Edit2, Star, ThumbsUp, Trash2 } from 'lucide-react';
import { formatDateDDMMYYYY } from '../../../../../util/dateFormat/dateFormat';
import { useStudentDetails } from '../../../../../tanstack/query/fetchSpecificStudentDetails';
import { useDispatch } from 'react-redux';
import { updateReviewRequest } from '../../../../../redux/slice/reviewSlice';
import hotToast from '../../../../../util/alert/hot-toast';
import getSweetAlert from '../../../../../util/alert/sweetAlert';
import { useQueryClient } from '@tanstack/react-query';
import ConfirmDeleteModal from '../../common-modal/ConfirmDeleteModal';

const ReviewCard = ({ review, userId, setShowReviewForm, setUserReview, setReviewFormData }) => {

    const dispatch = useDispatch(),
        queryClient = useQueryClient(),
        showMsgWordCount = 130,
        isUserReview = review?.student_id == userId,
        hasUserVoted = review?.help_voted_user_id?.find(id => id == userId);

    const [showMore, setShowMore] = useState(false);
    const [showMessageWordCount, setShowMessageWordCount] = useState(showMsgWordCount);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteReviewId, setDeleteReviewId] = useState(null);
    const { isLoading, data, error } = useStudentDetails(isUserReview ? userId : review?.student_id);

    const Stars = ({ rating, interactive = false, onRate = null }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star}
                    className={`w-5 h-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} ${interactive ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''}`}
                    onClick={() => interactive && onRate?.(star)} />
            ))}
        </div>
    );

    useEffect(() => {
        if (review?.review?.length > showMessageWordCount) {
            setShowMore(true);
        }
    }, [review]);

    const handleEditReview = () => {
        setReviewFormData({ id: review?.id, rating: review?.rating_count, comment: review?.review });
        setShowReviewForm(true);
    };

    const showHide = (text, showMore) => {
        setShowMessageWordCount(showMore ? text?.length : showMsgWordCount);
        setShowMore(!showMore);
    }

    const voteHelpful = () => {
        if (!userId) {
            hotToast("Invalid login credentials. Please login again", "error");
            return;
        }

        const updateHelpfulObj = {
            ...review,
            helpful: Number(review?.helpful) + 1,
            help_voted_user_id: [...review?.help_voted_user_id, userId]
        }

        dispatch(updateReviewRequest({ review_obj: updateHelpfulObj }))
            .then(res => {
                // console.log('Response for updating review', res);

                if (res.meta.requestStatus == "fulfilled") {
                    queryClient.invalidateQueries(['course-reviews', review?.course_id]);
                    hotToast("Marked helpful", "success");

                } else {
                    getSweetAlert("Oops...", "Something went wrong!", "error");
                }
            })
            .catch(err => {
                // console.log("Error occurred", err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    }

    return (
        <>
            <div className={`relative rounded-xl p-6 border text-start ${isUserReview
                ? 'bg-gradient-to-br from-purple-600/10 to-purple-800/10 border-purple-700/30 mb-2'
                : 'bg-gray-900 border-gray-800'}`}>
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isUserReview ? 'bg-purple-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'
                                }`}
                        >
                            {data?.name?.split(" ")?.map(n => n?.charAt(0)?.toUpperCase())?.join("") ?? 'N/A'}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold">{data?.name ?? 'N/A'}</h4>
                                {isUserReview && (
                                    <span className="text-xs bg-purple-600 px-2 py-1 rounded">Your Review</span>
                                )}
                            </div>
                            <Stars rating={review?.rating_count ?? 0} />
                            {/* <p className="text-sm text-gray-400 mt-1">{review.review}</p> */}
                        </div>
                    </div>

                    {isUserReview && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEditReview()}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                                title="Edit Review"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => { setOpenDeleteModal(true); setDeleteReviewId(review?.id); }}
                                className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors cursor-pointer"
                                title="Delete Review"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* <h3 className="font-semibold text-lg mb-2">{review.title}</h3> */}
                <p className={`text-gray-300 mb-4 ${showMore ? 'inline' : 'block'}`}>{(review?.review?.length > showMessageWordCount ? review?.review?.slice(0, showMessageWordCount) + '... '
                    : review?.review) ?? 'N/A'}</p>
                {
                    (review?.review?.length > showMessageWordCount - 1) && (
                        <button onClick={() => showHide(review?.review, showMore)} className="text-blue-300 mb-4 hover:text-blue-400 cursor-pointer text-[12px]">
                            {showMore ? 'show more' : 'show less'}
                        </button>
                    )
                }
                {/* DATE at bottom-right */}
                <p className="absolute bottom-3 right-4 text-sm text-gray-500 font-bold">
                    ~{formatDateDDMMYYYY(review?.created_at)}
                </p>

                {!isUserReview && (
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
                        <button onClick={() => hasUserVoted ? voteHelpful() : undefined} disabled={hasUserVoted}
                            className={`flex items-center gap-2 text-sm transition-colors ${hasUserVoted
                                ? 'text-purple-400 cursor-not-allowed' : 'text-gray-400 hover:text-purple-400 cursor-pointer'}`}>
                            <ThumbsUp className="w-4 h-4" />
                            <span>Helpful ({review?.helpful ?? 0})</span>
                        </button>
                        {/* <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span>Reply</span>
                        </button> */}
                    </div>
                )}
            </div>

            {openDeleteModal && (
                <ConfirmDeleteModal setOpenDeleteModal={setOpenDeleteModal} setDeleteReviewId={setDeleteReviewId} deleteReviewId={deleteReviewId}
                    courseId={review?.course_id} setShowReviewForm={setShowReviewForm} setUserReview={setUserReview} />
            )}
        </>
    )
}

export default ReviewCard