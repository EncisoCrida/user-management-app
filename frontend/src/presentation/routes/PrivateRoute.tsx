import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PrivateRoute({ children, roles }: any) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/users" replace />;
  }

  return children;
}