import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/public/Home/Home";
import Inicio from "../pages/public/Login/Login";
import Forum from "@/pages/private/forum/Forum";
import ForumPostPage from "@/pages/private/forum/ForumPostPage";
import Roadmap from "@/pages/private/Roadmap";
import AgenteIA from "@/pages/private/Agente IA";
import Chats from "@/pages/private/chat/Chats";
import App from "@/App";
import Registro from "@/pages/public/Registro/Registro";
import { Profile } from "@/pages/private/profile/Profile";
import Test from "@/pages/private/Test/test";
import ProtectedRoute from "@/hooks/ProtectedRoute";
import PublicOnlyRoute from "@/hooks/PublicOnlyRoute";


const router = createBrowserRouter(
    // createRoutesFromElements(
    //     <>
    //         <Route path="/" index element={<Home />} />
    //         <Route path="/login" element={<Inicio />} />
    //         <Route path="/register" element={<Registro />} />
    //         <Route element={<App />}>
    //             <Route path="/forum" element={<Forum />} />
    //             <Route path="/forum/:id" element={<ForumPostPage />} />
    //             <Route path="/roadmap" element={<Roadmap />} />
    //             <Route path="/agent" element={<AgenteIA />} />
    //             <Route path="/chat" element={<Chats />} />
    //             <Route path="/profile" element={<Profile/>}/>
    //             <Route path="/test" element={<Test/>}/>
    //         </Route>

    //     </>
    // )
    [
        {
            element: <PublicOnlyRoute />,
            children: [
                { path: "/login", element: <Inicio /> },
                { path: "/register", element: <Registro /> },
            ],
        },
        {
            path: "/",
            element: <Home />
        },
        {
            element: <ProtectedRoute/>,
            children: [
                {
                    element: <App/>,
                    children: [
                        {path: "/forum", element: <Forum />},
                        {path: "/forum/:id", element: <ForumPostPage />},
                        {path: "/roadmap", element: <Roadmap />},
                        {path: "/agent", element: <AgenteIA />},
                        {path: "/chat", element: <Chats />},
                        {path: "/profile", element: <Profile />},
                        {path: "/test", element: <Test />}
                    ]
                }
            ]
        }
    ]
    
);

export default router;