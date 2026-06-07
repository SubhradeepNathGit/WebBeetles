import React, { useEffect, useState } from "react";
import DashboardSidebar from "../../../layout/common/Sidebar";
import StudentDashboard from "../../../components/student/dashboard/StudentDashboard";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Menu } from "lucide-react";
import InstructorDashboard from "../../../components/instructor/dashboard/InstructorDashboard";
import AddCourseForm from "../../../components/instructor/dashboard/AddCourseForm";
import MyCoursesPage from "../../../components/student/dashboard/MyCoursesPage";
import InstructorCourse from "../../../components/instructor/dashboard/InstructorCourse";
import { checkLoggedInUser } from "../../../redux/slice/authSlice/checkUserAuthSlice";
import AvailableCategory from "../../../components/instructor/dashboard/AvailableCategory";
import InstructorProfile from "../../../components/instructor/dashboard/InstructorProfile";
import StudentProfile from "../../../components/student/dashboard/student-profile/StudentProfile";
import InstructorAnalytics from "../../../components/instructor/dashboard/InstructorAnalytics";
import getSweetAlert from "../../../util/alert/sweetAlert";

const DashboardLayout = ({ currentPage }) => {

  const [activePage, setActivePage] = useState(currentPage ?? "dashboard");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { user_type } = useParams();
  const navigate      = useNavigate();
  const dispatch      = useDispatch();
  const { isUserLoading, userAuthData } = useSelector(state => state.checkAuth);

  // Removed redundant checkLoggedInUser dispatch as ProtectedRoute already handles it

  // Custom event listeners to switch active tab from anywhere in the app
  useEffect(() => {
    const handlers = {
      "open-user-course":        () => setActivePage("student-myCourses"),
      "open-add-course":         () => setActivePage("instructor-add-myCourses"),
      "open-instructor-course":  () => setActivePage("instructor-myCourses"),
      "open-instructor-analytics": () => setActivePage("instructor-analytics"),
      "open-request-instructor": () => setActivePage("requestInstructor"),
    };
    Object.entries(handlers).forEach(([event, fn]) => window.addEventListener(event, fn));
    return () => Object.entries(handlers).forEach(([event, fn]) => window.removeEventListener(event, fn));
  }, []);

  // Handle navigation side-effects safely outside of render
  useEffect(() => {
    if (activePage === 'home') {
      navigate(user_type === "student" ? '/' : '/instructor/');
    } else if (activePage === 'allCourses') {
      navigate('/course');
    }
  }, [activePage, navigate, user_type]);

  const renderContent = () => {
    switch (activePage) {
      case 'student-dashboard':
        return <StudentDashboard studentDetails={userAuthData} />;
      case 'home':
        return null;
      case 'profile':
        return user_type === "student"
          ? <StudentProfile studentData={userAuthData} />
          : <InstructorProfile instructorDetails={userAuthData} />;
      case 'allCourses':
        return null;
      case 'student-myCourses':
        return <MyCoursesPage userData={userAuthData} />;
      case 'allCategory':
        return <AvailableCategory />;
      case 'instructor-dashboard':
        return <InstructorDashboard instructorDetails={userAuthData} />;
      case 'instructor-myCourses':
        return <InstructorCourse instructorDetails={userAuthData} />;
      case 'instructor-add-myCourses':
        return <AddCourseForm />;
      case 'instructor-analytics':
        return <InstructorAnalytics />;
      default:
        return user_type === "student"
          ? <StudentDashboard studentDetails={userAuthData} />
          : <InstructorDashboard instructorDetails={userAuthData} />;
    }
  };

  const isStudent = user_type === "student";

  if (isUserLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className={`w-12 h-12 ${isStudent ? 'text-purple-400' : 'text-rose-500'} animate-spin`} />
        <p className={`${isStudent ? 'text-purple-200' : 'text-rose-200'} text-sm font-medium`}>Loading...</p>
      </div>
    </div>
  );

  // Left margin offset: 280px expanded, 80px (w-20) collapsed. Only applied on md+.
  const mainMargin = sidebarCollapsed ? "md:ml-20" : "md:ml-[280px]";

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Mobile Top Bar ── */}
      <div
        className={`md:hidden flex items-center justify-between p-4 bg-gradient-to-r
          ${isStudent ? 'from-purple-900/50' : 'from-rose-950/50'} to-black
          border-b ${isStudent ? 'border-purple-500/20' : 'border-rose-500/20'}
          sticky top-0 z-30 backdrop-blur-md`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${isStudent ? 'from-purple-400 to-purple-600' : 'from-rose-400 to-rose-600'} flex items-center justify-center shadow-lg`}>
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <h1 className="font-bold text-lg">WebBeetles</h1>
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors cursor-pointer"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* ── Fixed Sidebar ── */}
      <DashboardSidebar
        setActivePage={setActivePage}
        activePage={activePage}
        user_type={user_type}
        userData={userAuthData}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onCollapseChange={setSidebarCollapsed}
      />

      {/* ── Main content — margin-left matches sidebar width on desktop ── */}
      <main className={`min-h-screen transition-all duration-300 ${mainMargin}`}>
        <div className="px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8">
          {renderContent()}
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;
