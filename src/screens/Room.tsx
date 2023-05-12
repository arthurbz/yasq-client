import { useContext } from "react"
import { App, Layout, Row, Typography } from "antd"
const { Content } = Layout
import { useParams, useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
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
import { getUserId, setUserId } from "../utils/StorageUtils"
import UserProfileCard from "../components/user/UserProfileCard"

function Room() {
    const { notification } = App.useApp()
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
            notification.error({ message: data.response?.data?.errorMessage })
            navigate("/")
        }
    })

    const { mutate: mutateJoinWithRandomUser } = useMutation<{ participationId: string, roomId: string, userId: string }, AxiosError<ErrorResponseData, any>, string>({
        mutationKey: ["participation", "join", "random"],
        mutationFn: async (roomId: string) => await axios.post("/participation/join/random", { roomId }).then(response => response.data),
        onSuccess: (data) => {
            const { participationId, roomId, userId } = data

            if (!participationId || !roomId || !userId) {
                notification.error({ message: "We are sorry, but there was an error when trying to join the room." })
                return
            }

            setUserId(userId)
            navigate(`/room/${roomId}`)
        },
        onError: () => notification.error({ message: "We are sorry, but there was an error when trying to join the room." })
    })

    const storageUserId = getUserId()
    if (!storageUserId && roomId)
        mutateJoinWithRandomUser(roomId)

    return (
        <Layout>
            <Content>
                <Row style={{ alignItems: "center" }}>
                    <Typography.Title ellipsis style={{ margin: 8 }}>
                        {room?.name}
                    </Typography.Title>

                    <SearchBar />

                    <UserProfileCard />
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
