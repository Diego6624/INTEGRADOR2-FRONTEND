import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Home from "../pages/public/Home";
import Forum from "@/pages/private/Forum";
import App from "@/App";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="/forum" element={<Forum />} />
        </Route>
    )
)

export default router;