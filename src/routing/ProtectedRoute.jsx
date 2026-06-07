import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";
import { checkLoggedInUser } from "../redux/slice/authSlice/checkUserAuthSlice";
import DashboardSkeleton from "../layout/common/DashboardSkeleton";

const ProtectedRoute = ({ role }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const tokenKey = `${role}_token`;
  const token = sessionStorage.getItem(tokenKey);

  const { isUserLoading, userAuthData, isAuthChecked } = useSelector((state) => state.checkAuth);

  // Trigger auth check if token is present but Redux store doesn't have details yet
  useEffect(() => {
    if (token && !userAuthData) {
      dispatch(checkLoggedInUser());
    }
  }, [dispatch, token, userAuthData]);

  // Determine redirection path based on role
  const getRedirectPath = () => {
    if (role === "admin") return "/admin/";
    if (role === "instructor") return "/instructor/signin";
    return "/signin";
  };

  const redirectTo = getRedirectPath();

  // 1. Immediate token presence check
  if (!token) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 2. Loading state while checking token validity against Supabase/Redux
  if (!isAuthChecked || isUserLoading) {
    return <DashboardSkeleton role={role} />;
  }

  // 3. Post-load authentication & role check
  if (!userAuthData || userAuthData.role !== role) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 4. Authorized
  return <Outlet />;
};

export default ProtectedRoute;
