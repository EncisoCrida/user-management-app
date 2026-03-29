import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PrivateRoute({ children }: any) {
  const { user, loading } = useAuth();

  //ESPERA a que cargue sesión
  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}