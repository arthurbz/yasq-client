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
import { Song } from "./types/Song"
import { Participation } from "./types/Participation"

function App() {
    const [user, setUser] = useState<User | undefined>(undefined)
    const [room, setRoom] = useState<Room | undefined>(undefined)
    const [song, setSong] = useState<Song| undefined>(undefined)
    const [participation, setParticipation] = useState<Participation | undefined>(undefined)
    const [globalLoading, setGlobalLoading] = useState(false)
    const globalDataContextValues = {
        room,
        setRoom,
        user,
        setUser,
        song,
        setSong,
        participation,
        setParticipation,
        globalLoading,
        setGlobalLoading
    }

    return (
        <GlobalDataContext.Provider value={globalDataContextValues}>
            <ConfigProvider theme={theme}>
                <Layout style={{ width: "100vw", height: "100vh" }}>
                    <Spin spinning={globalLoading} style={{ fontSize: "92em" }}>
                        <RouterProvider router={router} />
                    </Spin>
                </Layout>
            </ConfigProvider>
        </GlobalDataContext.Provider>
    )
}

export default App
