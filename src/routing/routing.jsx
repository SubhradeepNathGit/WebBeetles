import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Layouts
import Navbar from "../layout/navbar";
import Footer from "../layout/footer";
import ScrollToTop from "../layout/scrollonTop";

// Pages
import Home from "../pages/Home";
import Signin from "../pages/auth/login/Signin";
import Signup from "../pages/auth/register/Signup";
import Error404 from "../pages/Error404";
import ForgetPassword from "../pages/auth/forgetPassword/ForgetPassword";
import ResetPassword from "../pages/auth/resetPassword/ResetPassword";
import Otp from "../pages/auth/otp/Otp";
import Course from "../pages/Course";
import Category from "../pages/Category";
import ContactUs from "../pages/ContactUs";
import CourseDetails from "../pages/CourseDetails";
import AboutUs from "../pages/AboutUs";
import CategoryDetails from "../pages/CategoryDetails";
import TermsOfService from "../pages/TermsOfService";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import InstructorRequestForm from "../components/dashboard/instructors/InstructorRequestForm";

// Layout wrapper (must be used inside Router!)
const Layout = ({ children }) => {
  const location = useLocation();

  // routes that should NOT show navbar + footer
  const hideLayoutRoutes = ["/user-signin", "/user-signup", "/404"];
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
};

const Routing = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Pages with Layout */}
        <Route path="/" element={<Layout> <Home /></Layout>} />
        <Route path="/about" element={<Layout> <AboutUs /></Layout>} />
        <Route path="/course" element={<Layout> <Course /></Layout>} />
        <Route path="/course/course-details/:courseId" element={<Layout> <CourseDetails /></Layout>} />
        <Route path="/category" element={<Layout> <Category /></Layout>} />
        <Route path="/category/category-details/:categoryName" element={<Layout> <CategoryDetails /></Layout>} />
        <Route path="/contact" element={<Layout> <ContactUs /></Layout>} />
        <Route path="/terms" element={<Layout> <TermsOfService /></Layout>} />
        <Route path="/privacy" element={<Layout> <PrivacyPolicy /></Layout>} />

        {/* Pages (no navbar/footer) */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/dashboard" element={<DashboardLayout/>} />
        <Route path="/dashboard/user/request-instructor" element={<InstructorRequestForm />} />



        {/* 404 Page (no navbar/footer) */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default Routing;
