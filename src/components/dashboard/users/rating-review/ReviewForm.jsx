import React, { useState } from 'react'
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { addReviewRequest } from '../../../../redux/slice/reviewSlice';
import { Star } from 'lucide-react';
import getSweetAlert from '../../../../util/sweetAlert';
import { specificCourse } from '../../../../redux/slice/specificCourseSlice';

const ReviewForm = ({ getSpecificCourseData, setShowReviewForm}) => {

    const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' }),
        dispatch = useDispatch(),
        { control, register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: { rating: 0, comment: "" } }),
        { isReviewPending, getReviewData, isReviewError } = useSelector(state => state.review);

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

    const getSpecificCourse = (id) => {
        dispatch(specificCourse(id))
            .then(res => {
                // console.log('Response for specific course details fetching', res);
            })
            .catch(err => {
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
                console.log("Error occurred", err);
            });
    }

    const handleSubmitReview = async (data) => {
        const reviewObj = {
            rating: Number(data.rating),
            review: data.comment,
        };
        const id = getSpecificCourseData._id;

        dispatch(addReviewRequest({ reviewObj, id }))
            .then(res => {
                if (res.meta.requestStatus !== "rejected") {
                    getSweetAlert("Success...", "Review added successfully", "success");
                    reset();
                    setShowReviewForm(false);

                    getSpecificCourse(id);
                } else {
                    getSweetAlert("Oops...", "Something went wrong!", "error");
                }
            })
            .catch(err => {
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
                console.log("Error occurred", err);
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
                    <button type="submit"
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors">
                        {isReviewPending ? 'Submitting...' : 'Submit Review'}
                    </button>

                    <button type="button" onClick={() => {
                        setShowReviewForm(false);
                        reset()
                    }}
                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ReviewForm