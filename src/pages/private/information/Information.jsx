import { Button } from "@base-ui/react";

const Information = () => {
    return (<>
        <div className="bg-black/70 px-4 py-2 flex items-center flex-col w-full gap-2">
            <h1>Consultas</h1>
            <p>Bienvenido a la página de consultas.</p>
            <Button size="sm" className="bg-blue-500 rounded-3xl text-white p-2">
                <a href="https://pedrodavidsworkspace-40174552.atlassian.net/servicedesk/customer/portals">Ingresa tu consulta aquí</a>
            </Button>
        </div>
    </>);
}

export default Information;