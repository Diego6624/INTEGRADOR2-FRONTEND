import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function ProtectedRoute(){
    const { autenticado, loading } = useAuth()

    if (loading) {
        return <div> Cargando.....</div>
    }

    if (!autenticado) {
        return <Navigate to={"/login"} replace />
    }

    return <Outlet/>

}