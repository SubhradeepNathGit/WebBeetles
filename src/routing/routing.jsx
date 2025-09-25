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
        {/* Main Pages with Layout */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        {/* Auth Pages (no navbar/footer) */}
        <Route path="/user-signin" element={<Signin />} />
        <Route path="/user-signup" element={<Signup />} />

        {/* 404 Page (no navbar/footer) */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default Routing;
