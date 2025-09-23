import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // wait for session restoration
  if (!user) return <Navigate to="/login" replace />;

  // ✅ UPDATED: The permission check now allows both 'admin' and 'read_admin' to access 'admin' routes.
  const isAuthorized = role
    ? user.role.toLowerCase() === role.toLowerCase() || (role.toLowerCase() === 'admin' && user.role.toLowerCase() === 'read_admin')
    : true; // No role required, so any logged-in user can access

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
