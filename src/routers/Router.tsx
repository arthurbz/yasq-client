import { Navigate, createBrowserRouter } from "react-router-dom"
import Home from "../screens/Home"
import Room from "../screens/Room"
import ErrorBoundary from "../screens/ErrorBoundary"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "/room/:id",
        element: <Room />,
        errorElement: <ErrorBoundary />
    },
    {
        path: "*",
        element: <Navigate to="/" />,
        errorElement: <ErrorBoundary />
    }
])

export { router }
