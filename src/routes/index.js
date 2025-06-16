import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AuthSystem from "../auth/AuthSystem";
import AppLayout from "../layout/AppLayout";
import Dashboard from "../pages/Dashboard";
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
        path: '/dashboard',
        element: <ProtectedRoute element={<AppLayout />}/>,
        children: [
            {
                index: true,
                element: <Dashboard />
            }
        ]
    }
])