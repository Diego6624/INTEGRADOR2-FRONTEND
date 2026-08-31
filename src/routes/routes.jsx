import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Home from "../pages/public/Home";
import Inicio from "../pages/public/Inicio/inicio";
import Registro from "../pages/public/Registro/Registro";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route path="/" element={<Home />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/registro" element={<Registro />} />
        </>
    )
);

export default router;