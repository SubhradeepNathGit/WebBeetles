import React, { useEffect, useState } from "react";
import {
  Home, BookOpen, ChevronLeft, ChevronRight, GraduationCap, LogOut,
  LayoutDashboard, BookPlus, BookMarked, BookText, SquareStack,
  ShieldUser, CircleUser, BarChart3, X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import getSweetAlert from "../../util/alert/sweetAlert";
import { logoutUser } from "../../redux/slice/authSlice/checkUserAuthSlice";
import { motion, AnimatePresence } from "framer-motion";

const DashboardSidebar = ({
  setActivePage,
  activePage,
  user_type,
  userData,
  isMobileOpen,
  setIsMobileOpen,
  onCollapseChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Derive display values safely from userData prop
  const userPhoto = userData?.profile_image_url || userData?.profilePhoto || null;
  const userName  = userData?.name || userData?.fullName || (user_type === "student" ? "Student" : "Instructor");
  const userEmail = userData?.email || "";
  const isStudent = user_type === "student";

  // Notify parent whenever collapse state changes
  useEffect(() => {
    if (onCollapseChange) onCollapseChange(isCollapsed);
  }, [isCollapsed, onCollapseChange]);

  useEffect(() => {
    setActivePage(user_type === "student" ? "student-dashboard" : "instructor-dashboard");
  }, [user_type]);

  const showMail = (email) => {
    if (!email) return "";
    const first = email.slice(0, 3);
    const midStart = Math.floor(email.length / 2) - 1;
    const middle  = email.slice(midStart, midStart + 3);
    const last    = email.slice(-6);
    return `${first}*****${middle}****${last}`;
  };

  const studentMenu = [
    { name: "Dashboard",        icon: LayoutDashboard, key: "student-dashboard" },
    { name: "Home",             icon: Home,            key: "home" },
    { name: "Profile",          icon: CircleUser,      key: "profile" },
    { name: "All Courses",      icon: BookOpen,        key: "allCourses" },
    { name: "Enrolled Courses", icon: BookText,        key: "student-myCourses" },
  ];

  const instructorMenu = [
    { name: "Dashboard",      icon: LayoutDashboard, key: "instructor-dashboard" },
    { name: "Home",           icon: Home,            key: "home" },
    { name: "Profile",        icon: ShieldUser,      key: "profile" },
    { name: "All Category",   icon: SquareStack,     key: "allCategory" },
    { name: "My Courses",     icon: BookMarked,      key: "instructor-myCourses" },
    { name: "Add New Course", icon: BookPlus,        key: "instructor-add-myCourses" },
    { name: "Analytics",      icon: BarChart3,       key: "instructor-analytics" },
  ];

  const sidebarMenu = isStudent ? studentMenu : instructorMenu;

  const userLogout = async () => {
    await dispatch(logoutUser({ user_type, status: true }))
      .then(() => navigate(isStudent ? "/" : "/instructor/"))
      .catch(() => getSweetAlert({ title: "Logout Failed!", text: "Something went wrong.", icon: "error" }));
  };

  const handleMenuClick = (key) => {
    setActivePage(key);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  const toggleCollapse = () => setIsCollapsed(prev => !prev);

  // ── Shared inner content ──────────────────────────────────
  const SidebarInner = ({ collapsed }) => (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Logo header */}
      <div 
        onClick={collapsed ? toggleCollapse : undefined}
        className={`flex items-center gap-3 px-4 pt-6 pb-5 flex-shrink-0 transition-colors duration-200
          ${collapsed ? "justify-center px-0 cursor-pointer hover:bg-white/[0.03] group" : ""}`}
        title={collapsed ? "Expand Sidebar" : ""}
      >
        <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg transition-transform duration-300
          ${collapsed ? "group-hover:scale-105" : ""}
          ${isStudent ? "bg-purple-600 shadow-purple-600/20" : "bg-rose-600 shadow-rose-600/20"}`}>
          <GraduationCap size={18} className="text-white" />
          
          {/* Chevron indicator when collapsed */}
          {collapsed && (
            <div className="absolute -bottom-1.5 -right-1.5 bg-[#1a1a1a] rounded-full p-0.5 border border-white/10 text-white/60 group-hover:text-white shadow-md transition-colors">
              <ChevronRight size={12} strokeWidth={3} />
            </div>
          )}
        </div>
        {!collapsed && (
          <div className="min-w-0 pr-6"> {/* pr-6 gives space so text doesn't overlap the absolute toggle button */}
            <p className="text-sm font-bold text-white leading-none mb-0.5 tracking-wide">WebBeetles</p>
            <p className="text-[10px] text-white/50 tracking-wider uppercase font-medium">{isStudent ? "Student Portal" : "Instructor Panel"}</p>
          </div>
        )}
      </div>

      {/* User card */}
      {!collapsed && (
        <div className="px-4 pb-5 flex-shrink-0">
          <div className="flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl px-3 py-3 transition-colors duration-300 cursor-default">
            {userPhoto ? (
              <img
                src={userPhoto}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0"
                onError={e => { e.target.onerror = null; e.target.style.display = "none"; }}
              />
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-inner
                ${isStudent ? "bg-purple-700/80" : "bg-rose-700/80"}`}>
                {userName[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-none mb-1">{userName}</p>
              <p className="text-[10px] text-white/40 truncate">{showMail(userEmail)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto overflow-x-hidden
        scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {sidebarMenu.map(({ name, icon: Icon, key }) => {
          const isActive = activePage === key;
          return (
            <button
              key={key}
              onClick={() => handleMenuClick(key)}
              title={collapsed ? name : ""}
              className={`relative w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 group cursor-pointer overflow-hidden
                ${collapsed ? "justify-center px-0" : ""}
                ${isActive
                  ? `text-white ${isStudent ? "bg-purple-600 shadow-[0_4px_12px_rgba(147,51,234,0.3)]" : "bg-rose-600 shadow-[0_4px_12px_rgba(225,29,72,0.3)]"}`
                  : "text-white/50 hover:text-white hover:bg-white/[0.06]"
                }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-current"} />

              {!collapsed && <span className="flex-1 text-left truncate">{name}</span>}

              {/* Hover tooltip when collapsed */}
              {collapsed && (
                <span className="pointer-events-none absolute left-[calc(100%+12px)] px-3 py-1.5
                  bg-[#222] text-white text-xs font-medium rounded-lg border border-white/10
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible
                  transition-all duration-200 whitespace-nowrap z-[60] shadow-xl">
                  {name}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 pt-2 flex-shrink-0">
        <button
          onClick={userLogout}
          title={collapsed ? "Logout" : ""}
          className={`w-full flex items-center justify-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium
            text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer group
            ${collapsed ? "px-0" : ""}`}
        >
          <LogOut size={18} className="group-hover:scale-110 transition-transform duration-200" />
          {!collapsed && <span>Logout</span>}
          {collapsed && (
            <span className="pointer-events-none absolute left-[calc(100%+12px)] px-3 py-1.5
              bg-[#222] text-red-400 text-xs font-medium rounded-lg border border-white/10
              opacity-0 invisible group-hover:opacity-100 group-hover:visible
              transition-all duration-200 whitespace-nowrap z-[60] shadow-xl">
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────
  return (
    <>
      {/* ═══ DESKTOP — Fixed sidebar ═══ */}
      <aside
        className={`
          hidden md:block
          fixed top-0 left-0 h-screen z-40
          bg-[#0a0a0a] border-r border-white/5
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-[80px]" : "w-[280px]"}
        `}
      >
        <SidebarInner collapsed={isCollapsed} />

        {/* ── Premium Toggle Button (Fully inside sidebar) ── */}
        {!isCollapsed && (
          <button
            onClick={toggleCollapse}
            aria-label="Collapse sidebar"
            className={`
              absolute z-50 top-[28px] right-4 w-7 h-7
              flex items-center justify-center
              rounded-lg bg-white/[0.04] border border-white/5
              shadow-sm hover:bg-white/10 hover:border-white/10
              transition-all duration-300 cursor-pointer text-white/50 hover:text-white
            `}
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
        )}
      </aside>

      {/* ═══ MOBILE — Slide-in Drawer ═══ */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-full w-[280px] sm:w-[320px] bg-[#0a0a0a] border-r border-white/5
                text-white z-50 md:hidden shadow-2xl flex flex-col"
            >
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute right-4 top-5 w-8 h-8 bg-white/5 hover:bg-white/10
                  rounded-lg flex items-center justify-center border border-white/10
                  transition-all z-10 cursor-pointer"
                aria-label="Close sidebar"
              >
                <X size={16} className="text-white/70" />
              </button>
              <SidebarInner collapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;
