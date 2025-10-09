import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BookOpen, TrendingUp, Users, DollarSign, Star, Calendar,
  BarChart3, ArrowRight, Sparkles, MessageSquare, Award,
  Clock, Eye, Video, Loader2, Camera, Edit3, X, CheckCircle2,
  Plus, Target, Zap, ChevronRight
} from "lucide-react";
import { specificInstructorRequest } from "../../../redux/slice/specificInstructorSlice";
import { userProfile } from "../../../redux/slice/userSlice";

const InstructorDashboard = () => {
  const user = useSelector((state) => state.auth?.user);
  const name = user?.name || user?.fullName || "Instructor";
  const photo = user?.photo || user?.profilePhoto || user?.avatar;

  const dispatch = useDispatch(),
    { isAuth } = useSelector(state => state.checkAuth),
    { isSpecificInstructorLoading, getSpecificInstructorData, isSpecificInstructorError } = useSelector(state => state.specificInstructor),
    { isUserLoading, getUserData, isUserError } = useSelector(state => state.user);

  const [data, setData] = useState({ stats: { totalCourses: 0, totalStudents: 0 }, courses: [], activity: [], tasks: [], monthly: { enrollments: 0, revenue: 0 } });
  const [bio, setBio] = useState("");
  const [tempBio, setTempBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingPhoto, setUpdatingPhoto] = useState(false);
  const [updatingBio, setUpdatingBio] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isAuth) {
      dispatch(userProfile())
        .then(res => {
          // console.log('Response for fetching user profile', res);
        })
        .catch((err) => {
          getSweetAlert('Oops...', 'Something went wrong!', 'error');
          console.log("Error occurred", err);
        });
    }
  }, [isAuth, dispatch]);

  // useEffect(() => {
  //   if (Object.keys(getUserData).length > 0) {
  //     dispatch(specificInstructorRequest(getUserData.user._id))
  //       .then(res => {
  //         // console.log('Response for fetching user profile', res);
  //       })
  //       .catch((err) => {
  //         getSweetAlert('Oops...', 'Something went wrong!', 'error');
  //         console.log("Error occurred", err);
  //       });
  //   }
  // }, [isAuth, dispatch]);

  // console.log('Logged user', getSpecificInstructorData);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
      setLoading(false);
    };
    const fetchBio = async () => {
      await new Promise(r => setTimeout(r, 500));
      setBio("Passionate React instructor with 5+ years of experience in web development and UI/UX design.");
    };
    fetchData();
    fetchBio();
  }, []);

  const handleBioSave = async () => {
    setUpdatingBio(true);
    await new Promise(r => setTimeout(r, 800));
    setBio(tempBio);
    setEditingBio(false);
    setUpdatingBio(false);
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUpdatingPhoto(true);
    await new Promise(r => setTimeout(r, 1000));
    user.photo = URL.createObjectURL(file);
    alert("Profile photo updated successfully!");
    setUpdatingPhoto(false);
  };

  const icons = {
    completed: <CheckCircle2 size={16} className="text-green-400" />,
    review: <Star size={16} className="text-yellow-400" />,
    question: <MessageSquare size={16} className="text-blue-400" />,
    enrolled: <Users size={16} className="text-purple-400" />
  };

  const priorities = { high: 'bg-red-500/20 border-red-400/30 text-red-200', medium: 'bg-orange-500/20 border-orange-400/30 text-orange-200', low: 'bg-green-500/20 border-green-400/30 text-green-200' };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
        <p className="text-purple-200 text-sm font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  const stats = [
    { icon: BookOpen, value: data.stats.totalCourses, label: "Total Courses", color: "purple", trend: "+2" },
    { icon: Users, value: data.stats.totalStudents.toLocaleString(), label: "Total Students", color: "blue", trend: "+234" }
  ];

  const quickActions = [
    { label: "Create New Course", icon: Plus, gradient: "from-purple-500/30 to-purple-600/30" },
    { label: "View All Students", icon: Users, gradient: "from-blue-500/30 to-blue-600/30" },
    { label: "Course Analytics", icon: BarChart3, gradient: "from-pink-500/30 to-pink-600/30" }
  ];

  return (
    <div className="min-h-screen bg-black p-3 sm:p-4 lg:p-6 xl:p-8 overflow-x-hidden">
      <div className="max-w-full mx-auto space-y-4 sm:space-y-5 lg:space-y-6">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 backdrop-blur-xl rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-5 lg:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 lg:gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full ring-4 ring-white/30 overflow-hidden shadow-2xl bg-gradient-to-br from-blue-400 to-purple-500">
                {getUserData.user.profileImage ? <img src={`http://localhost:3005${getUserData.user.profileImage}`} alt={name} className="w-full h-full object-cover" /> :
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl sm:text-3xl lg:text-4xl font-bold">{name[0].toUpperCase()}</div>}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={updatingPhoto}
                className="absolute -bottom-2 -right-2 
             bg-white/10 backdrop-blur-md 
             hover:bg-white/20 
             text-white p-3 rounded-full 
             transition-all shadow-xl 
             border border-white/30 
             disabled:opacity-50 
             hover:scale-110 active:scale-95"
              >
                {updatingPhoto ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Camera size={18} />
                )}
              </button>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </div>

            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2 lg:mb-3">
                {/* <Sparkles className="text-yellow-300" size={18} /> */}
                <span className="text-xs font-bold text-purple-200 bg-white/20 px-2.5 py-1 rounded-full">INSTRUCTOR DASHBOARD</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-3 lg:mb-4">Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">{getUserData.user.name.split(" ")[0]}</span>! 🎓</h1>

              {!editingBio ? (
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 lg:gap-3">
                  <div className="flex-1 bg-white/10 px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 rounded-xl border border-white/20">
                    <p className="text-purple-100 text-xs sm:text-sm lg:text-base">{bio || "No bio added yet."}</p>
                  </div>
                  <button onClick={() => { setTempBio(bio); setEditingBio(true); }} className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-white bg-purple-600/50 hover:bg-purple-600/70 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-purple-400/40 transition-all hover:shadow-lg active:scale-95">
                    <Edit3 size={14} /> Edit Bio
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 lg:gap-3">
                  <div className="relative">
                    <textarea value={tempBio} onChange={(e) => setTempBio(e.target.value)} rows={3} maxLength={500} placeholder="Write a short bio about yourself..." className="bg-white/10 text-purple-100 placeholder:text-purple-300/50 rounded-xl w-full text-xs sm:text-sm p-3 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none" />
                    <span className="absolute bottom-2 right-2 text-xs text-purple-300/70 bg-black/20 px-2 py-1 rounded-lg">{tempBio.length}/500</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleBioSave} disabled={updatingBio} className="inline-flex items-center justify-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold transition-all disabled:opacity-50 hover:shadow-lg active:scale-95 flex-1">
                      {updatingBio ? <><Loader2 size={14} className="animate-spin" />Saving...</> : <><CheckCircle2 size={14} />Save</>}
                    </button>
                    <button onClick={() => setEditingBio(false)} disabled={updatingBio} className="inline-flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition-all hover:shadow-lg active:scale-95 border border-white/20">
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
          {stats.map((s, i) => (
            <div key={i} className="group bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xl border border-white/20 hover:bg-white/15 hover:scale-[1.02] transition-all">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl lg:rounded-2xl bg-gradient-to-br ${s.color === 'purple' ? 'from-purple-500/40 to-purple-600/40' : 'from-blue-500/40 to-blue-600/40'} flex items-center justify-center border ${s.color === 'purple' ? 'border-purple-400/30' : 'border-blue-400/30'} shadow-lg group-hover:scale-110 transition-transform`}>
                    <s.icon className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-0.5">{s.value}</h3>
                    <p className="text-purple-100 text-xs sm:text-sm font-medium">{s.label}</p>
                  </div>
                </div>
                <span className="text-green-400 text-xs font-bold flex items-center gap-1 bg-green-500/20 px-2 sm:px-2.5 py-1.5 rounded-lg border border-green-400/30"><TrendingUp size={12} />{s.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">

          {/* LEFT COL */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5 lg:space-y-6">

            {/* COURSES */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-5 lg:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 gap-2">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-blue-500/30 flex items-center justify-center border border-blue-400/30"><Video className="text-blue-300" size={18} /></div>
                  My Courses
                </h2>
                <button className="inline-flex items-center gap-1 text-purple-200 hover:text-white font-semibold text-xs sm:text-sm bg-white/10 hover:bg-white/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all border border-white/20 active:scale-95">
                  View All<ChevronRight size={14} />
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {data.courses.map((c) => (
                  <div key={c.id} className="group bg-white/5 rounded-xl p-3 sm:p-4 hover:bg-white/15 transition-all border border-white/10 hover:border-white/30 hover:shadow-2xl">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="relative flex-shrink-0">
                        <img src={c.thumbnail} alt={c.title} className="w-full sm:w-32 lg:w-40 h-24 sm:h-24 lg:h-28 rounded-lg object-cover ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">Published</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-sm sm:text-base lg:text-lg mb-2 group-hover:text-blue-200 transition-colors line-clamp-2">{c.title}</h3>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                          <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md text-xs text-purple-200 font-medium border border-white/10"><Users size={12} />{c.students.toLocaleString()}</span>
                          <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md text-xs text-purple-200 font-medium border border-white/10"><DollarSign size={12} />${c.revenue.toLocaleString()}</span>
                          <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md text-xs text-purple-200 font-medium border border-white/10"><Star size={12} className="text-yellow-400 fill-yellow-400" />{c.rating}</span>
                          <span className="inline-flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-md border border-green-400/30 text-green-300 text-xs font-bold"><TrendingUp size={12} />{c.trend}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white/10 rounded-lg p-2 sm:p-2.5 border border-white/20">
                            <div className="flex items-center gap-1.5 mb-1"><Eye size={12} className="text-blue-400" /><span className="text-xs text-purple-200 font-medium">Views</span></div>
                            <p className="text-base sm:text-lg font-bold text-white">{c.views.toLocaleString()}</p>
                          </div>
                          <div className="bg-white/10 rounded-lg p-2 sm:p-2.5 border border-white/20">
                            <div className="flex items-center gap-1.5 mb-1"><Target size={12} className="text-green-400" /><span className="text-xs text-purple-200 font-medium">Done</span></div>
                            <p className="text-base sm:text-lg font-bold text-white">{c.completion}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIVITY */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-5 lg:p-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6 flex items-center gap-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-purple-500/30 flex items-center justify-center border border-purple-400/30"><BarChart3 size={18} className="text-purple-300" /></div>
                Recent Activity
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {data.activity.map((a) => (
                  <div key={a.id} className="flex items-center gap-2 sm:gap-3 pb-2 sm:pb-3 border-b border-white/10 last:border-0 last:pb-0 hover:bg-white/5 p-2 sm:p-3 rounded-lg transition-all group">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform flex-shrink-0">{icons[a.type]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-white mb-0.5 truncate">{a.student}</p>
                      <p className="text-xs text-purple-200 truncate">{a.action} • {a.course}</p>
                    </div>
                    <span className="text-xs text-purple-300 whitespace-nowrap">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COL */}
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">

            {/* TASKS */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-5 lg:p-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6 flex items-center gap-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-orange-500/30 flex items-center justify-center border border-orange-400/30"><Calendar size={18} className="text-orange-400" /></div>
                Upcoming Tasks
              </h2>
              <div className="space-y-3">
                {data.tasks.map((t) => (
                  <div key={t.id} className={`${priorities[t.priority]} border rounded-lg p-3 sm:p-4 hover:scale-[1.02] transition-all group`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-bold text-white text-xs sm:text-sm flex-1 line-clamp-2">{t.task}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.priority === 'high' ? 'bg-red-500/40' : t.priority === 'medium' ? 'bg-orange-500/40' : 'bg-green-500/40'}`}>{t.priority.toUpperCase()}</span>
                    </div>
                    <p className="text-xs mb-3 opacity-90 font-medium truncate">{t.course}</p>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-1.5"><Clock size={12} />{t.date}</div>
                      <span className="bg-white/30 px-2 py-1 rounded-md">{t.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MONTHLY */}
            <div className="bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-pink-500/40 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-2xl p-4 sm:p-5 lg:p-6 border border-white/30">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6 flex items-center gap-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white/20 flex items-center justify-center border border-white/30"><TrendingUp size={18} /></div>
                This Month
              </h2>
              <div className="space-y-3">
                {[
                  { label: "New Enrollments", value: data.monthly.enrollments, icon: Users, change: "+18%" },
                  { label: "Total Revenue", value: `$${data.monthly.revenue.toLocaleString()}`, icon: DollarSign, change: "+24%" }
                ].map((m, i) => (
                  <div key={i} className="bg-white/20 rounded-lg p-3 sm:p-4 border border-white/40 hover:scale-[1.02] transition-transform">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm text-white font-semibold">{m.label}</span>
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center border border-white/30"><m.icon size={16} className="text-white" /></div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{m.value}</p>
                    <p className="text-xs text-white/90 font-medium flex items-center gap-1"><Zap size={12} className="text-green-300" />{m.change}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-5 lg:p-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6">Quick Actions</h2>
              <div className="space-y-2 sm:space-y-3">
                {quickActions.map((a, i) => (
                  <button key={i} className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r ${a.gradient} hover:opacity-90 rounded-lg text-white font-semibold text-xs sm:text-sm transition-all hover:scale-[1.02] hover:shadow-xl flex items-center justify-between group active:scale-95`}>
                    <span className="flex items-center gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 flex items-center justify-center border border-white/30"><a.icon size={16} /></div>
                      {a.label}
                    </span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;