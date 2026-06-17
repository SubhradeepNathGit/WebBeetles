import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Bot, ShoppingCart, Bell, CheckCircle2, Clock, Info, AlertTriangle, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import getSweetAlert from "../../util/alert/sweetAlert";
import { checkLoggedInUser, logoutUser } from "../../redux/slice/authSlice/checkUserAuthSlice";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead, addRealtimeNotification, removeRealtimeNotification, resetNotifications } from "../../redux/slice/notificationSlice";
import supabase from "../../util/supabase/supabase";

const formatRelativeTime = (dateString) => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
        return "";
    }
};

const getIconForType = (type) => {
    switch (type) {
        case 'success': return <CheckCircle2 className="w-5 h-5 text-gray-300" />;
        case 'warning': return <AlertTriangle className="w-5 h-5 text-gray-400" />;
        case 'error': return <XCircle className="w-5 h-5 text-gray-400" />;
        case 'info':
        default: return <Info className="w-5 h-5 text-gray-300" />;
    }
};

const StudentNavbar = () => {
  const [isOpen, setIsOpen] = useState(false),
    [activeDropdown, setActiveDropdown] = useState(null),
    [scrolled, setScrolled] = useState(false),
    [showNotificationDrawer, setShowNotificationDrawer] = useState(false),
    { isUserLoading, userAuthData: getStudentData, userError, isAuthChecked } = useSelector(state => state.checkAuth),
    { cartItems } = useSelector(state => state.cart),
    { notifications, unreadCount } = useSelector(state => state.notification),
    dispatch = useDispatch(),
    navigate = useNavigate();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userLogout = async () => {

    await dispatch(logoutUser({ user_type: 'student',status:true }))
      .then(res => {
        // console.log('Response for logout', res);
        navigate("/");
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

  // console.log('User data', getStudentData);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  useEffect(() => {
    if (getStudentData?.id) {
        const studentId = getStudentData.id;

        dispatch(fetchNotifications({ user_type: 'student', user_id: studentId }));

        // Poll every 30s as a robust fallback in case Supabase Realtime is not enabled
        const pollInterval = setInterval(() => {
            dispatch(fetchNotifications({ user_type: 'student', user_id: studentId }));
        }, 30000);

        const channel = supabase
            .channel(`realtime-notifications-student-${studentId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'notifications', filter: "user_type=eq.student" },
                (payload) => {
                    const row = payload.eventType === 'DELETE' ? payload.old : payload.new;
                    if (row?.user_id && row.user_id !== studentId) return;

                    if (payload.eventType === 'DELETE') {
                        dispatch(removeRealtimeNotification(row.id));
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
    }
  }, [getStudentData?.id, dispatch]);

  // Re-fetch every time the notification drawer opens
  useEffect(() => {
    if (showNotificationDrawer && getStudentData?.id) {
        dispatch(fetchNotifications({ user_type: 'student', user_id: getStudentData.id }));
    }
  }, [showNotificationDrawer, getStudentData, dispatch]);

  const handleNotificationClick = (notification) => {
      if (!notification.is_read) {
          dispatch(markNotificationRead(notification.id));
      }
      setShowNotificationDrawer(false);
      setIsOpen(false);
      if (notification.link) {
          navigate(notification.link);
      }
  };

  const handleNavClick = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      {/* Top StudentNavbar */}
      <nav
        className={`w-full text-white fixed top-0 z-50 transition-all duration-500 ${scrolled ? "bg-black/30 backdrop-blur-md" : "bg-transparent"
          }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl lg:rounded-xl flex items-center justify-center">
                <span className="text-white text-sm sm:text-lg lg:text-2xl font-bold">
                   <img src="/logo.png" alt="WebBeetles" className="h-10 w-10 animate-spin object-contain" />
                </span>
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold">
                WebBeetles
              </span>
            </div>

            {/* Desktop Menu */}
            {/* Unified Tablet + Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 xl:space-x-8">
              <Link to="/"
                className="relative text-white font-medium text-base xl:text-lg after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                Home
              </Link>
              <Link to="/about"
                className="relative text-white font-medium text-base xl:text-lg after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                About
              </Link>

              {/* Explore Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 relative text-white font-medium text-base xl:text-lg after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300">
                  Explore
                  <ChevronDown className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-44 xl:w-48 bg-white/10 backdrop-blur-md text-white font-semibold text-base xl:text-lg rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="py-3">
                    {[{ id: 1, title: "Category", url: "/category" }, { id: 2, title: "Course", url: "/course" }].map(
                      (item) => (
                        <Link
                          key={item.id}
                          to={item.url}
                          className="block px-4 py-2 text-sm transition-all duration-300 transform hover:scale-101 hover:bg-white/20 hover:text-white"
                        >
                          {item.title}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              </div>

              <Link to="/contact"
                className="relative text-white font-medium text-base xl:text-lg after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
              >
                Contact
              </Link>
            </div>


            {/* Get Started Button & AI Chatbot (Desktop + Tablet) */}
            <div className="hidden md:flex items-center gap-4">

              {/* Notification Button (Only visible after login) */}
              {isAuthChecked && getStudentData && (
                <button 
                  onClick={() => setShowNotificationDrawer(true)}
                  className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center transition-all duration-300 relative group"
                  title="Notifications"
                >
                  <Bell className="text-white w-5 h-5 lg:w-[22px] lg:h-[22px] group-hover:scale-110 transition-transform duration-300" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold w-[18px] h-[18px] lg:w-5 lg:h-5 rounded-full flex items-center justify-center border border-white/70 shadow-[0_4px_14px_rgba(255,255,255,0.35)] transform group-hover:scale-110 transition-transform duration-300">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* Cart Button (Only visible after login) */}
              {isAuthChecked && getStudentData && (
                <Link 
                  to="/cart"
                  className="w-10 h-10 lg:w-11 lg:h-11  flex items-center justify-center transition-all duration-300 group relative "
                  title="Your Cart"
                >
                  <ShoppingCart className="text-white w-5 h-5 lg:w-[22px] lg:h-[22px] transition-all duration-300" />
                  {cartItems?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold w-[18px] h-[18px] lg:w-5 lg:h-5 rounded-full flex items-center justify-center border border-white/70 shadow-[0_4px_14px_rgba(255,255,255,0.35)] transform group-hover:scale-110 transition-transform duration-300">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              )}

              {(!isAuthChecked || isUserLoading) ? (
                <div className="w-24 h-10 lg:h-12 bg-white/10 animate-pulse rounded-full"></div>
              ) : !getStudentData ? (
                <Link
                  to="/signin"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full font-semibold hover:bg-white/40 transition-all duration-300 transform hover:scale-105 text-sm lg:text-base"
                >
                  Get Started
                </Link>
              ) : (
                <div className="relative group flex items-center gap-3">
                  {/* Welcome Text */}
                  <span className="text-white/90 font-medium text-sm lg:text-base hidden sm:block cursor-default">
                    Welcome back, <span className="text-white font-bold">{getStudentData?.name?.split(" ")[0] || "Student"}</span>
                  </span>
                  
                  {/* Round Profile Button */}
                  <div className="w-10 h-10 lg:w-11 lg:h-11 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-md ring-2 ring-white/20 group-hover:ring-purple-400/50 group-hover:bg-white/20 transition-all duration-300 cursor-pointer overflow-hidden">
                    {getStudentData ? (
                      <img className="w-full h-full object-cover"
                        src={
                          getStudentData.profile_image_url
                            ? `${getStudentData.profile_image_url}`
                            : "/demo/user.png"
                        }
                        alt={getStudentData?.name?.charAt(0)} />) : null}
                  </div>

                  {/* Dropdown Menu (visible on hover) */}
                  <div className="absolute right-0 top-full pt-2 w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="bg-[#16161e] border border-white/10 rounded-xl shadow-2xl py-1.5 flex flex-col">
                      <Link
                        to="/student/dashboard"
                        className="px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm font-medium"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/cart"
                        className="px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm font-medium"
                      >
                        Cart
                      </Link>
                      <div className="h-px bg-white/10 my-1 mx-3"></div>
                      <button
                        onClick={() => userLogout()}
                        className="w-full text-left px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 text-sm font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-gray-200 transition-colors p-1"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={handleNavClick}
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-80 bg-gradient-to-b from-gray-900 to-black text-white z-50 md:hidden shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">W</span>
                </div>
                <span className="text-xl font-bold">WebBeetles</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-300 transition-colors p-1"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-1">
              {/* Home & About */}
              {[{ id: 1, title: "Home", url: "/" },
              { id: 2, title: "About Us", url: "/about" }].map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  className="block text-white hover:text-purple-300 hover:bg-white/5 transition-all duration-200 font-medium py-4 px-4 rounded-lg"
                  onClick={handleNavClick}
                >
                  {item.title}
                </Link>
              ))}

              {/* Explore Dropdown (Category + Course) */}
              <div>
                <button
                  onClick={() => toggleDropdown("explore")}
                  className="flex items-center justify-between w-full text-white hover:text-purple-300 hover:bg-white/5 transition-all duration-200 font-medium py-4 px-4 rounded-lg"
                >
                  Explore
                  <motion.div
                    animate={{ rotate: activeDropdown === "explore" ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {activeDropdown === "explore" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden ml-4 mt-2"
                    >
                      {[{ id: 1, title: "Category", url: "/category" },
                      { id: 2, title: "Course", url: "/course" }].map((item) => (
                        <Link
                          key={item.id}
                          to={item.url}
                          className="block text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 py-3 px-4 rounded-lg"
                          onClick={handleNavClick}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Contact */}
              <Link
                to="/contact"
                className="block text-white hover:text-purple-300 hover:bg-white/5 transition-all duration-200 font-medium py-4 px-4 rounded-lg"
                onClick={handleNavClick}
              >
                Contact
              </Link>

              {/* Get Started / Profile */}
              <div className="mt-6">
                {(!isAuthChecked || isUserLoading) ? (
                  <div className="w-full h-12 bg-white/10 animate-pulse rounded-xl"></div>
                ) : !getStudentData ? (
                  <Link
                    to="/signin"
                    className="block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-semibold text-center transition-all duration-300 transform hover:scale-105 shadow-lg"
                    onClick={handleNavClick}
                  >
                    Get Started
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/student/dashboard"
                      className="block text-white hover:text-purple-300 hover:bg-white/5 transition-all duration-200 font-medium py-4 px-4 rounded-lg mb-3"
                      onClick={handleNavClick}
                    >
                      Dashboard
                    </Link>
                    
                    <Link
                      to="/cart"
                      className="block text-white hover:text-purple-300 hover:bg-white/5 transition-all duration-200 font-medium py-4 px-4 rounded-lg mb-3"
                      onClick={handleNavClick}
                    >
                      Cart
                    </Link>

                    {/* Notification link in mobile drawer */}
                    <button
                      onClick={() => { setIsOpen(false); setShowNotificationDrawer(true); }}
                      className="flex items-center justify-between w-full text-white hover:text-purple-300 hover:bg-white/5 transition-all duration-200 font-medium py-4 px-4 rounded-lg mb-3"
                    >
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-white text-black text-xs font-bold px-2 py-0.5 rounded-full border border-white/70 shadow-[0_4px_14px_rgba(255,255,255,0.28)]">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        userLogout();
                        handleNavClick();
                      }}
                      className="block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-semibold text-center transition-all duration-300 w-full"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global AI Chatbot Drawer has been moved to global App.jsx */}

      {/* Notification Drawer Overlay */}
      <AnimatePresence>
        {showNotificationDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/35 backdrop-blur-md z-50"
            onClick={() => setShowNotificationDrawer(false)}
          />
        )}
      </AnimatePresence>

      {/* Notification Drawer (Sliding from Left) */}
      <AnimatePresence>
        {showNotificationDrawer && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-full xs:w-[360px] sm:w-[360px] bg-[rgba(5,7,12,0.94)] backdrop-blur-3xl text-white z-[60] shadow-[18px_0_50px_rgba(0,0,0,0.55)] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0))]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center border border-white/20 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_12px_30px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                  <Bell className="w-5 h-5 text-sky-100" />
                </div>
                <h2 className="text-2xl font-bold tracking-wide text-white">Notifications</h2>
              </div>
              <button
                onClick={() => setShowNotificationDrawer(false)}
                className="text-slate-200 hover:text-white hover:bg-white/12 p-2.5 rounded-xl transition-all backdrop-blur-xl cursor-pointer"
                aria-label="Close notifications"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-3 flex justify-between items-center bg-transparent">
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.12] backdrop-blur-2xl border border-white/20 text-xs font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_10px_24px_rgba(0,0,0,0.18)]">
                        <span className={`w-1.5 h-1.5 rounded-full ${unreadCount > 0 ? 'bg-sky-200 shadow-[0_0_12px_rgba(186,230,253,0.9)] animate-pulse' : 'bg-slate-500'}`}></span>
                        <span className="text-white font-bold">{unreadCount}</span> Unread
                    </span>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={() => getStudentData?.id && dispatch(markAllNotificationsRead({ user_type: 'student', user_id: getStudentData.id }))}
                        className="text-xs font-semibold text-slate-100 hover:text-white transition-colors cursor-pointer bg-white/10 px-4 py-2 rounded-full border border-white/15 hover:bg-white/[0.18] backdrop-blur-xl"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent px-5 pb-6 pt-4 space-y-4">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center opacity-70">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl">
                        <Bell className="w-8 h-8 text-sky-100" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">You're all caught up!</h3>
                    <p className="text-slate-300 text-sm">No new notifications right now.</p>
                </div>
              ) : (
                <AnimatePresence>
                    {notifications.map((notification) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_18px_34px_rgba(0,0,0,0.22)] ${!notification.is_read ? 'bg-white/[0.14] border-white/25 hover:bg-white/[0.18]' : 'bg-white/[0.07] border-white/[0.12] hover:bg-white/[0.12]'}`}
                        >
                            {!notification.is_read && (
                                <div className="absolute left-0 top-4 bottom-4 w-1 bg-sky-200 rounded-r-full shadow-[0_0_16px_rgba(186,230,253,0.45)]"></div>
                            )}
                            <div className="flex gap-4">
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] ${!notification.is_read ? 'bg-white/[0.14] text-white border border-white/20' : 'bg-white/[0.08] text-slate-300 border border-white/10'}`}>
                                    {getIconForType(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-sm pr-4 ${!notification.is_read ? 'text-white font-semibold' : 'text-slate-200 font-medium'}`}>
                                        {notification.title}
                                    </h4>
                                    <p className={`text-xs mt-1 leading-relaxed ${!notification.is_read ? 'text-slate-200' : 'text-slate-400'} line-clamp-2`}>
                                        {notification.message}
                                    </p>
                                    <span className={`flex items-center gap-1.5 text-[10px] mt-2.5 font-medium ${!notification.is_read ? 'text-slate-300' : 'text-slate-500'}`}>
                                        <Clock className="w-3 h-3" />
                                        {formatRelativeTime(notification.created_at)}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudentNavbar;

