import React, { useEffect, useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { addReviewRequest, updateReviewRequest } from '../../../../../redux/slice/reviewSlice';
import { Loader2, Star } from 'lucide-react';
import getSweetAlert from '../../../../../util/alert/sweetAlert';
import hotToast from '../../../../../util/alert/hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { addActivityRequest } from '../../../../../redux/slice/activitySlice';

const ReviewForm = ({ getSpecificCourseData, authId, setShowReviewForm, reviewFormData, setReviewFormData }) => {

    const dispatch = useDispatch(),
        queryClient = useQueryClient(),
        isUpdate = !!reviewFormData?.id,
        { control, register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: { rating: 0, comment: "" } }),
        { isReviewPending, getReviewData, isReviewError } = useSelector(state => state.review),
        { isActivityLoading, activityList, hasActivityError } = useSelector(state => state.activity);

    const Stars = ({ rating, interactive = false, onRate = null }) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-5 h-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} ${interactive ? 'cursor-pointer hover:text-yellow-400 transition-colors' : ''}`}
                    onClick={() => interactive && onRate?.(star)}
                />
            ))}
        </div>
    );

    useEffect(() => {
        if (reviewFormData?.id) {
            reset({
                rating: reviewFormData?.rating,
                comment: reviewFormData?.comment
            })
        }
    }, [reviewFormData]);

    const handleSubmitReview = async (data) => {
        const review_obj = {
            course_id: getSpecificCourseData?.id,
            category_id: getSpecificCourseData?.category_id,
            student_id: authId,
            rating_count: Number(data?.rating),
            review: data?.comment,
            helpful: 0,
            help_voted_user_id: []
        };

        const updated_obj = {
            id: reviewFormData?.id,
            rating_count: Number(data?.rating),
            review: data?.comment,
        }

        const activity = {
            course_id: getSpecificCourseData.id,
            instructor_id: getSpecificCourseData.instructor_id,
            student_id: authId,
            title: "Submit review",
            message: `Left a ${Number(data?.rating)}-star review`,
            status: "success",
            viewer_type: "instructor"
        }

        dispatch(!isUpdate ? addReviewRequest({ review_obj }) : updateReviewRequest({ review_obj: updated_obj }))
            .then(res => {
                // console.log('Response for adding/updating review', res);

                if (res.meta.requestStatus == "fulfilled") {

                    dispatch(addActivityRequest({ activity }))
                        .then(res => {
                            // console.log('Response for adding activity', res);

                            if (res.meta.requestStatus == "fulfilled") {
                                reset();
                                setShowReviewForm(false);

                                queryClient.invalidateQueries(['course-reviews', getSpecificCourseData?.id]);
                                if (isUpdate) {
                                    setReviewFormData({ id: null, rating: 0, comment: null });
                                    hotToast("Review updated successfully", "success");
                                }
                                else {
                                    hotToast("Review added successfully", "success");
                                }

                            } else {
                                getSweetAlert("Oops...", "Something went wrong!", "error");
                            }
                        })
                        .catch(err => {
                            console.log("Error occurred", err);
                            getSweetAlert('Oops...', 'Something went wrong!', 'error');
                        });
                } else {
                    getSweetAlert("Oops...", "Something went wrong!", "error");
                }
            })
            .catch(err => {
                console.log("Error occurred", err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    }

    return (
        <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
            <h3 className="text-xl font-semibold mb-6">Write Your Review</h3>

            <form className="space-y-6" onSubmit={handleSubmit(handleSubmitReview)}>
                {/* Rating */}
                <label className="block text-sm font-medium mb-3"> Rating <span className="text-red-500">{errors.rating ? '*' : null}</span></label>
                <Controller name="rating" control={control}
                    rules={{
                        validate: (value) => value > 0 || "Rating is required",
                    }}
                    render={({ field }) => (
                        <Stars rating={field.value} interactive onRate={(value) => field.onChange(value)} />
                    )} />

                {/* Review Comment */}
                <div>
                    <label className="block text-sm font-medium mb-2">Your Review <span className="text-red-500">{errors.comment?.message == 'required' ? '*' : null}</span></label>
                    <textarea rows={6} placeholder="Share your thoughts about the course..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                        {...register("comment", {
                            required: "required",
                            minLength: {
                                value: 50,
                                message: "min50",
                            },
                        })}
                    />
                    <p className={`text-xs mt-2 ${errors.comment?.message == 'min50' ? 'text-red-500' : 'text-gray-500'}`}>
                        Minimum 50 characters
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button type="submit" disabled={isReviewPending||isActivityLoading}
                        className={`px-6 py-3 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors ${(!isReviewPending||!isActivityLoading) ? 'bg-purple-600 cursor-pointer' : 'bg-purple-700 cursor-not-allowed'}`}>
                        {(isReviewPending||isActivityLoading) && <Loader2 className='w-4 h-4 animate-spin inline' />} Submit Review
                    </button>

                    <button type="button" disabled={isReviewPending||isActivityLoading} onClick={() => {
                        setShowReviewForm(false);
                        reset()
                    }}
                        className={`px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors ${(isReviewPending||isActivityLoading) ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ReviewForm