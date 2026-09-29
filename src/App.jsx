import { Navigate, Outlet } from 'react-router-dom'
import './App.css'
import Layout from './Layout'
import { useAuth } from './hooks/useAuth'

function App() {
  const { autenticado, loading } = useAuth()

    if (loading) {
        return <div> Cargando.....</div>
    }

    if (!autenticado) {
        return <Navigate to={"/login"} replace />
    }

  return (
    <>
      <Layout>
        <Outlet />
      </Layout>
    </>
  )
}

export default App