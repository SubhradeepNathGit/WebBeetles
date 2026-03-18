import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSidebarStore } from "../../store/useSidebarStore";
import {
    Home, Users, Settings, BarChart2, Menu, LogOut, X, ChevronLeft, ChevronRight, User, ClipboardCheck, BookOpenCheck,
    IndianRupee, Loader2, ShieldUser, ChartBarStacked, MessageSquareText, BellRing, Blinds, UserStar
} from "lucide-react";
import { allInstructor } from "../../redux/slice/instructorSlice";
import { useDispatch, useSelector } from "react-redux";
import { allCourse } from "../../redux/slice/couseSlice";
import { checkLoggedInUser, logoutUser } from "../../redux/slice/authSlice/checkUserAuthSlice";
import toastifyAlert from "../../util/alert/toastify";
import getSweetAlert from "../../util/alert/sweetAlert";

const NavItem = ({ to, icon: Icon, children, collapsed, onClick, badge }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-sm font-medium relative group
      ${isActive ? "bg-white/10 text-white shadow-lg" : "text-gray-300 hover:bg-white/5 hover:text-white"}`
        }
    >
        <div className="flex items-center justify-center w-6 flex-shrink-0">
            <Icon size={18} />
        </div>
        {!collapsed && (
            <>
                <span className="truncate flex-1">{children}</span>
                {badge && (
                    <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {badge}
                    </span>
                )}
            </>
        )}
        {collapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-black/80 backdrop-blur-xl text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-2xl border border-white/5">
                {children}
                {badge && <span className="ml-2 text-purple-400">({badge})</span>}
            </div>
        )}
    </NavLink>
);

export default function Sidebar({ onNavigate }) {

    const dispatch = useDispatch(),
        { isInstructorLoading, getInstructorData, isInstructorError } = useSelector(state => state?.instructor),
        { isCourseLoading, getCourseData, isCourseError } = useSelector(state => state?.course),
        { isUserLoading, userAuthData: getAdminData, userError } = useSelector(state => state.checkAuth);

    const pending = getCourseData?.filter(c => c?.status == 'pending');

    const collapsed = useSidebarStore((s) => s.collapsed);
    const toggle = useSidebarStore((s) => s.toggle);
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        dispatch(checkLoggedInUser())
            .then(res => {
                // console.log('Response for fetching user profile', res);
            })
            .catch((err) => {
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
                console.log("Error occurred", err);
            });
    }, [dispatch]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && mobileOpen) {
                setMobileOpen(false);
                if (onNavigate) onNavigate();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [mobileOpen, onNavigate]);

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    useEffect(() => {
        setMobileOpen(false);
        if (onNavigate) onNavigate();
    }, [navigate, onNavigate]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            dispatch(logoutUser({ user_type: 'admin', status: false }));
            sessionStorage.removeItem('admin_token');
            toastifyAlert.success('Logged out Successfully');
            navigate("/admin");
        } catch (error) {
            console.error("Logout failed:", error);
            toastifyAlert.error("Failed to logout. Please try again.");
        } finally {
            setIsLoggingOut(false);
        }
    };

    useEffect(() => {
        dispatch(allInstructor())
            .then(res => {
                // console.log('Response for fetching all instructor', res)
            }).catch(err => {
                console.log('Error occured', err);
            })
    }, [dispatch]);

    useEffect(() => {
        dispatch(allCourse())
            .then(res => {
                // console.log('Response for fetching courses', res);
            })
            .catch(err => {
                console.log('Error occured', err);
            })
    }, [dispatch]);

    const navItems = [
        { to: "/admin/dashboard", label: "Dashboard", icon: Home },
        { to: "/admin/profile", label: "Profile", icon: User },
        { to: "/admin/students", label: "Students", icon: Users },
        { to: "/admin/instructors", label: "Instructors", icon: UserStar },
        { to: "/admin/admin", label: "Admin", icon: ShieldUser },
        { to: "/admin/instructor-reviews", label: "Instructor Reviews", icon: ClipboardCheck, badge: isInstructorLoading ? <Loader2 className="inline h-3 w-3 mb-1 animate-spin" /> : getInstructorData?.filter(inst => inst?.application_status == 'pending' && inst?.application_complete)?.length ?? 0 },
        { to: "/admin/approve-courses", label: "Courses", icon: BookOpenCheck, badge: isCourseLoading ? <Loader2 className="inline h-3 w-3 mb-1 animate-spin" /> : pending?.length ?? 0 },
        { to: "/admin/analytics", label: "Analytics", icon: BarChart2 },
        { to: "/admin/charge", label: "Charge", icon: IndianRupee },
        { to: "/admin/category", label: "Category", icon: ChartBarStacked },
        { to: "/admin/contact", label: "Message", icon: MessageSquareText, badge: 5 },
        { to: "/admin/notification", label: "Notification", icon: BellRing, badge: 5 },
        { to: "/admin/examset", label: "Exam set", icon: Blinds },
        { to: "/admin/settings", label: "Settings", icon: Settings },
    ];

    // console.log('Logged admin data', getAdminData);

    return (
        <>
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={() => { setMobileOpen(false); if (onNavigate) onNavigate() }}
                    aria-hidden="true"
                />
            )}

            <aside
                ref={sidebarRef}
                role="navigation"
                aria-label="Main navigation"
                className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300 
          bg-black border-r border-white/5
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
                style={{ boxShadow: "inset 0 0 40px rgba(255,255,255,0.02)" }}
            >
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-black backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0 transition-all shadow-sm shadow-[0_0_15px_rgba(0,0,0,0.5)] border-transparent ${collapsed ? "scale-95" : "scale-100"
                                }`}
                        >
                            <span className="text-white text-lg font-bold">W</span>
                        </div>
                        {!collapsed && (
                            <div className="min-w-0">
                                <h1 className="text-white font-semibold text-base truncate">
                                    WebBeetles
                                </h1>
                                <p className="text-gray-400 text-xs">Admin Panel</p>
                            </div>
                        )}
                    </div>

                    {!collapsed && (
                        <button
                            onClick={toggle}
                            className="hidden md:flex p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white cursor-pointer"
                            aria-label="Collapse sidebar"
                            title="Collapse sidebar"
                        >
                            <ChevronLeft size={18} />
                        </button>
                    )}

                    <button
                        onClick={() => { setMobileOpen(false); if (onNavigate) onNavigate() }}
                        className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white"
                        aria-label="Close sidebar"
                    >
                        <X size={18} />
                    </button>
                </div>

                {!collapsed && (
                    <div className="p-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-sm shadow-[0_0_15px_rgba(0,0,0,0.5)] border-transparent">
                                <User size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">Admin</p>
                                <p className="text-gray-400 text-xs truncate">{getAdminData?.email ?? 'admin@webbeetles.com'}</p>
                            </div>
                        </div>
                    </div>
                )}

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {collapsed && (
                        <button
                            onClick={toggle}
                            className="w-full flex items-center justify-center p-3 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-white mb-2 cursor-pointer"
                            aria-label="Expand sidebar"
                            title="Expand sidebar"
                        >
                            <ChevronRight size={18} />
                        </button>
                    )}

                    {navItems.map((item) => (
                        <NavItem
                            key={item.to}
                            to={item.to}
                            icon={item.icon}
                            collapsed={collapsed}
                            onClick={() => { setMobileOpen(false); if (onNavigate) onNavigate() }}
                            badge={item.badge}
                        >
                            {item.label}
                        </NavItem>
                    ))}
                </nav>

                <div className="p-4 border-t shadow-[0_0_15px_rgba(0,0,0,0.5)] border-transparent space-y-3">
                    <button
                        onClick={() => handleLogout()}
                        disabled={isLoggingOut}
                        className={`w-full flex items-center justify-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer
              ${isLoggingOut ? "bg-white/5 text-gray-500 cursor-not-allowed"
                                : "text-gray-300 hover:bg-red-500/10 hover:text-red-400"
                            }`}
                        aria-label="Logout"
                    >
                        <LogOut size={18} className={isLoggingOut ? "animate-spin" : ""} />
                        {!collapsed && (
                            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                        )}
                    </button>

                    {!collapsed && (
                        <div className="text-xs text-gray-500 text-center pt-2">
                            © {new Date().getFullYear()} WebBeetles Admin
                        </div>
                    )}
                </div>
            </aside>

            <button
                onClick={() => setMobileOpen(true)}
                className="fixed top-4 left-4 z-30 p-3 rounded-lg bg-black text-white hover:bg-gray-900 transition-colors shadow-lg md:hidden shadow-sm shadow-[0_0_15px_rgba(0,0,0,0.5)] border-transparent"
                aria-label="Open sidebar"
            >
                <Menu size={20} />
            </button>

            <div
                className={`hidden md:block transition-all duration-300 ${collapsed ? "md:w-20" : "md:w-64"
                    }`}
                aria-hidden="true"
            />
        </>
    );
}
