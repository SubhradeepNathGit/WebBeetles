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
// import Error_404 from "../pages/cms/Error_404";

// Layout wrapper (must be used inside Router!)
const Layout = ({ children }) => {
  const location = useLocation();

  const hideLayoutRoutes = ["/user-signin", "/user-signup"];
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
      <Layout>
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Home />} />

          {/* Auth Pages */}
          <Route path="/user-signin" element={<Signin />} />
          <Route path="/user-signup" element={<Signup />} />

          {/* 404 Page */}
          {/* <Route path="*" element={<Error_404 />} /> */}
        </Routes>
      </Layout>
    </>
  );
};

export default Routing;
