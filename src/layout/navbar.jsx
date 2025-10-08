import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isLoggedInUser, logoutUser } from "../redux/slice/authSlice/checkAuth";
import toastifyAlert from "../util/toastify";
import { userProfile } from "../redux/slice/userSlice";
import getSweetAlert from "../util/sweetAlert";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false),
    [activeDropdown, setActiveDropdown] = useState(null),
    [scrolled, setScrolled] = useState(false),
    { isAuth } = useSelector(state => state.checkAuth),
    { isUserLoading, getUserData, isUserError } = useSelector(state => state.user),
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

  useEffect(() => {
    dispatch(isLoggedInUser());
  }, []);

  const userLogout = () => {
    dispatch(logoutUser())
    toastifyAlert.success("Logged out");
    navigate('/');
  }

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

  // console.log('User data', getUserData);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleNavClick = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      {/* Top Navbar */}
      <nav
        className={`w-full text-white fixed top-0 z-50 transition-all duration-500 ${scrolled ? "bg-black/30 backdrop-blur-md" : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-md rounded-lg sm:rounded-xl lg:rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-sm sm:text-lg lg:text-2xl font-bold">
                  W
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


            {/* Get Started Button (Desktop + Tablet) */}
            <div className="hidden md:block">
              {!isAuth ?
                <Link
                  to="/signin"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full font-semibold hover:bg-white/40 transition-all duration-300 transform hover:scale-105 text-sm lg:text-base"
                >
                  Get Started
                </Link> :
                <div className="relative group inline-block">
                  {/* Round Profile Button */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg group-hover:bg-white/30 transition-all duration-300 cursor-pointer">
                    <span className="text-white text-lg sm:text-xl lg:text-2xl font-bold">
                      {getUserData?.user ? (
                        <img className="rounded-full border-3 border-white/20 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14"
                          src={
                            getUserData.user.profileImage
                              ? `http://localhost:3005${getUserData.user.profileImage}`
                              : "/images/user1.jpg"
                          }
                          alt={getUserData.user.name.charAt(0)} />) : null}
                    </span>
                  </div>

                  {/* Dropdown Menu (visible on hover) */}
                  <div className="absolute right-0 mt-2 w-40 bg-white/10 backdrop-blur-md rounded-lg shadow-lg py-2 text-white font-medium text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-white/20 transition-all duration-200"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => userLogout()}
                      className="w-full text-left px-4 py-2 hover:bg-white/20 transition-all duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              }
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
                {!isAuth ? (
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
                      to="/dashboard"
                      className="block text-white hover:text-purple-300 hover:bg-white/5 transition-all duration-200 font-medium py-4 px-4 rounded-lg mb-3"
                      onClick={handleNavClick}
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        userLogout();
                        handleNavClick();
                      }}
                      className="block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-white px-6 py-4 rounded-xl font-semibold text-center transition-all duration-300 w-full"
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
    </>
  );
};

export default Navbar;