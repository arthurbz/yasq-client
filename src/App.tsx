import { useState } from "react"
import { ConfigProvider, Layout } from "antd"
import { RouterProvider } from "react-router-dom"
import { router } from "./routers/Router"
import { theme } from "./themes/AppThemes"
import { Spin } from "antd"

// Contexts
import GlobalDataContext from "./contexts/GlobalDataContext"

// Types
import { User } from "./types/User"
import { Room } from "./types/Room"

function App() {
    const [user, setUser] = useState<User | undefined>()
    const [room, setRoom] = useState<Room | undefined>()
    const [globalLoading, setGlobalLoading] = useState(false)

    return (
        <GlobalDataContext.Provider value={{ room, setRoom, user, setUser, globalLoading, setGlobalLoading }}>
            <ConfigProvider theme={theme}>
                <Layout style={{ minWidth: "100vw", minHeight: "100vh" }}>
                    <Spin spinning={globalLoading} style={{ fontSize: "92em" }}>
                        <RouterProvider router={router} />
                    </Spin>
                </Layout>
            </ConfigProvider>
        </GlobalDataContext.Provider>
    )
}

export default App
