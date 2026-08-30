import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Home from "../pages/public/Home";
import Inicio from "../pages/public/Inicio/inicio";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route path="/" element={<Home />} />
        <Route path="/inicio" element={<Inicio />} />
        </>
    )
);

export default router;