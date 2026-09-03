import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Home from "../pages/public/Home";
import Inicio from "../pages/public/Inicio/inicio";
import Forum from "@/pages/private/forum/Forum";
import Roadmap from "@/pages/private/Roadmap";
import AgenteIA from "@/pages/private/Agente IA";
import Chats from "@/pages/private/Chats";
import App from "@/App";
import Registro from "@/pages/public/Registro/Registro";
import { Profile } from "@/pages/private/profile/Profile";


const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Inicio />} />
            <Route path="/register" element={<Registro />} />

            <Route element={<App />}>
                <Route path="/home" element={<Home />} />
                <Route path="/forum" element={<Forum />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/agent" element={<AgenteIA />} />
                <Route path="/chat" element={<Chats />} />
                <Route path="/profile" element={<Profile/>}/>
            </Route>

        </>
    )
);

export default router;