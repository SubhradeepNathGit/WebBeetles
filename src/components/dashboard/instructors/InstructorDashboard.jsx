import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BookOpen, TrendingUp, Users, DollarSign, Star, Calendar, BarChart3, Download, ArrowRight, Sparkles, MessageSquare, Award, Clock, Eye, Video, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const InstructorDashboard = () => {
  const user = useSelector((state) => state.auth?.user);
  const name = user?.name || user?.fullName || "Instructor";
  const photo = user?.photo || user?.profilePhoto || user?.avatar;

  const [data, setData] = useState({ stats: { totalCourses: 0, totalStudents: 0 }, courses: [], activity: [], tasks: [], monthly: { enrollments: 0, revenue: 0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with your axios API calls
      // const axios = (await import('axios')).default;
      // const [stats, courses, activity, tasks, monthly] = await Promise.all([
      //   axios.get('/api/instructor/stats'), axios.get('/api/instructor/courses'),
      //   axios.get('/api/instructor/activity'), axios.get('/api/instructor/tasks'),
      //   axios.get('/api/instructor/monthly')
      // ]);
      // setData({ stats: stats.data, courses: courses.data, activity: activity.data, tasks: tasks.data, monthly: monthly.data });

      await new Promise(r => setTimeout(r, 800));
      setData({
        stats: { totalCourses: 12, totalStudents: 3847 },
        courses: [
          { id: 1, title: "Advanced React & Redux Masterclass", students: 1245, revenue: 18675, rating: 4.9, thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400", trend: "+12%", views: 8934, completion: 78 },
          { id: 2, title: "Full Stack Web Development Bootcamp", students: 892, revenue: 13380, rating: 4.7, thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400", trend: "+8%", views: 6721, completion: 65 },
          { id: 3, title: "UI/UX Design Fundamentals", students: 654, revenue: 9810, rating: 4.8, thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400", trend: "+15%", views: 5432, completion: 82 }
        ],
        activity: [
          { id: 1, student: "Sarah Johnson", action: "Completed your course", course: "React Masterclass", time: "2h ago", type: "completed" },
          { id: 2, student: "Mike Chen", action: "Left a 5-star review", course: "Full Stack Bootcamp", time: "5h ago", type: "review" },
          { id: 3, student: "Emma Davis", action: "Asked a question", course: "UI/UX Design", time: "1d ago", type: "question" },
          { id: 4, student: "John Smith", action: "Enrolled in your course", course: "React Masterclass", time: "2d ago", type: "enrolled" }
        ],
        tasks: [
          { id: 1, task: "Review Assignment Submissions", course: "React Masterclass", date: "Oct 15, 2025", priority: "high", count: 23 },
          { id: 2, task: "Update Course Content", course: "Full Stack Dev", date: "Oct 18, 2025", priority: "medium", count: 5 },
          { id: 3, task: "Answer Student Questions", course: "UI/UX Design", date: "Oct 20, 2025", priority: "high", count: 12 }
        ],
        monthly: { enrollments: 234, revenue: 12450 }
      });
    } catch (err) { console.error("Fetch error:", err); } finally { setLoading(false); }
  };

  const icons = { completed: <Award size={16} className="text-green-400" />, review: <Star size={16} className="text-yellow-400" />, question: <MessageSquare size={16} className="text-blue-400" />, enrolled: <Users size={16} className="text-purple-400" /> };
  const priorities = { high: 'bg-red-500/20 border-red-400/30 text-red-200', medium: 'bg-orange-500/20 border-orange-400/30 text-orange-200', low: 'bg-green-500/20 border-green-400/30 text-green-200' };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 text-white animate-spin" /></div>;

  const stats = [
    { icon: BookOpen, value: data.stats.totalCourses, label: "Total Courses", color: "purple", trend: "+2" },
    { icon: Users, value: data.stats.totalStudents.toLocaleString(), label: "Total Students", color: "blue", trend: "+234" }
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 overflow-y-auto">
      <div className="bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 backdrop-blur-xl rounded-3xl shadow-2xl mb-8 border border-white/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="px-6 md:px-8 py-8 md:py-10 relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1 flex items-center gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full ring-4 ring-white/30 overflow-hidden shadow-2xl bg-gradient-to-br from-blue-400 to-purple-500">
                {photo ? <img src={photo} alt={name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold">{name[0].toUpperCase()}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="text-yellow-300" size={24} />
                  <span className="text-sm font-semibold text-purple-200 bg-white/20 px-3 py-1 rounded-full">Instructor Dashboard</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome back, {name}! 🎓</h1>
                <p className="text-purple-100 text-sm md:text-base">Empower students and track your teaching success</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${s.color}-500/40 to-${s.color}-600/40 flex items-center justify-center border border-${s.color}-400/30 shadow-lg group-hover:scale-110 transition-transform`}>
                <s.icon className="text-white" size={26} />
              </div>
              <span className="text-green-400 text-xs font-bold flex items-center gap-1 bg-green-500/20 px-2.5 py-1.5 rounded-lg border border-green-400/30">
                <TrendingUp size={14} />{s.trend}
              </span>
            </div>
            <h3 className="text-4xl font-bold text-white mb-1">{s.value}</h3>
            <p className="text-purple-100 text-sm font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Video className="text-blue-300" size={28} />My Courses</h2>
              <button className="text-purple-200 hover:text-white font-semibold text-sm flex items-center gap-1 bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all border border-white/20">View All<ArrowRight size={16} /></button>
            </div>
            <div className="space-y-5">
              {data.courses.map((c) => (
                <div key={c.id} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/15 transition-all border border-white/10 hover:border-white/30 hover:shadow-2xl">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-shrink-0">
                      <img src={c.thumbnail} alt={c.title} className="w-full sm:w-40 h-32 sm:h-28 rounded-xl object-cover ring-2 ring-white/20" />
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">Published</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg mb-2 group-hover:text-blue-200 transition-colors line-clamp-1">{c.title}</h3>
                      <div className="flex flex-wrap gap-3 text-xs text-purple-200 mb-4">
                        <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg"><Users size={14} />{c.students}</span>
                        <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg"><DollarSign size={14} />${c.revenue.toLocaleString()}</span>
                        <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg"><Star size={14} className="text-yellow-400" fill="currentColor" />{c.rating}</span>
                        <span className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-lg border border-green-400/30 text-green-300"><TrendingUp size={14} />{c.trend}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                          <div className="flex items-center gap-2 mb-1"><Eye size={14} className="text-blue-400" /><span className="text-xs text-purple-200">Views</span></div>
                          <p className="text-lg font-bold text-white">{c.views.toLocaleString()}</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 border border-white/20">
                          <div className="flex items-center gap-2 mb-1"><Award size={14} className="text-green-400" /><span className="text-xs text-purple-200">Completion</span></div>
                          <p className="text-lg font-bold text-white">{c.completion}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><BarChart3 size={28} className="text-purple-300" />Recent Activity</h2>
            <div className="space-y-4">
              {data.activity.map((a) => (
                <div key={a.id} className="flex items-start gap-4 pb-4 border-b border-white/10 last:border-0 last:pb-0 hover:bg-white/5 p-3 rounded-xl transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">{icons[a.type]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white mb-1">{a.student}</p>
                    <p className="text-xs text-purple-200">{a.action} • {a.course}</p>
                  </div>
                  <span className="text-xs text-purple-300 whitespace-nowrap">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Calendar size={28} className="text-orange-400" />Upcoming Tasks</h2>
            <div className="space-y-4">
              {data.tasks.map((t) => (
                <div key={t.id} className={`${priorities[t.priority]} backdrop-blur-sm border rounded-2xl p-4 hover:scale-105 transition-transform cursor-pointer`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-bold text-white text-sm flex-1">{t.task}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.priority === 'high' ? 'bg-red-500/30' : t.priority === 'medium' ? 'bg-orange-500/30' : 'bg-green-500/30'}`}>{t.priority.toUpperCase()}</span>
                  </div>
                  <p className="text-xs mb-3 opacity-90">{t.course}</p>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2"><Clock size={14} />{t.date}</div>
                    <span className="bg-white/20 px-2 py-1 rounded-lg">{t.count} items</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/40 to-purple-500/40 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/30">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><TrendingUp size={28} />This Month</h2>
            <div className="space-y-4">
              <div className="bg-white/20 rounded-2xl p-4 border border-white/30">
                <div className="flex items-center justify-between mb-2"><span className="text-sm text-white font-medium">New Enrollments</span><Users size={20} /></div>
                <p className="text-3xl font-bold text-white">{data.monthly.enrollments}</p>
                <p className="text-xs text-purple-100 mt-1">+18% from last month</p>
              </div>
              <div className="bg-white/20 rounded-2xl p-4 border border-white/30">
                <div className="flex items-center justify-between mb-2"><span className="text-sm text-white font-medium">Revenue</span><DollarSign size={20} /></div>
                <p className="text-3xl font-bold text-white">${data.monthly.revenue.toLocaleString()}</p>
                <p className="text-xs text-purple-100 mt-1">+24% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { label: "Create New Course", color: "purple", icon: BookOpen, url: '/add' },
                { label: "View All Students", color: "blue", icon: Users, url: '' },

              ].map((a, i) => (
                <Link key={i}  to={a.url} className={`w-full px-5 py-4 bg-${a.color}-500/30 hover:bg-${a.color}-500/50 backdrop-blur-sm rounded-2xl text-white font-semibold text-sm transition-all border border-${a.color}-400/30 hover:scale-105 hover:shadow-xl flex items-center justify-between group`}>
                  <span className="flex items-center gap-3"><a.icon size={18} />{a.label}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;