import apiFetch from "@/lib/apiClient"
import { AuthContext } from "./AuthContext"
import { useEffect, useState } from "react"

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null)
    const [loading, setLoading] = useState(true)

    const verificarSesion = async () => {
        try {
            const response = await apiFetch.get("/me")
            setUsuario(response.data)
        } catch (err) {
            console.log(err)
            setUsuario(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        verificarSesion()
        // eslint-disable-next-line react-hooks/set-state-in-effect
    }, [])



    const cerrarSesion = async () => {
        try {
            await apiFetch.post("/logout")

        } catch (err) {
            console.error(err)
        } finally {
            setUsuario(null)

        }
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                autenticado: !!usuario,
                loading,
                cerrarSesion,
                verificarSesion
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}