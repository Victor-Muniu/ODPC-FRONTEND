import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AuthSystem from "../auth/AuthSystem";
import AppLayout from "../layout/AppLayout";
import Home from "../pages/Home";

export const router = createBrowserRouter([
    {
        path:'/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <AuthSystem />
            }
        ]
    },
    {
        path:'/protected',
        element: <ProtectedRoute element={<AppLayout />}/>,
        children: [
            {
                index: true,
                element: <Home />
            }
        ]
    }
])