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
        <Route path="/" element={ <Layout> <Home /></Layout>}/>
        <Route path="/course" element={ <Layout> <Course /></Layout>}/>
        <Route path="/category" element={ <Layout> <Category /></Layout>}/>

        {/* Pages (no navbar/footer) */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/otp" element={<Otp />} />

        {/* 404 Page (no navbar/footer) */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default Routing;
