import { ConfigProvider, Layout } from "antd"
import { RouterProvider } from "react-router-dom"
import { router } from "./routers/Router"
import { theme } from "./themes/AppThemes"

function App() {
    return (
        <ConfigProvider theme={theme}>
            <Layout style={{ width: "100vw", height: "100vh" }}>
                <RouterProvider router={router} />
            </Layout>
        </ConfigProvider>
    )
}

export default App
