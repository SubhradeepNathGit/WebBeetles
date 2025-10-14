import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { Edit2, MessageSquare, Star, ThumbsUp, Trash2 } from 'lucide-react';
import { fetchUserDetails } from '../../../../common-query/query';

const ReviewCard = ({ review, userData, isUserReview = userData.user._id == review.user }) => {

    const [userReview, setUserReview] = useState(null);
    // console.log('Single review',review);

    // Find specific data
    const specificUserById = (id) => {
        const fetchSpecificUserResponse = useQuery({
            queryKey: ['fetchSpecificUserResponse'],
            queryFn: () => fetchUserDetails(id),
        })
        const { error, isError, isLoading, data } = fetchSpecificUserResponse;
        const userDetails = data?.data;
        // console.log('Fetch Response', userDetails);

        return userDetails;
    };

    const Stars = ({ rating, interactive = false, onRate = null }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star}
                    className={`w-5 h-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} ${interactive ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''}`}
                    onClick={() => interactive && onRate?.(star)} />
            ))}
        </div>
    );

    const handleEditReview = () => {
        // setReviewForm({ rating: userReview.rating, comment: userReview.comment });
        setShowReviewForm(true);
    };

    const handleDeleteReview = () => {
        // setReviewForm({ rating: userReview.rating, comment: userReview.comment });
    };

    return (
        <div className={`relative rounded-xl p-6 border text-start ${isUserReview
            ? 'bg-gradient-to-br from-purple-600/10 to-purple-800/10 border-purple-700/30'
            : 'bg-gray-900 border-gray-800'
            }`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isUserReview ? 'bg-purple-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'
                            }`}
                    >
                        {specificUserById(review.user)}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{specificUserById(review.user)}</h4>
                            {isUserReview && (
                                <span className="text-xs bg-purple-600 px-2 py-1 rounded">Your Review</span>
                            )}
                        </div>
                        <Stars rating={review.value} />
                        <p className="text-sm text-gray-400 mt-1">{review.review}</p>
                    </div>
                </div>

                {isUserReview && (
                    <div className="flex gap-2">
                        <button
                            onClick={handleEditReview}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            title="Edit Review"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDeleteReview()}
                            className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors"
                            title="Delete Review"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* <h3 className="font-semibold text-lg mb-2">{review.title}</h3> */}
            <p className="text-gray-300 mb-4">{review.comment}</p>

            {/* DATE at bottom-right */}
            <p className="absolute bottom-3 right-4 text-sm text-gray-500 font-bold">
                ~{review.date || '10.06.2024'}
            </p>

            {!isUserReview && (
                <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
                    <button
                        className={`flex items-center gap-2 text-sm transition-colors ${review.hasUserVoted
                            ? 'text-purple-400'
                            : 'text-gray-400 hover:text-purple-400'
                            }`}>
                        <ThumbsUp className="w-4 h-4" />
                        <span>Helpful ({review.helpful})</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>Reply</span>
                    </button>
                </div>
            )}
        </div>
    )
}

export default ReviewCard