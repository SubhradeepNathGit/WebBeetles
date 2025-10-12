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
import { specificInstructor } from "../../redux/slice/instructorSlice";
import { Loader2 } from "lucide-react";

const DashboardLayout = ({ currentPage }) => {
  const [activePage, setActivePage] = useState(currentPage ? currentPage : "dashboard"),
    navigate = useNavigate(),
    dispatch = useDispatch(),
    { isAuth } = useSelector((state) => state.checkAuth),
    { isUserLoading, getUserData, isUserError } = useSelector(state => state.user),
    { isInstructorPending, getInstructorData, isInstructorError } = useSelector(state => state.instructor);

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
    if (Object.keys(getUserData).length > 0) {
      dispatch(specificInstructor(getUserData?.user?._id))
        .then((res) => {
          // console.log('Instructor profile fetched:', res);
        })
        .catch((err) => {
          getSweetAlert("Oops...", "Something went wrong!", "error");
          console.log("Error occurred", err);
        });
    }
  }, [dispatch, getUserData]);

  // console.log('User details', getUserData);
  // console.log('Instructor details', getInstructorData);


  useEffect(() => {
    const handleOpenAddCourse = () => setActivePage("add-myCourses");
    window.addEventListener("open-add-course", handleOpenAddCourse);

    return () => {
      window.removeEventListener("open-add-course", handleOpenAddCourse);
    };
  }, []);
 
  useEffect(() => {
    const handleOpenAddCourse = () => setActivePage("instructor-myCourses");
    window.addEventListener("open-instructor-course", handleOpenAddCourse);

    return () => {
      window.removeEventListener("open-instructor-course", handleOpenAddCourse);
    };
  }, []);

  useEffect(() => {
    const handleOpenAddCourse = () => setActivePage("requestInstructor");
    window.addEventListener("open-request-instructor", handleOpenAddCourse);

    return () => {
      window.removeEventListener("open-request-instructor", handleOpenAddCourse);
    };
  }, []);


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
        return <InstructorDashboard instructorDetails={getInstructorData} />
      case 'instructor-myCourses':
        return <InstructorCourse instructorDetails={getInstructorData} />;
      case 'add-myCourses':
        return <AddCourseForm />;
      default:
        return getUserData?.user?.role === "Instructor" ? (
          <InstructorDashboard instructorDetails={getInstructorData} />
        ) : (
          <UserDashboard />
        );
    }
  };

  if (Object.keys(getUserData).length == 0) return (
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
