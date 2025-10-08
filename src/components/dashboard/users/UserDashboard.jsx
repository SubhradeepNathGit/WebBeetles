import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  BookOpen, TrendingUp, Award, Clock, Play, Star, Users, Target, 
  Calendar, BarChart3, Download, ArrowRight, Sparkles, Trophy
} from "lucide-react";

const UserDashboard = () => {
  const user = useSelector((state) => state.auth?.user);
  const userName = user?.name || user?.fullName || "User";
  const userPhoto = user?.photo || user?.profilePhoto || user?.avatar;

  const [stats, setStats] = useState({ coursesEnrolled: 0, coursesCompleted: 0, hoursLearned: 0, certificatesEarned: 0 });
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [weeklyGoal, setWeeklyGoal] = useState({ current: 0, target: 15 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      // await Promise.all([
      //   fetch('/api/user/stats').then(r => r.json()).then(setStats),
      //   fetch('/api/user/enrolled-courses').then(r => r.json()).then(setEnrolledCourses),
      //   fetch('/api/user/recent-activity').then(r => r.json()).then(setRecentActivity),
      //   fetch('/api/user/deadlines').then(r => r.json()).then(setUpcomingDeadlines),
      //   fetch('/api/user/weekly-goal').then(r => r.json()).then(setWeeklyGoal)
      // ]);

      // Mock data
      setStats({ coursesEnrolled: 8, coursesCompleted: 3, hoursLearned: 47, certificatesEarned: 3 });
      setEnrolledCourses([
        { id: 1, title: "Advanced React & Redux Masterclass", instructor: "Sarah Johnson", progress: 65, thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400", duration: "12 hours", nextLesson: "State Management Patterns", rating: 4.8, students: 12453, lessonsCompleted: 23, totalLessons: 35 },
        { id: 2, title: "Full Stack Web Development Bootcamp", instructor: "Mike Chen", progress: 42, thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400", duration: "35 hours", nextLesson: "Backend API Development", rating: 4.9, students: 8765, lessonsCompleted: 15, totalLessons: 36 },
        { id: 3, title: "UI/UX Design Fundamentals", instructor: "Emma Davis", progress: 78, thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400", duration: "8 hours", nextLesson: "Prototyping in Figma", rating: 4.7, students: 5432, lessonsCompleted: 19, totalLessons: 24 }
      ]);
      setRecentActivity([
        { id: 1, course: "Advanced React & Redux", action: "Completed lesson", time: "2 hours ago", type: "completed" },
        { id: 2, course: "Full Stack Development", action: "Started new module", time: "1 day ago", type: "started" },
        { id: 3, course: "UI/UX Design", action: "Earned certificate", time: "3 days ago", type: "certificate" },
        { id: 4, course: "JavaScript Essentials", action: "Quiz passed with 95%", time: "5 days ago", type: "quiz" }
      ]);
      setUpcomingDeadlines([
        { id: 1, course: "Advanced React", task: "Final Project Submission", date: "Oct 15, 2025", priority: "high" },
        { id: 2, course: "Full Stack Dev", task: "Module 4 Quiz", date: "Oct 18, 2025", priority: "medium" },
        { id: 3, course: "UI/UX Design", task: "Design Challenge", date: "Oct 22, 2025", priority: "low" }
      ]);
      setWeeklyGoal({ current: 12, target: 15 });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const activityIcons = {
    completed: <Award size={16} className="text-green-400" />,
    started: <Play size={16} className="text-blue-400" />,
    certificate: <Trophy size={16} className="text-yellow-400" />,
    quiz: <Target size={16} className="text-purple-400" />
  };

  const priorityColors = {
    high: 'bg-red-500/20 border-red-400/30 text-red-200',
    medium: 'bg-orange-500/20 border-orange-400/30 text-orange-200',
    low: 'bg-green-500/20 border-green-400/30 text-green-200'
  };

  const statCards = [
    { icon: BookOpen, value: stats.coursesEnrolled, label: "Courses Enrolled", color: "purple", trend: "+2" },
    { icon: Award, value: stats.coursesCompleted, label: "Courses Completed", color: "green", trend: "+1" },
    { icon: Clock, value: stats.hoursLearned, label: "Hours Learned", color: "blue", trend: "+5h" },
    { icon: Target, value: stats.certificatesEarned, label: "Certificates Earned", color: "orange", trend: "+1" }
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-white text-xl">Loading dashboard...</div></div>;

  const goalPercentage = (weeklyGoal.current / weeklyGoal.target) * 100;

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 backdrop-blur-xl rounded-3xl shadow-2xl mb-8 border border-white/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="px-6 md:px-8 py-8 md:py-10 relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1 flex items-center gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full ring-4 ring-white/30 overflow-hidden shadow-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex-shrink-0">
                {userPhoto ? <img src={userPhoto} alt={userName} className="w-full h-full object-cover" /> : 
                <div className="w-full h-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold">{userName.charAt(0).toUpperCase()}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="text-yellow-300" size={24} />
                  <span className="text-sm font-semibold text-purple-200 bg-white/20 px-3 py-1 rounded-full">Student Dashboard</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">Welcome back, {userName}! 👋</h1>
                <p className="text-purple-100 text-sm md:text-base">Continue your learning journey and achieve your goals</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl font-medium transition-all shadow-lg border border-white/30 hover:scale-105">
              <Download size={18} />
              <span className="hidden sm:inline">Download Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:bg-white/15 hover:scale-105 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${stat.color}-500/40 to-${stat.color}-600/40 backdrop-blur-sm flex items-center justify-center border border-${stat.color}-400/30 shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="text-white" size={26} />
              </div>
              <span className="text-green-400 text-xs font-bold flex items-center gap-1 bg-green-500/20 px-2.5 py-1.5 rounded-lg border border-green-400/30">
                <TrendingUp size={14} />{stat.trend}
              </span>
            </div>
            <h3 className="text-4xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-purple-100 text-sm font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Continue Learning */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Play className="text-purple-300" size={28} />Continue Learning</h2>
              <button className="text-purple-200 hover:text-white font-semibold text-sm flex items-center gap-1 bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all border border-white/20">View All<ArrowRight size={16} /></button>
            </div>
            <div className="space-y-5">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/15 transition-all duration-300 border border-white/10 hover:border-white/30 hover:shadow-2xl">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-shrink-0">
                      <img src={course.thumbnail} alt={course.title} className="w-full sm:w-40 h-32 sm:h-28 rounded-xl object-cover ring-2 ring-white/20" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
                          <Play size={20} className="text-purple-600 ml-1" fill="currentColor" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-lg mb-2 group-hover:text-purple-200 transition-colors line-clamp-1">{course.title}</h3>
                      <p className="text-sm text-purple-200 mb-3">by {course.instructor}</p>
                      <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs text-purple-200 mb-4">
                        <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg"><Star size={14} className="text-yellow-400" fill="currentColor" />{course.rating}</span>
                        <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg"><Users size={14} />{course.students.toLocaleString()}</span>
                        <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg"><Clock size={14} />{course.duration}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-purple-200">Progress: {course.lessonsCompleted}/{course.totalLessons} lessons</span>
                          <span className="font-bold text-white bg-white/20 px-3 py-1 rounded-lg">{course.progress}%</span>
                        </div>
                        <div className="h-3 bg-white/20 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-gradient-to-r from-purple-400 via-pink-500 to-purple-500 rounded-full transition-all duration-500 shadow-lg" style={{ width: `${course.progress}%` }} />
                        </div>
                        <p className="text-xs text-purple-200 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>Next: <span className="font-semibold text-white">{course.nextLesson}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><BarChart3 size={28} className="text-purple-300" />Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-white/10 last:border-0 last:pb-0 hover:bg-white/5 p-3 rounded-xl transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
                    {activityIcons[activity.type] || activityIcons.completed}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white mb-1">{activity.action}</p>
                    <p className="text-xs text-purple-200">{activity.course}</p>
                  </div>
                  <span className="text-xs text-purple-300 whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 md:space-y-8">
          {/* Deadlines */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Calendar size={28} className="text-orange-400" />Upcoming Deadlines</h2>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className={`${priorityColors[deadline.priority]} backdrop-blur-sm border rounded-2xl p-4 hover:scale-105 transition-transform`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-bold text-white text-sm flex-1">{deadline.task}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${deadline.priority === 'high' ? 'bg-red-500/30 text-red-200' : deadline.priority === 'medium' ? 'bg-orange-500/30 text-orange-200' : 'bg-green-500/30 text-green-200'}`}>
                      {deadline.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs mb-3 opacity-90">{deadline.course}</p>
                  <div className="flex items-center gap-2 text-xs font-medium"><Clock size={14} />{deadline.date}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Goal */}
          <div className="bg-gradient-to-br from-purple-500/40 to-pink-500/40 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/30">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Target size={28} />Weekly Goal</h2>
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-white font-medium">Learning Time</span>
                  <span className="font-bold text-white text-lg">{weeklyGoal.current} / {weeklyGoal.target} hours</span>
                </div>
                <div className="h-4 bg-white/20 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-white to-purple-200 rounded-full shadow-lg" style={{ width: `${goalPercentage}%` }} />
                </div>
              </div>
              <div className="bg-white/20 rounded-2xl p-4 border border-white/30">
                <p className="text-sm text-white font-medium">🎯 {goalPercentage >= 100 ? "Congratulations! You've achieved your weekly goal!" : `You're doing great! Just ${weeklyGoal.target - weeklyGoal.current} more hours to reach your weekly goal.`}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { label: "Browse All Courses", color: "purple" },
                { label: "Request Instructor", color: "blue" },
                { label: "View Certificates", color: "green" }
              ].map((action, i) => (
                <button key={i} className={`w-full text-left px-5 py-4 bg-${action.color}-500/30 hover:bg-${action.color}-500/50 backdrop-blur-sm rounded-2xl text-white font-semibold text-sm transition-all border border-${action.color}-400/30 hover:scale-105 hover:shadow-xl flex items-center justify-between group`}>
                  <span>{action.label}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;