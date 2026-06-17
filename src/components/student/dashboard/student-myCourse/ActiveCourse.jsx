import React, { useEffect, useMemo, useState } from 'react'
import { ChevronRight, Edit2, Award } from 'lucide-react';
import CourseContent from './course-details/CourseContent';
import CourseReview from './course-details/CourseReview';
import ReviewForm from './rating-review/ReviewForm';
import ReviewCard from './rating-review/ReviewCard';
import CourseDetails from './course-details/CourseDetails';
import CertificateModal from './course-details/CertificateModal';
import { useCourseVideos } from '../../../../tanstack/query/fetchLectureVideo';
import { useCourseDetails } from '../../../../tanstack/query/fetchSpecificCourseDetails';
import { useCourseReviews } from '../../../../tanstack/query/fetchSpecificCourseReview';
import { useLectureProgress } from '../../../../tanstack/query/fetchVideoProgressDetails';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserPurchase } from '../../../../redux/slice/purchaseSlice';
import supabaseAdmin from '../../../../util/supabase/supabaseAdmin';
import { createAudienceNotifications } from '../../../../util/notification/notificationHelper';

const ActiveCourse = ({ setSelectedCourse, selectedCourse, getPurchaseData }) => {

    const [activeTab, setActiveTab] = useState('content');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userReview, setUserReview] = useState(null);
    const [reviewFilter, setReviewFilter] = useState('all');
    const [reviewFormData, setReviewFormData] = useState({ id: null, rating: 0, comment: null });
    const [showCertModal, setShowCertModal] = useState(false);

    const handleViewCertificate = async () => {
        setShowCertModal(true);
        await createAudienceNotifications({
            student: {
                title: 'Certificate Generated',
                message: `Your certificate for ${courseDetails?.title} has been generated.`,
                type: 'success',
                user_type: 'student',
                user_id: userAuthData?.id,
                link: `/student/dashboard`,
            },
            admin: {
                title: 'Certificate Generated',
                message: `${userAuthData?.name || 'A student'} generated a certificate for ${courseDetails?.title}.`,
                type: 'success',
                user_type: 'admin',
                user_id: null,
                link: '/admin/students',
            },
        });
    };

    const dispatch = useDispatch();
    const { userAuthData } = useSelector(state => state.checkAuth);
    const { isLoading: isCourseDetailsLoading, data: courseDetails, error: hasCourseDetailsError } = useCourseDetails(selectedCourse?.id);
    const { isLoading, data: lectureData, error } = useCourseVideos({ courseId: selectedCourse?.id });
    const { data: reviews, isLoading: isReviewLoading } = useCourseReviews(selectedCourse?.id);
    const { data: progressData } = useLectureProgress({ student_id: userAuthData?.id, course_id: selectedCourse?.id });

    useEffect(() => {
        reviews?.forEach(review => {
            if (review?.student_id == userAuthData?.id) {
                setUserReview(review);
            }
        })
    }, [reviews, userAuthData?.id]);

    const purchaseItems = useMemo(() => {
        return getPurchaseData?.flatMap(order => order.purchase_items.filter(item => item?.course_id == selectedCourse?.id)) || [];
    }, [getPurchaseData, selectedCourse?.id]);



    // Check if the user has completed all non-preview videos and all documents
    const isCompleted = useMemo(() => {
        if (!lectureData || !progressData || lectureData.length === 0) return false;
        const requiredLectures = lectureData.filter(l => !l.isPreview);
        if (requiredLectures.length === 0) return false;
        return requiredLectures.every(l => 
            progressData.some(p => p.lesson_id === l.id && p.completed)
        );
    }, [lectureData, progressData]);

    // Send Course Completed notification exactly once
    useEffect(() => {
        if (isCompleted && userAuthData?.id && courseDetails?.title) {
            const checkAndNotifyCompletion = async () => {
                const { data } = await supabaseAdmin.from('notifications')
                    .select('id')
                    .eq('user_id', userAuthData.id)
                    .eq('title', 'Course Completed')
                    .like('message', `%${courseDetails?.title}%`)
                    .maybeSingle();
                
                if (!data) {
                    await createAudienceNotifications({
                        student: {
                            title: 'Course Completed',
                            message: `Congratulations! You have completed the course ${courseDetails?.title}.`,
                            type: 'success',
                            user_type: 'student',
                            user_id: userAuthData.id,
                            link: '/student/dashboard',
                        },
                        admin: {
                            title: 'Course Completed',
                            message: `${userAuthData?.name || 'A student'} completed ${courseDetails?.title}.`,
                            type: 'success',
                            user_type: 'admin',
                            user_id: null,
                            link: '/admin/students',
                        },
                    });
                }
            };
            checkAndNotifyCompletion();
        }
    }, [isCompleted, userAuthData?.id, courseDetails?.title]);



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
        <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 text-white/80 hover:text-white transition-all duration-300 mb-6 cursor-pointer">
                        <ChevronRight className="w-4 h-4 rotate-180 text-purple-400" />
                        <span>Back to My Courses</span>
                    </button>

                    <CourseDetails 
                        selectedCourse={courseDetails} 
                        lectureData={lectureData} 
                        userAuthData={userAuthData} 
                        isCompleted={isCompleted}
                        onViewCertificate={handleViewCertificate}
                    />
                </div>

                <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl mb-8 w-fit backdrop-blur-sm">
                    {['content', 'reviews'].map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)} 
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                                activeTab === tab 
                                    ? 'bg-purple-500/15 border border-purple-500/25 text-purple-300 shadow-sm' 
                                    : 'text-white/50 border border-transparent hover:text-white/80 hover:bg-white/[0.02]'
                            }`}
                        >
                            <span className="capitalize">{tab === 'content' ? 'Course Content' : 'Reviews'}</span>
                            {tab === 'reviews' && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                                    activeTab === tab 
                                        ? 'bg-purple-500/20 border-purple-500/30 text-purple-300' 
                                        : 'bg-white/5 border-white/10 text-white/40'
                                }`}>
                                    {reviews?.length ?? 0}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {activeTab === 'content' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                        <CourseContent getSpecificCourseData={lectureData} userAuthData={userAuthData} selectedCourse={courseDetails} getPurchaseData={getPurchaseData} />

                        {isCompleted && (
                            <div className="mt-8 pt-8 border-t border-[#1c1c1f] flex flex-col items-center justify-center text-center bg-[#0a0a0c] p-8 rounded-2xl border border-[#1c1c1f]/50 relative overflow-hidden">
                                {/* Background glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />
                                
                                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-5 border border-purple-500/20 relative z-10">
                                    <Award className="w-8 h-8 text-purple-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2 relative z-10">Congratulations! Course Completed</h3>
                                <p className="text-gray-400 mb-8 max-w-md relative z-10">You've successfully finished all the modules in this course. Your verified certificate of completion is now ready.</p>
                                <button 
                                    onClick={handleViewCertificate}
                                    className="px-8 py-3.5 bg-black text-white border border-gray-600 hover:bg-[#111] hover:border-gray-400 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95 relative z-10 text-sm tracking-wide"
                                >
                                    Claim & View Certificate
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div>
                        <CourseReview getSpecificCourseData={lectureData} selectedCourse={courseDetails} review={reviews} />

                        {!userReview && !showReviewForm && (
                            <div className="bg-[#0a0a0c] rounded-xl p-6 mb-8 border border-[#1c1c1f] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Share your experience</h3>
                                    <p className="text-gray-400 text-sm">Help others learn better by sharing your review</p>
                                </div>
                                <button onClick={() => setShowReviewForm(true)} className="w-full sm:w-auto px-6 py-3 bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40 hover:text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95">
                                    <Edit2 className="w-4 h-4 text-purple-400" />
                                    Write a Review
                                </button>
                            </div>
                        )}

                        {showReviewForm && (
                            <ReviewForm getSpecificCourseData={selectedCourse} authId={userAuthData?.id} setShowReviewForm={setShowReviewForm} reviewFormData={reviewFormData} setReviewFormData={setReviewFormData} />
                        )}

                        {userReview && <ReviewCard review={userReview} userId={userAuthData?.id} setShowReviewForm={setShowReviewForm} setUserReview={setUserReview} setReviewFormData={setReviewFormData} />}

                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h3 className="text-xl font-semibold">Student Reviews</h3>
                                <select value={reviewFilter}
                                    onChange={(e) => setReviewFilter(e.target.value)}
                                    className="bg-[#0a0a0c] border border-[#26262b] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500 text-white"
                                >
                                    <option value="all">All</option>
                                    <option value="current">Most Recent</option>
                                    <option value="high">Highest Rating</option>
                                    <option value="low">Lowest Rating</option>
                                </select>

                            </div>
                            <div className="space-y-6 text-center">
                                {filteredReviews?.length == 0 ? "No Review Available" : filteredReviews?.map(review => <ReviewCard key={review?.id} review={review} userId={userAuthData?.id} setShowReviewForm={setShowReviewForm} setReviewFormData={setReviewFormData} />)}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showCertModal && (
                <CertificateModal
                    purchaseItemId={purchaseItems?.[0]?.id}
                    courseTitle={courseDetails?.title}
                    studentName={userAuthData?.name}
                    instructorName={courseDetails?.instructor?.name}
                    date={purchaseItems?.[0]?.updated_at || purchaseItems?.[0]?.created_at || new Date().toISOString()}
                    onClose={() => setShowCertModal(false)}
                />
            )}
        </div>
    );
};

export default ActiveCourse;
