import React, { useEffect, useState } from "react";
import DashboardSidebar from "../../layout/sidebar";
import UserDashboard from "../../components/dashboard/users/UserDashboard";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "../../redux/slice/userSlice";
import InstructorRequestForm from "../../components/dashboard/instructors/InstructorRequestForm";
import InstructorDashboard from "../../components/dashboard/instructors/InstructorDashboard";
import RequestStatusPage from "../../components/dashboard/instructors/RequestStatusPage";
import AddCourseForm from "../../components/dashboard/instructors/AddCourseForm";
import MyCoursesPage from "../../components/dashboard/users/MyCoursesPage";
import InstructorCourse from "../../components/dashboard/instructors/InstructorCourse";

const DashboardLayout = () => {
  const [activePage, setActivePage] = useState("dashboard"),
    navigate = useNavigate(),
    dispatch = useDispatch(),
    { isAuth } = useSelector((state) => state.checkAuth),
    { isUserLoading, getUserData, isUserError } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(userProfile())
      .then((res) => {
        // console.log('User profile fetched:', res);
      })
      .catch((err) => {
        getSweetAlert("Oops...", "Something went wrong!", "error");
        console.log("Error occurred", err);
      });
  }, [dispatch]);

  // console.log(getUserData);

  if (isUserLoading?.user) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p className="animate-pulse text-gray-400 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  // Render different content based on the activePage
  const renderContent = () => {
    switch (activePage) {
      case 'user-dashboard':
        return <UserDashboard />;
      case 'home':
        navigate('/');
        return;
      case 'allCourses':
        navigate('/course');
        return;
      case 'user-myCourses':
        return <MyCoursesPage />;
      case 'requestInstructor':
        return <InstructorRequestForm userData={getUserData} />;
      case 'requestStatus':
        return <RequestStatusPage />;
      case 'instructor-dashboard':
        return <InstructorDashboard />;
      case 'instructor-myCourses':
        return <InstructorCourse />;
      case 'add-myCourses':
        return <AddCourseForm />;
      default:
        return getUserData?.user?.role === "Instructor" ? (
          <InstructorDashboard />
        ) : (
          <UserDashboard />
        );
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-black text-white">
      {/* Pass setActivePage as a prop to Sidebar */}
      <DashboardSidebar setActivePage={setActivePage} activePage={activePage} />

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
