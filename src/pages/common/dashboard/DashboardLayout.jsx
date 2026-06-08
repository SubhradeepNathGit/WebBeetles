import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardSidebar from "../../../layout/common/Sidebar";
import DashboardSkeleton from "../../../layout/common/DashboardSkeleton";
import StudentDashboard from "../../../components/student/dashboard/StudentDashboard";
import MyCoursesPage from "../../../components/student/dashboard/MyCoursesPage";
import StudentProfile from "../../../components/student/dashboard/student-profile/StudentProfile";
import InstructorDashboard from "../../../components/instructor/dashboard/InstructorDashboard";
import AddCourseForm from "../../../components/instructor/dashboard/AddCourseForm";
import InstructorCourse from "../../../components/instructor/dashboard/InstructorCourse";
import AvailableCategory from "../../../components/instructor/dashboard/AvailableCategory";
import InstructorProfile from "../../../components/instructor/dashboard/InstructorProfile";
import InstructorAnalytics from "../../../components/instructor/dashboard/InstructorAnalytics";

const DashboardLayout = ({ currentPage }) => {
  const [activePage, setActivePage] = useState(currentPage ?? "dashboard");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { user_type } = useParams();
  const navigate = useNavigate();
  const { isUserLoading, userAuthData } = useSelector(state => state.checkAuth);

  const isStudent = user_type === "student";

  useEffect(() => {
    const handlers = {
      "open-user-course": () => setActivePage("student-myCourses"),
      "open-add-course": () => setActivePage("instructor-add-myCourses"),
      "open-instructor-course": () => setActivePage("instructor-myCourses"),
      "open-instructor-analytics": () => setActivePage("instructor-analytics"),
      "open-request-instructor": () => setActivePage("requestInstructor"),
    };

    Object.entries(handlers).forEach(([event, fn]) => window.addEventListener(event, fn));
    return () => Object.entries(handlers).forEach(([event, fn]) => window.removeEventListener(event, fn));
  }, []);

  useEffect(() => {
    if (activePage === "home") {
      navigate(isStudent ? "/" : "/instructor/");
    } else if (activePage === "allCourses") {
      navigate("/course");
    }
  }, [activePage, isStudent, navigate]);

  const renderContent = () => {
    switch (activePage) {
      case "student-dashboard":
        return <StudentDashboard studentDetails={userAuthData} />;
      case "home":
      case "allCourses":
        return null;
      case "profile":
        return isStudent
          ? <StudentProfile studentData={userAuthData} />
          : <InstructorProfile instructorDetails={userAuthData} />;
      case "student-myCourses":
        return <MyCoursesPage userData={userAuthData} />;
      case "allCategory":
        return <AvailableCategory />;
      case "instructor-dashboard":
        return <InstructorDashboard instructorDetails={userAuthData} />;
      case "instructor-myCourses":
        return <InstructorCourse instructorDetails={userAuthData} />;
      case "instructor-add-myCourses":
        return <AddCourseForm />;
      case "instructor-analytics":
        return <InstructorAnalytics />;
      default:
        return isStudent
          ? <StudentDashboard studentDetails={userAuthData} />
          : <InstructorDashboard instructorDetails={userAuthData} />;
    }
  };

  if (isUserLoading) return <DashboardSkeleton role={user_type} />;

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      <DashboardSidebar
        setActivePage={setActivePage}
        activePage={activePage}
        user_type={user_type}
        userData={userAuthData}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="fixed left-4 top-4 z-30 rounded-lg bg-black/80 p-3 text-gray-300 shadow-lg border border-white/10 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-black p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
