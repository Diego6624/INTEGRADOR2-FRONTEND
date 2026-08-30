import FormularioInicio from './components/FormularioInicio'
import imagen from '../../../assets/InicioS.png'

export default function Inicio() {
  return (
    <main className="flex min-h-screen flex-col bg-[#241e2b] lg:h-screen lg:flex-row lg:overflow-hidden">
      { }
      <section className="relative hidden h-40 w-full shrink-0 sm:h-56 md:block md:h-64 lg:h-full lg:w-auto lg:flex-1">
        <img
          src={imagen}
          alt="Persona trabajando"
          className="h-full w-full object-cover object-center lg:w-auto lg:object-contain"
        />
      </section>

      {/* Formulario */}
      <section className="flex w-full flex-1 items-center justify-center overflow-y-auto bg-[#241e2b] px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
        <div className="mx-auto w-full max-w-sm sm:max-w-md">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            JourNet
          </h2>

          <h1 className="mt-8 text-xl font-semibold text-white sm:mt-12 sm:text-2xl lg:mt-16">
            Hola de nuevo
          </h1>

          <FormularioInicio />
        </div>
      </section>
    </main>
  )
}