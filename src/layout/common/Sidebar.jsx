import React, { useEffect, useState } from "react";
import { Home, BookOpen, ChevronLeft, GraduationCap, LogOut, LayoutDashboard, BookPlus, BookMarked, BookText, SquareStack, ShieldUser, CircleUser, BarChart3 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import getSweetAlert from "../../util/alert/sweetAlert";
import { logoutUser } from "../../redux/slice/authSlice/checkUserAuthSlice";

const DashboardSidebar = ({ setActivePage, activePage, user_type, userData }) => {
  const [isCollapsed, setIsCollapsed] = useState(false),
    dispatch = useDispatch(),
    navigate = useNavigate();

  // console.log('Logged user data from sidebar', userData);
  // console.log('user type', user_type,activePage);

  useEffect(() => {
    setActivePage(user_type === "student" ? "student-dashboard" : "instructor-dashboard");
  }, [user_type]);

  const showMail = (email) => {
    const first = email.slice(0, 3);
    const midStart = Math.floor(email.length / 2) - 1;
    const middle = email.slice(midStart, midStart + 3);
    const last = email.slice(email.length - 6, email.length);
    return `${first}*****${middle}****${last}`;
  };

  // Safely access user from Redux state
  const user = useSelector(state => state.auth?.user);
  const role = user_type == "student" ? 'Student' : 'Instructor';
  const userName = userData?.name || role;
  const userEmail = userData?.email || "";
  const userPhoto = userData?.profile_image_url;

  // Sidebar menu items
  const studentMenu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, key: 'student-dashboard' },
    { name: "Home", icon: <Home size={20} />, key: 'home' },
    { name: "Profile", icon: <CircleUser size={20} />, key: 'profile' },
    { name: "All Courses", icon: <BookOpen size={20} />, key: 'allCourses' },
    { name: "Enrolled Courses", icon: <BookText size={20} />, key: 'student-myCourses' }
  ];

  const instructorMenu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, key: 'instructor-dashboard' },
    { name: "Home", icon: <Home size={20} />, key: 'home' },
    { name: "Profile", icon: <ShieldUser size={20} />, key: 'profile' },
    { name: "All Category", icon: <SquareStack size={20} />, key: 'allCategory' },
    { name: "My Courses", icon: <BookMarked size={20} />, key: 'instructor-myCourses' },
    { name: "Add New Course", icon: <BookPlus size={20} />, key: 'instructor-add-myCourses' },
    { name: "Analytics", icon: <BarChart3 size={20} />, key: 'instructor-analytics' },
  ];

  const sidebarMenu = user_type === "student" ? studentMenu : instructorMenu;

  const userLogout = async () => {

    await dispatch(logoutUser({ user_type, status: true }))
      .then(res => {
        // console.log('Response for logout', res);
        navigate(user_type === "student" ? "/" : "/instructor/");
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert({
          title: "Logout Failed!",
          text: "Something went wrong.",
          icon: "error"
        });
      });
  }

  // Handle menu item click to change the active page
  const handleMenuClick = (key) => {
    setActivePage(key);
  };

  return (
    <aside className={`${isCollapsed ? "w-20" : "w-72"} bg-gradient-to-br from-purple-700 to-black/30 text-white min-h-screen flex flex-col shadow-2xl backdrop-blur-md border-r border-purple-500/20 transition-all duration-300 ease-in-out relative`}>
      {/* Collapse/Expand Sidebar Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-4 top-6 bg-white/10 hover:bg-white/20 rounded-lg p-2 backdrop-blur-sm border border-white/20 transition-all duration-200 z-10 group cursor-pointer"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft size={18} className={`text-white transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
      </button>

      {/* Sidebar Header */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <GraduationCap size={22} className="text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-white truncate">
                WebBeetles
              </h2>
              <p className="text-xs text-purple-200/80 truncate">
                {user_type === "student" ? "Student Portal" : "Instructor Panel"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-4 px-4 py-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            {userPhoto ? (
              <img
                src={userPhoto}
                alt={userName}
                className="w-14 h-14 rounded-full object-cover shadow-lg flex-shrink-0 ring-2 ring-purple-400/40"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className={`w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0 ${userPhoto ? 'hidden' : 'flex'}`}
            >
              {/* {userName.charAt(0).toUpperCase()} */}
              {userPhoto ?
                <img src={userPhoto} className="w-13 h-13 rounded-full" />
                : <div className="w-full h-full flex items-center justify-center text-white text-2xl sm:text-3xl lg:text-4xl font-bold">{userName[0]?.toUpperCase()}</div>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-white truncate mb-0.5">{userName}</p>
              <p className="text-xs text-purple-200/80 truncate mb-2">{showMail(userEmail)}</p>
              <span className="inline-flex items-center px-2.5 py-1 bg-purple-500/40 rounded-full text-xs font-semibold text-white border border-purple-400/40 shadow-sm">
                {user_type == "student" ? "Student" : "Instructor"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
        {sidebarMenu.map((item) => (
          <div
            key={item.name}
            onClick={() => handleMenuClick(item.key)}
            className={`flex items-center cursor-pointer ${isCollapsed ? "justify-center" : "gap-4"} px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${activePage === item.key ? "bg-white/15 text-white shadow-lg border border-white/20 backdrop-blur-md" : "text-purple-100 hover:bg-white/10 hover:text-white"}`}
          >
            <span className={`flex-shrink-0 ${activePage === item.key ? "scale-110" : "group-hover:scale-110"} transition-transform duration-200`}>
              {item.icon}
            </span>
            {!isCollapsed && <span className="flex-1">{item.name}</span>}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button onClick={() => userLogout()}
          className={`w-full flex items-center cursor-pointer ${isCollapsed ? "justify-center" : "justify-center gap-3"} bg-white/10 backdrop-blur-md border border-white/20 hover:bg-red-500/20 hover:border-red-400/50 py-3.5 rounded-xl transition-all duration-200 text-sm font-semibold text-white shadow-md hover:shadow-lg group`}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform duration-200" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
