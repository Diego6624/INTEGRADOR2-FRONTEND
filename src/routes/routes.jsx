import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Home from "../pages/public/Home";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Home />} />
    )
)

export default router;