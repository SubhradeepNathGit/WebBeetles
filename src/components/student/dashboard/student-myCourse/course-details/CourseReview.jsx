import React from 'react'
import { getStarCount } from '../../../../../function/getStarCount';
import { Star, Stars } from 'lucide-react';
import CourseRating from '../rating-review/CourseRating';

const CourseReview = ({ getSpecificCourseData, selectedCourse, review }) => {

    return (
        <div className="bg-gray-900 rounded-xl p-8 mb-8 border border-gray-800">
            <div className="flex items-start gap-8">
                <div className="text-center">

                    <span className="text-5xl font-bold mb-2">
                        <Stars className='h-6 w-6 text-yellow-400' />{" "}
                        <CourseRating courseId={selectedCourse?.id} />
                    </span>

                    <div className="text-sm text-gray-400 mt-2">Course Rating</div>
                </div>
                <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const counts = getStarCount(review)[0];
                        const percentage = getStarCount(review)[1] != 0 ? (counts[star] / getStarCount(review)[1]) * 100 : 0;
                        return (
                            <div key={star} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-20">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm">{star}</span>
                                </div>
                                <div className="flex-1 bg-gray-800 rounded-full h-2">
                                    <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                                </div>
                                <span className="text-sm text-gray-400 w-12">{percentage.toFixed(0)}%</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default CourseReview