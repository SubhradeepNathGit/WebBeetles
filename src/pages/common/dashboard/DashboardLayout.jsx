import React, { useEffect, useState } from "react";
import DashboardSidebar from "../../../layout/common/Sidebar";
import StudentDashboard from "../../../components/student/dashboard/StudentDashboard";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import InstructorDashboard from "../../../components/instructor/dashboard/InstructorDashboard";
import AddCourseForm from "../../../components/instructor/dashboard/AddCourseForm";
import MyCoursesPage from "../../../components/student/dashboard/MyCoursesPage";
import InstructorCourse from "../../../components/instructor/dashboard/InstructorCourse";
import { checkLoggedInUser } from "../../../redux/slice/authSlice/checkUserAuthSlice";
import AvailableCategory from "../../../components/instructor/dashboard/AvailableCategory";
import InstructorProfile from "../../../components/instructor/dashboard/InstructorProfile";
import StudentProfile from "../../../components/student/dashboard/student-profile/StudentProfile";
import InstructorAnalytics from "../../../components/instructor/dashboard/InstructorAnalytics";

const DashboardLayout = ({ currentPage }) => {

  const [activePage, setActivePage] = useState(currentPage ? currentPage : "dashboard"),
    { user_type } = useParams(),
    navigate = useNavigate(),
    dispatch = useDispatch(),
    { isUserLoading, userAuthData, userError } = useSelector(state => state.checkAuth);

  // console.log('user_type', user_type);
  // console.log('currentPage', currentPage);
  // console.log('User Auth Data', userAuthData);

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
    const handleOpenTab = () => setActivePage("student-myCourses");
    window.addEventListener("open-user-course", handleOpenTab);

    return () => {
      window.removeEventListener("open-user-course", handleOpenTab);
    };
  }, []);

  useEffect(() => {
    const handleOpenTab = () => setActivePage("instructor-add-myCourses");
    window.addEventListener("open-add-course", handleOpenTab);

    return () => {
      window.removeEventListener("open-add-course", handleOpenTab);
    };
  }, []);

  useEffect(() => {
    const handleOpenTab = () => setActivePage("instructor-myCourses");
    window.addEventListener("open-instructor-course", handleOpenTab);

    return () => {
      window.removeEventListener("open-instructor-course", handleOpenTab);
    };
  }, []);
  
  useEffect(() => {
    const handleOpenTab = () => setActivePage("instructor-analytics");
    window.addEventListener("open-instructor-analytics", handleOpenTab);

    return () => {
      window.removeEventListener("open-instructor-analytics", handleOpenTab);
    };
  }, []);

  useEffect(() => {
    const handleOpenTab = () => setActivePage("requestInstructor");
    window.addEventListener("open-request-instructor", handleOpenTab);

    return () => {
      window.removeEventListener("open-request-instructor", handleOpenTab);
    };
  }, []);

  // console.log('active page', activePage);

  const renderContent = () => {
    switch (activePage) {
      case 'student-dashboard':
        return <StudentDashboard studentDetails={userAuthData} />;
      case 'home':
        return navigate(user_type == "student" ? '/' : '/instructor/');
      case 'profile':
        return (user_type == "student" ? <StudentProfile studentData={userAuthData} /> : <InstructorProfile instructorDetails={userAuthData} />);
      case 'allCourses':
        navigate('/course');
        return;
      case 'student-myCourses':
        return <MyCoursesPage userData={userAuthData} />;
      case 'allCategory':
        return <AvailableCategory />;
      case 'instructor-dashboard':
        return <InstructorDashboard instructorDetails={userAuthData} />
      case 'instructor-myCourses':
        return <InstructorCourse instructorDetails={userAuthData} />;
      case 'instructor-add-myCourses':
        return <AddCourseForm />;
      case 'instructor-analytics':
        return <InstructorAnalytics />;
      default:
        return user_type == "student" ? (
          <StudentDashboard studentDetails={userAuthData} />
        ) : (
          <InstructorDashboard instructorDetails={userAuthData} />
        );
    }
  }

  if (isUserLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
        <p className="text-purple-200 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-black text-white">
      {/* Pass setActivePage as a prop to Sidebar */}
      <DashboardSidebar setActivePage={setActivePage} activePage={activePage} user_type={user_type} userData={userAuthData} />
      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()} {/* Display content based on the activePage */}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
