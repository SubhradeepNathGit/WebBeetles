import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import ScrollToTop from "../layout/scrollonTop";

import useAppSettings from "../tanstack/query/fetchAppSettings";
import MaintenanceGuard from "../layout/common/MaintenanceGuard";

// student - Layouts
import StudentNavbar from "../layout/student/StudentNavbar";
import StudentFooter from "../layout/student/StudentFooter";

// Pages - student
import Home from "../pages/student/Home";
import Signin from "../pages/student/auth/login/Signin";
import Signup from "../pages/student/auth/register/Signup";
import Error404 from "../pages/common/Error404";
import ForgetPassword from "../pages/student/auth/forgetPassword/ForgetPassword";
import ResetPassword from "../pages/student/auth/resetPassword/ResetPassword";
import Otp from "../pages/student/auth/otp/Otp";
import Cart from "../pages/student/cart/Cart";
import Course from "../pages/student/Course";
import Category from "../pages/student/Category";
import ContactUs from "../pages/student/ContactUs";
import CourseDetails from "../pages/student/CourseDetails";
import AboutUs from "../pages/student/AboutUs";
import CategoryDetails from "../pages/student/CategoryDetails";
import TermsOfService from "../pages/common/terms&policy/TermsOfService";
import PrivacyPolicy from "../pages/common/terms&policy/PrivacyPolicy";
import DashboardLayout from "../pages/common/dashboard/DashboardLayout";

// instructor - Layout
import InstructorNavbar from "../layout/instructor/InstructorNavbar";
import InstructorFooter from "../layout/instructor/InstructorFooter";

// Pages - instructor
import InstructorHome from "../pages/instructor/InstructorHome";
import InstructorSignup from "../pages/instructor/auth/register/InstructorSignup";
import InstructorSignin from "../pages/instructor/auth/login/InstructorSignin";
import InstructorResetPassword from "../pages/instructor/auth/resetPassword/InstructorResetPassword";
import InstructorForgetPassword from "../pages/instructor/auth/forgetPassword/InstructorForgetPassword";
import InstructorOtp from "../pages/instructor/auth/otp/InstructorOtp";
import InstructorRequestForm from "../pages/instructor/request/form/InstructorRequestForm";
import InstructorRequestStatus from "../pages/instructor/request/status/InstructorRequestStatus";


// Admin - Layout
import AdminLayout from "../layout/admin/AdminLayout";

// Pages - admin
import AdminSignin from "../pages/admin/auth/AdminSignin";
import Dashboard from "../Pages/admin/Dashboard";
import Students from "../pages/admin/Student";
import Instructors from "../Pages/admin/Instructors";
import InstructorReviews from "../pages/admin/InstructorReviews";
import ApproveCourses from "../Pages/admin/ApproveCourses";
import Analytics from "../Pages/admin/Analytics";
import Settings from "../Pages/admin/Settings";
import Charges from "../pages/admin/Charges";
import Contact from "../pages/admin/Contact";
import AllCategory from "../pages/admin/AllCategory";
import Notification from "../pages/admin/Notification";
import Admin from "../pages/admin/Admin";
import ExamSet from "../pages/admin/ExamSet";
import AdminProfile from "../pages/admin/AdminProfile";
import { Loader2 } from "lucide-react";

// Student Layout wrapper (must be used inside Router!)
const StudentLayout = ({ children }) => {
  const location = useLocation();

  // routes that should NOT show navbar + footer
  const hideLayoutRoutes = ["/user-signin", "/user-signup", "/404"];
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && <StudentNavbar />}
      {children}
      {!hideLayout && <StudentFooter />}
    </>
  );
};

// Instructor Layout wrapper (must be used inside Router!)
const InstructorLayout = ({ children }) => {
  const location = useLocation();

  // routes that should NOT show navbar + footer
  const hideLayoutRoutes = ["/user-signin", "/user-signup", "/404"];
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && <InstructorNavbar />}
      {children}
      {!hideLayout && <InstructorFooter />}
    </>
  );
};

const Routing = () => {
  const { settings, loading } = useAppSettings();

  if (loading) {
    return <div className="text-white p-10 h-screen"><Loader2 className="w-15 h-15 mx-auto text-center inline animate-spin my-auto" /></div>;
  }

  const isMaintenance = settings?.maintenance_mode;

  return (
    <>
      <ScrollToTop />
      <Routes>

        {/* student  */}

        {/* Pages with Layout */}
        <Route path="/" element={<MaintenanceGuard isMaintenance={isMaintenance}><StudentLayout><Home /></StudentLayout></MaintenanceGuard>} />
        <Route path="/about" element={<MaintenanceGuard isMaintenance={isMaintenance}><StudentLayout> <AboutUs /></StudentLayout></MaintenanceGuard>} />
        <Route path="/course" element={<MaintenanceGuard isMaintenance={isMaintenance}><StudentLayout> <Course /></StudentLayout></MaintenanceGuard>} />
        <Route path="/course/course-details/:courseId" element={<MaintenanceGuard isMaintenance={isMaintenance}><StudentLayout> <CourseDetails /></StudentLayout></MaintenanceGuard>} />
        <Route path="/category" element={<MaintenanceGuard isMaintenance={isMaintenance}><StudentLayout> <Category /></StudentLayout></MaintenanceGuard>} />
        <Route path="/category/category-details/:categoryId" element={<MaintenanceGuard isMaintenance={isMaintenance}><StudentLayout> <CategoryDetails /></StudentLayout></MaintenanceGuard>} />
        <Route path="/contact" element={<MaintenanceGuard isMaintenance={isMaintenance}><StudentLayout> <ContactUs /></StudentLayout></MaintenanceGuard>} />
        <Route path="/terms" element={<MaintenanceGuard isMaintenance={isMaintenance}><StudentLayout> <TermsOfService /></StudentLayout></MaintenanceGuard>} />
        <Route path="/privacy" element={<MaintenanceGuard isMaintenance={isMaintenance}><StudentLayout> <PrivacyPolicy /></StudentLayout></MaintenanceGuard>} />

        {/* Pages (no navbar/footer) */}
        <Route path="/signin" element={<MaintenanceGuard isMaintenance={isMaintenance}><Signin /></MaintenanceGuard>} />
        <Route path="/signup" element={<MaintenanceGuard isMaintenance={isMaintenance}><Signup /></MaintenanceGuard>} />
        <Route path="/forget-password" element={<MaintenanceGuard isMaintenance={isMaintenance}><ForgetPassword /></MaintenanceGuard>} />
        <Route path="/reset-password" element={<MaintenanceGuard isMaintenance={isMaintenance}><ResetPassword /></MaintenanceGuard>} />
        <Route path="/otp" element={<MaintenanceGuard isMaintenance={isMaintenance}><Otp /></MaintenanceGuard>} />
        <Route path="/cart" element={<MaintenanceGuard isMaintenance={isMaintenance}><Cart /></MaintenanceGuard>} />


        {/* instructor */}

        {/* Pages with Layout */}
        <Route path="/instructor/" element={<MaintenanceGuard isMaintenance={isMaintenance}><InstructorLayout> <InstructorHome /></InstructorLayout></MaintenanceGuard>} />

        {/* Pages (no navbar/footer) */}
        <Route path="/instructor/signin" element={<MaintenanceGuard isMaintenance={isMaintenance}><InstructorSignin /></MaintenanceGuard>} />
        <Route path="/instructor/signup" element={<MaintenanceGuard isMaintenance={isMaintenance}><InstructorSignup /></MaintenanceGuard>} />
        <Route path="/instructor/forget-password" element={<MaintenanceGuard isMaintenance={isMaintenance}><InstructorForgetPassword /></MaintenanceGuard>} />
        <Route path="/instructor/reset-password" element={<MaintenanceGuard isMaintenance={isMaintenance}><InstructorResetPassword /></MaintenanceGuard>} />
        <Route path="/instructor/otp" element={<MaintenanceGuard isMaintenance={isMaintenance}><InstructorOtp /></MaintenanceGuard>} />
        <Route path="/instructor/profile-form" element={<MaintenanceGuard isMaintenance={isMaintenance}><InstructorRequestForm /></MaintenanceGuard>} />
        <Route path="/instructor/request-status" element={<MaintenanceGuard isMaintenance={isMaintenance}><InstructorRequestStatus /></MaintenanceGuard>} />


        {/* admin */}

        {/* Pages with Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="instructors" element={<Instructors />} />
          <Route path="instructor-reviews" element={<InstructorReviews />} />
          <Route path="approve-courses" element={<ApproveCourses />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="charge" element={<Charges />} />
          <Route path="category" element={<AllCategory />} />
          <Route path="admin" element={<Admin />} />
          <Route path="contact" element={<Contact />} />
          <Route path="notification" element={<Notification />} />
          <Route path="examset" element={<ExamSet />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Pages (no navbar/footer) */}
        <Route path="/admin/" element={<AdminSignin />} />

        {/* common  */}

        {/* Pages (no navbar/footer) */}
        <Route path="/:user_type/dashboard" element={<DashboardLayout />} />


        {/* 404 Page (no navbar/footer) */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default Routing;
