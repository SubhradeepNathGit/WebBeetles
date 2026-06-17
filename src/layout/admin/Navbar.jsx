import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, LogOut, Settings, ChevronDown, Menu, X, Clock, Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { checkLoggedInUser, logoutUser } from "../../redux/slice/authSlice/checkUserAuthSlice";
import toastifyAlert from "../../util/alert/toastify";
import getSweetAlert from "../../util/alert/sweetAlert";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead, addRealtimeNotification, removeRealtimeNotification, resetNotifications } from "../../redux/slice/notificationSlice";
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

export default function Navbar({ isMobileOpen = false, setIsMobileOpen }) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchQuery, setSearchQuery] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
   
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
                setIsMobileOpen?.(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [setIsMobileOpen]);

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
                { event: '*', schema: 'public', table: 'notifications', filter: "user_type=eq.admin" },
                (payload) => {
                    if (payload.eventType === 'DELETE') {
                        dispatch(removeRealtimeNotification(payload.old.id));
                        return;
                    }
                    dispatch(addRealtimeNotification(payload.new));
                }
            )
            .subscribe();

        return () => {
            clearInterval(pollInterval);
            supabase.removeChannel(channel);
            dispatch(resetNotifications());
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
                        <button
                            type="button"
                            onClick={() => setIsMobileOpen?.((open) => !open)}
                            className="rounded-lg bg-white/5 p-2 text-gray-300 transition-all hover:bg-white/10 hover:text-white md:hidden"
                            aria-label="Toggle menu"
                        >
                            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

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
                                    <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center border border-white/70 shadow-[0_4px_14px_rgba(255,255,255,0.32)]">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-[360px] max-w-[calc(100vw-2rem)] bg-[linear-gradient(145deg,rgba(255,255,255,0.16),rgba(15,23,42,0.82)_44%,rgba(3,7,18,0.92))] border border-white/20 rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.42)] overflow-hidden backdrop-blur-3xl">
                                    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.04]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]">
                                                <Bell size={17} className="text-sky-100" />
                                            </div>
                                            <h3 className="text-white font-semibold text-sm">Notifications</h3>
                                        </div>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllAsRead}
                                                className="text-xs text-sky-100 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-96 overflow-y-auto p-3 space-y-3">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-slate-300 text-sm">
                                                No new notifications
                                            </div>
                                        ) : (
                                            notifications.map((notification) => (
                                                <button
                                                    key={notification.id}
                                                    onClick={() => handleNotificationClick(notification)}
                                                    className={`w-full p-4 text-left transition-all rounded-2xl border backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_14px_28px_rgba(0,0,0,0.2)] cursor-pointer ${!notification.is_read ? "bg-white/[0.14] border-white/25 hover:bg-white/[0.18]" : "bg-white/[0.07] border-white/[0.12] hover:bg-white/[0.12]"}`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                                                            <Info size={16} className="text-sky-100" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                {!notification.is_read && (
                                                                    <span className="w-1.5 h-1.5 bg-sky-200 rounded-full flex-shrink-0 shadow-[0_0_10px_rgba(186,230,253,0.7)]" />
                                                                )}
                                                                <p className="text-white text-sm font-semibold truncate">
                                                                    {notification.title}
                                                                </p>
                                                            </div>
                                                            {notification.message && (
                                                                <p className="text-slate-300 text-xs mt-1 line-clamp-2">
                                                                    {notification.message}
                                                                </p>
                                                            )}
                                                            <p className="text-slate-400 text-[10px] mt-2 flex items-center gap-1.5">
                                                                <Clock size={12} />
                                                                {formatRelativeTime(notification.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-3 border-t border-white/10 bg-white/[0.03]">
                                        <button
                                            onClick={() => {
                                                navigate("/admin/notification");
                                                setShowNotifications(false);
                                            }}
                                            className="w-full text-center text-sm text-sky-100 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl py-2.5 transition-colors cursor-pointer"
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
        </>
    );
}

