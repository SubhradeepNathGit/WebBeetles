import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { LogOut, BookOpen, Home, User, BarChart3, ChevronLeft, GraduationCap } from "lucide-react";

const DashboardSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Safely access user from Redux state
  const user = useSelector((state) => state.auth?.user);
  const role = user?.role || "user";
  const userName = user?.name || user?.fullName || "User";
  const userEmail = user?.email || "";
  const userPhoto = user?.photo || user?.avatar || user?.profileImage || null;

  // Sidebar menu items
  const userMenu = [
    {name: "Dashboard", icon: <Home size={20} />, path: "/dashboard/user/home" },
    { name: "Home", icon: <Home size={20} />, path: "/" },
    { name: "All Courses", icon: <BookOpen size={20} />, path: "/course" },
    { name: "My Courses", icon: <BookOpen size={20} />, path: "/dashboard/user/my-courses" },
    { name: "Request Instructor", icon: <User size={20} />, path: "/dashboard/user/request-instructor" },
    { name: "Request Status", icon: <BarChart3 size={20} />, path: "/dashboard/user/request-status" },
  ];

  const instructorMenu = [
    {name: "Dashboard", icon: <Home size={20} />, path: "/dashboard/user/home" },
    { name: "Home", icon: <Home size={20} />, path: "/" },
    { name: "All Courses", icon: <BookOpen size={20} />, path: "/course" },
    { name: "Home", icon: <Home size={20} />, path: "/dashboard/instructor/home" },
    { name: "My Courses", icon: <BookOpen size={20} />, path: "/dashboard/instructor/my-courses" },
  ];

  const sidebarMenu = role === "instructor" ? instructorMenu : userMenu;

  return (
    <aside 
      className={`${
        isCollapsed ? "w-20" : "w-72"
      } bg-gradient-to-br from-purple-700 to-black/30 text-white min-h-screen flex flex-col shadow-2xl backdrop-blur-md border-r border-purple-500/20 transition-all duration-300 ease-in-out relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-4 top-6 bg-white/10 hover:bg-white/20 rounded-lg p-2 backdrop-blur-sm border border-white/20 transition-all duration-200 z-10 group"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft 
          size={18} 
          className={`text-white transition-transform duration-300 ${
            isCollapsed ? "rotate-180" : ""
          }`}
        />
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
                {role === "instructor" ? "Instructor Panel" : "Student Portal"}
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
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-white truncate mb-0.5">{userName}</p>
              <p className="text-xs text-purple-200/80 truncate mb-2">{userEmail}</p>
              <span className="inline-flex items-center px-2.5 py-1 bg-purple-500/40 rounded-full text-xs font-semibold text-white border border-purple-400/40 shadow-sm">
                {role === "instructor" ? "Instructor" : "Student"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
        {sidebarMenu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center ${isCollapsed ? "justify-center" : "gap-4"} px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-white/15 text-white shadow-lg border border-white/20 backdrop-blur-md"
                  : "text-purple-100 hover:bg-white/10 hover:text-white hover:border hover:border-white/10 backdrop-blur-sm"
              }`
            }
            title={isCollapsed ? item.name : ""}
          >
            {({ isActive }) => (
              <>
                <span className={`flex-shrink-0 ${isActive ? "scale-110" : "group-hover:scale-110"} transition-transform duration-200`}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="flex-1">{item.name}</span>
                )}
                {isActive && !isCollapsed && (
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-300 shadow-sm shadow-purple-300/50"></span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button 
          className={`w-full flex items-center ${isCollapsed ? "justify-center" : "justify-center gap-3"} bg-white/10 backdrop-blur-md border border-white/20 hover:bg-red-500/20 hover:border-red-400/50 py-3.5 rounded-xl transition-all duration-200 text-sm font-semibold text-white shadow-md hover:shadow-lg group`}
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