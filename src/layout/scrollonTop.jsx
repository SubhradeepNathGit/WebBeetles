import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTopOnRoute = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      behavior: "smooth", // change to "auto" if you want instant scroll
    });
  }, [pathname]); // runs every time route changes

  return null; // doesn’t render anything
};

export default ScrollToTopOnRoute;
