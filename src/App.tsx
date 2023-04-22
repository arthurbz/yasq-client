import { Layout } from "antd"
import { RouterProvider } from "react-router-dom"
import { router } from "./router/Router"

function App() {
    return (
        <Layout style={{ width: "100vw", height: "100vh" }}>
            <RouterProvider router={router} />
        </Layout>
    )
}

export default App
