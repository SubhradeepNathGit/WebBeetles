import React, { useEffect, useState } from "react";
import DashboardSidebar from "../../layout/sidebar";
import UserDashboard from "../../components/dashboard/users/UserDashboard";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "../../redux/slice/userSlice";
import InstructorRequestForm from "../../components/dashboard/users/InstructorRequestForm";
import InstructorDashboard from "../../components/dashboard/instructors/InstructorDashboard";
import RequestStatusPage from "../../components/dashboard/users/RequestStatusPage";
import AddCourseForm from "../../components/dashboard/instructors/AddCourseForm";
import MyCoursesPage from "../../components/dashboard/users/MyCoursesPage";
import InstructorCourse from "../../components/dashboard/instructors/InstructorCourse";
import { allInstructor } from "../../redux/slice/instructorSlice";

const DashboardLayout = ({ currentPage }) => {
  const [activePage, setActivePage] = useState(currentPage ? currentPage : "dashboard"),
    navigate = useNavigate(),
    dispatch = useDispatch(),
    { isAuth } = useSelector((state) => state.checkAuth),
    { isUserLoading, getUserData, isUserError } = useSelector(state => state.user),
    { isInstructorPending, getInstructorData, isInstructorError } = useSelector(state => state.instructor);

  let instructor = null;

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

  useEffect(() => {
    dispatch(allInstructor())
      .then((res) => {
        // console.log('Instructor profile fetched:', res);
      })
      .catch((err) => {
        getSweetAlert("Oops...", "Something went wrong!", "error");
        console.log("Error occurred", err);
      });
  }, [dispatch]);

  useEffect(() => {
    const handleOpenAddCourse = () => setActivePage("add-myCourses");
    window.addEventListener("open-add-course", handleOpenAddCourse);

    return () => {
      window.removeEventListener("open-add-course", handleOpenAddCourse);
    };
  }, []);

  useEffect(() => {
    const handleOpenAddCourse = () => setActivePage("requestInstructor");
    window.addEventListener("open-request-instructor", handleOpenAddCourse);

    return () => {
      window.removeEventListener("open-request-instructor", handleOpenAddCourse);
    };
  }, []);

  // console.log(getUserData, getInstructorData);

  if (Object.keys(getUserData).length > 0 && getInstructorData.length > 0) {
    instructor = getInstructorData.find(instructor => instructor.user._id == getUserData.user._id);
  }

  // console.log(instructor);

  if (Array.isArray(getInstructorData) && getInstructorData.length > 0 && getUserData?.user?._id) {
    instructor = getInstructorData.find(
      (ins) => ins?.user?._id === getUserData.user._id
    );
  }

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
        return <MyCoursesPage userData={getUserData} />;
      case 'requestInstructor':
        return <InstructorRequestForm userData={getUserData} />;
      case 'requestStatus':
        return <RequestStatusPage userData={getUserData} />;
      case 'instructor-dashboard':
        return <InstructorDashboard instructorDetails={instructor} />
      case 'instructor-myCourses':
        return <InstructorCourse />;
      case 'add-myCourses':
        return <AddCourseForm />;
      default:
        return getUserData?.user?.role === "Instructor" ? (
          <InstructorDashboard instructorDetails={instructor} />
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
