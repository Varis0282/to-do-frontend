import { createBrowserRouter } from "react-router-dom";
import PrivateResource from "./PrivateResources";
import { Admin_panel, Login, SignUp, Taskv2 } from "../pages";


const routes = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <SignUp />,
    },
    {
        path: "/",
        element: <PrivateResource component={<Taskv2 />} />,
    },
    {
        path: "/admin",
        element: <PrivateResource component={<Admin_panel />} />,
    },
    {
        path: "*",
        element: <PrivateResource component={<p>The page you're looking doesn't exists</p>} />,
    },

]);

export default routes;