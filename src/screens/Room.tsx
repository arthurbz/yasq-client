import { useContext } from "react"
import { App, Layout, Row, Typography } from "antd"
const { Content } = Layout
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { axios } from "../plugins/AxiosInstance"

// Components
import SearchBar from "../components/search/SearchBar"
import SongList from "../components/song/SongList"
import UserList from "../components/user/UserList"
import GlobalMusicPlayer from "../components/players/GlobalMusicPlayer"

// Types
import { Room } from "../types/Room"
import { ErrorResponseData } from "../types/ErrorResponseData"

// Contexts
import GlobalDataContext from "../contexts/GlobalDataContext"

function Room() {
    const { message } = App.useApp()
    const navigate = useNavigate()
    const { room, setRoom } = useContext(GlobalDataContext)
    const { id: roomId } = useParams()

    useQuery<Room, AxiosError<ErrorResponseData, any>>({
        queryKey: ["room", "find", roomId],
        enabled: !!roomId && typeof roomId == "string",
        staleTime: 5 * 60 * 1000,
        retryDelay: 250,
        queryFn: async () => await axios.get(`/room/find/${roomId}`).then(response => response.data),
        onSuccess: room => setRoom(room),
        onError: data => {
            message.error(data.response?.data?.errorMessage)
            navigate("/")
        }
    })

    return (
        <Layout>
            <Content>
                <Row style={{ alignItems: "center" }}>
                    <Typography.Title ellipsis style={{ margin: 8 }}>
                        {room?.name}
                    </Typography.Title>

                    <SearchBar />
                </Row>

                <Row style={{ height: 500 }}>
                    <SongList roomId={roomId} />

                    <UserList roomId={roomId} />
                </Row>

                <Row style={{ padding: 8 }}>
                    <GlobalMusicPlayer />
                </Row>
            </Content>
        </Layout>
    )
}

export default Room
