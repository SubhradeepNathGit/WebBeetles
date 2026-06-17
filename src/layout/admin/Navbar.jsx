import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, LogOut, Settings, ChevronDown, Moon, Sun, Menu, X, } from "lucide-react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { checkLoggedInUser, logoutUser } from "../../redux/slice/authSlice/checkUserAuthSlice";
import toastifyAlert from "../../util/alert/toastify";
import getSweetAlert from "../../util/alert/sweetAlert";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead, addRealtimeNotification } from "../../redux/slice/notificationSlice";
import supabase from "../../util/supabase/supabase";

const formatRelativeTime = (dateString) => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
        return "";
    }
};

export default function Navbar() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchQuery, setSearchQuery] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);
   
    const [isMobile, setIsMobile] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const notificationRef = useRef(null);
    const userMenuRef = useRef(null);
    const searchInputRef = useRef(null);

    const { isUserLoading, userAuthData: getAdminData, userError } = useSelector(state => state.checkAuth);
    const { notifications, unreadCount } = useSelector(state => state.notification);
    
    // Removed redundant checkLoggedInUser dispatch as ProtectedRoute handles it

    const [gravatarUrl, setGravatarUrl] = useState("");

    useEffect(() => {
        async function generateGravatarUrl() {
            const email = getAdminData?.email;
            if (!email) {
                setGravatarUrl("");
                return;
            }
            try {
                const formattedEmail = email.trim().toLowerCase();
                const msgBuffer = new TextEncoder().encode(formattedEmail);
                const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                setGravatarUrl(`https://gravatar.com/avatar/${hashHex}?d=identicon`);
            } catch (error) {
                console.error("Error generating Gravatar URL:", error);
                setGravatarUrl("");
            }
        }
        generateGravatarUrl();
    }, [getAdminData?.email]);


    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            if (e.key === "Escape") {
                setShowNotifications(false);
                setShowUserMenu(false);
                setShowMobileSidebar(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (showMobileSidebar) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [showMobileSidebar]);

    useEffect(() => {
        dispatch(fetchNotifications({ user_type: 'admin' }));

        // Poll every 30s as a robust fallback in case Supabase Realtime is not enabled
        const pollInterval = setInterval(() => {
            dispatch(fetchNotifications({ user_type: 'admin' }));
        }, 30000);

        const channel = supabase
            .channel('realtime-notifications-admin')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'notifications', filter: "user_type=eq.admin" },
                (payload) => {
                    dispatch(addRealtimeNotification(payload.new));
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'notifications', filter: "user_type=eq.admin" },
                (payload) => {
                    dispatch(fetchNotifications({ user_type: 'admin' }));
                }
            )
            .subscribe();

        return () => {
            clearInterval(pollInterval);
            supabase.removeChannel(channel);
        };
    }, [dispatch]);

    // Re-fetch every time admin opens the notifications dropdown
    useEffect(() => {
        if (showNotifications) {
            dispatch(fetchNotifications({ user_type: 'admin' }));
        }
    }, [showNotifications, dispatch]);

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log("Searching for:", searchQuery);
            navigate(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
        }
    }, [searchQuery, navigate]);

    const handleNotificationClick = useCallback((notification) => {
        dispatch(markNotificationRead(notification.id));
        setShowNotifications(false);
        if (notification.link) {
            navigate(notification.link);
        }
    }, [dispatch, navigate]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            // Navigate first to escape ProtectedRoute before clearing auth state
            // This prevents the jitter caused by ProtectedRoute's <Navigate> racing with this navigate()
            navigate("/admin/", { replace: true });
            sessionStorage.removeItem('admin_token');
            await dispatch(logoutUser({ user_type: 'admin', status: false }));
            toastifyAlert.success('Logged out Successfully');
        } catch (error) {
            console.error("Logout failed:", error);
            toastifyAlert.error("Failed to logout. Please try again.");
        } finally {
            setIsLoggingOut(false);
        }
    };

 

    const markAllAsRead = useCallback(() => {
        dispatch(markAllNotificationsRead({ user_type: 'admin' }));
    }, [dispatch]);

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-black border-b border-white/5">
                <div className="flex items-center justify-between px-4 md:h-18 lg:h-18 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        {isMobile && (
                            <button
                                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                                aria-label="Toggle menu"
                            >
                                {showMobileSidebar ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        )}

                        <div className="flex items-center gap-2">
                            <div className="">
                                <h1 className="text-white text-sm sm:text-base md:text-base font-semibold">WebBeetles</h1>
                                <p className="text-gray-400 text-xs">Admin Panel</p>
                            </div>
                        </div>
                    </div>

                    <div className="hidden sm:flex flex-1 max-w-md lg:max-w-2xl mx-4">
                        <div className="relative w-full">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={16}
                            />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch(e);
                                    }
                                }}
                                placeholder="Search"
                                className="w-full pl-9 pr-4 py-2 md:py-2.5 text-sm bg-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] border border-white/5 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        {isMobile && (
                            <button
                                onClick={() => searchInputRef.current?.focus()}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all sm:hidden"
                                aria-label="Search"
                            >
                                <Search size={18} />
                            </button>
                        )}

                    

                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 md:p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
                                aria-label="Notifications"
                                title="Notifications"
                            >
                                <Bell size={18} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-[#121212] shadow-sm">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-[#111] border border-white/5 rounded-xl shadow-2xl overflow-hidden">
                                    <div className="flex items-center justify-between p-4 border-b border-white/5">
                                        <h3 className="text-white font-semibold text-sm">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllAsRead}
                                                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-gray-500 text-sm">
                                                No new notifications
                                            </div>
                                        ) : (
                                            notifications.map((notification) => (
                                                <button
                                                    key={notification.id}
                                                    onClick={() => handleNotificationClick(notification)}
                                                    className={`w-full p-4 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 ${!notification.is_read ? "bg-emerald-500/5" : ""
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        {!notification.is_read && (
                                                            <span className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-white text-sm font-medium truncate">
                                                                {notification.title}
                                                            </p>
                                                            {notification.message && (
                                                                <p className="text-gray-400 text-xs mt-0.5 truncate">
                                                                    {notification.message}
                                                                </p>
                                                            )}
                                                            <p className="text-gray-500 text-[10px] mt-1">
                                                                {formatRelativeTime(notification.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-3 border-t border-white/5">
                                        <button
                                            onClick={() => {
                                                navigate("/admin/notification");
                                                setShowNotifications(false);
                                            }}
                                            className="w-full text-center text-sm text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                                        >
                                            View all notifications
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="relative" ref={userMenuRef}>
                             <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 pr-2 md:pr-3 rounded-lg bg-transparent hover:bg-white/10 transition-all group cursor-pointer"
                                aria-label="User menu"
                            >
                                {gravatarUrl ? (
                                    <img 
                                        src={gravatarUrl} 
                                        alt={getAdminData?.name ?? 'Admin'} 
                                        className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover shadow-sm border border-white/20"
                                        onError={() => setGravatarUrl("")}
                                    />
                                ) : (
                                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-white/20 to-white/50 flex items-center justify-center text-white font-semibold text-xs md:text-xs shadow-sm border-white">
                                        {(getAdminData?.name || getAdminData?.email || 'A').charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="hidden lg:block text-left">
                                    <p className="text-white text-sm font-medium">{getAdminData?.name ?? 'Admin'}</p>
                                    <p className="text-gray-400 text-xs">{getAdminData?.email ?? 'admin@webbeetles.com'}</p>
                                </div>
                                <ChevronDown
                                    className={`hidden md:block text-gray-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`} size={16} />
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-[#111] border border-white/5 rounded-xl shadow-2xl overflow-hidden">
                                    <div className="p-4 border-b border-white/5 flex items-center gap-3">
                                        {gravatarUrl ? (
                                            <img 
                                                src={gravatarUrl} 
                                                alt={getAdminData?.name ?? 'Admin'} 
                                                className="w-9 h-9 rounded-full object-cover border border-white/10"
                                                onError={() => setGravatarUrl("")}
                                            />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/20 to-white/50 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                                {(getAdminData?.name || getAdminData?.email || 'A').charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-white text-sm font-medium">{getAdminData?.name ?? 'Admin'}</p>
                                            <p className="text-gray-400 text-xs mt-0.5">{getAdminData?.email ?? 'admin@webbeetles.com'}</p>
                                        </div>
                                    </div>

                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                navigate("/admin/settings");
                                                setShowUserMenu(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-all text-sm cursor-pointer"
                                        >
                                            <Settings size={16} />
                                            <span>Settings</span>
                                        </button>
                                    </div>

                                    <div className="p-2 border-t shadow-[0_0_15px_rgba(0,0,0,0.5)] border-transparent">
                                        <button
                                            onClick={() => handleLogout()} disabled={isLoggingOut}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm cursor-pointer"
                                        >
                                            <LogOut size={16} className={isLoggingOut ? "animate-spin" : ""} />
                                            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {isMobile && (
                    <div className="px-4 pb-3 sm:hidden">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={16}
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch(e);
                                    }
                                }}
                                placeholder="Search..."
                                className="w-full pl-9 pr-4 py-2 text-sm bg-white/5 shadow-sm shadow-[0_0_15px_rgba(0,0,0,0.5)] border-transparent rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                            />
                        </div>
                    </div>
                )}
            </header>

            {isMobile && showMobileSidebar && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={() => setShowMobileSidebar(false)}
                    />
                    <div
                        className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out ${showMobileSidebar ? "translate-x-0" : "-translate-x-full"
                            }`}
                    >
                        <Sidebar onNavigate={() => setShowMobileSidebar(false)} />
                    </div>
                </>
            )}
        </>
    );
}
