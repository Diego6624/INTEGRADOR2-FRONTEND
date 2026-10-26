import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function AdminRoute() {
  const { usuario, loading } = useAuth();
  if (loading) return <p role="status">Cargando...</p>;
  return usuario?.role === 'ADMINISTRADOR' ? <Outlet /> : <Navigate to="/forum" replace />;
}
