import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function ProtectedAdminRoute({ children }) {
  const { session, loading } = useAdminAuth();

  if (loading) return null;
  if (!session) return <Navigate to="/admin/login" replace />;

  return children;
}
