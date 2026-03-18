import React, { useEffect, useMemo, useState } from 'react'
import { ChevronRight, Edit2 } from 'lucide-react';
import CourseContent from './course-details/CourseContent';
import CourseReview from './course-details/CourseReview';
import ReviewForm from './rating-review/ReviewForm';
import ReviewCard from './rating-review/ReviewCard';
import CourseDetails from './course-details/CourseDetails';
import { useCourseVideos } from '../../../../tanstack/query/fetchLectureVideo';
import { useCourseDetails } from '../../../../tanstack/query/fetchSpecificCourseDetails';
import { useCourseReviews } from '../../../../tanstack/query/fetchSpecificCourseReview';
import { useSelector } from 'react-redux';

const ActiveCourse = ({ setSelectedCourse, selectedCourse, getPurchaseData }) => {

    const [activeTab, setActiveTab] = useState('content');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userReview, setUserReview] = useState(null);
    const [reviewFilter, setReviewFilter] = useState('all');
    const [reviewFormData, setReviewFormData] = useState({ id: null, rating: 0, comment: null });

    const { userAuthData } = useSelector(state => state.checkAuth);
    const { isLoading: isCourseDetailsLoading, data: courseDetails, error: hasCourseDetailsError } = useCourseDetails(selectedCourse?.id);
    const { isLoading, data: lectureData, error } = useCourseVideos({ courseId: selectedCourse?.id });
    const { data: reviews, isLoading: isReviewLoading } = useCourseReviews(selectedCourse?.id);

    useEffect(() => {
        reviews?.forEach(review => {
            if (review?.student_id == userAuthData?.id) {
                setUserReview(review);
            }
        })
    }, [reviews]);

    const filteredReviews = useMemo(() => {
        if (!reviews) return [];

        let list = [...reviews];

        switch (reviewFilter) {
            case 'current':
                return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            case 'high':
                return list.sort((a, b) => b.rating_count - a.rating_count);

            case 'low':
                return list.sort((a, b) => a.rating_count - b.rating_count);

            default:
                return list;
        }
    }, [reviews, reviewFilter]);

    // console.log('Selected course details', selectedCourse);
    // console.log('User details', userAuthData);

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-6 cursor-pointer">
                        <ChevronRight className="w-5 h-5 rotate-180" />
                        <span>Back to My Courses</span>
                    </button>

                    <CourseDetails selectedCourse={courseDetails} lectureData={lectureData} userAuthData={userAuthData} />
                </div>

                <div className="flex gap-6 border-b border-gray-800 mb-8">
                    {['content', 'reviews'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 px-2 font-semibold transition-colors relative cursor-pointer ${activeTab === tab ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300'}`}>
                            {tab === 'content' ? 'Course Content' : 'Reviews'}
                            {tab === 'reviews' && <span className="text-xs bg-gray-800 px-2 py-1 rounded-full ml-2"> {reviews?.length ?? 0}</span>}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400" />}
                        </button>
                    ))}
                </div>

                {activeTab === 'content' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                        <CourseContent getSpecificCourseData={lectureData} userAuthData={userAuthData} selectedCourse={courseDetails} getPurchaseData={getPurchaseData} />
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div>
                        <CourseReview getSpecificCourseData={lectureData} selectedCourse={courseDetails} review={reviews} />

                        {!userReview && !showReviewForm && (
                            <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Share your experience</h3>
                                    <p className="text-gray-400 text-sm">Help others learn better by sharing your review</p>
                                </div>
                                <button onClick={() => setShowReviewForm(true)} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors flex items-center gap-2 cursor-pointer">
                                    <Edit2 className="w-4 h-4" />
                                    Write a Review
                                </button>
                            </div>
                        )}

                        {showReviewForm && (
                            <ReviewForm getSpecificCourseData={selectedCourse} authId={userAuthData?.id} setShowReviewForm={setShowReviewForm} reviewFormData={reviewFormData} setReviewFormData={setReviewFormData} />
                        )}

                        {userReview && <ReviewCard review={userReview} userId={userAuthData?.id} setShowReviewForm={setShowReviewForm} setUserReview={setUserReview} setReviewFormData={setReviewFormData} />}

                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold">Student Reviews</h3>
                                <select value={reviewFilter}
                                    onChange={(e) => setReviewFilter(e.target.value)}
                                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
                                >
                                    <option value="all">All</option>
                                    <option value="current">Most Recent</option>
                                    <option value="high">Highest Rating</option>
                                    <option value="low">Lowest Rating</option>
                                </select>

                            </div>
                            <div className="space-y-6 text-center">
                                {filteredReviews?.length == 0 ? "No Review Available" : filteredReviews?.map(review => <ReviewCard key={review?.id} review={review} userId={userAuthData?.id} setShowReviewForm={setShowReviewForm} setReviewFormData={setReviewFormData} />)}

                                {/* {filteredReviews?.length == 0 ? "No Review Available" : filteredReviews?.map(review => {
                                    if (review?.student_id != userAuthData?.id) {
                                        return (
                                            <ReviewCard key={review?.id} review={review} userId={userAuthData?.id} setShowReviewForm={setShowReviewForm} setUserReview={setUserReview} setReviewFormData={setReviewFormData} />
                                        )
                                    }
                                })} */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ActiveCourse