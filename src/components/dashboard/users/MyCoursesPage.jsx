import React, { useState } from 'react';
import { Play, Clock, Award, BookOpen, ChevronRight, ChevronDown, PlayCircle, FileText, CheckCircle, Lock, Star, ThumbsUp, MessageSquare, Edit2, Trash2 } from 'lucide-react';

const MyCoursesPage = ({userData}) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [activeTab, setActiveTab] = useState('content');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: '', comment: '' });

  const courses = [
    { id: 1, title: "Advanced React & Redux Masterclass", instructor: "Sarah Johnson", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop", progress: 65, totalLessons: 35, completedLessons: 23, duration: "12h 30m", rating: 4.8, enrolled: "2024-08-15" },
    { id: 2, title: "Full Stack Web Development Bootcamp", instructor: "Mike Chen", thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=225&fit=crop", progress: 42, totalLessons: 36, completedLessons: 15, duration: "18h 45m", rating: 4.5, enrolled: "2024-09-01" },
    { id: 3, title: "UI/UX Design Fundamentals", instructor: "Emma Davis", thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop", progress: 78, totalLessons: 24, completedLessons: 18, duration: "8h 20m", rating: 4.9, enrolled: "2024-07-20" },
    { id: 4, title: "Python for Data Science", instructor: "Dr. James Wilson", thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop", progress: 23, totalLessons: 42, completedLessons: 10, duration: "15h 10m", rating: 4.7, enrolled: "2024-09-15" },
    { id: 5, title: "Machine Learning A-Z", instructor: "Prof. Sarah Martinez", thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop", progress: 10, totalLessons: 58, completedLessons: 6, duration: "22h 15m", rating: 4.8, enrolled: "2024-09-28" },
    { id: 6, title: "Mobile App Development with Flutter", instructor: "Alex Kumar", thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop", progress: 55, totalLessons: 30, completedLessons: 16, duration: "14h 30m", rating: 4.6, enrolled: "2024-08-10" }
  ];

  const courseContent = {
    1: {
      reviews: [
        { id: 1, userName: "John Smith", userAvatar: "JS", rating: 5, date: "2024-09-15", title: "Excellent course for advanced React developers", comment: "This course exceeded my expectations. The Redux patterns are explained clearly and the projects are very practical. Sarah is an amazing instructor!", helpful: 24, hasUserVoted: false },
        { id: 2, userName: "Maria Garcia", userAvatar: "MG", rating: 4, date: "2024-09-10", title: "Great content but a bit fast-paced", comment: "The content is top-notch and covers everything you need to know about React and Redux. However, some sections move quite quickly, so be prepared to pause and practice.", helpful: 18, hasUserVoted: true },
        { id: 3, userName: "David Chen", userAvatar: "DC", rating: 5, date: "2024-09-05", title: "Best React course I've taken", comment: "I've taken several React courses, and this one is by far the best. The state management section alone is worth the price. Highly recommended!", helpful: 31, hasUserVoted: false },
        { id: 4, userName: "Emily Johnson", userAvatar: "EJ", rating: 4, date: "2024-08-28", title: "Solid course with practical examples", comment: "Really enjoyed the hands-on approach. The projects helped me understand how to implement these patterns in real applications. Would love more content on testing.", helpful: 15, hasUserVoted: false }
      ],
      sections: [
        { id: 1, title: "Getting Started with React", duration: "2h 15m", lessons: [
          { id: 1, title: "Introduction to React", type: "video", duration: "12:30", completed: true },
          { id: 2, title: "Setting Up Development Environment", type: "video", duration: "18:45", completed: true },
          { id: 3, title: "Your First React Component", type: "video", duration: "25:20", completed: true },
          { id: 4, title: "Quiz: React Basics", type: "quiz", duration: "10:00", completed: true }
        ]},
        { id: 2, title: "State Management Patterns", duration: "3h 45m", lessons: [
          { id: 5, title: "Understanding State in React", type: "video", duration: "22:15", completed: true },
          { id: 6, title: "Props vs State", type: "video", duration: "16:30", completed: true },
          { id: 7, title: "Context API Deep Dive", type: "video", duration: "32:45", completed: true },
          { id: 8, title: "Introduction to Redux", type: "video", duration: "28:20", completed: false },
          { id: 9, title: "Redux Toolkit", type: "video", duration: "35:40", completed: false },
          { id: 10, title: "Assignment: Build a Todo App", type: "assignment", duration: "45:00", completed: false }
        ]},
        { id: 3, title: "Advanced React Patterns", duration: "4h 20m", lessons: [
          { id: 11, title: "Higher Order Components", type: "video", duration: "24:15", locked: true },
          { id: 12, title: "Render Props Pattern", type: "video", duration: "28:30", locked: true },
          { id: 13, title: "Custom Hooks", type: "video", duration: "32:45", locked: true },
          { id: 14, title: "Performance Optimization", type: "video", duration: "26:20", locked: true }
        ]},
        { id: 4, title: "Testing React Applications", duration: "2h 50m", lessons: [
          { id: 15, title: "Introduction to Testing", type: "video", duration: "18:15", locked: true },
          { id: 16, title: "Jest Basics", type: "video", duration: "22:30", locked: true },
          { id: 17, title: "React Testing Library", type: "video", duration: "28:45", locked: true },
          { id: 18, title: "Final Project", type: "assignment", duration: "60:00", locked: true }
        ]}
      ]
    }
  };

  const resetState = () => {
    setSelectedCourse(null);
    setExpandedSections({});
    setActiveTab('content');
    setShowReviewForm(false);
    setUserReview(null);
  };

  const handleSubmitReview = () => {
    if (reviewForm.rating > 0 && reviewForm.title && reviewForm.comment.length >= 50) {
      setUserReview({
        id: Date.now(),
        userName: "You",
        userAvatar: "U",
        rating: reviewForm.rating,
        date: new Date().toISOString().split('T')[0],
        title: reviewForm.title,
        comment: reviewForm.comment,
        helpful: 0,
        isUserReview: true
      });
      setShowReviewForm(false);
      setReviewForm({ rating: 0, title: '', comment: '' });
    }
  };

  const handleEditReview = () => {
    setReviewForm({ rating: userReview.rating, title: userReview.title, comment: userReview.comment });
    setShowReviewForm(true);
  };

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

  const StatCard = ({ icon: Icon, value, label, gradient }) => (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 border border-opacity-30`}>
      <Icon className="w-8 h-8 mb-2" />
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );

  const CourseCard = ({ course, onClick }) => (
    <div onClick={onClick} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-600 transition-all cursor-pointer group">
      <div className="relative h-48 overflow-hidden">
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-sm text-white/80">
          <Clock className="w-4 h-4" />
          <span>{course.duration}</span>
          <span>•</span>
          <span>{course.totalLessons} lessons</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{course.title}</h3>
        <p className="text-gray-400 text-sm mb-4">by {course.instructor}</p>
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span>{course.rating}</span>
          </div>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400">{course.completedLessons}/{course.totalLessons} completed</span>
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="font-semibold text-purple-400">{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
          </div>
        </div>
        <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
          <Play className="w-4 h-4" />
          Continue Learning
        </button>
      </div>
    </div>
  );

  const LessonItem = ({ lesson }) => {
    const iconMap = { video: PlayCircle, quiz: FileText, assignment: FileText };
    const Icon = iconMap[lesson.type] || PlayCircle;
    
    return (
      <div className={`flex items-center justify-between p-4 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0 ${lesson.locked ? 'opacity-50' : 'cursor-pointer'}`}>
        <div className="flex items-center gap-4">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${lesson.completed ? 'bg-green-500' : lesson.locked ? 'bg-gray-700' : 'bg-purple-600'}`}>
            {lesson.completed ? <CheckCircle className="w-4 h-4" /> : lesson.locked ? <Lock className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="font-medium">{lesson.title}</h4>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="capitalize">{lesson.type}</span>
              <span>•</span>
              <span>{lesson.duration}</span>
            </div>
          </div>
        </div>
        {!lesson.locked && (
          <button className={`px-4 py-2 ${lesson.completed ? 'bg-gray-700 hover:bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'} rounded-lg text-sm font-medium transition-colors`}>
            {lesson.completed ? 'Review' : 'Start'}
          </button>
        )}
      </div>
    );
  };

  const ReviewCard = ({ review, isUserReview = false }) => (
    <div className={`rounded-xl p-6 border ${isUserReview ? 'bg-gradient-to-br from-purple-600/10 to-purple-800/10 border-purple-700/30' : 'bg-gray-900 border-gray-800'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isUserReview ? 'bg-purple-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
            {review.userAvatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-semibold">{review.userName}</h4>
              {isUserReview && <span className="text-xs bg-purple-600 px-2 py-1 rounded">Your Review</span>}
            </div>
            <Stars rating={review.rating} />
            <p className="text-sm text-gray-400 mt-1">{review.date}</p>
          </div>
        </div>
        {isUserReview && (
          <div className="flex gap-2">
            <button onClick={handleEditReview} className="p-2 hover:bg-gray-800 rounded-lg transition-colors" title="Edit Review">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={() => setUserReview(null)} className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors" title="Delete Review">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
      <p className="text-gray-300 mb-4">{review.comment}</p>
      {!isUserReview && (
        <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
          <button className={`flex items-center gap-2 text-sm transition-colors ${review.hasUserVoted ? 'text-purple-400' : 'text-gray-400 hover:text-purple-400'}`}>
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
  );

  if (selectedCourse) {
    const content = courseContent[selectedCourse.id];
    
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <button onClick={resetState} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-6">
              <ChevronRight className="w-5 h-5 rotate-180" />
              <span>Back to My Courses</span>
            </button>
            
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-3">{selectedCourse.title}</h1>
                <p className="text-lg text-gray-400 mb-4">by {selectedCourse.instructor}</p>
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  {[
                    { icon: Clock, text: selectedCourse.duration },
                    { icon: BookOpen, text: `${selectedCourse.totalLessons} Lessons` },
                    { icon: Award, text: 'Certificate Available' }
                  ].map((item, i) => (
                    <span key={i} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.text}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 min-w-[280px]">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Course Progress</span>
                    <span className="font-semibold text-purple-400">{selectedCourse.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all" style={{ width: `${selectedCourse.progress}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 mb-1">Completed</div>
                    <div className="font-semibold text-lg">{selectedCourse.completedLessons}/{selectedCourse.totalLessons}</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-gray-400 mb-1">Rating</div>
                    <div className="font-semibold text-lg flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      {selectedCourse.rating}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-6 border-b border-gray-800 mb-8">
            {['content', 'reviews'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 px-2 font-semibold transition-colors relative ${activeTab === tab ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300'}`}>
                {tab === 'content' ? 'Course Content' : 'Reviews'}
                {tab === 'reviews' && <span className="text-xs bg-gray-800 px-2 py-1 rounded-full ml-2">{content?.reviews?.length || 0}</span>}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400" />}
              </button>
            ))}
          </div>

          {activeTab === 'content' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-6">Course Content</h2>
              {content?.sections.map((section) => (
                <div key={section.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                  <button onClick={() => setExpandedSections(prev => ({ ...prev, [section.id]: !prev[section.id] }))} className="w-full flex items-center justify-between p-4 hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-4">
                      {expandedSections[section.id] ? <ChevronDown className="w-5 h-5 text-purple-400" /> : <ChevronRight className="w-5 h-5 text-purple-400" />}
                      <div className="text-left">
                        <h3 className="font-semibold text-lg">{section.title}</h3>
                        <p className="text-sm text-gray-400">{section.lessons.length} lessons • {section.duration}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">{section.lessons.filter(l => l.completed).length}/{section.lessons.length} completed</div>
                  </button>
                  {expandedSections[section.id] && (
                    <div className="border-t border-gray-800">
                      {section.lessons.map((lesson) => <LessonItem key={lesson.id} lesson={lesson} />)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="bg-gray-900 rounded-xl p-8 mb-8 border border-gray-800">
                <div className="flex items-start gap-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold mb-2">{selectedCourse.rating}</div>
                    <Stars rating={Math.round(selectedCourse.rating)} />
                    <div className="text-sm text-gray-400 mt-2">Course Rating</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const counts = { 5: 245, 4: 123, 3: 45, 2: 12, 1: 8 };
                      const percentage = (counts[star] / 433) * 100;
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

              {!userReview && !showReviewForm && (
                <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Share your experience</h3>
                    <p className="text-gray-400 text-sm">Help others learn better by sharing your review</p>
                  </div>
                  <button onClick={() => setShowReviewForm(true)} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    Write a Review
                  </button>
                </div>
              )}

              {showReviewForm && (
                <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
                  <h3 className="text-xl font-semibold mb-6">Write Your Review</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-3">Rating *</label>
                      <Stars rating={reviewForm.rating} interactive onRate={(rating) => setReviewForm({ ...reviewForm, rating })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Review Title *</label>
                      <input type="text" value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} placeholder="Summarize your experience" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Review *</label>
                      <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Share your thoughts about the course..." rows={6} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors resize-none" />
                      <p className="text-xs text-gray-500 mt-2">Minimum 50 characters</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleSubmitReview} disabled={!reviewForm.rating || !reviewForm.title || reviewForm.comment.length < 50} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors">
                        Submit Review
                      </button>
                      <button onClick={() => { setShowReviewForm(false); setReviewForm({ rating: 0, title: '', comment: '' }); }} className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {userReview && <ReviewCard review={userReview} isUserReview />}

              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Student Reviews</h3>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500">
                    <option>Most Helpful</option>
                    <option>Most Recent</option>
                    <option>Highest Rating</option>
                    <option>Lowest Rating</option>
                  </select>
                </div>
                <div className="space-y-6">
                  {content?.reviews?.map((review) => <ReviewCard key={review.id} review={review} />)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Courses</h1>
          <p className="text-gray-400">Continue your learning journey</p>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard icon={BookOpen} value={courses.length} label="Enrolled Courses" gradient="from-purple-600/20 to-purple-800/20 border-purple-700/30" />
          <StatCard icon={CheckCircle} value={courses.filter(c => c.progress === 100).length} label="Completed" gradient="from-green-600/20 to-green-800/20 border-green-700/30" />
          <StatCard icon={Play} value={courses.filter(c => c.progress > 0 && c.progress < 100).length} label="In Progress" gradient="from-blue-600/20 to-blue-800/20 border-blue-700/30" />
          <StatCard icon={Award} value="3" label="Certificates" gradient="from-orange-600/20 to-orange-800/20 border-orange-700/30" />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onClick={() => { setSelectedCourse(course); setExpandedSections({ 1: true }); }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCoursesPage;