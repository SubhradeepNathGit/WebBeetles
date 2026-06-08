import React, { useEffect, useState } from "react";
import {
  BarChart3,
  BookMarked,
  BookOpen,
  BookPlus,
  BookText,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  Home,
  LayoutDashboard,
  LogOut,
  ShieldUser,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import getSweetAlert from "../../util/alert/sweetAlert";
import { logoutUser } from "../../redux/slice/authSlice/checkUserAuthSlice";

const getMaskedEmail = (email) => {
  if (!email) return "";
  if (email.length <= 12) return email;

  const first = email.slice(0, 3);
  const midStart = Math.max(Math.floor(email.length / 2) - 1, 0);
  const middle = email.slice(midStart, midStart + 3);
  const last = email.slice(-6);
  return `${first}*****${middle}****${last}`;
};

const NavItem = ({ item, activePage, collapsed, onClick }) => {
  const Icon = item.icon;
  const isActive = activePage === item.key;

  return (
    <button
      type="button"
      onClick={() => onClick(item.key)}
      title={collapsed ? item.name : ""}
      className={`relative group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200
        ${collapsed ? "justify-center" : ""}
        ${isActive ? "bg-white/10 text-white shadow-lg" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
    >
      <span className="flex w-6 flex-shrink-0 items-center justify-center">
        <Icon size={18} />
      </span>

      {!collapsed && <span className="flex-1 truncate text-left">{item.name}</span>}

      {collapsed && (
        <span className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-lg border border-white/5 bg-black/80 px-3 py-2 text-xs text-white opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
          {item.name}
        </span>
      )}
    </button>
  );
};

const DashboardSidebar = ({
  setActivePage,
  activePage,
  user_type,
  userData,
  isMobileOpen,
  setIsMobileOpen,
  onCollapseChange,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isStudent = user_type === "student";
  const panelLabel = isStudent ? "Student Portal" : "Instructor Panel";
  const userPhoto = userData?.profile_image_url || userData?.profilePhoto || null;
  const userName = userData?.name || userData?.fullName || (isStudent ? "Student" : "Instructor");
  const userEmail = userData?.email || "";

  useEffect(() => {
    onCollapseChange?.(collapsed);
  }, [collapsed, onCollapseChange]);

  useEffect(() => {
    setActivePage(isStudent ? "student-dashboard" : "instructor-dashboard");
  }, [isStudent, setActivePage]);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const studentMenu = [
    { name: "Dashboard", icon: LayoutDashboard, key: "student-dashboard" },
    { name: "Home", icon: Home, key: "home" },
    { name: "All Courses", icon: BookOpen, key: "allCourses" },
    { name: "Enrolled Courses", icon: BookText, key: "student-myCourses" },
    { name: "Profile", icon: CircleUser, key: "profile" },
  ];

  const instructorMenu = [
    { name: "Dashboard", icon: LayoutDashboard, key: "instructor-dashboard" },
    { name: "My Courses", icon: BookMarked, key: "instructor-myCourses" },
    { name: "Add New Course", icon: BookPlus, key: "instructor-add-myCourses" },
    { name: "Analytics", icon: BarChart3, key: "instructor-analytics" },
    { name: "Profile", icon: ShieldUser, key: "profile" },
  ];

  const sidebarMenu = isStudent ? studentMenu : instructorMenu;

  const handleMenuClick = (key) => {
    setActivePage(key);
    setIsMobileOpen?.(false);
  };

  const userLogout = async () => {
    await dispatch(logoutUser({ user_type, status: true }))
      .then(() => navigate(isStudent ? "/" : "/instructor/"))
      .catch(() => getSweetAlert({ title: "Logout Failed!", text: "Something went wrong.", icon: "error" }));
  };

  const SidebarInner = ({ isCollapsed, isMobile = false }) => (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 flex-shrink-0`}
          >
            <img src="/logo.png" alt="WebBeetles" className="h-10 w-10 animate-spin object-contain" />
          </div>

          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold text-white">WebBeetles</h1>
              <p className="text-xs text-gray-400">{panelLabel}</p>
            </div>
          )}
        </div>

        {!isCollapsed && !isMobile && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="hidden cursor-pointer rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/5 hover:text-white md:flex"
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {isMobile && (
          <button
            type="button"
            onClick={() => setIsMobileOpen?.(false)}
            className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className="p-4 pt-0">
          <div className="flex cursor-default items-center gap-3 rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10">
            {userPhoto ? (
              <img
                src={userPhoto}
                alt={userName}
                className="h-10 w-10 flex-shrink-0 rounded-full object-cover ring-2 ring-white/10"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                {userName?.[0]?.toUpperCase() || "W"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{userName}</p>
              <p className="truncate text-xs text-gray-400">{getMaskedEmail(userEmail)}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 flex-1 space-y-1 overflow-y-auto overflow-x-hidden p-4 pt-2">
        {isCollapsed && !isMobile && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="mb-2 flex w-full cursor-pointer items-center justify-center rounded-lg p-3 text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <ChevronRight size={18} />
          </button>
        )}

        {sidebarMenu.map((item) => (
          <NavItem
            key={item.key}
            item={item}
            activePage={activePage}
            collapsed={isCollapsed}
            onClick={handleMenuClick}
          />
        ))}
      </nav>

      <div className="space-y-3 border-t border-transparent p-4 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <button
          type="button"
          onClick={userLogout}
          title={isCollapsed ? "Logout" : ""}
          className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-300 transition-all hover:bg-red-500/10 hover:text-red-400"
          aria-label="Logout"
        >
          <LogOut size={18} className="transition-transform group-hover:scale-110" />
          {!isCollapsed && <span>Logout</span>}
        </button>

        {!isCollapsed && (
          <div className="pt-2 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} WebBeetles {isStudent ? "Student" : "Instructor"}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsMobileOpen?.(false)}
          aria-hidden="true"
        />
      )}

      <aside
        role="navigation"
        aria-label={`${panelLabel} navigation`}
        className={`fixed left-0 top-0 z-50 hidden h-screen flex-col border-r border-white/5 bg-black transition-all duration-300 md:flex ${collapsed ? "w-20" : "w-64"}`}
        style={{ boxShadow: "inset 0 0 40px rgba(255,255,255,0.02)" }}
      >
        <SidebarInner isCollapsed={collapsed} />
      </aside>

      <div
        className={`hidden transition-all duration-300 md:block ${collapsed ? "md:w-20" : "md:w-64"}`}
        aria-hidden="true"
      />

      <aside
        role="navigation"
        aria-label={`${panelLabel} mobile navigation`}
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-white/5 bg-black text-white shadow-2xl transition-transform duration-300 md:hidden ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarInner isCollapsed={false} isMobile />
      </aside>
    </>
  );
};

export default DashboardSidebar;
