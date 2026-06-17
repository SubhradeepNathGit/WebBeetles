import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { markNotificationRead, markAllNotificationsRead } from "../../redux/slice/notificationSlice";
import { BellRing, CheckCircle2, ChevronRight, Clock, Info, AlertTriangle, XCircle, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
        
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return "";
    }
};

const getIconForType = (type) => {
    switch (type) {
        case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
        case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
        case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
        case 'info':
        default: return <Info className="w-5 h-5 text-blue-400" />;
    }
};

const Notification = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notifications, unreadCount } = useSelector(state => state.notification);
    const [filter, setFilter] = useState("all"); // "all" or "unread"

    const filteredNotifications = notifications.filter(n => filter === "all" ? true : !n.is_read);

    const handleMarkAllRead = () => {
        dispatch(markAllNotificationsRead({ user_type: 'admin' }));
    };

    const handleNotificationClick = (notification) => {
        if (!notification.is_read) {
            dispatch(markNotificationRead(notification.id));
        }
        if (notification.link) {
            navigate(notification.link);
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BellRing className="w-6 h-6 text-emerald-400" />
                        Notifications
                    </h1>
                    <p className="text-gray-400 mt-1">Stay updated with the latest alerts and messages.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="bg-white/5 p-1 rounded-lg flex border border-white/10 backdrop-blur-sm">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === "all" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter("unread")}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${filter === "unread" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"}`}
                        >
                            Unread
                            {unreadCount > 0 && (
                                <span className="bg-emerald-500/20 text-emerald-400 py-0.5 px-2 rounded-full text-[10px]">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-lg font-medium transition-colors text-sm border border-emerald-500/20 cursor-pointer"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 lg:p-24 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                            <BellRing className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">No notifications found</h3>
                        <p className="text-gray-400 mt-2 max-w-sm">
                            {filter === "unread" 
                                ? "You're all caught up! There are no unread notifications right now."
                                : "There are currently no notifications to display."}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        <AnimatePresence>
                            {filteredNotifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`group relative p-4 lg:p-6 hover:bg-white/5 transition-colors cursor-pointer ${!notification.is_read ? 'bg-emerald-500/5' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    {!notification.is_read && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    )}
                                    <div className="flex gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!notification.is_read ? 'bg-white/10' : 'bg-white/5'}`}>
                                            {getIconForType(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                                <h4 className={`text-base truncate pr-4 ${!notification.is_read ? 'text-white font-semibold' : 'text-gray-300 font-medium'}`}>
                                                    {notification.title}
                                                </h4>
                                                <span className="flex items-center gap-1.5 text-xs text-gray-500 flex-shrink-0 whitespace-nowrap">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {formatRelativeTime(notification.created_at)}
                                                </span>
                                            </div>
                                            <p className={`text-sm ${!notification.is_read ? 'text-gray-300' : 'text-gray-500'} line-clamp-2`}>
                                                {notification.message}
                                            </p>
                                        </div>
                                        {notification.link && (
                                            <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                                                <ChevronRight className="w-5 h-5 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;