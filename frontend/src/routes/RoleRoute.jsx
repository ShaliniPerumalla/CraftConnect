import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";

export default function RoleRoute({ allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader text="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const normalizedUserRole = user?.role ? String(user.role).toLowerCase() : "";
  const normalizedAllowedRoles = allowedRoles.map((item) => String(item).toLowerCase());

  if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}