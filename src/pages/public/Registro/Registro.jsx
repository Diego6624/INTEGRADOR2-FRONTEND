import FormularioRegistro from './components/FormularioRegistro';
import AuthLayout from '@/components/auth/AuthLayout';
export default function Registro() {
  return <AuthLayout title="Crea tu cuenta" description="Forma parte de Journet y descubre nuevas oportunidades para aprender."><FormularioRegistro /></AuthLayout>;
}
