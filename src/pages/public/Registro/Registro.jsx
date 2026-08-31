import FormularioRegistro from './components/FormularioRegistro'
import imagen from '../../../assets/InicioS.png'

export default function Registro() {
  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#241e2b] lg:flex-row">
      { }
      <section className="relative hidden shrink-0 md:block md:h-64 lg:h-full lg:w-auto lg:flex-1">
        <img src={imagen} alt="Persona trabajando" className="h-full w-full object-cover object-center lg:w-auto lg:object-contain"/>
      </section>

      {/* Formulario */}
      <section className="flex w-full flex-1 items-center justify-center overflow-hidden bg-[#241e2b] px-6 py-4 sm:px-10 lg:px-12">
        <div className="mx-auto w-full max-w-sm sm:max-w-md">
          <h1 className="mt-4 text-lg font-semibold text-white sm:mt-4 sm:text-xl">
            Crea tu cuenta
          </h1>
          <FormularioRegistro />
        </div>
      </section>
    </main>
  )
}