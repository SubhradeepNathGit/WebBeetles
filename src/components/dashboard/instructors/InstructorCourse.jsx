import React, { useState } from 'react';
import { Play, Clock, Users, DollarSign, Star, Edit2, Trash2, Plus, Upload, X, BookOpen, Eye, ChevronRight, ChevronDown, PlayCircle, FileText, Video } from 'lucide-react';
import DashboardLayout from '../../../pages/dashboard/DashboardLayout';

const InstructorCourse = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [uploadForm, setUploadForm] = useState({ title: '', duration: '', type: 'video', sectionId: null });
  const [courses, setCourses] = useState([
    { id: 1, title: "Advanced React & Redux Masterclass", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop", students: 1234, revenue: 15420, rating: 4.8, totalLessons: 35, duration: "12h 30m", status: "published" },
    { id: 2, title: "Full Stack Web Development Bootcamp", thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=225&fit=crop", students: 856, revenue: 10272, rating: 4.5, totalLessons: 36, duration: "18h 45m", status: "published" },
    { id: 3, title: "UI/UX Design Fundamentals", thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop", students: 2103, revenue: 25236, rating: 4.9, totalLessons: 24, duration: "8h 20m", status: "published" },
    { id: 4, title: "Python for Data Science", thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop", students: 543, revenue: 6516, rating: 4.7, totalLessons: 42, duration: "15h 10m", status: "draft" }
  ]);

  const [courseContent, setCourseContent] = useState({
    1: {
      sections: [
        { id: 1, title: "Getting Started with React", duration: "2h 15m", lessons: [
          { id: 1, title: "Introduction to React", type: "video", duration: "12:30", views: 1205, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", uploadedAt: "2024-08-15" },
          { id: 2, title: "Setting Up Development Environment", type: "video", duration: "18:45", views: 1150, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", uploadedAt: "2024-08-16" },
          { id: 3, title: "Your First React Component", type: "video", duration: "25:20", views: 1098, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", uploadedAt: "2024-08-17" },
          { id: 4, title: "Quiz: React Basics", type: "quiz", duration: "10:00", views: 987, uploadedAt: "2024-08-18" }
        ]},
        { id: 2, title: "State Management Patterns", duration: "3h 45m", lessons: [
          { id: 5, title: "Understanding State in React", type: "video", duration: "22:15", views: 945, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", uploadedAt: "2024-08-20" },
          { id: 6, title: "Props vs State", type: "video", duration: "16:30", views: 892, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", uploadedAt: "2024-08-21" },
          { id: 7, title: "Context API Deep Dive", type: "video", duration: "32:45", views: 856, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", uploadedAt: "2024-08-22" },
          { id: 8, title: "Introduction to Redux", type: "video", duration: "28:20", views: 812, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", uploadedAt: "2024-08-23" }
        ]}
      ]
    }
  });

  // API placeholder functions
  const apiCalls = {
    fetchCourses: async () => {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/instructor/courses');
      // const data = await response.json();
      // setCourses(data);
      console.log('API: Fetching courses...');
    },
    fetchCourseContent: async (courseId) => {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/instructor/courses/${courseId}/content`);
      // const data = await response.json();
      // setCourseContent(prev => ({ ...prev, [courseId]: data }));
      console.log(`API: Fetching content for course ${courseId}...`);
    },
    updateCourse: async (courseId, data) => {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/instructor/courses/${courseId}`, {
      //   method: 'PUT',
      //   body: JSON.stringify(data)
      // });
      console.log(`API: Updating course ${courseId}...`, data);
    },
    deleteCourse: async (courseId) => {
      // TODO: Replace with actual API call
      // await fetch(`/api/instructor/courses/${courseId}`, { method: 'DELETE' });
      console.log(`API: Deleting course ${courseId}...`);
    },
    uploadVideo: async (courseId, sectionId, videoData) => {
      // TODO: Replace with actual API call
      // const formData = new FormData();
      // formData.append('video', videoData.file);
      // formData.append('title', videoData.title);
      // const response = await fetch(`/api/instructor/courses/${courseId}/sections/${sectionId}/videos`, {
      //   method: 'POST',
      //   body: formData
      // });
      console.log(`API: Uploading video to course ${courseId}, section ${sectionId}...`, videoData);
    },
    deleteVideo: async (courseId, videoId) => {
      // TODO: Replace with actual API call
      // await fetch(`/api/instructor/courses/${courseId}/videos/${videoId}`, { method: 'DELETE' });
      console.log(`API: Deleting video ${videoId}...`);
    }
  };

  const handleDeleteCourse = (id) => {
    apiCalls.deleteCourse(id);
    setCourses(courses.filter(c => c.id !== id));
    setShowDeleteModal(null);
    if (selectedCourse?.id === id) setSelectedCourse(null);
  };

  const handleEditCourse = () => {
    apiCalls.updateCourse(editForm.id, editForm);
    setCourses(courses.map(c => c.id === editForm.id ? { ...c, ...editForm } : c));
    if (selectedCourse?.id === editForm.id) setSelectedCourse({ ...selectedCourse, ...editForm });
    setShowEditModal(null);
  };

  const handleUploadVideo = () => {
    const newLesson = {
      id: Date.now(),
      title: uploadForm.title,
      type: uploadForm.type,
      duration: uploadForm.duration,
      views: 0,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    
    apiCalls.uploadVideo(selectedCourse.id, uploadForm.sectionId, uploadForm);
    
    setCourseContent(prev => ({
      ...prev,
      [selectedCourse.id]: {
        ...prev[selectedCourse.id],
        sections: prev[selectedCourse.id].sections.map(section =>
          section.id === uploadForm.sectionId
            ? { ...section, lessons: [...section.lessons, newLesson] }
            : section
        )
      }
    }));
    
    setShowUploadModal(null);
    setUploadForm({ title: '', duration: '', type: 'video', sectionId: null });
  };

  const handleDeleteVideo = (sectionId, videoId) => {
    apiCalls.deleteVideo(selectedCourse.id, videoId);
    
    setCourseContent(prev => ({
      ...prev,
      [selectedCourse.id]: {
        ...prev[selectedCourse.id],
        sections: prev[selectedCourse.id].sections.map(section =>
          section.id === sectionId
            ? { ...section, lessons: section.lessons.filter(l => l.id !== videoId) }
            : section
        )
      }
    }));
  };

  const StatCard = ({ icon: Icon, value, label, gradient }) => (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 border border-opacity-30`}>
      <Icon className="w-8 h-8 mb-2" />
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );

  const CourseCard = ({ course }) => (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-600 transition-all group">
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => { setSelectedCourse(course); setExpandedSections({ 1: true }); }}>
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${course.status === 'published' ? 'bg-green-500' : 'bg-yellow-500 text-black'}`}>
          {course.status}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4">{course.title}</h3>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-4 h-4" />
            <span>{course.students} students</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{course.rating}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <PlayCircle className="w-4 h-4" />
            <span>{course.totalLessons} lessons</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <DollarSign className="w-4 h-4" />
            <span>${course.revenue}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setEditForm(course); setShowEditModal(course); }} className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button onClick={() => setShowDeleteModal(course)} className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const LessonItem = ({ lesson, sectionId }) => {
    const iconMap = { video: PlayCircle, quiz: FileText };
    const Icon = iconMap[lesson.type] || PlayCircle;
    
    return (
      <div className="flex items-center justify-between p-4 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{lesson.title}</h4>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="capitalize">{lesson.type}</span>
              <span>•</span>
              <span>{lesson.duration}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{lesson.views} views</span>
              </div>
              {lesson.uploadedAt && (
                <>
                  <span>•</span>
                  <span>Uploaded: {lesson.uploadedAt}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {lesson.type === 'video' && (
            <button onClick={() => setShowVideoModal(lesson)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <Play className="w-4 h-4" />
              Play
            </button>
          )}
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteVideo(sectionId, lesson.id)} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  if (selectedCourse) {
    const content = courseContent[selectedCourse.id];
    
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-6">
            <ChevronRight className="w-5 h-5 rotate-180" />
            Back to Dashboard
          </button>
          
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-3">{selectedCourse.title}</h1>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2"><Users className="w-4 h-4" />{selectedCourse.students} students</span>
                <span className="flex items-center gap-2"><Star className="w-4 h-4" />{selectedCourse.rating} rating</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{selectedCourse.duration}</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => { setEditForm(selectedCourse); setShowEditModal(selectedCourse); }} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                Edit Course
              </button>
              <button onClick={() => setShowDeleteModal(selectedCourse)} className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>

          <div className="mb-6">
            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Section
            </button>
          </div>

          <div className="space-y-4">
            {content?.sections.map((section) => (
              <div key={section.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                <div className="flex items-center justify-between p-4 bg-gray-800">
                  <button onClick={() => setExpandedSections(prev => ({ ...prev, [section.id]: !prev[section.id] }))} className="flex items-center gap-4 flex-1">
                    {expandedSections[section.id] ? <ChevronDown className="w-5 h-5 text-purple-400" /> : <ChevronRight className="w-5 h-5 text-purple-400" />}
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">{section.title}</h3>
                      <p className="text-sm text-gray-400">{section.lessons.length} lessons • {section.duration}</p>
                    </div>
                  </button>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {expandedSections[section.id] && (
                  <div>
                    {section.lessons.map((lesson) => <LessonItem key={lesson.id} lesson={lesson} sectionId={section.id} />)}
                    <div className="p-4 border-t border-gray-800">
                      <button onClick={() => { setUploadForm({ ...uploadForm, sectionId: section.id }); setShowUploadModal(true); }} className="w-full py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/50 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-purple-400">
                        <Upload className="w-5 h-5" />
                        Upload Video / Add Content
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Video Player Modal */}
        {showVideoModal && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl max-w-5xl w-full border border-gray-800">
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h2 className="text-xl font-bold">{showVideoModal.title}</h2>
                <button onClick={() => setShowVideoModal(null)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={showVideoModal.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="mt-4 flex items-center gap-6 text-sm text-gray-400">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {showVideoModal.duration}
                  </span>
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {showVideoModal.views} views
                  </span>
                  <span>Uploaded: {showVideoModal.uploadedAt}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Video Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-8 max-w-2xl w-full border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Upload Content</h2>
                <button onClick={() => setShowUploadModal(null)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Content Type</label>
                  <select value={uploadForm.type} onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors">
                    <option value="video">Video</option>
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input type="text" value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} placeholder="Lesson title" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <input type="text" value={uploadForm.duration} onChange={(e) => setUploadForm({ ...uploadForm, duration: e.target.value })} placeholder="e.g., 15:30" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" />
                </div>
                {uploadForm.type === 'video' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Video File</label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                      <p className="text-gray-400 mb-2">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">MP4, MOV, AVI (max. 500MB)</p>
                      <input type="file" accept="video/*" className="hidden" />
                    </div>
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <button onClick={handleUploadVideo} disabled={!uploadForm.title || !uploadForm.duration} className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors">
                    Upload
                  </button>
                  <button onClick={() => setShowUploadModal(null)} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Courses</h1>
            <p className="text-gray-400">Manage your courses and track performance</p>
          </div>
          <button onClick={() => window.dispatchEvent(new CustomEvent("open-add-course"))} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Course
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard icon={BookOpen} value={courses.length} label="Total Courses" gradient="from-purple-600/20 to-purple-800/20 border-purple-700/30" />
          <StatCard icon={Users} value={courses.reduce((a, c) => a + c.students, 0).toLocaleString()} label="Total Students" gradient="from-blue-600/20 to-blue-800/20 border-blue-700/30" />
          <StatCard icon={DollarSign} value={`$${courses.reduce((a, c) => a + c.revenue, 0).toLocaleString()}`} label="Total Revenue" gradient="from-green-600/20 to-green-800/20 border-green-700/30" />
          <StatCard icon={Star} value="4.7" label="Avg Rating" gradient="from-yellow-600/20 to-yellow-800/20 border-yellow-700/30" />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {courses.map((course) => <CourseCard key={course.id} course={course} />)}
        </div>
      </div>

      {/* Delete Course Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Delete Course?</h2>
            <p className="text-gray-400 mb-6">Are you sure you want to delete "{showDeleteModal.title}"? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDeleteCourse(showDeleteModal.id)} className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors">
                Delete
              </button>
              <button onClick={() => setShowDeleteModal(null)} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl p-8 max-w-2xl w-full border border-gray-800 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Edit Course</h2>
              <button onClick={() => setShowEditModal(null)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Course Title</label>
                <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <input type="text" value={editForm.duration} onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={handleEditCourse} className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors">
                  Save Changes
                </button>
                <button onClick={() => setShowEditModal(null)} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorCourse;