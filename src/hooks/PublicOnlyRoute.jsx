import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function PublicOnlyRoute() {
  const { autenticado, loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-center text-white">Verificando sesión...</div>;
  }

  if (autenticado) {
    return <Navigate to="/forum" replace />;
  }

  return <Outlet />;
}
