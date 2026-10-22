import FormularioInicio from './components/FormularioInicio';
import AuthLayout from '@/components/auth/AuthLayout';
export default function Login() {
  return <AuthLayout title="Hola de nuevo" description="Ingresa a tu cuenta y sigue avanzando en tu camino."><FormularioInicio /></AuthLayout>;
}
