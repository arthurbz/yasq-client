import { useState } from "react"
import { ConfigProvider, Layout } from "antd"
import { RouterProvider } from "react-router-dom"
import { router } from "./routers/Router"
import { theme } from "./themes/AppThemes"

// Contexts
import GlobalDataContext from "./contexts/GlobalDataContext"

// Types
import { User } from "./types/User"
import { Room } from "./types/Room"

function App() {
    const [user, setUser] = useState<User | undefined>()
    const [room, setRoom] = useState<Room | undefined>()

    return (
        <GlobalDataContext.Provider value={{ room, setRoom, user, setUser }}>
            <ConfigProvider theme={theme}>
                <Layout style={{ minWidth: "100vw", minHeight: "100vh" }}>
                    <RouterProvider router={router} />
                </Layout>
            </ConfigProvider>
        </GlobalDataContext.Provider>
    )
}

export default App
